import { useState, useEffect } from "react";
import Image from "next/image";

interface ProjectImageProps {
  imageUrl: string;
}

const ProjectImage: React.FC<ProjectImageProps> = ({ imageUrl }) => {
  imageUrl = imageUrl === "" ? "/images/DemoProject.png" : imageUrl;
  const [src, setSrc] = useState<string>(imageUrl);

  useEffect(() => {
    setSrc(imageUrl);
  }, [imageUrl]);

  const handleError = (e: any) => {
    setSrc("/images/DemoProject.png");
  };

  return (
    <div className="relative min-w-min h-40" >
      <Image
        src={src}
        alt="Project Image"
        layout="fill"
        objectFit="cover" 
        className="rounded-2xl"
        onError={handleError}
      />
    </div>
  );
};

export default ProjectImage;
