import { ProjectRecord } from "@/type";
import {
  DynamicFieldInfo,
  GetObjectParams,
  SuiClient,
  SuiObjectResponse,
  SuiParsedData,
} from "@mysten/sui/client";
import { isValidSuiObjectId } from "@mysten/sui/utils";

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
const deploy = () => {};

/* public fun do_claim(
        project_record: &mut ProjectRecord,
        project_admin_cap: &ProjectAdminCap,
        clk: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> */
const do_claim = () => {};

/*     public fun do_mint(
        project_record: &mut ProjectRecord,
        fee_sui: &mut Coin<SUI>,
        clk: &Clock,
        ctx: &mut TxContext
    ): SupporterReward  */
const do_mint = () => {};

/*  public fun reference_reward
(reward: Coin<SUI>, sender: address, recipient: address) */
const reference_reward = () => {};

/* public fun do_merge(
        sp_rwd_1: &mut SupporterReward,
        sp_rwd_2: SupporterReward
    ) */
const do_merge = () => {};

/* public fun do_split(
        sp_rwd: &mut SupporterReward,
        amount: u64,
        ctx: &mut TxContext
    ): SupporterReward */
const do_split = () => {};

/* public fun do_burn(
        project_record: &mut ProjectRecord,
        sp_rwd: SupporterReward,
        clk: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> */
const do_burn = () => {};

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
const add_comment = () => {};

/*     public entry fun like_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const like_comment = () => {};

/*     public entry fun unlike_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const unlike_comment = () => {};

const getAllDeployRecords = async (
  client: SuiClient
): Promise<ProjectRecord[]> => {
  const params: GetObjectParams = {
    id: process.env.NEXT_PUBLIC_DEPLOY_RECORD!,
    options: {
      showContent: true,
    },
  };
  const deploy_object = await client.getObject(params);
  const content = deploy_object.data!.content as any;
  const record_id = content.fields.record.fields.id.id;
  if (!isValidSuiObjectId(record_id)) {
    throw new Error("Invalid record id");
  }
  const record_data = await client.getDynamicFields({ parentId: record_id });
  const record_objects = await Promise.all(
    record_data.data.map(async (record: DynamicFieldInfo) => {
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
      const response = await client.getObject({
        id: id.fields.value,
        options: { showContent: true },
      });

      const data = response.data?.content as any;
      const project: ProjectRecord = {
        object_id: id.fields.value,
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
    })
  );
  return projects;
};

export {
  getAllDeployRecords,
  deploy,
  do_claim,
  do_mint,
  reference_reward,
  do_merge,
  do_split,
  do_burn,
  native_stake,
  native_unstake,
  add_comment,
  like_comment,
  unlike_comment,
};
