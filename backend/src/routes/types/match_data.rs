use serde::{Deserialize, Serialize};
//
// #[derive(Deserialize, Serialize, Debug)]
// #[serde(rename_all = "camelCase")]
// pub struct MatchIds(pub Vec<String>);
//
// #[derive(Deserialize, Serialize, Debug)]
// #[serde(rename_all = "camelCase")]
// pub struct History(pub Vec<Match>);

pub type MatchIds = Vec<String>;
pub type History = Vec<Match>;

// struct containing the fields I need
// matching pattern return from
// https://americas.api.riotgames.com/lol/match/v5/matches/{matchId}
// docs: https://developer.riotgames.com/apis#match-v5/GET_getMatch
#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Match {
    metadata: Metadata,
    info: Info,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Metadata {
    match_id: String,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Info {
    game_creation: i64,
    game_duration: i64,
    game_mode: String,
    queue_id: i64,
    participants: Vec<Participant>,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Participant {
    assists: i64,
    champ_level: i64,
    champion_id: i64,
    champion_name: String,
    deaths: i64,
    item0: i64,
    item1: i64,
    item2: i64,
    item3: i64,
    item4: i64,
    item5: i64,
    item6: i64,
    kills: i64,
    largest_multi_kill: i64,
    perks: Perks,
    summoner1_id: i64,
    summoner2_id: i64,
    summoner_name: String,
    total_damage_dealt_to_champions: i64,
    total_minions_killed: i64,
    win: bool,
}

#[derive(Deserialize, Serialize, Debug)]
#[serde(rename_all = "camelCase")]
struct Perks {
    stat_perks: PerkStats,
    styles: Vec<PerkStyle>,
}

#[derive(Deserialize, Serialize, Debug)]
struct PerkStats {
    defense: i64,
    flex: i64,
    offense: i64,
}

#[derive(Deserialize, Serialize, Debug)]
struct PerkStyle {
    description: String,
    selections: Vec<PerkStyleSelection>,
    style: i64,
}

#[derive(Deserialize, Serialize, Debug)]
struct PerkStyleSelection {
    perk: i64,
    var1: i64,
    var2: i64,
    var3: i64,
}
