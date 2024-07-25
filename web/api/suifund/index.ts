import { CommentType, IformatedDeployParams, ProjectRecord, ProjectRecordResponse } from "@/type";
import {
  DynamicFieldInfo,
  GetObjectParams,
  SuiClient,
  SuiObjectResponse,
  SuiParsedData,
} from "@mysten/sui/client";
import { isValidSuiObjectId, isValidSuiAddress } from "@mysten/sui/utils";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";
import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { getAllCommentsQL } from "./graphqlContext";
import { z } from "zod";
import { formSchema } from "@/components/create_form/formValidation";

/*    public entry fun deploy(
    deploy_record: &mut DeployRecord,
    name: vector<u8>,
    description: vector<u8>,
    image_url: vector<u8>,
    x: vector<u8>,
    telegram: vector<u8>,
    discord: vector<u8>,
    website: vector<u8>,
    github: vector<u8>,
    start_time_ms: u64,
    time_interval: u64,
    total_deposit_sui: u64,
    ratio: u64,
    amount_per_sui: u64,
    min_value_sui: u64, 
    max_value_sui: u64,
    fee: &mut Coin<SUI>,
    clk: &Clock,
    ctx: &mut TxContext
)*/
const deploy = (params: IformatedDeployParams) => {
  console.log(params);
  if (!isValidSuiAddress(params.sender)) {
    throw new Error("Invalid tx sender");
  }
  let deploy_fee = get_deploy_fee(params.totalDeposit, params.ratioToBuilders);
  const tx = new Transaction();
  const [coin] = tx.splitCoins(tx.gas, [deploy_fee]);
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "deploy",
    arguments: [
      tx.object(process.env.NEXT_PUBLIC_DEPLOY_RECORD!),
      tx.pure(bcs.string().serialize(params.name).toBytes()),
      tx.pure(bcs.string().serialize(params.description).toBytes()),
      tx.pure(bcs.string().serialize(params.imageUrl).toBytes()),
      tx.pure(bcs.string().serialize(params.linktree).toBytes()),
      tx.pure(bcs.string().serialize(params.xLink).toBytes()),
      tx.pure(bcs.string().serialize(params.telegramLink).toBytes()),
      tx.pure(bcs.string().serialize(params.discord).toBytes()),
      tx.pure(bcs.string().serialize(params.website).toBytes()),
      tx.pure(bcs.string().serialize(params.github).toBytes()),
      tx.pure(bcs.u64().serialize(params.startTime).toBytes()),
      tx.pure(bcs.u64().serialize(params.projectDuration).toBytes()),
      tx.pure(bcs.u64().serialize(params.totalDeposit).toBytes()),
      tx.pure(bcs.u64().serialize(params.ratioToBuilders).toBytes()),
      tx.pure(bcs.u64().serialize(params.amount_per_sui).toBytes()),
      tx.pure(bcs.u64().serialize(params.minValue).toBytes()),
      tx.pure(bcs.u64().serialize(params.maxValue).toBytes()),
      coin,
      tx.object("0x6"),
    ],
  });
  tx.transferObjects([coin], tx.pure(bcs.Address.serialize(params.sender)));
  return tx;
};

const get_deploy_fee = (total_deposit_sui: bigint, ratio: number): bigint => {
  const base_fee: bigint = BigInt(20_000_000_000);
  let deploy_fee: bigint = (total_deposit_sui * BigInt(ratio)) / BigInt(1000);
  if (deploy_fee <= base_fee) {
    deploy_fee = base_fee;
  }
  return deploy_fee;
};

/* public fun claim(
        project_record: &mut ProjectRecord,
        project_admin_cap: &ProjectAdminCap,
        clk: &Clock,
        ctx: &mut TxContext
    ) */
const claim = (project_record: string, project_admin_cap: string) => {
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  if (!isValidSuiObjectId(project_admin_cap)) {
    throw new Error("Invalid project admin cap id");
  }
  const tx = new Transaction();
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "claim",
    arguments: [
      tx.object(project_record),
      tx.object(project_admin_cap),
      tx.object("0x6"),
    ],
  });
  return tx;
};

/*     public fun do_mint(
        project_record: &mut ProjectRecord,
        fee_sui: &mut Coin<SUI>,
        clk: &Clock,
        ctx: &mut TxContext
    ): SupporterReward  */
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
  if (recipient&&isValidSuiAddress(recipient)) {
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

/*  public fun reference_reward
(reward: Coin<SUI>, sender: address, recipient: address) */
// const reference_reward = () => {};

/* public fun do_merge(
        sp_rwd_1: &mut SupporterReward,
        sp_rwd_2: SupporterReward
    ) */
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

/* public fun do_split(
        sp_rwd: &mut SupporterReward,
        amount: u64,
        ctx: &mut TxContext
    ): SupporterReward */
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

/* public fun do_burn(
        project_record: &mut ProjectRecord,
        sp_rwd: SupporterReward,
        clk: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> */
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

/*     public entry fun native_stake(
        wrapper: &mut SuiSystemState,
        validator_address: address,
        sp_rwd: &mut SupporterReward,
        ctx: &mut TxContext
    ) */
const native_stake = () => {};

/*     public entry fun native_unstake(
        wrapper: &mut SuiSystemState,
        sp_rwd: &mut SupporterReward,
        ctx: &mut TxContext
    )  */
const native_unstake = () => {};

/*     public entry fun add_comment(
        project_record: &mut ProjectRecord,
        reply: Option<ID>, 
        media_link: vector<u8>, 
        content: vector<u8>, 
        clk: &Clock,
        ctx: &mut TxContext
    )  */
const add_comment = (
  project_record: string,
  reply: string,
  media_link: string,
  content: string
) => {
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  const tx = new Transaction();
  const reply_to = isValidSuiObjectId(reply)
    ? tx.pure(bcs.option(bcs.Address).serialize(reply).toBytes())
    : tx.pure(bcs.option(bcs.Address).serialize(null).toBytes());
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "add_comment",
    arguments: [
      tx.object(project_record),
      reply_to,
      tx.pure(bcs.string().serialize(media_link).toBytes()),
      tx.pure(bcs.string().serialize(content).toBytes()),
      tx.object("0x6"),
    ],
  });
  return tx;
};

/*     public entry fun like_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const like_comment = (project_record: string, idx: number) => {
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  const tx = new Transaction();
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "like_comment",
    arguments: [
      tx.object(project_record),
      tx.pure(bcs.u64().serialize(idx).toBytes()),
    ],
  });
  return tx;
};

/*     public entry fun unlike_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const unlike_comment = (project_record: string, idx: number) => {
  if (!isValidSuiObjectId(project_record)) {
    throw new Error("Invalid project record id");
  }
  const tx = new Transaction();
  tx.moveCall({
    package: process.env.NEXT_PUBLIC_PACKAGE!,
    module: "suifund",
    function: "unlike_comment",
    arguments: [
      tx.object(project_record),
      tx.pure(bcs.u64().serialize(idx).toBytes()),
    ],
  });
  return tx;
};

const getProjectRecord = async (projectId:string, client:SuiClient) => {
  const response = await client.getObject({
    id: projectId,
    options: { showContent: true },
  });
  const data = response.data?.content as any;
  const project: ProjectRecord = {
    object_id: projectId,
    id: data.fields.id.id,
    creator: data.fields.creator,
    name: data.fields.name,
    description: data.fields.description,
    image_url: data.fields.image_url,
    x: data.fields.x,
    telegram: data.fields.telegram,
    discord: data.fields.discord,
    website: data.fields.website,
    github: data.fields.github,
    cancel: data.fields.cancel,
    balance: data.fields.balance,
    ratio: data.fields.ratio,
    start_time_ms: data.fields.start_time_ms,
    end_time_ms: data.fields.end_time_ms,
    total_supply: data.fields.total_supply,
    amount_per_sui: data.fields.amount_per_sui,
    remain: data.fields.remain,
    current_supply: data.fields.current_supply,
    total_transactions: data.fields.total_transactions,
    min_value_sui: data.fields.min_value_sui,
    max_value_sui: data.fields.max_value_sui,
    participants: data.fields.participants.fields.contents.fields.id.id,
    minted_per_user: data.fields.minted_per_user.fields.id.id,
    thread: data.fields.thread.fields.contents.fields.id.id,
  };
  return project;
}

const getAllDeployRecords = async (
  client: SuiClient,
  cursor: string | null
): Promise<{
  data: ProjectRecord[];
  hasNextPage: boolean;
  nextCursor: string | null;
}> => {
  const params: GetObjectParams = {
    id: process.env.NEXT_PUBLIC_DEPLOY_RECORD!,
    options: { showContent: true },
  };
  const deploy_object = await client.getObject(params);
  const content = deploy_object.data!.content as any;
  const record_id = content.fields.record.fields.id.id;

  if (!isValidSuiObjectId(record_id)) {
    throw new Error("Invalid record id");
  }

  const { data, hasNextPage, nextCursor } = await client.getDynamicFields({
    parentId: record_id,
    cursor,
  });

  const record_objects = await Promise.all(
    data.map(async (record: DynamicFieldInfo) => {
      const response = await client.getObject({
        id: record.objectId,
        options: { showContent: true },
      });
      return response.data?.content as SuiParsedData;
    })
  );

  const projects = await Promise.all(
    record_objects.map(async (record: SuiParsedData) => {
      const id = record as unknown as any;
      if (!isValidSuiObjectId(id.fields.value)) {
        throw new Error("Invalid record id");
      }
      return await getProjectRecord(id.fields.value, client);
    })
  );

  return { data: projects, hasNextPage, nextCursor };
};


const getAllComments = async (client: SuiClient, address: string) => {
  const response = await client.getDynamicFields({
    parentId: address,
  });
  const responses = await Promise.all(
    response.data.map(async (record: DynamicFieldInfo) => {
      const result = (await client.getObject({
        id: record.objectId,
        options: { showContent: true },
      })) as unknown as any;
      const returnData: CommentType = {
        index: result.data.content.fields.name,
        id: result.data.content.fields.id.id,
        creator: result.data.content.fields.value.fields.creator,
        media_link: result.data.content.fields.value.fields.media_link,
        content: result.data.content.fields.value.fields.content,
        timestamp: result.data.content.fields.value.fields.timestamp,
        likes: result.data.content.fields.value.fields.likes.fields.contents,
        reply: result.data.content.fields.value.fields.reply,
      };
      return returnData;
    })
  );
  return responses.sort((a: CommentType, b: CommentType) => {
    return a.index - b.index;
  });
};

const getAllCommentsGraphQl = async (address: string) => {
  const client = new SuiGraphQLClient({
    url: "https://sui-testnet.mystenlabs.com/graphql",
  });
  const response = await client.query({
    query: getAllCommentsQL,
    variables: {
      id: address,
    },
  });
  if (!response.data?.owner) {
    return [];
  }
  const result: CommentType[] = response
    .data!.owner!.dynamicFields.nodes.map((node: any) => {
      return {
        index: node.name.json,
        creator: node.value.json.creator,
        timestamp: node.value.json.timestamp,
        content: node.value.json.content,
        media_link: node.value.json.media_link,
        likes: node.value.json.likes,
        id: node.value.json.id,
        reply: node.value.json.reply,
      };
    })
    .sort((a: CommentType, b: CommentType) => {
      return a.index - b.index;
    });

  return result;
};

export {
  getAllComments,
  getProjectRecord,
  getAllDeployRecords,
  getAllCommentsGraphQl,
  deploy,
  claim,
  do_mint,
  do_merge,
  do_split,
  do_burn,
  native_stake,
  native_unstake,
  add_comment,
  like_comment,
  unlike_comment,
};
