import needle from "needle";
import Ship from "../interfaces/ship";

export default class {
    handleFinish:(endOffset:number) => void;
    handleChunk:(ships:Array<Ship>) => void;
    url:string;
    position:number;

    constructor(onChunk:(ships:Array<Ship>) => void, onFinish:(endOffset:number) => void) {
        this.handleFinish = onFinish; // on finish received function, returns final offset
        this.handleChunk = onChunk; // on chunk received function, returns parsed ships for that particular chunk
        this.url = "https://master.drednot.io/api/scoreboard"; // api endpoint
        this.position = 1; // ship position (e.g. top scoring ship has position "1")
    }

    /**
     * Returns a promise with the api result for 1k ships below offset_score
     */
    private getShipsChunk(offset_score:number):Promise<{[unit:string]:any}> {
        return new Promise(resolve => {
            needle.get(`${this.url}?offset_score=${offset_score}`, (err, response) => {
                if(err) throw err;
                resolve(response.body.ships);
            });
        });
    }


    /**
     * Handles a single chunk of ship data, and loops to the next chunk if possible
     */
    private cycleShipsChunk(offset_score:number):void {
        this.getShipsChunk(offset_score).then(rawShips => {
            let ships:Array<Ship> = [];
            for(let i in rawShips) {
                ships.push({
                    name:rawShips[i].ship_name,
                    hex:rawShips[i].hex_code,
                    color:rawShips[i].color,
                    score:rawShips[i].score,
                    position: this.position
                });
                this.position++;
            }
            this.handleChunk(ships);
            let newOffset = ships[ships.length-1].score;
            if(newOffset < offset_score) {
                setTimeout(() => {
                    this.cycleShipsChunk(newOffset);
                }, 500); // don't request ships too fast
            } else {
                this.handleFinish(newOffset);
            }
        });
    }


    /**
     * Start the ship-getting cycle
     */
    getShips():void {
        needle.get(this.url, (err, response) => {
            if(err) throw err;
            this.cycleShipsChunk(response.body.ships[0].score);
        });
    }

    /**
     * Reset everything
     */
    reset():void {
      this.position = 1;
    }
}