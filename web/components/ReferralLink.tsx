import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { SlShareAlt } from "react-icons/sl";

interface ReferralLinkProps {
  projectId: string;
}

const ReferralLink: React.FC<ReferralLinkProps> = ({ projectId }) => {
  const { toast } = useToast();
  const currentAccount = useCurrentAccount();
  const [isCopied, setIsCopied] = useState(false);

  const referralId = currentAccount?.address || "";
  const referralLink = `${
    typeof window !== "undefined" ? window.location.origin : ""
  }/project/${projectId}?ref=${referralId}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setIsCopied(true);
      toast({
        title: "Success",
        description: "Referral link copied to clipboard",
      });
      setTimeout(() => setIsCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy referral link",
      });
    }
  };

  return (
    <SlShareAlt
      onClick={handleCopy}
      size={25}
      className="hover:cursor-pointer bg-transparent"
    />
  );
};

export default ReferralLink;
