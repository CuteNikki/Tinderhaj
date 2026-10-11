// What the report dialog shows, apart from the checks in lib/reports, so the dialog doesn't bring zod to every page with a shark on it.
import type { ReportReason } from '@/generated/enums';

/** Why someone can report a shark, in the order the dialog offers them. */
export const REPORT_REASONS: Record<ReportReason, string> = {
  NOT_A_SHARK: 'Not a shark plush',
  INAPPROPRIATE: 'Inappropriate or explicit',
  PERSONAL_INFO: 'Shares personal information',
  HARASSMENT: 'Harassment or hate',
  SPAM: 'Spam or a scam',
  OTHER: 'Something else',
};

/** The longest explanation a report can carry. */
export const REPORT_DETAILS_MAX = 500;

/** How many reports one account can make in a day, so nobody can flood the queue. */
export const REPORTS_PER_DAY = 20;
