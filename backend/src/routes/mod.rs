mod handlers;
mod types;
mod utils;

use self::handlers::{history, last_match, match_by_id, matches, player};
use axum::{routing::get, Router};

pub async fn make_router() -> Router {
    Router::new()
        .route("/player/:name", get(player))
        .route("/matches/:name", get(matches))
        .route("/match/:id", get(match_by_id))
        .route("/match/last/:name", get(last_match))
        .route("/history/:name", get(history))
}
