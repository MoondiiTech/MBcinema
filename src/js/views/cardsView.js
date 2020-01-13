export const addCards = (cards, randHour, randMinute, fillRandomSeats) => {
    for (let i = 0; i < cards; i++) {
        let timesHTML = '';
        let j = 0,
            randTimes = 0;
        randTimes = Math.floor(Math.random() * 4 + 1);
        let randHourArr = randHour(randTimes);
        while (j < randTimes) {
            j++;
            timesHTML += `<a class="time">${randHourArr[j+3]}:${randMinute()}</a>`;
        }
        let html = `
        <div class="card card--${i}">
        <div class="card--front side"></div>
        <div class="card--back side">
            <div class="card__heading">
                <img src="img/side arrow.svg" alt="" class="leftNav nav">
                <h4 class="heading-quarternary date">Monday</h4>
                <img src="img/side arrow.svg" alt="" class="rightNav nav">
            </div>
            <div class="card__body">
                <div class="times">
                    <a class="time">${randHourArr[0]}:${randMinute()}</a>
                    <a class="time">${randHourArr[1]}:${randMinute()}</a>
                    <a class="time">${randHourArr[2]}:${randMinute()}</a>
                    <a class="time">${randHourArr[3]}:${randMinute()}</a>
                </div>
                <div class="times">
                    ${timesHTML}
                </div>
                <div class="seats">
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="seat-row">
                        ${fillRandomSeats()}
                    </div>
                    <div class="screen"></div>
                </div>
                <div action="#" class="specifications">
                    <a href="#" class="choice dimension twoD">2D</a>
                    <a href="#" class="choice dimension threeD selected">3D</a>
                    <a href="#" class="choice age child">Child</a>
                    <a href="#" class="choice age adult selected">Adult</a>
                </div>
                <a href="#" class="orderBtn">Order <span class="cost">$0</span></a>
            </div>
        </div>
    </div>`;

        document.querySelector('.cards').insertAdjacentHTML('beforeend', html);
    }
};
export const addImages = (cards) => {
    let i = 0;
    while (i < cards) {
        document.querySelectorAll('.card--front')[i].style.backgroundImage = `url(../img/M_${i}.jpg)`;
        i++;
    }
}