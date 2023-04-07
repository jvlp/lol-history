mod routes;

#[tokio::main]
async fn main() {
    routes::router::init_tracing_sub();
    let app = routes::router::make_router().await;
    // run it with hyper on localhost:3000
    let addr = std::net::SocketAddr::from(([127, 0, 0, 1], 3000));
    axum::Server::bind(&addr)
        .serve(app.into_make_service())
        .await
        .unwrap();
}

#[cfg(test)]
mod tests {
    use super::routes::router::make_router;
    use axum::body::Body;
    use axum::http::{Request, StatusCode};
    use tower::ServiceExt;

    #[tokio::test]
    async fn player_req() {
        let app = make_router().await;

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/player/Blaymus")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn matches_req() {
        let app = make_router().await;

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/matches/Blaymus")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn match_by_id_req() {
        let app = make_router().await;

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/match/BR1_2705493953")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn last_match_req() {
        let app = make_router().await;

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/match/last/Blaymus")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }

    #[tokio::test]
    async fn history_req() {
        let app = make_router().await;

        let response = app
            .oneshot(
                Request::builder()
                    .uri("/history/Blaymus")
                    .body(Body::empty())
                    .unwrap(),
            )
            .await
            .unwrap();

        assert_eq!(response.status(), StatusCode::OK);
    }
}
