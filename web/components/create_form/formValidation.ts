import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(3).max(50),
    totalDeposit: z.number().min(1),
    ratioToBuilders: z.number().min(0).max(100),
    minValue: z.number().min(1),
    maxValue: z.number(),
    startTime: z.date().min(new Date()),
    projectDuration: z.number().gt(3),
    description: z.string().min(10).max(500),
    imageUrl: z.string().url().or(z.literal("")).optional(),
    xLink: z.string().url().or(z.literal("")).optional(),
    telegramLink: z.string().url().or(z.literal("")).optional(),
    website: z.string().url().or(z.literal("")).optional(),
    github: z.string().url().or(z.literal("")).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.maxValue !== 0 && data.maxValue <= data.minValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Max value must be greater than min value or equal to 0. If Max value is 0, it means no limit.",
        path: ["maxValue"],
      });
    }
  });

export type FormSchema = z.infer<typeof formSchema>;
