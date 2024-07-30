import React from "react";
import { useFormContext, Controller } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Option {
  value: string;
  label: string;
}

interface FormSelectProps {
  name: string;
  label: string;
  options: Option[];
  placeholder?: string;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  name,
  label,
  options,
  placeholder = "Select an option",
  className = "",
}) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  // 确保错误消息为字符串类型
  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === "string" ? errorMessage : undefined;

  return (
    <div className={`flex items-center ${className}`}>
      <span className="mr-2 w-1/3 text-nowrap">{label}:</span>
      <div className="w-2/3">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder={placeholder} />
              </SelectTrigger>
              <SelectContent>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
        {errorText && <p className="text-red-500">{errorText}</p>}
      </div>
    </div>
  );
};

export default FormSelect;
