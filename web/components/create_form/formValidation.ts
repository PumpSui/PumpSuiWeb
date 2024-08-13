import { daysToTimestamp } from "@/lib/utils";
import { IformatedDeployParams } from "@/type";
import { MIST_PER_SUI } from "@mysten/sui/utils";
import { z } from "zod";

const parseValue = (value:any) => {
  if(Number.isNaN(value)) return BigInt(0);
  return value;
};

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
      .min(1)
      .default(1)
      .transform((val) => BigInt(val)),
    maxValue: z
      .any()
      .optional()
      .transform(parseValue)
      .transform((val) => (val !== undefined ? BigInt(val) : BigInt(0))),
    amount_per_sui: z.number().int().min(1).max(1844674407369).default(1),
    startTime: z.date().min(new Date()),
    projectDuration: z.number().gt(3),
    description: z.string().min(10).max(5000),
    imageUrl: z.string().url().or(z.literal("")).optional(),
    linktree: z.string().url().or(z.literal("")).optional(),
    xLink: z.string().url().or(z.literal("")).optional(),
    telegramLink: z.string().url().or(z.literal("")).optional(),
    discord: z.string().url().or(z.literal("")).optional(),
    website: z.string().url().or(z.literal("")).optional(),
    github: z.string().url().or(z.literal("")).optional(),
    category: z.string().min(3).max(50),
    threshold_ratio: z.number().min(0).max(100).default(0),
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
    category:values.category,
    threshold_ratio:values.threshold_ratio,
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
    maxValue: Number.isNaN(BigInt(values.maxValue))? BigInt(0):MIST_PER_SUI * values.maxValue,
    startTime: values.startTime.getTime(),
    sender: address,
    imageUrl: values.imageUrl!,
  };
};

export type FormSchema = z.infer<typeof formSchema>;
