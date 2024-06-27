'use client';

import { ConnectButton } from "@mysten/dapp-kit";
import "@mysten/dapp-kit/dist/index.css";

const page = () => {
    return (
      <main className="flex flex-col space-y-10 items-center justify-center min-h-screen">
        <h1>Sui Nextjs Template</h1>
        <ConnectButton />
      </main>
    );
}

export default page