import { PageRows } from "@/components/layout/page-shell";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/lib/i18n";

/**
 * The interface language, per browser.
 *
 * Next to the theme rather than under an account menu: both are "how this machine reads", both live
 * in `localStorage`, and both have to work before sign-in. Changing it takes effect on the next
 * render — no reload — because every translated string is read through the provider.
 */
export function LanguagePreference() {
  const { locale, setLocale, t } = useI18n();
  return (
    <PageRows>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>{t("Interface language")}</ItemTitle>
          <ItemDescription>
            {t(
              "Applies to this browser immediately. Conversation names keep whatever language they were given.",
            )}
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Select
            value={locale}
            onValueChange={(value) => {
              if (value === "en" || value === "zh") setLocale(value);
            }}
          >
            <SelectTrigger aria-label={t("Interface language")}>
              <SelectValue>
                {locale === "zh" ? "简体中文" : "English"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="zh">简体中文</SelectItem>
            </SelectContent>
          </Select>
        </ItemActions>
      </Item>
    </PageRows>
  );
}
