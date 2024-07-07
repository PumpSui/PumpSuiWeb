export interface Project {
  creator: string;
  name: string;
  progress: number;
  startDate: string;
  endDate: string;
  description: string;
  imgUrl?: string;
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

/*     public struct Comment has key, store {
        id: UID,
        reply: Option<ID>,
        creator: address,
        media_link: Url,
        content: String,
        timestamp: u64,
        likes: VecSet<address>,
    } */