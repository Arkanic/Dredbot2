import mongodb, {MongoClient} from "mongodb";
import dotenv from "dotenv";
import Logger from "./utils/logger";

import Ship from "./interfaces/ship";

dotenv.config({
    path: ".env"
});

const logger = new Logger("mongodb", "red");

const client = new MongoClient(process.env.MONGODB as string, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

export let db:mongodb.Db;
export let leaderboards:mongodb.Collection;

export function start() {
    client.connect((err) => {
        if(err) throw err;

        db = client.db("Cluster0");
        leaderboards = db.collection("dredbot");

        logger.success("Mongodb connected");
    });
}

export function stop() {
    client.close();
}

export function insertLeaderboard(finishTime:number, ships:Array<Ship>) {
    const hour = Math.floor(finishTime / 1000 / 60 / 60);
    let obj = {
        hour,
        ships
    }
    if(process.env.SAVETOMONGODB != "yes") return logger.info("Not inserting to DB, as it is turned off via constants.");
    if(hour % 12 != 0) return logger.info("Not the right time to insert DB, skipping...");

    leaderboards.insertOne(obj, (err, res) => {
        if(err) throw err;
        logger.success("Inserted leaderboard into db");
    });

    logger.info("Checking for old db entries...");
    let now = Math.floor(Date.now() / 1000 / 60 / 60);
    let tooOld = now - 24 * 15;
    leaderboards.find({}).toArray((err, results) => {
        if(err) throw err;
        let oldOnes = [];
        for(let i in results) {
            let result = results[i];
            
            if(result.hour < tooOld) oldOnes.push(result);
        }

        for(let i in oldOnes) {
            let oldOne = oldOnes[i];
            let query = {hour:oldOne.hour};
            leaderboards.deleteOne(query, (err, obj) => {
                if(err) throw err;
                logger.info(`Old DB entry ${oldOne.hour} deleted.`);
            });
        }
        if(oldOnes.length > 0) logger.success(`Attemped to delete ${oldOnes.length} db entries.`);
    });
}