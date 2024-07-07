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
const deploy = () => {

}

/* public fun do_claim(
        project_record: &mut ProjectRecord,
        project_admin_cap: &ProjectAdminCap,
        clk: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> */
const do_claim = () => {

}

/*     public fun do_mint(
        project_record: &mut ProjectRecord,
        fee_sui: &mut Coin<SUI>,
        clk: &Clock,
        ctx: &mut TxContext
    ): SupporterReward  */
const do_mint = () => {

}

/*  public fun reference_reward
(reward: Coin<SUI>, sender: address, recipient: address) */
const reference_reward = () => {

}

/* public fun do_merge(
        sp_rwd_1: &mut SupporterReward,
        sp_rwd_2: SupporterReward
    ) */
const do_merge = () => {

}

/* public fun do_split(
        sp_rwd: &mut SupporterReward,
        amount: u64,
        ctx: &mut TxContext
    ): SupporterReward */
const do_split = () => {

}

/* public fun do_burn(
        project_record: &mut ProjectRecord,
        sp_rwd: SupporterReward,
        clk: &Clock,
        ctx: &mut TxContext
    ): Coin<SUI> */
const do_burn = () => {

}

/*     public entry fun native_stake(
        wrapper: &mut SuiSystemState,
        validator_address: address,
        sp_rwd: &mut SupporterReward,
        ctx: &mut TxContext
    ) */
const native_stake = () =>{

}

/*     public entry fun native_unstake(
        wrapper: &mut SuiSystemState,
        sp_rwd: &mut SupporterReward,
        ctx: &mut TxContext
    )  */
const native_unstake = () =>{

}

/*     public entry fun add_comment(
        project_record: &mut ProjectRecord,
        reply: Option<ID>, 
        media_link: vector<u8>, 
        content: vector<u8>, 
        clk: &Clock,
        ctx: &mut TxContext
    )  */
const add_comment =()=>{

}

/*     public entry fun like_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const like_comment =()=>{

}

/*     public entry fun unlike_comment(
        project_record: &mut ProjectRecord,
        idx: u64,
        ctx: &TxContext
    ) */
const unlike_comment =()=>{
    
}