import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { getAdminCap } from "./graphqlContext";
import {
  DynamicFieldInfo,
  GetObjectParams,
  SuiClient,
  SuiParsedData,
} from "@mysten/sui/client";
import {
  EditEnum,
  editProjectParam,
  IformatedDeployParams,
  ProjectRecord,
} from "@/type";
import { isValidSuiAddress, isValidSuiObjectId } from "@mysten/sui/utils";
import { ObjectsResponseType } from "@/hooks/useGetInfiniteObject";
import { Transaction } from "@mysten/sui/transactions";
import { bcs } from "@mysten/sui/bcs";

const getAllProjectAdminCapGraphql = async (
  client: SuiGraphQLClient<{}>,
  address: string
): Promise<{ [key: string]: string }> => {
  const response = await client.query({
    query: getAdminCap,
    variables: {
      address: address,
    },
  });

  const result = response.data?.address?.objects.nodes as any;

  const obj: { [key: string]: string } = {};

  if (result && result.length > 0) {
    result.forEach((node: any) => {
      obj[node.contents.json.to] = node.contents.json.id;
    });
  }

  return obj;
};

const getAllProjectAdminCap = async (
  client: SuiClient,
  address: string
): Promise<{ [key: string]: string }> => {
  const response = await client.getOwnedObjects({
    owner: address,
    filter: {
      StructType:
        "0x257d035780276a41187b9bac21ca05e73a69b6c93f06e786cc18e8da78832808::suifund::ProjectAdminCap",
    },
    options: { showContent: true },
  });
  const result = response.data;
  const obj: { [key: string]: string } = {};
  if (result && result.length > 0) {
    result.forEach((node: any) => {
      obj[node.data.content.fields.to] = node.data.content.fields.id.id;
    });
  }
  return obj;
};

const getProjectRecord = async (projectId: string, client: SuiClient) => {
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
};

const getAllDeployRecords = async (
  client: SuiClient,
  cursor: string | null
): Promise<ObjectsResponseType<ProjectRecord>> => {
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
    limit: 32,
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
      tx.pure(bcs.string().serialize(params.category).toBytes()),
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
      tx.pure(bcs.u64().serialize(params.threshold_ratio).toBytes()),
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

const editProject = (params: editProjectParam[]) => {
  const tx = new Transaction();
  params.forEach((param) => {
    if (!isValidSuiObjectId(param.project_record)) {
      throw new Error("Invalid project record id");
    }
    if (!isValidSuiObjectId(param.project_admin_cap)) {
      throw new Error("Invalid project admin cap id");
    }
    tx.moveCall({
      package: process.env.NEXT_PUBLIC_PACKAGE!,
      module: "suifund",
      function: EditEnum[param.type],
      arguments: [
        tx.object(param.project_record),
        tx.object(param.project_admin_cap),
        tx.pure(bcs.string().serialize(param.content).toBytes()),
      ],
    });
  });
  console.log(tx);
  return tx;
};

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

const cancelAndBurnProject = (project_record: string, project_admin_cap: string) => {
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
      function: "cancel_project_by_team",
      arguments: [
        tx.object(project_admin_cap),
        tx.object(process.env.NEXT_PUBLIC_PACKAGE!),
        tx.object(project_record),
      ],
    });
    tx.moveCall({
      package: process.env.NEXT_PUBLIC_PACKAGE!,
      module: "suifund",
      function: "burn_project_admin_cap",
      arguments: [
        tx.object(project_record),
        tx.object(project_admin_cap),
      ],
    });
    return tx;
};

export {
  claim,
  editProject,
  deploy,
  getAllDeployRecords,
  getProjectRecord,
  getAllProjectAdminCap,
  cancelAndBurnProject,
};
