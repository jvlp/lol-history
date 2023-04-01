use axum::{extract::Path, http::StatusCode, response::IntoResponse, Json};

use super::{
    types::{
        endpoint::Endpoint,
        match_data::{History, Match, MatchIds},
        player::Player,
    },
    utils::{get_match, get_match_list, make_request_url, request},
};

pub async fn player(Path(name): Path<String>) -> Result<impl IntoResponse, StatusCode> {
    let url = make_request_url(Endpoint::Player, name).await?;
    let player_data = request::<Player>(url).await?;
    Ok(Json::<Player>(player_data))
}

pub async fn matches(Path(name): Path<String>) -> Result<impl IntoResponse, StatusCode> {
    let match_list = get_match_list(name).await?;
    Ok(Json::<MatchIds>(match_list))
}

pub async fn match_by_id(Path(id): Path<String>) -> Result<impl IntoResponse, StatusCode> {
    let match_data = get_match(id).await?;
    Ok(Json::<Match>(match_data))
}

pub async fn last_match(Path(name): Path<String>) -> Result<impl IntoResponse, StatusCode> {
    let match_ids = get_match_list(name).await?;
    if let Some(last_match_id) = match_ids.first() {
        let match_data = get_match(last_match_id.to_owned()).await?;
        Ok(Json::<Match>(match_data))
    } else {
        Err(StatusCode::NOT_FOUND)
    }
}

pub async fn history(Path(name): Path<String>) -> Result<impl IntoResponse, StatusCode> {
    let match_ids = get_match_list(name).await?;
    let mut response = vec![];
    let mut task_set = tokio::task::JoinSet::new();

    for id in match_ids {
        task_set.spawn(get_match(id));
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
