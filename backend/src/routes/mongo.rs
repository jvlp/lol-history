use mongodb::{bson::doc, options::ClientOptions, Client, Collection};

use super::models::{match_data::Match, player::Player};

#[derive(Clone)]
pub struct Repo {
    players: Collection<Player>,
    matches: Collection<Match>,
}

impl Repo {
    pub async fn init() -> Self {
        let uri =
            "mongodb+srv://jvlp:123@lol-history.ch5iemn.mongodb.net/?retryWrites=true&w=majority";
        let client_options = ClientOptions::parse(uri).await.unwrap();
        let client = Client::with_options(client_options).unwrap();
        // let client = Client::with_uri_str(uri).await.unwrap();

        let players = client
            .database("lol_history_teste")
            .collection::<Player>("players");

        let matches = client
            .database("lol_history_teste")
            .collection::<Match>("matches");

        Self { players, matches }
    }

    pub async fn insert_player(&self, player: Player) {
        match self.players.insert_one(player, None).await {
            Ok(_) => println!("player inserted sucefully"),
            Err(_) => println!("error when inserting player to db"),
        };
    }

    pub async fn find_player(&self, name: String) -> Option<Player> {
        let query_result = self.players.find_one(doc! {"name": name}, None).await;
        match query_result {
            Ok(player) => player,
            _ => None,
        }
    }

    pub async fn insert_match(&self, match_data: Match) {
        match self.matches.insert_one(match_data, None).await {
            Ok(_) => println!("match inserted sucefully"),
            Err(_) => println!("error when inserting match to db"),
        };
    }

    pub async fn find_match(&self, id: String) -> Option<Match> {
        let query_result = self
            .matches
            .find_one(doc! {"metadata.matchId": id}, None)
            .await;
        match query_result {
            Ok(match_data) => match_data,
            _ => None,
        }
    }
}
