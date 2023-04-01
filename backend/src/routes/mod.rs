mod handlers;
mod types;
mod utils;

use self::handlers::{history, last_match, match_by_id, matches, player};
use axum::{extract::MatchedPath, http::Request, routing::get, Router};

use tower_http::trace::TraceLayer;
use tracing::info_span;
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

pub async fn make_router() -> Router {
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "lol-history2=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    Router::new()
        .route("/player/:name", get(player))
        .route("/matches/:name", get(matches))
        .route("/match/:id", get(match_by_id))
        .route("/match/last/:name", get(last_match))
        .route("/history/:name", get(history))
        .layer(
            TraceLayer::new_for_http().make_span_with(|request: &Request<_>| {
                let matched_path = request
                    .extensions()
                    .get::<MatchedPath>()
                    .map(MatchedPath::as_str);

                info_span!(
                    "http_request",
                    method = ?request.method(),
                    matched_path,
                    some_other_field = tracing::field::Empty,
                )
            }),
        )
}
