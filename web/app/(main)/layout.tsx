'use client';

import { customTheme } from "@/components/customTheme";
import Navbar from "@/components/navbar";
import { ProjectProvider } from "@/components/providers/ProjectContext";
import {
  createNetworkConfig,
  SuiClientProvider,
  WalletProvider,
} from "@mysten/dapp-kit";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { LoadingProvider } from "@/contexts/LoadingContext";

const { networkConfig } = createNetworkConfig({
  product: { url: process.env.NEXT_PUBLIC_SUI_NETWORK! },
});
console.log(networkConfig);
const queryClient = new QueryClient();

const main = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <>
      <LoadingProvider>
        <QueryClientProvider client={queryClient}>
          <SuiClientProvider networks={networkConfig} defaultNetwork="product">
            <WalletProvider theme={customTheme} autoConnect>
              <Navbar></Navbar>
              <ProjectProvider>
                <div>
                  {children}
                </div>
                <Toaster></Toaster>
              </ProjectProvider>
            </WalletProvider>
          </SuiClientProvider>
        </QueryClientProvider>
      </LoadingProvider>
    </>
  );
};

export default main;
