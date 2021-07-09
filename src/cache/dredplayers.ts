import ws from "ws";

export  interface DredPlayer {
    players:number;
    maxPlayers:number;
}

export interface RawDredPlayers {
    player_count:number;
    player_max:number;
}

export default class DredPlayers {
    url:string
    name:string;
    players:number;
    maxPlayers:number;

    constructor(url:string, name:string) {
        this.url = url;
        this.name = name;
        this.players = 0;
        this.maxPlayers = 0;
    }

    static deserialize(rawDredPlayers:RawDredPlayers):DredPlayer {
        return {
            players: rawDredPlayers.player_count,
            maxPlayers: rawDredPlayers.player_max
        }
    }

    ping():Promise<void> {
        return new Promise((resolve, reject) => {
            let websocket = new ws(this.url);
            try {
                websocket.addEventListener("open", (err) => {
                    //if(err) throw err;
                    websocket.send("yo");
                });
                websocket.addEventListener("message", (result) => {
                    let data = DredPlayers.deserialize(JSON.parse(result.data));
                    this.players = data.players;
                    this.maxPlayers = data.maxPlayers;

                    websocket.close();
                    resolve();
                });
                websocket.addEventListener("error", (err) => {
                    reject(err);
                    throw err;
                });
            } catch(err) {
                if(err) throw err;
            }
        });
    }
}