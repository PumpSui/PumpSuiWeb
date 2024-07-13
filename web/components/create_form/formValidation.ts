import { daysToTimestamp } from "@/lib/utils";
import { IformatedDeployParams } from "@/type";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { z } from "zod";

export const formSchema = z
  .object({
    name: z.string().min(3).max(50),
    totalDeposit: z
      .number()
      .int()
      .min(1)
      .transform((val) => BigInt(val)),
    ratioToBuilders: z.number().min(0).max(100),
    minValue: z
      .number()
      .int()
      .min(0)
      .default(0)
      .transform((val) => BigInt(val)),
    maxValue: z
      .number()
      .int()
      .min(0)
      .default(0)
      .transform((val) => BigInt(val)),
    amount_per_sui: z.number().int().min(1).max(1844674407369).default(1),
    startTime: z.date().min(new Date()),
    projectDuration: z.number().gt(3),
    description: z.string().min(10).max(500),
    imageUrl: z.string().url().or(z.literal("")).optional(),
    linktree: z.string().url().or(z.literal("")).optional(),
    xLink: z.string().url().or(z.literal("")).optional(),
    telegramLink: z.string().url().or(z.literal("")).optional(),
    discord: z.string().url().or(z.literal("")).optional(),
    website: z.string().url().or(z.literal("")).optional(),
    github: z.string().url().or(z.literal("")).optional(),
  })
  .superRefine((data, ctx) => {
    if (data.maxValue !== BigInt(0) && data.maxValue <= data.minValue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message:
          "Max value must be greater than min value or equal to 0. If Max value is 0, it means no limit.",
        path: ["maxValue"],
      });
    }
  });

export const formatedDeployParams = (
  values: FormSchema,
  address: string
): IformatedDeployParams => {
  return {
    name: values.name,
    description: values.description,
    projectDuration: daysToTimestamp(values.projectDuration),
    ratioToBuilders: values.ratioToBuilders,
    amount_per_sui: values.amount_per_sui,
    linktree: values.linktree!,
    xLink: values.xLink!,
    telegramLink: values.telegramLink!,
    discord: values.discord!,
    website: values.website!,
    github: values.github!,
    totalDeposit: MIST_PER_SUI * values.totalDeposit,
    minValue: MIST_PER_SUI * values.minValue,
    maxValue: MIST_PER_SUI * values.maxValue,
    startTime: values.startTime.getTime(),
    sender: address,
    imageUrl: values.imageUrl!,
  };
};

export type FormSchema = z.infer<typeof formSchema>;
