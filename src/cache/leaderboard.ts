import needle from "needle";
import Ship from "../interfaces/ship";

export default class {
    handleFinish:(endOffset:number) => void;
    handleChunk:(ships:Array<Ship>) => void;
    url:string;
    position:number;

    constructor(onChunk:(ships:Array<Ship>) => void, onFinish:(endOffset:number) => void) {
        this.handleFinish = onFinish;
        this.handleChunk = onChunk;
        this.url = "https://master.drednot.io/api/scoreboard";
        this.position = 1;
    }

    private getShipsChunk(offset_score:number):Promise<{[unit:string]:any}> {
        return new Promise(resolve => {
            needle.get(`${this.url}?offset_score=${offset_score}`, (err, response) => {
                if(err) throw err;
                resolve(response.body.ships);
            });
        });
    }

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

    getShips():void {
        needle.get(this.url, (err, response) => {
            if(err) throw err;
            this.cycleShipsChunk(response.body.ships[0].score);
        });
    }

    reset():void {
      this.position = 1;
    }
}