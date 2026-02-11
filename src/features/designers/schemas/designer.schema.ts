import { z } from "zod";

export const designerSchema = z.object({
  fullName: z
    .string()
    .min(3, "Full name must be at least 3 characters")
    .max(50, "Full name must be at most 50 characters"),
  workingHours: z
    .string()
    .regex(/^([01]\d|2[0-4]):([0-5]\d)-([01]\d|2[0-4]):([0-5]\d)$/, "Format must be HH:mm-HH:mm (e.g. 12:30-15:40)"),
  status: z.enum(["active", "inactive"]).default("active"),
  avatarUrl: z.string().optional(),
});

export type DesignerFormData = z.infer<typeof designerSchema>;
