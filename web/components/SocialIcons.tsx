import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import {
  SiTwitter,
  SiDiscord,
  SiTelegram,
  SiGithub,
  SiEmbarcadero,
  SiLinktree,
} from "react-icons/si";

interface SocialLinks {
  website?: string;
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
  linktree?: string;
}

interface SocialIconProps {
  href?: string;
  Icon: IconType;
}

const icons: { [key in keyof SocialLinks]: IconType } = {
  website: SiEmbarcadero,
  twitter: SiTwitter,
  discord: SiDiscord,
  telegram: SiTelegram,
  github: SiGithub,
  linktree: SiLinktree
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, Icon }) => {
  if (!href) {
    return <Icon className="rounded-2xl text-gray-500" size={30} />;
  }

  return (
    <Link href={href} passHref target="_blank">
      <Icon className="hover:cursor-pointer rounded-2xl" size={30} />
    </Link>
  );
};

interface SocialIconsProps {
  socialLinks: SocialLinks;
}

const SocialIcons: React.FC<SocialIconsProps> = ({ socialLinks }) => {
  return (
    <div className="flex flex-row max-w-sm w-full mb-3 gap-3 justify-evenly">
      {Object.keys(socialLinks).map((key) => {
        const IconComponent = icons[key as keyof SocialLinks];
        const href = socialLinks[key as keyof SocialLinks];
        if (IconComponent) {
          return <SocialIcon key={key} href={href} Icon={IconComponent} />;
        }
        return null;
      })}
    </div>
  );
};

export default SocialIcons;
