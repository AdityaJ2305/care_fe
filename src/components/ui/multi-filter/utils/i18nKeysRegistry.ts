/**
 * This file explicitly references i18n keys that are used dynamically
 * (e.g., t(variable)) so that the remove-unused-i18n.js script can detect them.
 * 
 * DO NOT REMOVE THIS FILE OR THESE REFERENCES.
 * These keys are used dynamically in filter configurations and other components
 * where the script cannot detect them through AST analysis.
 */

// Date range option keys used in longDateRangeOptions and shortDateRangeOptions
const dateRangeKeys = [
  "today",
  "yesterday",
  "tomorrow",
  "last_week",
  "next_week",
  "last_month",
  "next_month",
  "last_year",
  "last_count_days",
  "last_count_weeks",
  "last_count_months",
] as const;

// Status keys used in various inventory and pharmacy components
const statusKeys = [
  "pending",
  "history",
  "requested",
  "completed",
  "in_transit",
  "created",
  "draft",
  "issued",
  "balanced",
  "cancelled",
  "entered_in_error",
  "Completed", // Note: This appears to be a capitalized variant used in some components
] as const;

// Filter label keys used in multi-filter system
const filterLabelKeys = [
  "priority",
  "started_date",
  "tags",
  "is",
] as const;

/**
 * This function is never called at runtime, but its presence ensures
 * that the i18n script detects all the keys we use dynamically.
 * The TypeScript compiler will optimize this away in production.
 */
export function registerDynamicI18nKeys() {
  // @ts-expect-error - t function doesn't exist here, but this helps the i18n script detect keys
  const t = (key: string, options?: any) => key;
  
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
  t("Completed");
  
  // Filter label keys
  t("priority");
  t("started_date");
  t("tags", { count: 2 });
  t("is");
}
