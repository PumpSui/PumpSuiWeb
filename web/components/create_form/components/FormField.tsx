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
    <div className={`flex flex-col space-y-2 ${className}`}>
      <div className="flex items-center">
        <label htmlFor={name} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {tooltip && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <InfoIcon className="ml-1 h-4 w-4 cursor-help text-gray-400" />
              </TooltipTrigger>
              <TooltipContent>
                <article className="text-pretty max-w-sm">
                  <p>{tooltip}</p>
                </article>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>
      <div className="w-full">
        {isTextarea ? (
          <Textarea
            id={name}
            {...register(name, {
              required: !optional && `${label} is required`,
              valueAsNumber,
            })}
            placeholder={placeholder}
            onBlur={() => trigger(name)}
            className="w-full"
          />
        ) : (
          <Input
            id={name}
            {...register(name, {
              required: !optional && `${label} is required`,
              valueAsNumber,
            })}
            type={type}
            placeholder={placeholder}
            onBlur={() => trigger(name)}
            className="w-full"
          />
        )}
        {errorText && <p className="text-red-500 text-sm mt-1">{errorText}</p>}
      </div>
    </div>
  );
};

export default FormField;
