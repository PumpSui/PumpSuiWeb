import { useState } from "react";
import { useCurrentAccount } from "@mysten/dapp-kit";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

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
    <div className="flex items-center justify-between bg-gray-100 p-2 rounded-lg mb-4">
      <div className="flex-grow mr-4">
        <p className="text-sm font-medium text-gray-700">
          Referral ID:{" "}
          <span className="text-lg font-bold text-gray-900"> {referralId}</span>
        </p>
      </div>
      <Button
        onClick={handleCopy}
        variant="outline"
        className={isCopied ? "bg-green-500 text-white" : ""}
      >
        {isCopied ? "Copied!" : "Copy Link"}
      </Button>
    </div>
  );
};

export default ReferralLink;
