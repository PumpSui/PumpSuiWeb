import { useState, useEffect, useCallback } from "react";
import Image from "next/image";

interface ProjectImageProps {
  imageUrl: string;
  height?: number;
  alt?: string;
  priority?: boolean;
}

const DEFAULT_IMAGE = "/images/DemoProject.png";

const ProjectImage: React.FC<ProjectImageProps> = ({
  imageUrl,
  height = 160,
  alt = "Project Image",
  priority = false,
}) => {
  const [src, setSrc] = useState<string>(imageUrl || DEFAULT_IMAGE);

  useEffect(() => {
    setSrc(imageUrl || DEFAULT_IMAGE);
  }, [imageUrl]);

  const handleError = useCallback(() => {
    setSrc(DEFAULT_IMAGE);
  }, []);

  return (
    <div
      className="relative min-w-min w-full"
      style={{ height: `${height}px` }}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "cover" }}
        className="rounded-2xl"
        onError={handleError}
        priority={priority}
      />
    </div>
  );
};

export default ProjectImage;
