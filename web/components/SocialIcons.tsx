import React from "react";
import Link from "next/link";
import { IconType } from "react-icons";
import { SiTwitter, SiDiscord, SiTelegram, SiGithub } from "react-icons/si";

interface SocialLinks {
  twitter?: string;
  discord?: string;
  telegram?: string;
  github?: string;
}

interface SocialIconProps {
  href?: string;
  Icon: IconType;
}

const icons: { [key in keyof SocialLinks]: IconType } = {
  twitter: SiTwitter,
  discord: SiDiscord,
  telegram: SiTelegram,
  github: SiGithub,
};

const SocialIcon: React.FC<SocialIconProps> = ({ href, Icon }) => {
  if (!href) {
    return <Icon className="rounded-2xl text-gray-500" size={30} />;
  }

  return (
    <Link href={href} passHref>
      <Icon className="hover:cursor-pointer rounded-2xl" size={30} />
    </Link>
  );
};

interface SocialIconsProps {
  socialLinks: SocialLinks;
}

const SocialIcons: React.FC<SocialIconsProps> = ({ socialLinks }) => {
  return (
    <div className="flex flex-row mt-3 gap-3 justify-end">
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
