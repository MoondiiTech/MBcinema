export default class Cards{
    fillRandomSeats(){
        let numSeats = 9,
            i = 0;
        let seatHTML = '';
        while (i < numSeats) {
            i++;
            let randSeat = Math.floor(Math.random() * 2);
            if (randSeat === 0) {
                seatHTML += `<a href="#" class="seat"></a>`;
            } else {
                seatHTML += `<a href="#" class="seat taken"></a>`;
            }
        }
        return seatHTML;
    }
    randHour(randTimes){
        let randHours = [];
        while (randHours.length < 4 + randTimes) {
            let r = Math.floor(Math.random() * 16 + 7);
            if (randHours.indexOf(r) === -1) {
                randHours.push(r);
            }
        }
        randHours.sort((a, b) => a - b);
        return randHours;
    }
    
    randMinute(){
        let randMinute = 0;
        Math.floor(Math.random() * 2) === 0 ? randMinute = 20 : randMinute = 50;
        return randMinute;
    }
}