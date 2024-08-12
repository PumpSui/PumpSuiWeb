import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import styles from "./ProjectImage.module.css"; // 假设我们将CSS放在这个文件中

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
    <div className={styles.imageContainer} style={{ height: `${height}px` }}>
      <div className={styles.scrollingWrapper}>
        <Image
          src={src}
          alt={alt}
          width={500} // 设置一个合适的宽度
          height={height}
          objectFit="cover"
          className={styles.scrollingImage}
          onError={handleError}
          priority={priority}
        />
        <Image
          src={src}
          alt={alt}
          width={500} // 设置一个合适的宽度
          height={height}
          objectFit="cover"
          className={styles.scrollingImage}
          onError={handleError}
          priority={priority}
        />
      </div>
    </div>
  );
};

export default ProjectImage;
