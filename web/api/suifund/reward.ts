import { bcs } from "@mysten/sui/bcs";
import { Transaction } from "@mysten/sui/transactions";
import { isValidSuiAddress, isValidSuiObjectId } from "@mysten/sui/utils";

const do_mint = (
  project_record: string,
  value: bigint,
  sender: string,
  recipient?: string
) => {
  if (!isValidSuiAddress(sender)) {
    throw new Error("Invalid tx sender");
  }
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [value]);
  const [sp_rwd] = tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "do_mint",
    arguments: [tx.object(project_record), coin, tx.object("0x6")],
  });
  tx.transferObjects([coin, sp_rwd], tx.pure(bcs.Address.serialize(sender)));
  if (recipient && isValidSuiAddress(recipient)) {
    const ref_value = (value * BigInt(5)) / BigInt(100);
    const [ref_coin] = tx.splitCoins(tx.gas, [ref_value]);
    tx.moveCall({
      package: process.env.NEXT_PUBLIC_PACKAGE!,
      module: "suifund",
      function: "reference_reward",
      arguments: [
        ref_coin,
        tx.pure(bcs.Address.serialize(sender)),
        tx.pure(bcs.Address.serialize(recipient)),
      ],
    });
  }
  return tx;
};

const do_merge = (sp_rwd_1: string, sp_rwd_2: string) => {
  if (!isValidSuiObjectId(sp_rwd_1) || !isValidSuiObjectId(sp_rwd_2)) {
    throw new Error("Invalid supporter ticket id");
  }
  const tx = new Transaction();
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "do_merge",
    arguments: [tx.object(sp_rwd_1), tx.object(sp_rwd_2)],
  });
  return tx;
};

const do_split = (sp_rwd: string, amount: number, sender: string) => {
  if (!isValidSuiObjectId(sp_rwd)) {
    throw new Error("Invalid supporter ticket id");
  }
  const tx = new Transaction();
  const [sp_rwd_new] = tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "do_split",
    arguments: [
      tx.object(sp_rwd),
      tx.pure(bcs.u64().serialize(amount).toBytes()),
    ],
  });
  tx.transferObjects([sp_rwd_new], tx.pure(bcs.Address.serialize(sender)));
  return tx;
};

const do_burn = (project_record: string, sp_rwd: string, sender: string) => {
  if (!isValidSuiAddress(sender)) {
    throw new Error("Invalid tx sender");
  }
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  if (!isValidSuiObjectId(sp_rwd)) {
    throw new Error("Invalid supporter ticket id");
  }
  const tx = new Transaction();
  const [coin] = tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "do_burn",
    arguments: [tx.object(project_record), tx.object(sp_rwd), tx.object("0x6")],
  });
  tx.transferObjects([coin], tx.pure(bcs.Address.serialize(sender)));
  return tx;
};

const native_stake = () => {};

const native_unstake = () => {};

export { do_mint, do_merge, do_split, do_burn };
