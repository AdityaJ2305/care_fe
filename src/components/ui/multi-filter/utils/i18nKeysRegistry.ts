/**
 * This file explicitly references i18n keys that are used dynamically
 * (e.g., t(variable)) so that the remove-unused-i18n.js script can detect them.
 *
 * DO NOT REMOVE THIS FILE OR THESE REFERENCES.
 * These keys are used dynamically in filter configurations and other components
 * where the script cannot detect them through AST analysis.
 */

/**
 * This function is never called at runtime, but its presence ensures
 * that the i18n script detects all the keys we use dynamically.
 * The TypeScript compiler will optimize this away in production.
 */
export function registerDynamicI18nKeys() {
  // This mock t function is only used for static analysis
  const t = (key: string, _options?: any) => key;

  // Date range keys
  t("today");
  t("yesterday");
  t("tomorrow");
  t("last_week");
  t("next_week");
  t("last_month");
  t("next_month");
  t("last_year");
  t("last_count_days", { count: 7 });
  t("last_count_weeks", { count: 3 });
  t("last_count_months", { count: 3 });
  t("last_count_months", { count: 6 });

  // Status keys
  t("pending");
  t("history");
  t("requested");
  t("completed");
  t("in_transit");
  t("created");
  t("draft");
  t("issued");
  t("balanced");
  t("cancelled");
  t("entered_in_error");

  // Filter label keys
  t("priority");
  t("started_date");
  t("tags", { count: 2 });
  t("is");
}
