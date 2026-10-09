// Shared by the report dialog and the server, so keep this free of server-only imports.
import { z } from 'zod';

import { ReportReason } from '@/generated/enums';

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

export const reportSchema = z
  .object({
    profileId: z.string().min(1),
    reason: z.enum(ReportReason),
    details: z.string().trim().max(REPORT_DETAILS_MAX, `Keep it to ${REPORT_DETAILS_MAX} characters.`),
    /** About the way to reach its owner, which only matches see, rather than the shark. */
    contact: z.boolean(),
  })
  // "Something else" says nothing on its own.
  .refine((report) => report.reason !== 'OTHER' || report.details, { path: ['details'], message: 'Say what’s wrong, so a moderator knows what to look for.' });
