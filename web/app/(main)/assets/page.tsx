"use client";
import { getAllSupportTicket } from "@/api/suifund";
import SupportCard from "@/components/support_card/SupportCard";
import { useCurrentAccount, useSuiClient } from "@mysten/dapp-kit";
import { isValidSuiAddress } from "@mysten/sui/utils";
import useSWR from "swr";

const Page = () => {
  const currentAccount = useCurrentAccount();
  const address = currentAccount?.address;
  const client = useSuiClient();
  const { data } = useSWR([client, address], ([client, address]) =>
    address && isValidSuiAddress(address)
      ? getAllSupportTicket(client, address)
      : null
  );
  return (
    <div>
      <div className="py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4">
          {data && data.map((item) => <div key={item.id}> 
            <SupportCard base64Image={item.image} name={item.name} amount={item.amount.toString()}></SupportCard>
          </div>)}
        </div>
      </div>
    </div>
  );
};

export default Page;
