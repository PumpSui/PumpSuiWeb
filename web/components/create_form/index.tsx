"use client";
import React from "react";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";
import { useForm, FormProvider, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { formatedDeployParams, formSchema, FormSchema } from "./formValidation";
import {
  useCurrentAccount,
  useSignAndExecuteTransaction,
} from "@mysten/dapp-kit";
import { deploy } from "@/api/suifund";
import { useRouter } from "next/navigation";
import FormField from "./components/FormField";
import FormSelect from "./components/FormSelect";


const ProjectForm: React.FC = () => {
  const currentUser = useCurrentAccount();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const router = useRouter();
  const methods = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      linktree: "",
      discord: "",
      imageUrl: "",
      xLink: "",
      telegramLink: "",
      website: "",
      github: "",
    },
  });

  const {
    handleSubmit,
    control,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = methods;

  const getDeployFee = () => {
    const TDL = Number(watch("totalDeposit", BigInt(0)));
    const fee = TDL * watch("ratioToBuilders", 0) * 0.01;
    return Number.isNaN(fee) || fee < 20 ? 20 : fee;
  };

  const onSubmit = async (values: FormSchema) => {
    const formattedValues = formatedDeployParams(values, currentUser?.address!);
    console.log("formattedValues", formattedValues);
    const txb = deploy(formattedValues);
    await signAndExecuteTransaction(
      {
        transaction: txb,
        chain: "sui::testnet",
      },
      {
        onSuccess: () => {
          router.push("/");
        },
        onError: (error) => {
          console.log("error", error);
        },
      }
    );
  };

  const projectTypeOptions = [
    { value: "defi", label: "DeFi" },
    { value: "nft", label: "NFT" },
    { value: "gaming", label: "Gaming" },
    { value: "infrastructure", label: "Infrastructure" },
  ];

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-md">
        <FormField name="name" label="Name" placeholder="Name" />
        <FormField
          name="totalDeposit"
          label="TDL(SUI)"
          placeholder="Total Deposit Value"
          valueAsNumber
        />
        <FormField
          name="threshold_ratio"
          label="Threshold Ratio"
          placeholder=""
          tooltip="The ratio of the total deposit that must be reached before the project can be funded."
          valueAsNumber
        />
        <FormField
          name="ratioToBuilders"
          label="Ratio(%)"
          placeholder="TDL * Ratio = CrowdFund for Builders"
          valueAsNumber
        />
        <FormSelect
          name="category"
          label="Category"
          options={projectTypeOptions}
          placeholder="Select project Category"
        />
        <FormField
          name="minValue"
          label="Min Value(SUI)"
          placeholder="Min Value"
          valueAsNumber
        />
        <FormField
          name="maxValue"
          label="Max Value(SUI)"
          placeholder="∞"
          valueAsNumber
        />
        <FormField
          name="amount_per_sui"
          label="Amount Per Sui"
          placeholder="Amount Per Sui"
          valueAsNumber
        />

        <div className="flex items-center">
          <span className="mr-2 w-1/3">Start Time:</span>
          <div className="w-2/3">
            <Controller
              control={control}
              name="startTime"
              render={({ field }) => (
                <DatePicker
                  selected={field.value}
                  onChange={(date: Date | null) => {
                    field.onChange(date);
                    trigger("startTime");
                  }}
                  showTimeSelect
                  dateFormat="Pp"
                  className="min-full bg-primary-foreground border rounded px-3 py-2"
                />
              )}
            />
          </div>
        </div>
        {errors.startTime && (
          <p className="text-red-500">{errors.startTime.message}</p>
        )}

        <FormField
          name="projectDuration"
          label="Duration"
          placeholder="Development Time (days)"
          valueAsNumber
        />
        <FormField
          name="description"
          label="Description"
          placeholder="Description"
          isTextarea
        />

        <Accordion type="single" collapsible>
          <AccordionItem value="Optional">
            <AccordionTrigger>Some more options ?</AccordionTrigger>
            <AccordionContent>
              <FormField
                name="imageUrl"
                label="Image URL"
                placeholder="Image URL (Optional)"
                optional
              />
              <FormField
                name="linktree"
                label="LinkTree"
                placeholder="LinkTree (Optional)"
                optional
              />
              <FormField
                name="xLink"
                label="X Link"
                placeholder="X Link (Optional)"
                optional
              />
              <FormField
                name="telegramLink"
                label="Telegram Link"
                placeholder="Telegram Link (Optional)"
                optional
              />
              <FormField
                name="discord"
                label="Discord"
                placeholder="Discord (Optional)"
                optional
              />
              <FormField
                name="website"
                label="Website"
                placeholder="Website (Optional)"
                optional
              />
              <FormField
                name="github"
                label="Github"
                placeholder="Github (Optional)"
                optional
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Button className="min-w-full" type="submit" disabled={isSubmitting}>
          Create Project
        </Button>

        <p className="text-cyan-400">Deploy Fee: {getDeployFee()} SUI</p>
      </form>
    </FormProvider>
  );
};

export default ProjectForm;
