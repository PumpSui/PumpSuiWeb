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
import ImageUploader from "../imageUploader";
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
    const fee = TDL * watch("ratioToBuilders", 0) /10000;
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

  const handleImageUpload = (file: any) => {
    console.log(file);
  }

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
          tooltip="Total Deposit Value. The total amount of funds raised, including the portion distributed to the project team through the project treasury and the portion retained in the supporter ticket NFT."
          valueAsNumber
        />
        <FormField
          name="threshold_ratio"
          label="Threshold Ratio"
          placeholder=""
          tooltip="Should be an integer less than or equal to 100. When the fundraising amount reaches TDL * Threshold Ratio / 100, the crowdfunding project is activated, and the project team can receive funds from the project treasury through streaming payments. Before this, the project team can choose to cancel the crowdfunding, and supporters can retrieve all their investments without loss."
          valueAsNumber
        />
        <FormField
          name="ratioToBuilders"
          label="Ratio(%)"
          placeholder="TDL * Ratio = CrowdFund for Builders"
          tooltip="Should be an integer less than or equal to 100. A portion of the total funds raised, TDL * Ratio / 100, will be allocated to the project treasury for team expenses. The remaining portion will be locked with the supporters and will be used for exchange with the supporters' rights when the project is completed. It is recommended to choose an appropriate ratio parameter, such as 10% to 30%, unless the project's product is already very mature. The cost of deploying a crowdfunding project is TDL * Ratio / 10000."
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
          tooltip="The minimum amount that project supporters must invest in the crowdfunding project each time, which should be set to be greater than or equal to 1 SUI."
          valueAsNumber
        />
        <FormField
          name="maxValue"
          label="Max Value(SUI)"
          placeholder="∞"
          tooltip="The maximum amount that each project supporter can support for the crowdfunding project. The default value is 0, indicating no limit. It should be set to a value greater than the minimum amount when there is a concern about the risk of withdrawal due to over-reliance on a single investor."
          valueAsNumber
        />
        <FormField
          name="amount_per_sui"
          label="Amount Per Sui"
          placeholder="Amount Per Sui"
          tooltip="The face value amount of the supporter ticket NFT that project supporters receive for each 1 SUI invested."
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
          tooltip="The estimated project execution period, in days, with a minimum of three days. The fundraising in the project treasury will be linearly unlocked and allocated according to the project cycle time. It is recommended to set a reasonable project cycle unless the project's product is already very mature."
          valueAsNumber
        />
        <FormField
          name="description"
          label="Description"
          placeholder="Description"
          tooltip="Project description. It is recommended to include an introduction to the project, the project team, proof of previous work, and the returns that project supporters can get. This part can be edited again in the future."
          isTextarea
        />       

        <Accordion type="single" collapsible>
          <AccordionItem value="Optional">
            <AccordionTrigger>Some more options ?</AccordionTrigger>
            <AccordionContent>
              <FormImage name={"imageUrl"} label={"Image URL"}/>
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
