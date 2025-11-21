import { Trans, useTranslation } from "react-i18next";

export function EdgeCasesExample() {
  const { t, i18n } = useTranslation();

  return (
    <div>
      {/* Edge case: Trans with values but no count */}
      <Trans i18nKey="welcome_message" values={{ name: "John" }} />

      {/* Edge case: Trans with i18nKey as expression */}
      <Trans i18nKey={"static_key"}>
        <span>Content</span>
      </Trans>

      {/* Edge case: t() with count = 0 */}
      <p>{t("no_items", { count: 0 })}</p>

      {/* Edge case: i18n.t() with multiline */}
      <p>
        {i18n.t("multiline_key", {
          count: 1,
          name: "Test",
        })}
      </p>

      {/* Edge case: Nested template literal */}
      <div>{t(`prefix__${status}__suffix`)}</div>
    </div>
  );
}

const status = "active";
