use axum::{
    extract::{Path, State},
    http::StatusCode,
    response::IntoResponse,
    Json,
};

use super::{
    models::{
        endpoint::Endpoint,
        match_data::{History, Match, MatchIds},
        player::Player,
    },
    mongo::Repo,
    utils::{get_match, get_match_list, make_request_url, request},
};

pub async fn player(
    State(db): State<Repo>,
    Path(name): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let player = db.find_player(name.clone()).await;

    match player {
        Some(player) => {
            println!("fetched {name}'s data from db");
            Ok(Json::<Player>(player))
        }

        None => {
            println!("fetched {name}'s data from riot");
            let url = make_request_url(&db, Endpoint::Player, name).await?;
            let player = request::<Player>(url).await?;
            db.insert_player(player.clone()).await;
            Ok(Json::<Player>(player))
        }
    }
}

pub async fn matches(
    State(db): State<Repo>,
    Path(name): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let match_list = get_match_list(&db, name).await?;
    Ok(Json::<MatchIds>(match_list))
}

pub async fn last_match(
    State(db): State<Repo>,
    Path(name): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let match_ids = get_match_list(&db, name).await?;
    if let Some(last_match_id) = match_ids.first() {
        let match_data = get_match(db, last_match_id.to_owned()).await?;
        Ok(Json::<Match>(match_data))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn match_by_id(
    State(db): State<Repo>,
    Path(id): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let match_data = get_match(db, id).await?;
    Ok(Json::<Match>(match_data))
}

pub async fn history(
    State(db): State<Repo>,
    Path(name): Path<String>,
) -> Result<impl IntoResponse, StatusCode> {
    let match_ids = get_match_list(&db, name).await?;
    let mut response = vec![];
    let mut task_set = tokio::task::JoinSet::new();

    for id in match_ids {
        task_set.spawn(get_match(db.clone(), id));
    }

    while let Some(match_data) = task_set.join_next().await {
        if let Ok(match_data) = match_data {
            response.push(match_data?);
        } else {
            return Err(StatusCode::INTERNAL_SERVER_ERROR);
        }
    }

    Ok(Json::<History>(response))
}
