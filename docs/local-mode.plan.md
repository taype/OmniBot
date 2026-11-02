# Local Mode 改造方案(讨论稿)

> 目标:让 OpenBot 在**完全没有 CopilotKit 云**的情况下完整运行——会话线程持久化、记忆、无人值守运行(hops/routines)全部由本地 PostgreSQL 与本机进程承担;服务器在无 `INTELLIGENCE_*` 配置时可启动。
>
> 状态:**实施中**。P1 已完成并经冒烟验证;P2~P4 待做。改动清单见文末"实施进展"。
>
> 代码入口:`server/src/threads/*`(本地线程存储/客户端/runner/lock)、`server/src/agents/model-api.ts`(chat-completions 模型对象)、`server/src/db/schema/threads.ts`(三张表,migration 0061)。

## 一、关键结论(已从代码核实)

1. **底层 runtime 原生支持无云模式**。`server/src/copilot.ts:1777` 注释:"`mode` is inferred from the presence of `intelligence`"。不传 `intelligence` 即 classic 本地模式:run 在进程内执行,AG-UI 事件直接流回浏览器。
2. **作者已为替换预留接口**(`toolkit/src/run-turn.ts`):
   - `RunnerLike`(`:166-177`)= `run({threadId, agent, input, persistedInputMessages}) → EventStream` + `stop()`;
   - `IntelligenceLike`(`:122-151`)= `getOrCreateThread` / `getThreadMessages` / `ɵacquireThreadLock` / `ɵrenewThreadLock` / `ɵcleanupThreadLock`,均为结构类型,注释明确说是"让测试不网关也能驱动、如实记录依赖了多少云端"。
3. `agent.runAgent(input)` 返回 `Observable<BaseEvent>`,即 `EventStream` 本身——**本地 runner 可以只有几行**(`intelligence.mjs:309` 的云端 runner 内部也是调 `agent.runAgent`)。
4. **记忆已有本地降级**。`docs/architecture.md:358`:无 Intelligence 许可时"OpenBot 照旧读写自己的表,什么都不坏"。只需把 entitlement 判定固定为"不可用"。
5. **Learning 是可选云功能**,无容器指派时"OpenBot 仍能启动和聊天"(`.env.example:150-152`)。

## 二、依赖点清单

### 服务端
| 位置 | 依赖 | 本地化做法 |
|---|---|---|
| `config.ts:959-990` | 启动强制要求三个 INTELLIGENCE_* | `LOCAL_MODE=1` 时跳过校验,`runtime.intelligence` 置空 |
| `copilot.ts:1746-1866` | IntelligenceKnowingANewThread / CopilotRuntime(intelligence) / history / threadLock / runnerConnection | 条件构造;本地实现替换 |
| `agents/handoff-wiring.ts:126` | `IntelligenceAgentRunner` | 换 `LocalAgentRunner` |
| `index.ts:1651` | routines 的 `IntelligenceAgentRunner` | 同上 |
| `index.ts:342,691,1245,2360` | learning 探针 / entitlement / inspector / self-host banner | 本地模式下跳过 |
| `routines/turn-runner`(经 `createTurnRunner`) | lock + history + runner | 全部走本地实现 |
| `/api/threads/:id`、`/api/copilotkit/threads/:id/messages` | 代理 Intelligence | 改读本地表 |
| 记忆(`server/src/memory/*`) | `intelligence-entitlement-check.ts` 门控 | entitlement 恒为 inactive → 本地表路径 |

### 前端
| 位置 | 依赖 | 本地化做法 |
|---|---|---|
| `channel-chat.tsx:366-424` | "Join the gateway socket, restore durable history" | 本地模式跳过 join,历史走 REST |
| `bot-thread.ts` | `/api/threads/:id` | 服务端改读本地表,前端不动 |
| `thread-messages.ts` | `/api/copilotkit/threads/:id/messages` | 同上 |
| 群聊 / unread / approval 流 | 部分经 gateway 推送 | 需要逐个确认降级路径(前端代理正在勘察) |

## 三、设计

### 3.1 开关
`LOCAL_MODE=1`(环境变量,写入 `.env`):不要求 INTELLIGENCE_*,不连任何云端域名。

### 3.2 本地线程存储(PostgreSQL,新增三张表)
- `threads(id, user_id, agent_id, created_at)`
- `thread_messages(thread_id, message_id, role, content_json, activity_type, tool_calls_json, tool_call_id, position, created_at)` — 按 message_id 幂等 upsert
- `thread_locks(thread_id, run_id, user_id, expires_at)` — 租约锁,模拟平台 120s TTL

### 3.3 `LocalIntelligenceClient`(实现 `IntelligenceLike`)
- `getOrCreateThread` → upsert threads
- `getThreadMessages` → 按 position 查
- 三个锁方法 → `thread_locks` 行锁 + 过期判定;续租更新 expires_at

### 3.4 `LocalAgentRunner`(实现 `RunnerLike`)
- `run` → `agent.runAgent(input)`(事件流原样返回;RUN_ERROR 语义保持)
- `stop` → 按 (threadId, runId) 找活动 agent,`agent.abortRun()`
- **完成时落库**:run 结束后把 `agent.messages` 全量幂等写回 `thread_messages`(浏览器路径在 handler 包装层做同样的事)

### 3.5 浏览器交互路径的持久化
包一层 `createCopilotHonoHandler` 的流:请求进(带全量 messages)时 upsert;流结束时把更新后的 messages upsert。这样刷新/重启后历史不丢。

### 3.6 记忆与 Learning
- entitlement 判定在 LOCAL_MODE 下恒为 inactive → 记忆走本地表(现有代码路径)
- Learning 恒定关闭(不建容器、不推送)

## 四、分阶段实施(每阶段结束系统可运行)

| 阶段 | 内容 | 验收 |
|---|---|---|
| P1 | LOCAL_MODE 配置 + runtime 无 intelligence 挂载 + 本地三表与迁移 | 无 INTELLIGENCE_* 启动成功,单聊可用(内存内历史) |
| P2 | 本地 client + 前端跳过 gateway + 历史路由改读本地表 | 刷新页面历史还在 |
| P3 | LocalAgentRunner + routines/hops 接线 | 定时任务、Bot 交接可用 |
| P4 | 记忆本地化 + Learning 关闭 + 清理 entitlement 探针 | 无 cloud 调用,`grep -r intelligence.copilotkit.ai` 仅剩注释 |

## 五、风险与缓解

| 风险 | 影响 | 缓解 |
|---|---|---|
| fork 维护成本 | 上游更新冲突 | 改动集中、LOCAL_MODE 开关隔离、尽量不删原路径 |
| 事件时序/落库时机 | 历史重复或丢失 | message_id 幂等 upsert;完成时全量写 |
| 锁语义 | 并发双写 | 行级 advisory lock + 租约测试 |
| 前端非 gateway 路径的边角(群聊、审批流) | 局部功能降级 | P2 逐个验证,失败则明确报错而非静默 |
| 测试套件假设 Intelligence | CI 红 | 只跑相关子集;不改全局行为 |

## 六、需要拍板的决策

1. **范围**:Bot 交接 / routines / 群聊 —— 三样必须本地可用,还是先做单聊+历史?
2. **维护方式**:接受 fork(集中改动 ~10 文件),还是尽量极小补丁?
3. **底线**:任何云依赖都不能留吗?

## 七、实施进展

### 已完成(P1)

- `config.ts`:`RuntimeCapabilities` 变为 `intelligence | local` 联合;三个 `INTELLIGENCE_*` 全缺 → 自动 local;只配一部分 → 仍拒绝启动;`LOCAL_MODE=true` 强制 local。对应测试已更新(`server/tests/config.test.ts`)。
- 新表:`local_threads` / `local_thread_messages` / `local_thread_locks`(migration `0061_lively_nova.sql`)。
- 新模块:`server/src/threads/local-thread-store.ts`(幂等消息落库、租约锁)、`local-intelligence.ts`(`IntelligenceLike` + `ThreadLock` 端口实现)、`local-agent-runner.ts`(`AgentRunner` 子类:进程内跑 agent、`MESSAGES_SNAPSHOT` 重放、`ɵsupportsLocalThreadEndpoints` 让 runtime 自带线程接口直接读本地缓存)。
- `copilot.ts`:local 模式不传 `intelligence`,传本地 runner;`history`/`threadLock` 走本地;learning 随云客户端一起缺席。
- `index.ts`:learning 探针/自动指派、记忆镜像、自托管横幅、线程存在性检查全部在 local 模式退化为本地实现或关闭;routines/hops/群聊/Responsibilities 的 headless 引擎换成 `localIntelligence` + `LocalAgentRunner`(同一个 `createTurnRunner`,零分支)。
- `app.ts`:`GET /api/threads/:id` 在 local 模式用本地存储回答 `known`;`/api/capabilities` 如实返回 `mode: "local"`。
- 新模块 `server/src/agents/model-api.ts`:`OPENBOT_MODEL_API=chat` 让内置 Agent 用 `/v1/chat/completions`(多数兼容网关没有 Responses API;默认 responses 行为不变),`builtInAgentConfiguration` 传入模型对象,runtime 原样透传。
- 冒烟(全部通过):无 `INTELLIGENCE_*` 启动;真实对话 SSE 返回 `LOCAL-OK`;消息落库;`/api/copilotkit/threads/:id/messages` 读回;`connect` 返回 `MESSAGES_SNAPSHOT`;重启后历史仍在;`/api/threads/:id` known/unknown;`/api/memory` 本地读写。焦点测试 318 通过;类型检查/lint/格式全绿。

### 待做(P2~P4)

- P2:浏览器 UI 实测(`/bot`、频道聊天、刷新恢复、群聊、审批流)——服务端接口已具备,需在 3010 界面点一遍。
- P3:无人值守实测:创建 routines 并等触发、Bot 交接(@另一个 Bot)、Responsibilities 触发;本地 runner 的 `stop`/并发/超时路径靠测试补充。
- P4:记忆页与管理页目视验收;"Kept in Intelligence"等文案清理(可选);确认无任何云端网络调用(`ensure-container.ts` 的硬编码 URL 在 local 模式不会被调用)。

### 第 2 轮验证结果(2026-10-31)

- **routine 全链路** ✅ 直接插入 `routines` 行 → `POST /api/routines/:id/run` → 9.2s 后 `routine_runs.status = succeeded`;模型回复 `ROUTINE-OK` 落进 `local_thread_messages`(频道 thread);频道 `lastMessageAt` 更新(roster 有活动)。
- **Bot 交接(hop)全链路** ✅ 直接向 `work_items` 插入 `bot.message` 作业 → handoff 扫描认领 → 目标 Bot(`knowledge`)在自建 scratch thread 收到任务并回答 `HOP-OK` → 回传 relay 作业完成;审计两行 `agent.handoff_delivered`(knowledge←GA 6818ms,GA←knowledge 11436ms)。这条链路走的是 `LocalAgentRunner` + 本地锁 + 本地历史。
- **记忆** ✅ `GET /api/memory` → `{"memories":[]}`(本地表);**Learning** ✅ `GET /api/admin/learning/settings` → 自动指派 `off`(无云端探测)。
- **零云检查** ✅ 服务端 `grep api.intelligence.copilotkit.ai` 仅剩 `learning/ensure-container.ts:37`(local 模式不会被调用);`.env` 中 INTELLIGENCE_* 全部注释。
- **浏览器 UI(Playwright + 本机 Chrome 无头)** ✅
  - 首页正常渲染(名册可见测试产生的频道,含 "Routine OK verification test");
  - 首页输入框发送 `Reply with exactly: UI-OK` → 助手回复 `UI-OK` 渲染,落库到新 thread `…8f93…`;
  - `/bot` 页加载正常(121s 内渲染),发送 `BOT-PAGE-OK` → 回复渲染,落库到 thread `…8403…`;
  - 刷新后名册显示 "UI-OK Response Test"(消息与频道活动持久化)。
- 当前本地线程状态:9 个 thread / 20 条消息;焦点测试 250 通过。

### 追加完成:P5 模型管理页(用户要求的"没有配置模型的能力")

原来模型只能靠 `model.yaml` + `.env` 配置,改一次要重启。现在:

- 新表 `model_settings`(单行,migration `0062_smiling_lyja.sql`);API key 走既有凭据库(`kind: "model"`,keyId `default`),加密存储、只写不读。
- `GET/PUT/DELETE /api/admin/model`、`POST /api/admin/model/test`(管理员限定);改动写审计 `model.saved` / `model.cleared`。
- `server/src/agents/model-api.ts`:保存的模型以 **LanguageModel 对象**传给 runtime(provider/base URL/协议全部可配);`setModelRuntimeConfig` 让下一次 run 立即生效。
- `server/src/model-settings.ts`:存储 + 管理服务 + 连接测试(`generateText` 小请求)。
- 前端 `app/src/routes/_authed/admin/model.tsx` + 侧栏/总览入口 + `app/src/lib/model/queries.ts`:provider/base URL/model/protocol/key 表单、测试连接、重置为部署默认。
- 已验证:无保存时读 `.env`;保存后**不重启**下一次对话即用新模型(实测 `glm-5.3` → `qwen3.7-max`);测试连接返回 `OK`;重置后回到默认。