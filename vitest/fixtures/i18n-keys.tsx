import { Trans, useTranslation } from "react-i18next";

// Variable for test completeness
const selectedQuestions = 3;

export function AllKeysExample() {
  const { t, i18n } = useTranslation();
  const status = "cancelled";

  return (
    <div>
      {/* Static key */}
      <h1>{t("field_required")}</h1>

      {/* Plural key with t() */}
      <p>{t("encounter_tag_count", { count: 3 })}</p>

      {/* Multiline plural key */}
      <p>
        {t("entity_count", {
          count: 4,
          entity: "User",
        })}
      </p>

      {/* Plural key with i18n.t() */}
      <p>{i18n.t("patient_count", { count: 10 })}</p>

      {/* Trans component without count */}
      <Trans i18nKey="page_title">
        <span>Hello</span>
      </Trans>

      {/* Trans component WITH count in values prop - THIS IS THE MISSING CASE */}
      <Trans
        i18nKey="found_patient_with_this"
        values={{ count: 5, identifier: "phone" }}
      />

      {/* Trans component with count - multiline format */}
      <Trans
        i18nKey="remove_questions_confirmation"
        values={{ count: selectedQuestions }}
        components={{
          strong: <strong />,
        }}
      />

      {/* Dynamic template keys */}
      <div>{t(`encounter_status__${status}`)}</div>
    </div>
  );
}
