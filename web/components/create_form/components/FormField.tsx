import React from "react";
import { useFormContext } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { InfoIcon } from "lucide-react";

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  optional?: boolean;
  valueAsNumber?: boolean;
  isTextarea?: boolean;
  tooltip?: string;
}

const FormField: React.FC<FormFieldProps> = ({
  name,
  label,
  placeholder,
  type = "text",
  className = "",
  optional = false,
  valueAsNumber = false,
  isTextarea = false,
  tooltip,
}) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === "string" ? errorMessage : undefined;

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2 w-1/3 text-nowrap flex items-center">
        {label}:
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="ml-1 h-4 w-4 cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>{tooltip}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </span>
      <div className="w-2/3">
        {isTextarea ? (
          <Textarea
            {...register(name, {
              required: !optional && `${label} is required`,
              valueAsNumber,
            })}
            placeholder={placeholder}
            onBlur={() => trigger(name)}
          />
        ) : (
          <Input
            {...register(name, {
              required: !optional && `${label} is required`,
              valueAsNumber,
            })}
            type={type}
            placeholder={placeholder}
            onBlur={() => trigger(name)}
          />
        )}
        {errorText && <p className="text-red-500">{errorText}</p>}
      </div>
    </div>
  );
};

export default FormField;
