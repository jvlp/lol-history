mod routes;

#[tokio::main]
async fn main() {
    let app = routes::router::make_router().await;
    // run it with hyper on localhost:3000
    axum::Server::bind(&"0.0.0.0:3000".parse().unwrap())
        .serve(app.into_make_service())
        .await
        .unwrap();
}
