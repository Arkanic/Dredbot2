import needle from "needle";

export default class {
    handleFinish:() => void;
    handleChunk:(ships:Array<any>) => void;
    url:string;

    constructor(onChunk:(ships:{[unit:string]:any}) => void, onFinish:() => void) {
        this.handleFinish = onFinish;
        this.handleChunk = onChunk;
        this.url = "https://master.drednot.io/api/scoreboard";
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
            let ships:Array<any> = [];
            let position = 1;
            for(let i in rawShips) {
                ships.push({
                    name:rawShips[i].ship_name,
                    hex:rawShips[i].hex_code,
                    color:rawShips[i].color,
                    score:rawShips[i].score,
                    position
                });
                position++;
            }
            this.handleChunk(ships);
            let newOffset = ships[ships.length-1].score;
            if(newOffset > 0) {
                setTimeout(() => {
                    this.cycleShipsChunk(newOffset);
                }, 500); // don't request ships too fast
            }
        });
    }

    getShips():void {
        needle.get(this.url, (err, response) => {
            if(err) throw err;
            this.cycleShipsChunk(response.body.ships[0].score);
        });
    }
}