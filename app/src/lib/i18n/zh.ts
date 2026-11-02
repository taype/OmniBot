/**
 * Every Chinese string the interface can show, keyed by the English it replaces.
 *
 * WHY THE ENGLISH IS THE KEY. The app was written in English, and a key like `"Ask anything"` keeps
 * every call site readable: `t("Ask anything")` says what it renders without a second lookup table to
 * maintain. A missing entry falls back to the English key itself, so an untranslated screen is the
 * old screen rather than a row of `missing.key` placeholders, and translating more of the app is
 * additive.
 *
 * TEMPLATES USE NAMED TOKENS. `{name}`-style placeholders are filled by `t(key, vars)`; the English
 * key carries the same tokens so a translator can see what the sentence needs.
 */
export const zh = {
  // ---- Common verbs and states -------------------------------------------------------------
  "Loading…": "正在加载…",
  "Saving…": "正在保存…",
  "Try again": "重试",
  Save: "保存",
  Cancel: "取消",
  Delete: "删除",
  Close: "关闭",
  Back: "返回",
  Edit: "编辑",
  Done: "完成",
  Reload: "重新加载",
  "Not configured": "未配置",
  Configured: "已配置",

  // ---- App sidebar -------------------------------------------------------------------------
  "New conversation": "新会话",
  "Search conversations": "搜索会话",
  "Search…": "搜索…",
  "No conversations yet": "还没有会话",
  "Start a conversation with a Bot and it shows up here.":
    "和一个机器人开始对话，它就会出现在这里。",
  "No conversations match your search": "没有匹配的会话",
  "No loaded conversations match your search": "已加载的会话中没有匹配项",
  "Load older conversations to search more of your history.":
    "加载更早的会话以搜索更多历史。",
  "No conversation has “{query}” in its name or latest message.":
    "没有任何会话的名称或最后一条消息包含“{query}”。",

  // ---- Primary navigation --------------------------------------------------------------------
  Bots: "机器人",
  Capabilities: "能力",
  Connections: "连接",
  Admin: "管理",
  Settings: "设置",
  "Sign out": "退出登录",

  // ---- Home ---------------------------------------------------------------------------------
  "Start a conversation": "开始对话",
  "Explore Bots": "探索机器人",
  "OmniBot picks the right Bot. Type": "OmniBot 会自动选择合适的机器人。输入",
  "to choose one.": "来选择其中一个。",
  "Couldn't load your Bots, so there's no one to send this to. Reload the page.":
    "无法加载你的机器人，没有可发送的对象。请刷新页面。",
  "Couldn't start the conversation. Try again.": "无法开始对话，请重试。",
  "Couldn't load the Bots shared with you.": "无法加载分享给你的机器人。",
  "Nobody has shared a Bot with you yet.": "还没有人向你分享机器人。",

  // ---- Preferences --------------------------------------------------------------------------
  Preferences: "偏好设置",
  "How OmniBot looks and works for you. Message list settings follow your account. The theme stays in this browser.":
    "OmniBot 在你这里的样子和做法。消息列表设置跟随你的账号，主题只留在这个浏览器里。",
  General: "通用",
  "Dark theme": "深色主题",
  "Use the dark appearance across OmniBot.": "在整个 OmniBot 中使用深色外观。",
  Language: "语言",
  "Interface language": "界面语言",
  "Applies to this browser immediately. Conversation names keep whatever language they were given.":
    "立即对当前浏览器生效；已经生成的会话名称不会改变。",
  English: "English",
  简体中文: "简体中文",
  "Keyboard shortcuts": "键盘快捷键",

  // ---- Admin sidebar ------------------------------------------------------------------------
  "Back to app": "返回应用",
  Overview: "总览",
  "What Bots can reach": "机器人能触达什么",
  "What Bots can do": "机器人能做什么",
  "Who can get in": "谁能进入",
  "What happened": "发生过什么",
  Credentials: "凭据",
  Boundaries: "边界",
  Approvals: "审批",
  Computers: "电脑",
  Model: "模型",
  Plugins: "插件",
  Skills: "技能",
  "Automatic learning": "自动学习",
  "UI components": "界面组件",
  Playground: "演练场",
  People: "成员",
  "Identity providers": "身份提供商",
  "Enterprise controls": "企业控制",
  Audit: "审计",

  // ---- Admin overview -----------------------------------------------------------------------
  "Settings for everybody in this deployment. A change here affects every person and every Bot.":
    "整个部署的全局设置。这里的改动会影响每一个人和每一个机器人。",
  "What a Bot can touch outside OmniBot, and the limits on it.":
    "机器人能触达 OmniBot 之外的东西，以及限制。",
  "Apps, skills and interface pieces every Bot can use.":
    "每个机器人可用的应用、技能和界面组件。",
  "Who has signed in, and what an administrator may do about them.":
    "谁登录过，以及管理员可以对他们做什么。",
  "Every action taken in OmniBot, and who took it.":
    "OmniBot 里发生的每个动作，以及是谁做的。",
  "Keys and tokens for this deployment.": "这个部署使用的密钥和令牌。",
  "Things no Bot may ever do.": "机器人永远不能做的事。",
  "What members' Bots must ask before they act.":
    "成员的机器人在行动前必须问什么。",
  "The machines Bots run tools on.": "机器人运行工具的机器。",
  "The model every Bot answers on: provider, endpoint, model name and key.":
    "每个机器人回答所用的模型：提供商、端点、模型名和密钥。",
  "The services OmniBot can reach, and which Bots can use them.":
    "OmniBot 能访问的服务，以及哪些机器人可以使用它们。",
  "Named instructions anybody can run with /.":
    "任何人用 / 就能运行的命名指令。",
  "Learn from finished conversations and review the skills it proposes.":
    "从已完成的对话中学习，并审查它建议的技能。",
  "Custom pieces a Bot can draw in a conversation.":
    "机器人可以在对话中绘制的自定义组件。",
  "Write a component and watch it render as you type.":
    "写一个组件，边输入边看它渲染。",
  "Who has signed in, and who the admins are, and whose access was removed.":
    "谁登录过、谁是管理员，以及谁被移除了访问权限。",
  "Roles and groups, required SSO, SCIM, network policy, MCP and model allowlists, Action Recording.":
    "角色与分组、强制 SSO、SCIM、网络策略、MCP 与模型白名单、操作录制。",
  "Your company's SAML or OpenID Connect provider, matched by email domain.":
    "你公司的 SAML 或 OpenID Connect 提供商，按邮箱域名匹配。",

  // ---- Admin: Model page --------------------------------------------------------------------
  "Which model the Bots answer on. Saved here, it takes effect on the next answer — no restart — and it wins over .env and the tenant package.":
    "机器人回答所用的模型。在这里保存后，下一次回答即生效——无需重启——并且优先于 .env 和租户包。",
  "What is configured now": "当前配置",
  "An administrator saved this model. Reset it to fall back to the deployment defaults.":
    "管理员已保存此模型。重置后会回到部署默认值。",
  "Nothing has been saved, so the deployment defaults apply.":
    "尚未保存任何模型，因此使用部署默认值。",
  Provider: "提供商",
  "Base URL": "基础 URL",
  "Wire protocol": "接口协议",
  "API key": "API 密钥",
  "Deployment default": "部署默认",
  "the provider's own endpoint": "提供商自己的端点",
  "/v1/chat/completions": "/v1/chat/completions",
  "Responses API": "Responses API",
  "Test connection": "测试连接",
  "Testing…": "测试中…",
  "Change it": "修改",
  "The API key is write-only: it is stored encrypted and never shown again. Leave it empty to keep the current one.":
    "API 密钥是只写的：加密存储，之后不再显示。留空则保留当前密钥。",
  "OpenAI (or any OpenAI-compatible gateway)":
    "OpenAI（或任何兼容 OpenAI 的网关）",
  Anthropic: "Anthropic",
  "Google (Gemini)": "Google（Gemini）",
  "Base URL (optional)": "基础 URL（可选）",
  "Leave empty for the provider's own endpoint": "留空则使用提供商自己的端点",
  "/v1/chat/completions (most gateways)": "/v1/chat/completions（大多数网关）",
  "Responses API (OpenAI's own)": "Responses API（OpenAI 自家的）",
  "API key (optional)": "API 密钥（可选）",
  "Leave empty to keep the current key": "留空以保留当前密钥",
  "Paste the key this provider needs": "粘贴该提供商需要的密钥",
  "Save model": "保存模型",
  "Reset to deployment defaults": "重置为部署默认",
  "Saved. The next answer uses it.": "已保存。下一次回答会使用它。",
  configured: "已配置",
  "not configured": "未配置",
  "Reached in {ms}ms": "连接成功，用时 {ms} 毫秒",
  "replied “{reply}”": "回复“{reply}”",
  "The model did not answer.": "模型没有响应。",

  // ---- Bot page -----------------------------------------------------------------------------
  "New chat": "新对话",
  "Ask it to open a page and watch it work.": "让它打开一个网页，看着它干活。",
  "Couldn't load earlier messages. The Bot is answering without them.":
    "无法加载更早的消息，机器人将在没有它们的情况下回答。",
  "Couldn't load your Bots. Reload the page.":
    "无法加载你的机器人。请刷新页面。",
  "Couldn't load this Bot. Reload the page.":
    "无法加载这个机器人。请刷新页面。",
  "There are no Bots yet.": "还没有机器人。",
  "Browser Bot": "浏览器机器人",
  Computer: "电脑",

  // ---- Composer -----------------------------------------------------------------------------
  "Ask anything": "想问什么都行",
  "Send message": "发送消息",
  "Stop the Bot": "停止机器人",
  "Attach a file": "添加附件",
  "Call this Bot": "给这个机器人打电话",
  "Queue message": "排队发送",
  "Show voice call": "显示语音通话",
  "Start voice call": "开始语音通话",
  "More message options unavailable": "更多消息选项不可用",
  Attachment: "附件",
  Message: "消息",
  "Voice calls need a microphone and a secure (HTTPS) connection":
    "语音通话需要麦克风和安全的（HTTPS）连接",

  // ---- Transcript ---------------------------------------------------------------------------
  Thinking: "思考中",
  Remove: "移除",
  Details: "详情",
  "Working…": "正在工作…",

  // ---- Channel chat -------------------------------------------------------------------------
  "This Bot is still working on something. Wait for it, or stop it first.":
    "这个机器人还在处理一件事。等它完成，或先停止它。",
  "The user stopped this task before it completed.":
    "用户在任务完成前停止了它。",
  "Couldn't load earlier messages. You can keep using this conversation.":
    "无法加载更早的消息，你可以继续使用这个会话。",
  "One earlier message couldn't be read, so it isn't shown. Everything else is here.":
    "有一条更早的消息无法读取，因此没有显示。其余内容都在。",
  "{count} earlier messages couldn't be read, so they aren't shown. Everything else is here.":
    "有 {count} 条更早的消息无法读取，因此没有显示。其余内容都在。",

  // ---- Settings sidebar ---------------------------------------------------------------------
  Notifications: "通知",
  Passwords: "密码",
  "Components gallery": "组件库",
  "Loading this conversation": "正在加载这个会话",
  "Routine ran.": "例行任务已执行。",
  "Responsibility ran.": "职责已执行。",
  Trigger: "触发方式",
  "There's no Bot called “{name}”.": "没有名为“{name}”的机器人。",
  "Scroll to end": "滚动到最新",
  "Scroll to start": "滚动到开头",
  "Open Computer": "打开电脑",
  "Close Computer": "关闭电脑",
  "Needs you": "需要你",
  Channel: "会话",
  "Hand back": "交还控制",
  "Take control": "接管控制",
  "Finishing the current action…": "正在完成当前动作…",
  "Close details": "关闭详情",
  "This conversation's Bot": "这个会话的机器人",
  "Toggle Sidebar": "显示或隐藏侧栏",
  // ---- Admin: Credentials -------------------------------------------------------------------
  "Add credential": "添加凭据",
  "Keys and tokens for this deployment. OmniBot never shows a secret after it is saved.":
    "此部署使用的密钥和令牌。OmniBot 保存后不会再显示密钥。",
  "Saved for this deployment. You won't see the secret again.":
    "已为此部署保存。之后不会再显示这串密钥。",
  Connector: "连接器",
  "Key ID": "密钥 ID",
  Secret: "密钥",
  "This key already has an active credential. Saving replaces it and revokes the old one.":
    "这个密钥已有有效凭据。保存会替换并吊销旧的。",
  "Couldn't save the credential. Try again.": "无法保存凭据，请重试。",
  "Save credential": "保存凭据",
  "Saved credentials": "已保存的凭据",
  "Couldn't load credentials. Reload the page.": "无法加载凭据。请刷新页面。",
  "No credentials yet. Add one with Add credential.":
    "还没有凭据。用「添加凭据」新建一个。",
  revoked: "已吊销",
  active: "有效",
  Revoke: "吊销",
  // ---- Admin: Boundaries --------------------------------------------------------------------
  "Never submit a form": "永不提交表单",
  "Never type into a password field": "不向密码框输入",
  "Stay off social media": "避开社交媒体",
  "What a Bot can and can't do with its computer. Every action is checked before it happens. Refusals show in":
    "机器人能用它的电脑做什么、不能做什么。每个动作都会在执行前被检查。被拒绝的动作会出现在",
  "with the rule that refused them.": "并注明拒绝它的规则。",
  "Stop the action, or record it and let it through. Recording lets you try a rule on real activity before it refuses anything.":
    "阻止动作，或记录后放行。记录让你能在真正拒绝任何人之前，先用真实活动试一下规则。",
  "When a rule matches": "规则命中时",
  "Stop the action": "阻止动作",
  "Record it and allow it": "记录并放行",
  "The Bot is stopped and told which rule refused it.":
    "机器人会被阻止，并被告知是哪条规则拒绝了它。",
  "Nothing is stopped. Each match is recorded as if it had been refused.":
    "不会阻止任何动作。每次命中都会按“已被拒绝”记录。",
  "Bots may never": "机器人永远不能",
  "No rules. Every action is allowed and recorded.":
    "还没有规则。所有动作都会被允许并记录。",
  "A rule, written in CEL": "用 CEL 编写的规则",
  "Test first": "先测试",
  "Add rule": "添加规则",
  "Applies to anything the list above didn't catch. An empty list here allows nothing, and every action is refused.":
    "适用于上面列表未命中的一切。这里为空则什么都不允许，每个动作都会被拒绝。",
  "Otherwise they may": "其余情况允许",
  "true, anything not refused above": "true，即上面没有被拒绝的一切",
  "Saved. It applies to the next action any Bot takes.":
    "已保存。对任何机器人的下一个动作生效。",
  "Changes apply to the next action any Bot takes. They stay after a restart.":
    "改动对任何机器人的下一个动作生效，重启后仍然保留。",
  "No recorded computer actions to test against yet. The rule is valid. You'll see what it matches once Bots have acted.":
    "还没有记录下来的电脑动作可供测试。规则本身有效；等机器人操作过后就能看到它命中了什么。",
  "Tested on the last {scanned} recorded actions. This rule would have refused none. It may still match future ones.":
    "已在最近 {scanned} 条记录动作上测试。这条规则不会拒绝任何一条，但将来仍可能命中。",
  "Tested on the last {scanned} recorded actions. This rule would have refused {refused}.":
    "已在最近 {scanned} 条记录动作上测试。这条规则会拒绝 {refused} 条。",
  "Would refuse": "会拒绝",
  "Would now allow": "现在会放行",
  "Showing the first {count}. The count above covers everything checked.":
    "仅显示前 {count} 条，上面的数字涵盖所有检查过的动作。",
  "Also stops the Bot pressing Enter anywhere else. A form can submit from Enter in any field.":
    "也会阻止机器人在其他地方按回车。任何字段里按回车都可能提交表单。",
  "A password box with a different label isn't covered. The rule matches the label.":
    "标签不同的密码框不在覆盖范围内——规则匹配的是标签。",
  "Only these two hosts. A link that redirects there from elsewhere is allowed.":
    "只覆盖这两个域名；从别处跳转过去的链接仍会被允许。",
  // ---- Admin: Approvals / Audit -------------------------------------------------------------
  "What members' Bots must ask before they act, rules for everyone, and requests to use shared accounts.":
    "成员的机器人在行动前必须询问什么、适用于所有人的规则，以及使用共享账号的申请。",
  Everything: "全部",
  "Computer actions": "电脑动作",
  "Nobody watching": "无人值守",
  "Every action a Bot took, and every one this deployment's policy refused.":
    "机器人做过的每个动作，以及被本部署策略拒绝的每个动作。",
  "Export CSV": "导出 CSV",
  "Exporting…": "正在导出…",
  Refresh: "刷新",
  "The file has the newest {count} events, not all of them. Narrow the filter or dates to export the rest.":
    "文件只包含最新的 {count} 条事件，并非全部。缩小筛选范围或日期后再导出其余部分。",
  "Couldn't load the audit log. Reload the page.":
    "无法加载审计日志。请刷新页面。",
  "No events match this filter yet.": "还没有事件匹配这个筛选。",
  When: "时间",
  What: "动作",
  On: "对象",
  Bot: "机器人",
  "Started by": "发起者",
  Decision: "裁决",
  "A routine": "例行任务",
  "Handed on by {name}": "由 {name} 转交",
  "Handed on": "转交而来",
  "A memory source": "记忆来源",
  "A responsibility": "职责",
  "This deployment": "本部署",
  "A person": "某人",
  "The person chose this Bot": "由本人指定",
  "Sent to the default Bot": "发往默认机器人",
  "Sent to the Bot it was meant for": "发往命中的机器人",
  "{offered} of {granted} tools": "{offered} / {granted} 个工具",
  Blocked: "已阻止",
  "Did not happen": "未发生",
  Allowed: "已允许",
  ", reported by the Bot itself": "，由机器人自己报告",
  "dry-run: recorded, not enforced": "试运行：已记录，未强制执行",
  "The Bot declined": "机器人拒绝了",
  "The Bot stopped responding": "机器人停止响应",
  "Boundary at start-up": "启动时的边界",
  "Isolation at start-up": "启动时的隔离",
  "A person took control": "某人接管了控制",
  "Control went back to the Bot": "控制交还给机器人",
  "The Bot asked for help": "机器人请求帮助",
  "The Bot asked for a secret": "机器人请求密钥",
  "A person supplied a secret": "某人提供了密钥",
  "The computer was reset": "电脑已重置",
  "The computer was updated": "电脑已更新",
  "A person pressed stop": "某人按了停止",
  "Granted to this Bot": "已授予此机器人",
  "Taken away from this Bot": "已从此机器人收回",
  "Published. Every Bot can use it": "已发布，所有机器人都能使用",
  "Unpublished. No Bot can use it": "已取消发布，机器人无法使用",
  "Draft saved, not yet published": "草稿已保存，尚未发布",
  Refused: "已拒绝",
  "Can read this": "可以读取",
  "Can no longer read this": "不再可以读取",
  "Read real data": "读取了真实数据",
  "Couldn't read it": "无法读取",
  "Tools offered for one run": "本次运行提供的工具",
  "Called on this Bot's behalf": "代表此机器人调用",
  "The server didn't answer": "服务器未响应",
  "Couldn't confirm which Bot it was": "无法确认是哪个机器人",
  "Configuration changed": "配置已更改",
  "Credential saved": "凭据已保存",
  "Few enough tools to offer them all": "工具很少，全部提供",
  "No skill declares any of these tools": "没有技能声明这些工具",
  "Couldn't choose, so all were offered": "无法选择，因此全部提供",
  "No skill applied, so all were offered": "没有适用的技能，因此全部提供",
  "Chosen by skill": "由技能选择",
  "Team settings": "团队设置",
  "Require auto-review for everyone": "为所有人开启自动审核",
  "Let members set personal rules": "允许成员设置个人规则",
  "Commands on members' computers, at most": "成员电脑上的命令，最多",
  "A member's own stricter setting still applies.":
    "成员自己更严格的设置仍然生效。",
  "These apply to every member's Bots. Members can't change them.":
    "这些规则适用于每个成员的机器人，成员无法更改。",
  "Team rules": "团队规则",
  "No team rules.": "还没有团队规则。",
  "Add a team rule": "添加团队规则",
  // ---- Approvals: rules ---------------------------------------------------------------------
  "Ask every time": "每次都询问",
  "Always allow": "始终允许",
  Never: "从不",
  "Take action without asking": "无需询问即可行动",
  "Take action if pre-approved": "预先批准后即可行动",
  "Ask before taking action": "行动前询问",
  "Hand off to you": "交给你处理",
  "Take action without asking (team rule)": "无需询问即可行动（团队规则）",
  "Take action if pre-approved (team rule)": "预先批准后即可行动（团队规则）",
  "Ask before taking action (team rule)": "行动前询问（团队规则）",
  "Hand off to you (team rule)": "交给你处理（团队规则）",
  Locked: "已锁定",
  "on {scope}": "范围：{scope}",
  "for {botId}": "机器人：{botId}",
  "Behaviour for {tool}": "{tool} 的行为",
  "A tool or app, and what a Bot does before using it.":
    "工具或应用，以及机器人在使用它之前的行为。",
  "Use * to match anything. mcp/gmail/* means every Gmail tool. A target of *.example.com means every page on that site.":
    "* 可匹配任何内容。mcp/gmail/* 表示所有 Gmail 工具；目标写 *.example.com 表示该站点上的每个页面。",
  "Tool or app": "工具或应用",
  "Kind of action": "动作类型",
  Target: "目标",
  Behaviour: "行为",
  "Save rule": "保存规则",
  // ---- Admin: Computers ---------------------------------------------------------------------
  "Each Bot's browser and the profile it keeps. The profile keeps a Bot signed in. Resetting it signs the Bot out of everything.":
    "每个机器人自己的浏览器以及它保留的配置文件。配置文件让机器人保持登录；重置会让它退出所有账号。",
  "Couldn't load the computers. Reload the page.":
    "无法加载电脑列表。请刷新页面。",
  "Every Bot is sharing one computer.": "所有机器人正在共用一台电脑。",
  "They share its logins, files and session. A Bot can reach what another signed into. Set":
    "它们共享登录态、文件和会话，一个机器人能碰到另一个登录过的内容。设置",
  "to give each Bot its own.": "来让每个机器人拥有自己的电脑。",
  "Each Bot has its own computer, with its own container, files and browser profile.":
    "每个机器人都有自己的电脑，含独立容器、文件和浏览器配置。",
  "Computers in this deployment": "本部署的电脑",
  "Couldn't load the list.": "无法加载列表。",
  "No computers yet. One shows up the first time a Bot opens a page.":
    "还没有电脑。机器人第一次打开网页时就会出现。",
  "Browser running since {time}": "浏览器自 {time} 起运行",
  "No browser running. It starts when the Bot next needs it.":
    "浏览器未运行。下次机器人需要时会自动启动。",
  "Egress not reported": "未报告出口",
  "Leaves directly": "直接出网",
  "Leaves through {proxy}": "经由 {proxy} 出网",
  "Update available": "有可用更新",
  "Update computer": "更新电脑",
  "Stop browser": "停止浏览器",
  Reset: "重置",
  "Reset {name}'s computer?": "重置 {name} 的电脑？",
  "Its profile is deleted. The Bot is signed out of every service and starts clean. You can't undo this.":
    "它的配置会被删除，机器人会退出所有服务并从头开始。此操作无法撤销。",
  "Resetting…": "正在重置…",
  "Reset it": "重置",
  "Update {name}'s computer?": "更新 {name} 的电脑？",
  "It moves to the computer image this deployment now runs. Its files and sign-ins are kept. If it's running, it restarts and stops what it's doing.":
    "它会切换到本部署当前运行的电脑镜像，文件和登录态都会保留。如果正在运行，会重启并中断当前动作。",
  "Updating…": "正在更新…",
  "Update it": "更新",
  Stop: "停止",
  "closes the browser and keeps its logins. It starts again the next time the Bot needs it.":
    "会关闭浏览器并保留登录态，下次机器人需要时再启动。",
  "deletes the profile and signs the Bot out of everything.":
    "会删除配置，让机器人退出所有账号。",
  "shows when a computer runs an older image. It moves the computer to the new one and keeps its files and sign-ins. All three show in":
    "只在电脑运行旧镜像时出现。它会把电脑切换到新镜像，并保留文件与登录态。三者都会记入",
  "Choose folders a Bot can read on this computer. The desktop app asks before each edit or command. Access ends when you stop OmniBot.":
    "选择机器人在这台电脑上可以读取的文件夹。每次修改或执行命令前，桌面应用都会询问。停止 OmniBot 时访问结束。",
  "Folders on this computer": "这台电脑上的文件夹",
  "The desktop app is offline. Open it to approve folders or run commands.":
    "桌面应用已离线。打开它才能批准文件夹或执行命令。",
  "No Bots yet. Create one, then choose its folders.":
    "还没有机器人。先创建一个，再选择它的文件夹。",
  "Waiting…": "等待中…",
  "Choose folder": "选择文件夹",
  "Folders are read-only. When a Bot needs to write, the desktop app asks you first.":
    "文件夹是只读的。机器人需要写入时，桌面应用会先询问你。",
  "Stopping…": "正在停止…",
  "Stop folder access": "停止文件夹访问",
  "View audit": "查看审计",
  "Read-only": "只读",
  "Revoking…": "正在吊销…",
  "{what} from {owner}": "{owner} 的{what}",
  " for {name}": "，针对 {name}",
  "No folders approved.": "尚未批准任何文件夹。",
  "{count} read-only folders": "{count} 个只读文件夹",
  "{count} pending requests": "{count} 个待处理请求",
  "the desktop owner": "桌面端所有者",
  "File change waiting for approval or to finish": "文件修改等待批准或完成",
  "Command waiting for approval or to finish": "命令等待批准或完成",
  "Listing files": "列出文件",
  "Reading a file": "读取文件",
  "Stopping folder work": "正在停止文件夹操作",
  "Folder access waiting for approval": "文件夹访问等待批准",
  // ---- Admin: Skills ------------------------------------------------------------------------
  "Write a skill": "编写技能",
  "Named instructions anybody can run with /. A skill adds no access. It can only ask a Bot to use what it already has.":
    "任何人用 / 就能运行的命名指令。技能不会增加任何权限，只能让机器人使用它已有的能力。",
  "For everybody in this deployment. People write their own on their Skills page.":
    "面向本部署的所有人。个人技能在自己的「技能」页编写。",
  Installed: "已安装",
  "Couldn't load skills. Reload the page.": "无法加载技能。请刷新页面。",
  "No skills yet. Write one with Write a skill.":
    "还没有技能。用「编写技能」新建一个。",
  "Write a skill for everybody": "为所有人编写技能",
  "People type the slug after /. The Bot then follows the instructions. Everybody can use it, and you choose which Bots have it.":
    "人们在 / 之后输入 slug，机器人随后按指令执行。所有人都可以使用，你可以决定哪些机器人拥有它。",
  Slug: "标识（slug）",
  Title: "标题",
  Summary: "摘要",
  Instructions: "指令",
  "What the Bot should do when this skill is used.":
    "使用这个技能时机器人应该做什么。",
  "Install skill": "安装技能",

  // ---- Admin: People ------------------------------------------------------------------------
  "Everybody who has signed in. Admins can open these screens. Everybody else talks to Bots.":
    "所有登录过的人。管理员可以打开这些页面，其他人只和机器人对话。",
  "Who is here": "都有谁",
  "Addresses in INITIAL_ADMIN_EMAILS are always admins. You can't change them here.":
    "INITIAL_ADMIN_EMAILS 中的地址始终是管理员，无法在这里更改。",
  "Stopped {count} computers. Their disks are kept.":
    "已停止 {count} 台电脑，磁盘保留。",
  "{count} couldn't be stopped.": "{count} 台未能停止。",
  "Search people": "搜索成员",
  "Search by name or address": "按姓名或地址搜索",
  "Couldn't load people. Reload the page.": "无法加载成员。请刷新页面。",
  "Nobody matches “{query}”.": "没有匹配“{query}”的人。",
  "Nobody has signed in yet. People show here once they do.":
    "还没有人登录。登录后会出现在这里。",
  "last signed in {date}": "最后登录于 {date}",
  "never signed in": "从未登录",
  "no provider": "无身份提供商",
  "Access removed · {source} · {when}": "访问已移除 · {source} · {when}",
  "Admin by configuration · {when}": "配置中的管理员 · {when}",
  "{source} · {when}": "{source} · {when}",
  "Stop computers": "停止电脑",
  Restore: "恢复",
  "Admin: {email}": "管理员：{email}",
  "Show more": "显示更多",
  // ---- Admin: Plugins -----------------------------------------------------------------------
  "What this deployment can reach, and which Bots can use it. A plugin you add is for everybody. Choose which Bots get its tools on its page.":
    "本部署能访问的服务，以及哪些机器人可以使用。你添加的插件面向所有人；在插件自己的页面上选择哪些机器人获得它的工具。",
  "Couldn't load plugins. Reload the page.": "无法加载插件。请刷新页面。",
  "Added for everybody. Open one to set it up and choose which Bots get its tools.":
    "已为所有人添加。打开一个进行配置，并选择哪些机器人获得它的工具。",
  Connected: "已连接",
  "Nothing connected yet. Pick one from the list below.":
    "还没有连接任何服务。从下面的列表中选择一个。",
  "Reviewed, first-party servers. Open one to add it.":
    "经过审核的第一方服务。打开一个即可添加。",
  "Explore plugins": "发现插件",
  "Every plugin in the catalogue is connected.": "目录中的每个插件都已连接。",
  "Not added": "未添加",
  "More apps": "更多应用",
  "Not connected": "未连接",
  "No tools yet": "还没有工具",
  "{count} tools": "{count} 个工具",
  "{tools} · no Bots": "{tools} · 没有机器人",
  "{tools} · {bots} Bots": "{tools} · {bots} 个机器人",
  "{count} requests": "{count} 个请求",
  // ---- Settings: Notifications --------------------------------------------------------------
  "Where your Bots' updates reach you when you're away. Set how much each Bot sends on its own page.":
    "你不在时，机器人的更新会送到这里。每个机器人发多少，在它自己的页面上设置。",
  "Where each kind of update goes when you're away. OmniBot on the web always shows everything.":
    "你不在时每类更新去往哪里。网页版 OmniBot 始终显示全部内容。",
  "Where updates go": "更新的去向",
  "Couldn't load where your updates go. Reload the page.":
    "无法加载更新去向。请刷新页面。",
  Progress: "进展",
  "Replies and results from work you weren't watching.":
    "你不在场时的工作回复与结果。",
  Decisions: "决定",
  "Approvals a Bot needs before it acts.": "机器人行动前需要的批准。",
  Questions: "问题",
  "Things a Bot asked you and is waiting on.":
    "机器人问你、正在等待回答的事情。",
  Push: "推送",
  Slack: "Slack",
  "Microsoft Teams": "Microsoft Teams",
  SMS: "短信",
  "Not set up": "未配置",
  "{kind} by {transport}": "通过{transport}接收{kind}",
  "Sign in to the OmniBot app on your phone and turn on notifications to add it here.":
    "在手机上登录 OmniBot 应用并开启通知，就会出现在这里。",
  "Your devices": "你的设备",
  "No devices yet.": "还没有设备。",
  "Recent deliveries": "最近送达",
  "No deliveries yet.": "还没有送达记录。",
  // ---- Settings: Passwords / Components gallery / Approvals ---------------------------------
  "Logins you saved when signing a Bot in to a website. Bots never see them, and you confirm each use.":
    "你在把机器人登录到某个网站时保存的账号。机器人看不到它们，每次使用都要你确认。",
  "Saved logins": "已保存的登录",
  "Couldn't load your passwords. Reload the page.":
    "无法加载你的密码。请刷新页面。",
  "An admin has turned off saved passwords. Your logins are kept but won't be offered.":
    "管理员已关闭保存的密码。你的登录仍会保留，但不会再被提供。",
  "No saved logins. Choose Save to Passwords when you sign a Bot in to a website.":
    "还没有保存的登录。把机器人登录到网站时选择「保存到密码」。",
  "last used {date}": "最后使用于 {date}",
  "never used": "从未使用",
  "Delete login for {origin}": "删除 {origin} 的登录",
  "What a Bot can draw in a conversation. An admin chooses which ones each Bot can use.":
    "机器人在对话中可以画出的内容。管理员决定每个机器人能用哪些。",
  "Couldn't load components. Reload the page.": "无法加载组件。请刷新页面。",
  "Nothing published yet": "还没有发布任何组件",
  "When an admin publishes a component, it will show up here.":
    "管理员发布组件后会出现在这里。",
  "There's no component with that name.": "没有这个名称的组件。",
  "No such component": "没有该组件",
  "It may have been removed or unpublished.": "它可能已被移除或取消发布。",
  "Back to the gallery": "返回组件库",
  Kind: "类型",
  "Called as": "调用名",
  "Choose when your Bots ask before they change things. Rules here apply to all of them.":
    "选择机器人在做改动前何时询问你。这里的规则适用于所有机器人。",
  "Team settings and shared account requests are in":
    "团队设置与共享账号申请在",
  "Admin → Approvals": "管理 → 审批",
  "Before a Bot acts": "机器人行动前",
  "Ask before making changes": "改动前先询问",
  "Review a Bot's changes to websites, connected apps, and files.":
    "审查机器人对网站、已连接应用和文件的改动。",
  "Auto-review": "自动审核",
  "An admin requires this. ": "管理员已强制开启。",
  "Before a Bot does something that could affect your accounts or share information, OmniBot checks it against your request and your rules. If it can't tell, it asks you.":
    "机器人做可能影响你账号或分享信息的操作之前，OmniBot 会用你的请求和规则核对；判断不了时就来问你。",
  "Commands on your computer": "你电脑上的命令",
  "An admin limits this to {limit}.": "管理员将其限制为「{limit}」。",
  "The OmniBot desktop app still shows you each command before it runs.":
    "OmniBot 桌面应用仍会在每条命令执行前展示给你。",
  "The strictest matching rule wins. An “ask” rule beats an “allow” rule. Team rules are locked. Passwords, security settings and payments are always handed to you. Rules for one Bot are on":
    "最严格的匹配规则生效：「询问」规则优先于「允许」规则。团队规则是锁定的。密码、安全设置和支付始终交给你处理。针对单个机器人的规则在",
  "that Bot's page": "该机器人的页面上",
  " An admin has turned off personal rules. Yours are kept but don't apply.":
    " 管理员已关闭个人规则，你的规则会保留但不会生效。",
  "Rules for every Bot": "针对每个机器人的规则",
  "No rules yet.": "还没有规则。",
  "Add a rule": "添加规则",
  "These don't match a Bot you can open. They still apply to any Bot they match. Remove the ones you don't want.":
    "这些规则不匹配你能打开的机器人，但对任何匹配的机器人仍然生效。不需要的可以移除。",
  "Rules for other Bots": "针对其他机器人的规则",
  "A Bot shared with you uses its owner's apps. It uses yours only where you said yes in a conversation.":
    "分享给你的机器人默认使用其所有者的应用；只有在对话中你同意过的地方才用你的。",
  "Shared Bots": "共享机器人",
  "Apps you let shared Bots use": "你允许共享机器人使用的应用",
  "Reset. Each shared Bot will ask again.":
    "已重置。每个共享机器人都会重新询问。",
  "Forget every answer, so each shared Bot asks again.":
    "忘记所有回答，让每个共享机器人重新询问。",
  // ---- Capabilities: Skills -----------------------------------------------------------------
  Type: "输入",
  "and a skill's name to give a Bot that instruction. Only you see yours, and they work on Bots you own.":
    "再加技能名，就能把这个指令交给机器人。只有你能看到自己的技能，且只在你拥有的机器人上生效。",
  "Your skills": "你的技能",
  "New skill": "新建技能",
  "Couldn't load your skills. Reload the page.":
    "无法加载你的技能。请刷新页面。",
  "No skills yet. Write one with New skill.":
    "还没有技能。用「新建技能」写一个。",
  "Delete /{slug}": "删除 /{slug}",
  "Workspace skills": "工作区技能",
  "An admin writes these for everyone and picks which Bots use them.":
    "管理员为所有人编写这些技能，并决定哪些机器人使用。",
  Command: "命令",
  "You can't change a command. To rename this skill, write a new one and delete this one.":
    "命令不能修改。要重命名这个技能，请写一个新的，然后删除旧的。",
  "What you type after a slash.": "斜杠之后输入的内容。",
  "My standup skill": "我的站会技能",
  "One-liner": "一句话说明",
  "Turns yesterday's work into a standup update": "把昨天的工作整理成站会更新",
  "Shown beside the command in this list and in the":
    "显示在列表中命令旁边，以及",
  "menu. Optional.": "菜单里。可选。",
  "What the Bot is told when you use the command. Write it as instructions to the Bot.":
    "使用该命令时告诉机器人的内容。请写成对机器人的指令。",
  Memory: "记忆",
  "An instruction you start with": "一条以",
  "Only you see it, and it works on Bots you own.":
    "开头的指令。只有你能看到，且只在你拥有的机器人上生效。",
  "Save skill": "保存技能",
  "Tools it needs": "它需要的工具",
  "Couldn't load the tools. Reload the page.": "无法加载工具。请刷新页面。",
  "No app offers tools yet. You can still write the skill. Most skills are only instructions.":
    "还没有应用提供工具。你仍然可以写这个技能——大多数技能只是指令。",
  "changes something": "会修改内容",
  "Public-web research": "公共网络研究",
  "{role}: uses whichever research app the Bot has":
    "{role}：使用机器人可用的研究应用",
  "Not available here": "此处不可用",
  "{ref}: no app here offers this": "{ref}：此处没有应用提供它",
  "This skill asks for these, but no app here offers them. They do nothing until an admin adds the app. Click one to remove it.":
    "这个技能需要这些工具，但此处没有应用提供。在管理员添加对应应用之前它们不会生效。点击可移除。",
  "Using this skill loads these tools for that reply. It doesn't give access. A Bot can only use tools it already has.":
    "使用这个技能只会为那一次回复加载这些工具，不会授予任何权限。机器人只能使用它已有的工具。",
  Missing: "缺失",
  "Save changes": "保存修改",
  // ---- Capabilities: Memory -----------------------------------------------------------------
  "Remember a fact": "记住一条事实",
  "All your Bots will know it.": "你所有的机器人都将知道它。",
  "Something you want your Bots to know": "你想让机器人知道的事",
  "I prefer meetings in the morning.": "我更喜欢上午开会。",
  Remember: "记住",
  "Your memories": "你的记忆",
  "your Bot": "你的机器人",
  "No memories yet. Add one with Remember a fact.":
    "还没有记忆。用「记住一条事实」添加一条。",
  "Kept in Intelligence": "保存在 Intelligence 中",
  "Turned off": "已关闭",
  "Formed by {name}": "由 {name} 形成",
  " · needs review": " · 待审核",
  "Imported · needs review": "已导入 · 待审核",
  Reviewed: "已审核",
  "From {source}": "来自{source}",
  "a conversation": "一次对话",
  ", read {time}": "，读取于 {time}",
  "Open record": "打开记录",
  Confirm: "确认",
  Forget: "忘记",
  "Use this memory: {memory}": "使用这条记忆：{memory}",
  "Edit memory": "编辑记忆",
  "What your Bots know about you. Facts you add reach every Bot. What a Bot learns on its own stays with that Bot.":
    "机器人对你的了解。你添加的事实会被所有机器人共享；机器人自己学到的东西只留在它那里。",
  // ---- Routines -----------------------------------------------------------------------------
  "Hasn't run yet": "尚未运行",
  recently: "最近",
  "Failed {when}": "{when}失败",
  "Skipped {when}": "{when}跳过",
  "Ran {when}": "{when}运行过",
  "Finished {when}": "{when}完成",
  "No runs yet.": "还没有运行记录。",
  "Open conversation": "打开对话",
  "Routines aren't running.": "例务没有在运行。",
  "OmniBot last checked them {when}. None will run until it starts again. Ask an admin if this keeps happening.":
    "OmniBot 上次检查是在{when}。在重新启动之前都不会运行。如果一直如此，请联系管理员。",
  "OmniBot hasn't started running routines yet, so none of these will run. Ask an admin to set this up.":
    "OmniBot 还没有开始运行例务，因此这些都不会执行。请联系管理员完成设置。",
  "Couldn't load your routines. Reload the page.":
    "无法加载你的例务。请刷新页面。",
  "No routines for this Bot yet. Ask it something like “every weekday at 9, send me…” and it shows up here.":
    "这个机器人还没有例务。对它说类似「每个工作日早上 9 点把…发给我」，它就会出现在这里。",
  "No routines yet. Ask a Bot something like “every weekday at 9, send me…” and it shows up here.":
    "还没有例务。对一个机器人说类似「每个工作日早上 9 点把…发给我」，它就会出现在这里。",
  "Enable the routine scheduled {schedule}": "启用按 {schedule} 安排的例务",
  "Conversation deleted": "对话已删除",
  "Untitled conversation": "未命名对话",
  Paused: "已暂停",
  Due: "已到期",
  "Next {when}": "下次 {when}",
  "Run the routine scheduled {schedule} now":
    "立即运行按 {schedule} 安排的例务",
  "Runs it now, for real. The Bot does the work and posts in the conversation.":
    "立即真正执行一次：机器人会完成工作并发布在对话里。",
  "This routine is paused. Turn it on first.": "这个例务已暂停，请先开启。",
  "Run history for the routine scheduled {schedule}":
    "按 {schedule} 安排例务的运行历史",
  History: "历史",
  "Delete the routine scheduled {schedule}": "删除按 {schedule} 安排的例务",
  "Delete “{schedule}”?": "删除“{schedule}”？",
  "This routine stops for good. You can't undo this.":
    "这个例务将永久停止，无法撤销。",
  "Deleting…": "正在删除…",
  "What a Bot does on a schedule, without being asked each time. Made and changed by talking to a Bot — this page only shows what is standing, and lets you stop one.":
    "机器人按时间自动做的事，不必每次开口。它由对话创建和修改——这个页面只显示正在生效的例务，并允许停用。",
  Routines: "例务",
  "Run now": "立即运行",
  // ---- Responsibilities ---------------------------------------------------------------------
  "New responsibility": "新建职责",
  Goals: "目标",
  "No responsibilities for this Bot yet. Add one with New responsibility.":
    "这个机器人还没有职责。用「新建职责」添加一个。",
  "No responsibilities yet. Add one with New responsibility.":
    "还没有职责。用「新建职责」添加一个。",
  Active: "进行中",
  Completed: "已完成",
  Manual: "手动",
  Schedule: "计划",
  "Connected app": "已连接应用",
  Webhook: "Webhook",
  "{status} · Nothing starts it until you resume it":
    "{status} · 恢复前不会自动启动",
  "{kind} trigger": "{kind}触发",
  "{status} · Starts on {starts}": "{status} · 由 {starts} 启动",
  "{status} · Runs when asked": "{status} · 按需运行",
  "Its events and triggers start it.": "由事件和触发器启动。",
  "Paused. Its triggers won't start it.": "已暂停，触发器不会启动它。",
  "Runs it now, for real. The Bot does the work and can post and take actions.":
    "立即真正执行一次：机器人会完成工作，可以发布消息并采取行动。",
  Complete: "完成",
  "Mark it done. Nothing starts it after this.":
    "标记为完成，之后不会再被启动。",
  Instruction: "指令",
  "Success criteria": "成功标准",
  Events: "事件",
  Runs: "运行记录",
  "Hide runs": "收起运行记录",
  "View runs": "查看运行记录",
  Queued: "已排队",
  Running: "运行中",
  "Waiting for {kind}. Answer at the top of this Bot's page or in the conversation.":
    "正在等待{kind}。请在机器人页面顶部或对话中回答。",
  // ---- Bot subpages -------------------------------------------------------------------------
  "The skills, apps and other Bots this Bot can use.":
    "这个机器人可以使用的技能、应用和其他机器人。",
  "Skills and access": "技能与权限",
  "What this Bot can do without asking you first.":
    "这个机器人无需先询问你就能做的事。",
  "Approval rules": "审批规则",
  "What this Bot is doing for you and how it's set up.":
    "这个机器人在为你做什么，以及它是如何配置的。",
  "The apps this Bot learns from, and the research it does for you in the background.":
    "这个机器人学习所用的应用，以及它在后台为你做的研究。",
  "Continue a conversation with this Bot in Slack, Microsoft Teams, or by text message.":
    "在 Slack、Microsoft Teams 或短信里继续和这个机器人对话。",
  "Reaching you": "联系你",
  "Ongoing goals this Bot works on for you. See what started each run and what it found.":
    "这个机器人为你持续推进的目标。可以查看每次运行的起因与结果。",
  Responsibilities: "职责",
  "What this Bot does for you on a schedule. Turn one off, run it now, or delete it.":
    "这个机器人按计划为你做的事。可以停用、立即运行或删除。",
  "Who this Bot is, who can find it, and where it runs.":
    "这个机器人是谁、谁能找到它、它在哪运行。",
  Setup: "设置",
  "Who else can use this Bot. Each person's conversations with it are private.":
    "还有谁能使用这个机器人。每个人与它的对话都是私密的。",
  Sharing: "共享",
  // ---- Bots roster --------------------------------------------------------------------------
  "New Bot": "新建机器人",
  "Your Bots and the ones shared with you. See what each is doing and what it needs from you.":
    "你的机器人以及分享给你的机器人。看看每个正在做什么、需要你做什么。",
  Pinned: "已置顶",
  Yours: "你的",
  "Your Bots are all pinned above.": "你的机器人都在上面置顶了。",
  "Your Bots are all under Needs you.": "你的机器人都列在「需要你」里。",
  "You don't have any Bots yet. Create one with New Bot.":
    "你还没有机器人。用「新建机器人」创建一个。",
  "Shared with you": "分享给你",
  Hide: "隐藏",
  Show: "显示",
  "{count} Bots you hid. Only your list changes.":
    "你隐藏了 {count} 个机器人。只影响你自己的列表。",
  Hidden: "已隐藏",
  "{count} questions": "{count} 个问题",
  "{count} approvals": "{count} 个审批",
  "{count} stalled hand-offs": "{count} 个中断的交接",
  "{count} unread": "{count} 条未读",
  "{count} things need you": "{count} 件事需要你处理",
  "Unread messages": "未读消息",
  "{name} needs you": "{name} 需要你",
  // ---- New Bot flow -------------------------------------------------------------------------
  "View details for {name}": "查看 {name} 的详情",
  "Taking you to it…": "正在带你过去…",
  Optional: "可选",
  "A few words shown under its name.": "名称下方显示的一句话。",
  "Who can see it": "谁可以看到它",
  "Run it here": "在这里运行",
  "or connect one you run": "或连接你自己运行的 agent",
  "Agent address": "Agent 地址",
  "Any agent that speaks AG-UI works. OmniBot connects to it, so it has to be reachable from OmniBot's server.":
    "任何支持 AG-UI 的 agent 都可以。OmniBot 会连接它，因此它必须能从 OmniBot 服务器访问到。",
  "Sent as an": "以",
  "header with every request, and stored encrypted.":
    "头发送每次请求，并加密存储。",
  Name: "名称",
  "Checking…": "正在检查…",
  "Creating…": "正在创建…",
  Create: "创建",
  Continue: "继续",
  // ---- Connections --------------------------------------------------------------------------
  "Couldn't connect that account. Nothing was saved. Try again.":
    "无法连接该账号，没有保存任何内容。请重试。",
  "The apps and accounts your Bots use as you. Open one to connect it or change it.":
    "机器人以你的身份使用的应用和账号。打开一个即可连接或修改。",
  "Your connections": "你的连接",
  "Couldn't load your connections. Reload the page, or ask an admin if it keeps happening.":
    "无法加载你的连接。请刷新页面；如果一直如此，请询问管理员。",
  "Nothing to connect yet. Apps show up here once an admin turns them on.":
    "还没有可连接的应用。管理员开启后会出现在这里。",
  "{inUse} in use · {all} in all": "{inUse} 个使用中 · 共 {all} 个",
  "Search connections": "搜索连接",
  "Nothing matches “{query}”.": "没有匹配“{query}”的连接。",
  "Couldn't load GitHub and Slack, so they aren't listed. Reload the page.":
    "无法加载 GitHub 和 Slack，因此没有列出。请刷新页面。",
  "Team account": "团队账号",
  Reconnect: "重新连接",
  Connect: "连接",
  // ---- Connection detail ---------------------------------------------------------------------
  Account: "账号",
  "Couldn't load this connection. Reload the page, or ask an admin if it keeps happening.":
    "无法加载这个连接。请刷新页面；如果一直如此，请询问管理员。",
  "Couldn't load this app. Reload the page, or ask an admin if it keeps happening.":
    "无法加载这个应用。请刷新页面；如果一直如此，请询问管理员。",
  "{name} isn't set up yet. An admin has to turn it on before anyone can connect it.":
    "{name} 尚未配置。需要管理员先开启，其他人才能连接。",
  "Shared by your organisation. Bots act as the team account.":
    "由你的组织共享，机器人以团队账号行动。",
  "No Bot can use this as you.": "没有机器人能以你的身份使用它。",
  "Authorize the actions you want below.": "在下面授权你需要的操作。",
  "Connecting takes you to {vendor} to approve access.":
    "连接会带你到 {vendor} 批准访问。",
  "Bots use this as you, and see only what you can see.":
    "机器人以你的身份使用它，只能看到你能看到的内容。",
  "Bots you allow use your {vendor} as you. Disconnecting removes their access everywhere.":
    "被允许的机器人会以你的身份使用 {vendor}。断开连接会移除它们在各处的访问。",
  "You don't connect this app yourself.": "这个应用不需要你自己连接。",
  "Bots use one shared account for this app, the same for everybody.":
    "机器人使用这个应用的一个共享账号，所有人相同。",
  "OmniBot has no app by that name.": "OmniBot 没有这个名称的应用。",
  "Your account": "你的账号",
  "Not available yet. An admin has to turn this on first.":
    "暂不可用。需要管理员先开启。",
  "Bots you allow use this as you, and see only what you can see.":
    "被允许的机器人以你的身份使用它，只能看到你能看到的内容。",
  "No Bot can use this as you. Connecting takes you to {vendor} to approve access.":
    "没有机器人能以你的身份使用它。连接会带你到 {vendor} 批准访问。",
  "What you allowed, as {vendor} recorded it. This can be less than OmniBot asked for.":
    "你允许的范围（按 {vendor} 的记录）。这可能比 OmniBot 申请的要少。",
  Access: "访问权限",
  "Allowed by you": "允许的范围",
  "{vendor} didn't say.": "{vendor} 未说明。",
  // ---- Admin: Automatic learning ------------------------------------------------------------
  "Learn from finished conversations, review the skills Intelligence proposes, and give published skills to Bots.":
    "从已完成的对话中学习，审查 Intelligence 建议的技能，并把已发布的技能交给机器人。",
  Participation: "参与",
  "Container changes apply to new conversations. Existing ones keep their first container. Containers must already exist in the same Intelligence project. Until you save here, OmniBot uses that project's openbot container.":
    "容器改动只影响新对话；已有对话沿用它的第一个容器。容器必须已存在于同一个 Intelligence 项目中。在你在这里保存之前，OmniBot 使用该项目的 openbot 容器。",
  "Loading Learning settings…": "正在加载学习设置…",
  "Turn on automatic learning and skill delivery": "开启自动学习与技能交付",
  Default: "默认",
  "With no default, Bots without their own container are left out. IDs are 1 to 64 lowercase letters, numbers and single hyphens. Leave revision empty to use the latest published skills.":
    "没有默认值时，没有自己容器的机器人会被排除在外。ID 由 1 到 64 个小写字母、数字和单个连字符组成。修订留空则使用最新发布的技能。",
  "Per-Bot participation": "各机器人参与方式",
  "Couldn't load the Bot list. Saved settings for each Bot are below.":
    "无法加载机器人列表。各机器人的已保存设置见下。",
  "Use deployment default": "使用部署默认",
  "Leave out of Learning": "不参与学习",
  "Use a specific container": "使用指定容器",
  "Save Learning settings": "保存学习设置",
  "Settings saved.": "设置已保存。",
  "Review and publish": "审查与发布",
  "Intelligence studies finished conversations and proposes skills. Review and publish them in Intelligence. Bots only use published skills.":
    "Intelligence 研究已完成的对话并提出技能建议。在 Intelligence 中审查并发布；机器人只使用已发布的技能。",
  "Show the container for": "查看以下对象的容器",
  "Checking Intelligence…": "正在检查 Intelligence…",
  "The selected container or its instrumentation isn't available.":
    "所选容器或其监控不可用。",
  "Choose a Bot, or set a default container.":
    "选择一个机器人，或设置默认容器。",
  "No Learning container is assigned.": "尚未分配学习容器。",
  "Threads ready": "待处理会话",
  "Candidates to review": "待审查候选",
  "Published skills": "已发布技能",
  Insights: "洞察",
  "An analysis is running.": "分析正在运行。",
  "Latest analysis: {status}.": "最近一次分析：{status}。",
  "No analysis has run yet.": "还没有运行过分析。",
  "Manage Learning in Intelligence": "在 Intelligence 中管理学习",
  "Review skill candidates": "审查技能候选",
  "View analysis runs": "查看分析记录",
  "Skill delivery": "技能交付",
  "Checking delivery…": "正在检查交付…",
  "Delivery is off for this Bot.": "这个机器人的交付已关闭。",
  "Waiting for the first verified skill snapshot.":
    "等待第一个已验证的技能快照。",
  "Using the last verified snapshot. A refresh is pending.":
    "正在使用上一个已验证快照，刷新待处理。",
  "A verified snapshot is available.": "已有可用的已验证快照。",
  "Loaded revision: {revision}": "已加载修订：{revision}",
  "Last checked:": "最后检查：",
  "Refresh status": "刷新状态",
  "Managing Learning needs your Intelligence account and project access. OmniBot keeps project credentials on the server. Turning Learning off here keeps settings and conversation assignments. Schedules and publishing stay in Intelligence.":
    "管理学习需要你的 Intelligence 账号与项目权限。OmniBot 将项目凭据保存在服务器上。在此关闭学习会保留设置与对话归属；调度与发布仍在 Intelligence 中进行。",
  "{label} container ID": "{label} 容器 ID",
  "{label} revision": "{label} 修订版本",
  "Exact revision (optional)": "精确修订版本(可选)",
  "Latest published": "最新发布",
  // ---- Admin: Identity providers ------------------------------------------------------------
  "Add a provider": "添加提供商",
  "Your company's own SAML or OpenID Connect provider. People sign in with their email, and its domain picks the provider.":
    "贵公司自己的 SAML 或 OpenID Connect 提供商。人们用邮箱登录，由域名决定使用哪个提供商。",
  "Google, Microsoft and Okta are set in the environment. They don't show here.":
    "Google、Microsoft 和 Okta 通过环境变量配置，不会显示在这里。",
  Registered: "已注册",
  "Couldn't load identity providers. Reload the page.":
    "无法加载身份提供商。请刷新页面。",
  "No identity providers yet. Add one with the metadata from your identity team.":
    "还没有身份提供商。用身份团队提供的元数据添加一个。",
  "Add an identity provider": "添加身份提供商",
  "Email domain": "邮箱域名",
  "Anybody with an address at this domain signs in here. Separate several with commas.":
    "使用该域名邮箱地址的人都会在这里登录。多个域名用逗号分隔。",
  Issuer: "颁发者",
  "Sign-on URL": "登录 URL",
  "Metadata XML": "元数据 XML",
  "The file from your identity team. It includes the signing certificate.":
    "来自身份团队的文件，其中包含签名证书。",
  "Client ID": "客户端 ID",
  "Client secret": "客户端密钥",
  "Adding…": "正在添加…",
  Add: "添加",
  // ---- Admin: UI components -----------------------------------------------------------------
  "What each Bot can answer with. Every published component is on for every Bot. Turn one off and that Bot never sees it. Changes and refusals show in Audit.":
    "每个机器人可以用什么来回答。已发布的组件默认对所有机器人开启；关掉后那个机器人就再也看不到它。改动与被拒绝的记录都会进入审计。",
  "No components yet": "还没有组件",
  "Components your Bots can use will show here.":
    "机器人可用的组件会显示在这里。",
  "There is no component that name.": "没有这个名称的组件。",
  "It may have been renamed, or this deployment no longer ships it.":
    "它可能已改名，或本部署不再包含它。",
  "Back to components": "返回界面组件",
  "Not published. No Bot can see it.": "未发布，没有机器人能看到它。",
  "What this component is for, and which Bots can answer with it.":
    "这个组件的用途，以及哪些机器人可以用它来回答。",
  Configuration: "配置",
  "Not in this build": "此版本中没有",
  "OmniBot can't draw it. The settings below have no effect.":
    "OmniBot 无法绘制它，下面的设置不会生效。",
  Published: "已发布",
  "Bots can answer with it.": "机器人可以用它回答。",
  "No Bot can use it.": "没有机器人可以使用它。",
  " The description has unpublished changes.": " 描述有未发布的改动。",
  Description: "描述",
  "Nothing yet": "还没有内容",
  "Available to": "可用范围",
  "Can read": "可读取",
  "Last changed": "最后修改",
  "What the model reads when it decides to use this. It has no effect until the component is published.":
    "模型决定是否使用它时读到的内容。在组件发布之前不会生效。",
  "Turn a Bot off and it never learns this component exists. Changes apply right away.":
    "关掉某个机器人后，它就再也不知道这个组件存在。改动立即生效。",
  "No Bots yet.": "还没有机器人。",
  "The data this component can fetch to draw itself. This is separate from Available to. With all of these off, it shows only what the Bot passes it. Every read shows in Audit. Changes apply right away.":
    "这个组件绘制自身时可以抓取的数据。它和「可用范围」是分开的。全部关闭时，它只显示机器人传给它的内容。每次读取都会记入审计。改动立即生效。",
  "This deployment has no data functions.": "本部署没有数据函数。",
  "Nothing. It shows only what the Bot passes it.":
    "没有。它只显示机器人传给它的内容。",
  // ---- Admin: Playground --------------------------------------------------------------------
  "Write a component and publish it without redeploying. Your edits are a draft. Conversations only show what is published.":
    "编写组件并发布，无需重新部署。你的修改只是草稿；对话中只显示已发布的内容。",
  "Save draft": "保存草稿",
  Publish: "发布",
  "What the model is told about it": "告诉模型这是什么",
  "Show a refund with its amount, reason and status.":
    "展示一笔退款，包含金额、原因和状态。",
  "Arguments (JSON Schema)": "参数（JSON Schema）",
  "Sample arguments": "示例参数",
  Preview: "预览",
  "The sample arguments aren't available.": "示例参数不可用。",
  "Fix the JSON fields before previewing.": "预览前请先修正 JSON 字段。",
  "Saved here": "已保存",
  "Nothing saved yet. Save a draft to see it here.":
    "还没有保存任何内容。保存草稿后会显示在这里。",
  "published, revision {revision}": "已发布，修订 {revision}",
  "draft only, no Bot can draw it": "仅草稿，没有机器人能绘制它",
  " · edited since publishing": " · 发布后有修改",
  Open: "打开",
  "Publishing makes it available to every Bot. Turn it off for one Bot on the UI components page.":
    "发布后所有机器人都可用。可以在「界面组件」页对单个机器人关闭。",
  "Delete “{name}”?": "删除“{name}”？",
  "It's removed from this deployment, and no Bot can draw it. You can't undo this.":
    "它会从本部署中移除，没有机器人能再绘制它。此操作无法撤销。",
  "Delete it": "删除",
  // ---- Admin: Plugin detail -----------------------------------------------------------------
  Plugin: "插件",
  "There is no plugin with that name, here or in the catalogue.":
    "这里和插件目录中都没有这个名称的插件。",
  "Not a plugin": "不是插件",
  "Enable for this deployment": "为整个部署启用",
  "Whose account": "使用谁的账号",
  "This vendor answers as whoever is asking. The deployment registers an OAuth client, and each person connects their own account. A Bot only sees what that person can see.":
    "该服务以发起请求者的身份应答。部署注册一个 OAuth 客户端，每个人连接自己的账号，机器人只能看到那个人能看到的内容。",
  "Built into this deployment. There is no vendor to reach and no credential to keep. A call runs as whoever asked.":
    "内置于本部署。没有外部服务需要访问，也不需要保存凭据；调用以发起者身份运行。",
  "What this deployment sends to the vendor. One credential for everybody.":
    "本部署发给该服务商的凭据，所有人共用一份。",
  Connection: "连接方式",
  "How this is reached": "访问方式",
  "Access token": "访问令牌",
  "OAuth client": "OAuth 客户端",
  "Instance host": "实例主机",
  "A Bot only sees the tools it has been given. Each call is checked when it happens, so removing access applies from the next call.":
    "机器人只能看到已授予它的工具。每次调用都会在发生时检查，因此移除权限从下一次调用起生效。",
  Tools: "工具",
  "No tools listed. Refresh tools to check again.":
    "没有列出工具。刷新工具再检查一次。",
  "Given but no longer listed": "已授予但不再列出",
} satisfies Record<string, string>;

export type ZhDictionary = typeof zh;
