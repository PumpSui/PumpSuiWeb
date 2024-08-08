import "@uploadcare/react-uploader/core.css";
import { FileUploaderMinimal, FileUploaderRegular } from "@uploadcare/react-uploader";
import React from "react";

interface ImageUploaderProps {
    onFileUploadSuccess: (file: any) => void;
}

const ImageUploader:React.FC<ImageUploaderProps> = ({onFileUploadSuccess}) => {
  return (
    <div>
      <FileUploaderMinimal
        pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
        maxLocalFileSizeBytes={5000000}
        multiple={false}
        imgOnly={true}
        useCloudImageEditor={false}
        sourceList="local, url"
        classNameUploader="my-config uc-dark"
        onFileUploadSuccess={(file) => {onFileUploadSuccess(file)}}
      />
    </div>
  );
};

export default ImageUploader;
