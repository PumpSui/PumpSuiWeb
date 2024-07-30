import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import React from "react";
import { useFormContext } from "react-hook-form";

interface FormFieldProps {
  name: string;
  label: string;
  placeholder?: string;
  type?: string;
  className?: string;
  optional?: boolean;
  valueAsNumber?: boolean;
  isTextarea?: boolean;
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
}) => {
  const {
    register,
    formState: { errors },
    trigger,
  } = useFormContext();

  // 确保错误消息为字符串类型
  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === "string" ? errorMessage : undefined;

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2 w-1/3 text-nowrap">{label}:</span>
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
