export interface Project {
  creator: string;
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
  imgUrl?: string;
}

export interface editProjectParam {
  type: EditEnum;
  project_record: string;
  project_admin_cap: string;
  content: string;
}


export enum EditEnum {
  edit_description,
  edit_image_url,
  edit_x_url,
  edit_telegram_url,
  edit_discord_url,
  edit_website_url,
  edit_github_url,
}

/*
    public struct SupporterReward has key, store {
        id: UID,
        name: std::ascii::String,
        project_id: ID,
        image_url: Url,
        amount: u64,
        balance: Balance<SUI>,
        start: u64,
        end: u64,
        attach_df: u8,
    }
*/

/*     public struct ProjectRecord has key {
        id: UID,
        version: u64,
        creator: address,
        name: std::ascii::String,
        description: std::string::String,
        image_url: Url,
        x: Url,
        telegram: Url,
        discord: Url,
        website: Url,
        github: Url,
        cancel: bool,
        balance: Balance<SUI>,
        ratio: u64,
        start_time_ms: u64,
        end_time_ms: u64,
        total_supply: u64,
        amount_per_sui: u64, 
        remain: u64,
        current_supply: u64,
        total_transactions: u64,
        min_value_sui: u64, 
        max_value_sui: u64,
        participants: TableVec<address>, 
        minted_per_user: Table<address, u64>,
        thread: TableVec<Comment>,
    }*/
export interface ProjectRecord {
    object_id: string;
    id:string;
    category: string;
    creator: string;
    name: string;
    description: string;
    image_url: string;
    x: string;
    telegram: string;
    discord: string;
    website: string;
    github: string;
    cancel: boolean;
    balance: number;
    ratio: number;
    threshold_ratio: number;
    start_time_ms: number;
    end_time_ms: number;
    total_supply: number;
    amount_per_sui: number;
    remain: number;
    current_supply: number;
    total_transactions: number;
    min_value_sui: number;
    max_value_sui: number;
    participants: string[];
    minted_per_user: Record<string, number>;
    thread: string;    
}

/*     public struct Comment has key, store {
        id: UID,
        reply: Option<ID>,
        creator: address,
        media_link: Url,
        content: String,
        timestamp: u64,
        likes: VecSet<address>,
    } */
export interface CommentType {
    id: string;
    index: number;
    reply?: string;
    creator: string;
    media_link: string;
    content: string;
    timestamp: number;
    likes: string[];
    bcs?: string;

}

export type ObjectsResponseType<T> = {
  hasNextPage: boolean;
  nextCursor: string | null | undefined;
  data: T[];
};

// types/index.ts
export interface CommentProps {
  id: string;
  author: string;
  date: string;
  content: string;
  replies?: CommentProps[];
  isReply?: boolean;
  reply?: string;
  islike: boolean;
  likeCount?: number;
  index: number;
  onReplySubmit?: (comment: string, id: string) => void;
  onLikeSubmit?: (islike:boolean,index:number) => void;
}


export interface IformatedDeployParams {
  name: string;
  totalDeposit: bigint;
  category: string;
  threshold_ratio: number;
  ratioToBuilders: number;
  minValue: bigint;
  maxValue: bigint;
  amount_per_sui: number;
  startTime: number;
  projectDuration: number;
  description: string;
  imageUrl: string;
  linktree: string;
  xLink: string;
  telegramLink: string;
  discord: string;
  website: string;
  github: string;
  sender: string;
}