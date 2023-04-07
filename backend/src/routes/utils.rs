use std::time::Duration;

use axum::http::StatusCode;
use reqwest::Response;
use serde::de::DeserializeOwned;

use super::{
    models::{
        endpoint::Endpoint,
        match_data::{Match, MatchIds},
        player::Player,
    },
    mongo::Repo,
};

pub async fn make_request_url(
    db: &Repo,
    endpoint: Endpoint,
    param: String,
) -> Result<String, StatusCode> {
    match endpoint {
        Endpoint::Player => Ok(format!(
            "https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{param}"
        )),

        Endpoint::Matches => {
            let player_req_url =
                format!("https://br1.api.riotgames.com/lol/summoner/v4/summoners/by-name/{param}");

            let player = match db.find_player(param).await {
                Some(p) => p,
                _ => request::<Player>(player_req_url).await?,
            };

            Ok(format!("https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/{}/ids?start=0&count=20", player.puuid))
        }

        Endpoint::Match => Ok(format!(
            "https://americas.api.riotgames.com/lol/match/v5/matches/{}",
            param
        )),
    }
}

pub async fn get_match_list(db: &Repo, name: String) -> Result<MatchIds, StatusCode> {
    let url = make_request_url(&db, Endpoint::Matches, name).await?;
    request::<MatchIds>(url).await
}

pub async fn get_match(db: Repo, id: String) -> Result<Match, StatusCode> {
    let match_data = db.find_match(id.clone()).await;

    match match_data {
        Some(match_data) => {
            println!("fetched {id}'s data from db");
            Ok(match_data)
        }

        None => {
            println!("fetched {id}'s data from riot");
            let url = make_request_url(&db, Endpoint::Match, id).await?;
            let match_data = request::<Match>(url).await?;
            db.insert_match(match_data.clone()).await;
            Ok(match_data)
        }
    }
}

async fn send_request(url: &str) -> Result<Response, StatusCode> {
    let client = reqwest::Client::new();
    client
        .get(url.clone())
        .header(
            "X-Riot-Token",
            "RGAPI-4a189dd2-5736-4ae1-8a56-65d3f9f5c4d0".to_owned(),
        )
        .send()
        .await
        .map_err(|e| {
            // let msg = format!("{:#?}", e);
            println!("{:#?}", e);
            StatusCode::INTERNAL_SERVER_ERROR
        })
}

pub async fn request<T: DeserializeOwned>(url: String) -> Result<T, StatusCode> {
    let mut res = send_request(&url).await?;

    // if rate limit exceded wait timeout and request again
    // TODO: map unwraps to INTERNAL_SERVER_ERROR
    if res.status() == StatusCode::from_u16(429).unwrap() {
        let sleep_time = res.headers().get("Retry-After").unwrap().to_str().unwrap();
        let sleep_time = sleep_time.parse::<u64>().unwrap();
        tokio::time::sleep(Duration::from_secs(sleep_time)).await;
        res = send_request(&url).await?;
    }

    // if error foward status code from riot API
    if res.status() != StatusCode::OK {
        return Err(res.status());
    }

    let deserialized_response = res.json::<T>().await.map_err(|e| {
        // let msg = format!("{:#?}", e);
        println!("{:#?}", e);
        StatusCode::INTERNAL_SERVER_ERROR
    })?;

    Ok(deserialized_response)
}
