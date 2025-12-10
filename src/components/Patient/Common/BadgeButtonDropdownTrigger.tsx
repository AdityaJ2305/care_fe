import { BadgeInfo } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

interface BadgeButtonDropdownTriggerProps {
  /**
   * Whether to show the notification badge (green dot)
   */
  showBadge?: boolean;
  /**
   * Accessible label for screen readers when badge is shown
   */
  ariaLabel?: string;
}

/**
 * A reusable button with badge component for dropdown menu triggers.
 * Shows a BadgeInfo icon with an optional green notification badge.
 * Used in allergy, diagnosis, and symptom cards to indicate additional information.
 */
export function BadgeButtonDropdownTrigger({
  showBadge = false,
  ariaLabel,
}: BadgeButtonDropdownTriggerProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenuTrigger asChild>
      <Button
        variant="link"
        className="hover:text-gray-700"
        aria-label={showBadge ? ariaLabel || t("has_note") : undefined}
      >
        <span className="relative inline-flex">
          <BadgeInfo size={16} />
          {showBadge && (
            <span
              className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-green-600 ring-2 ring-white"
              aria-hidden="true"
            ></span>
          )}
        </span>
      </Button>
    </DropdownMenuTrigger>
  );
}
