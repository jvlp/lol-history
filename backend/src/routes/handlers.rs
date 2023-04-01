use axum::extract::Path;
use axum::response::{IntoResponse, Response};
use axum::Json;
use reqwest::StatusCode;

use super::types::{endpoint::Endpoint, match_data::Match, match_ids::MatchIds, player::Player};
use super::utils::{make_request_url, request};

pub async fn player(Path(name): Path<String>) -> Response {
    // make_request_url never returns Err for RoutePath::Player
    let url = make_request_url(Endpoint::Player, name).await.unwrap();
    match request::<Player>(url).await {
        Ok(p) => Json(p).into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn matches(Path(name): Path<String>) -> Response {
    match get_match_list(name).await {
        Ok(m) => Json::<MatchIds>(m).into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn match_by_id(Path(id): Path<String>) -> Response {
    match get_match(id).await {
        Ok(m) => Json::<Match>(m).into_response(),
        Err(e) => e.into_response(),
    }
}

pub async fn last_match(Path(name): Path<String>) -> Response {
    let match_ids = match get_match_list(name).await {
        Ok(m) => m.0,
        Err(e) => return e.into_response(),
    };

    if let Some(id) = match_ids.first() {
        match get_match(id.to_owned()).await {
            Ok(m) => return Json::<Match>(m).into_response(),
            Err(e) => return e.into_response(),
        }
    } else {
        return StatusCode::INTERNAL_SERVER_ERROR.into_response();
    }
}

async fn get_match_list(name: String) -> Result<MatchIds, StatusCode> {
    let url = make_request_url(Endpoint::Matches, name).await?;
    request::<MatchIds>(url).await
}

async fn get_match(id: String) -> Result<Match, StatusCode> {
    let url = make_request_url(Endpoint::Match, id).await.unwrap();
    request::<Match>(url).await
}

pub async fn history(Path(name): Path<String>) -> Response {
    let match_ids = match get_match_list(name).await {
        Ok(m) => m.0,
        Err(e) => return e.into_response(),
    };

    let mut response = vec![];
    let mut task_set = tokio::task::JoinSet::new();

    for id in match_ids {
        task_set.spawn(get_match(id));
    }

    // join tasks
    while let Some(match_data) = task_set.join_next().await {
        // if not JoinError
        if let Ok(match_data) = match_data {
            match match_data {
                Ok(m) => response.push(m),
                _ => return StatusCode::INTERNAL_SERVER_ERROR.into_response(),
            }
        } else {
            return StatusCode::INTERNAL_SERVER_ERROR.into_response();
        }
    }

    Json::<Vec<Match>>(response).into_response()
}
