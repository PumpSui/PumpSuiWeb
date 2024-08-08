import React from "react";
import { Controller, ControllerRenderProps, FieldValues, useFormContext } from "react-hook-form";
import ImageUploader from "@/components/imageUploader";

interface FormImageProps {
  name: string;
  label: string;
}

const FormImage: React.FC<FormImageProps> = ({
  name,
  label
}) => {
  const {
    control,
    setValue,
    formState: { errors },
  } = useFormContext();

  const errorMessage = errors[name]?.message;
  const errorText = typeof errorMessage === "string" ? errorMessage : undefined;

  const handleImageUpload = (file: any) => {
    console.log(file);
    const url = file.cdnUrl;
    setValue(name, url);
  };

  return (
    <div className={`flex items-center justify-between my-5`}>
      <span className="mr-2 w-1/3 text-nowrap flex items-center">{label}:</span>
      <div className="w-2/3">
        <Controller
          name={name}
          control={control}
          render={() => (
            <ImageUploader onFileUploadSuccess={handleImageUpload} />
          )}
        />

        {errorText && <p className="text-red-500">{errorText}</p>}
      </div>
    </div>
  );
};

export default FormImage;
