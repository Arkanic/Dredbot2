/**
* turns miliseconds (the return value of Date.now()) into a string with the format "<h>h<m>m<s>.<ms>s"
*/
export function millisecondsToMinSeconds(duration:number):string {
   let milliseconds = Math.floor((duration % 1000) / 100);
   let seconds = Math.floor((duration / 1000) % 60);
   let minutes = Math.floor((duration / (1000 * 60)) % 60);
   let hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

   let hoursStr = (hours < 10) ? "0" + hours : hours;
   let minutesStr = (minutes < 10) ? "0" + minutes : minutes;
   let secondsStr = (seconds < 10) ? "0" + seconds : seconds;

   return `${hoursStr}h${minutesStr}m${secondsStr}.${milliseconds}s`;
}
