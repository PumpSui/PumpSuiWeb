"use client";
import React from "react";
import { Button } from "../ui/button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
import FormImage from "./components/FormImage";

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
    const fee = (TDL * watch("ratioToBuilders", 0)) / 10000;
    return Number.isNaN(fee) || fee < 20 ? 20 : fee;
  };

  const onSubmit = async (values: FormSchema) => {
    const formattedValues = formatedDeployParams(values, currentUser?.address!);
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
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 w-full">
        {/* 基本信息部分 */}
        <div className="rounded-lg bg-gradient-to-b from-blue-100 to-blue-500 from-50% px-10 py-4">
          <h2 className="text-xl font-semibold mb-4 text-black">Basic Information</h2>
          <div className="grid grid-cols-2 gap-6">
            <FormField name="name" label="Project Name" placeholder="Enter project name" />
            <FormSelect
              name="category"
              label="Category"
              options={projectTypeOptions}
              placeholder="Select project category"
              className="text-black"
            />
            <FormField
              name="description"
              label="Description"
              placeholder=".MD Supported!!  Project description, team introduction, previous work, and supporter benefits"
              tooltip="This part can be edited in the future."
              isTextarea
              className="text-black"
            />
            <FormImage name="imageUrl" label="Project Image" />
          </div>
        </div>

        {/* 财务设置部分 */}
        <div className="p-6 rounded-lg shadow-md bg-white">
          <h2 className="text-xl font-semibold mb-4 text-black">Financial Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              name="totalDeposit"
              label="TDL (SUI)"
              placeholder="Total Deposit Value"
              tooltip="Total Deposit Value. The total amount of funds raised."
              valueAsNumber
            />
            <FormField
              name="threshold_ratio"
              label="Threshold Ratio (%)"
              placeholder="0-100"
              tooltip="When the fundraising amount reaches TDL * Threshold Ratio / 100, the crowdfunding project is activated."
              valueAsNumber
            />
            <FormField
              name="ratioToBuilders"
              label="Ratio to Builders (%)"
              placeholder="TDL * Ratio = CrowdFund for Builders"
              tooltip="Portion of the total funds raised allocated to the project treasury."
              valueAsNumber
            />
            <FormField
              name="minValue"
              label="Min Investment (SUI)"
              placeholder="Min Value"
              tooltip="Minimum investment amount (≥ 1 SUI)"
              valueAsNumber
            />
            <FormField
              name="maxValue"
              label="Max Investment (SUI)"
              placeholder="∞"
              tooltip="Maximum investment amount per supporter (0 for no limit)"
              valueAsNumber
            />
            <FormField
              name="amount_per_sui"
              label="Amount Per SUI"
              placeholder="Face value per 1 SUI"
              tooltip="Face value of supporter ticket NFT per 1 SUI invested"
              valueAsNumber
            />
          </div>
        </div>

        {/* 时间设置部分 */}
        <div className="p-6 rounded-lg shadow-md bg-gradient-to-b from-blue-100 to-blue-500 from-50%">
          <h2 className="text-xl font-semibold mb-4 text-black">Time Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-black">Start Time</label>
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
                    className="w-full bg-white text-black border rounded px-3 py-2"
                  />
                )}
              />
              {errors.startTime && (
                <p className="text-red-500 text-sm">{errors.startTime.message}</p>
              )}
            </div>
            <FormField
              name="projectDuration"
              label="Duration (days)"
              placeholder="Development Time"
              tooltip="Estimated project execution period in days (minimum 3 days)"
              valueAsNumber
            />
          </div>
        </div>

        {/* 社交链接部分 */}
        <div className="p-6 rounded-lg shadow-md bg-white text-black">
          <h2 className="text-xl font-semibold mb-4">Social Links</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FormField
              name="linktree"
              label="LinkTree"
              placeholder="LinkTree URL (Optional)"
              optional
            />
            <FormField
              name="xLink"
              label="X (Twitter) Link"
              placeholder="X Profile URL (Optional)"
              optional
            />
            <FormField
              name="telegramLink"
              label="Telegram Link"
              placeholder="Telegram Group/Channel URL (Optional)"
              optional
            />
            <FormField
              name="discord"
              label="Discord"
              placeholder="Discord Invite URL (Optional)"
              optional
            />
            <FormField
              name="website"
              label="Website"
              placeholder="Project Website URL (Optional)"
              optional
            />
            <FormField
              name="github"
              label="Github"
              placeholder="Github Repository URL (Optional)"
              optional
            />
          </div>
        </div>

        {/* 提交按钮部分 */}
        <div className="flex flex-col items-center space-y-4">
          <Button
            className="max-w-md text-md py-6 px-10 bg-lime-400 font-jaro"
            type="submit"
            disabled={isSubmitting}
          >
            Create Project
          </Button>
          <p className="text-white text-sm">Deploy Fee: {getDeployFee()} SUI</p>
        </div>
      </form>
    </FormProvider>
  );
};

export default ProjectForm;
