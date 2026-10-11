// The checks a report gets on the server. What the dialog shows is in constants/reports, which needs no zod.
import { z } from 'zod';

import { REPORT_DETAILS_MAX } from '@/constants/reports';
import { ReportReason } from '@/generated/enums';

export const reportSchema = z
  .object({
    profileId: z.string().min(1),
    reason: z.enum(ReportReason),
    details: z.string().trim().max(REPORT_DETAILS_MAX, `Keep it to ${REPORT_DETAILS_MAX} characters.`),
    /** About the way to reach its owner, which only matches see, rather than the shark. */
    contact: z.boolean(),
  })
  // "Something else" says nothing on its own.
  .refine((report) => report.reason !== 'OTHER' || report.details, { path: ['details'], message: "Say what's wrong, so a moderator knows what to look for." });
