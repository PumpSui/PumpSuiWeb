'use client';

import Navbar from "@/components/navbar";
import {
  createNetworkConfig,
  lightTheme,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";
import { getFullnodeUrl } from "@mysten/sui/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const { networkConfig } = createNetworkConfig({
  testnet: { url: getFullnodeUrl("testnet") },
  mainnet: { url: getFullnodeUrl("mainnet") },
});
const queryClient = new QueryClient();

const main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <QueryClientProvider client={queryClient}>
        <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
          <WalletProvider theme={lightTheme}>
            <Navbar></Navbar>
            <div className="pt-24">{children}</div>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </>
  );
};

export default main;
