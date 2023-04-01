use axum::http::StatusCode;
use serde::de::DeserializeOwned;

use super::types::{endpoint::Endpoint, player::Player};

pub async fn make_request_url(rp: Endpoint, param: String) -> Result<String, StatusCode> {
    match rp {
        Endpoint::Player => Ok(format!(
            "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{}",
            &param
        )),

        Endpoint::Matches => {
            let player_req_url = format!(
                "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{}",
                &param
            );

            let player = request::<Player>(player_req_url).await?;

            Ok(format!("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{}/ids?start=0&count=20",
                        player.puuid))
        }

        Endpoint::Match => Ok(format!(
            "https://americas.api.riotgames.com/lol/match/v5/matches/{}",
            param
        )),
    }
}

pub async fn request<T: DeserializeOwned>(url: String) -> Result<T, StatusCode> {
    let client = reqwest::Client::new();
    println!("{}", url);
    let res = client
        .get(url)
        .header(
            "X-Riot-Token",
            "RGAPI-5e3767a5-7746-40ba-8ab8-4bcda6b90b06".to_owned(),
        )
        .send()
        .await
        .map_err(|e| {
            println!("{:#?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })?;

    // if error foward status code from riot API
    if res.status() != StatusCode::OK {
        return Err(res.status());
    }

    let deserialized_response = res.json::<T>().await.map_err(|e| {
        println!("{:#?}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(deserialized_response)
}
