use serde::{Deserialize, Serialize};

// struct containing the fields I needed
// matching pattern return from
// https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{summonerName}
// docs: https://developer.riotgames.com/apis#summoner-v4/GET_getBySummonerName
#[derive(Deserialize, Serialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct Player {
    profile_icon_id: i32,
    name: String,
    pub puuid: String,
    summoner_level: i64,
}
