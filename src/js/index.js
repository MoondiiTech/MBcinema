let ageCost = [],
    dimensionCost = [],
    cardNum = 0,
    cards = 10,
    total = [];

// CARD ADDING ******************************
let fillRandomSeats = () => {
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
let randHour = (randTimes) => {
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

let randMinute = () => {
    let randMinute = 0;
    Math.floor(Math.random() * 2) === 0 ? randMinute = 20 : randMinute = 50;
    return randMinute;
}
let addCards = () => {
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
                <img src="../img/side arrow.svg" alt="" class="leftNav nav">
                <h4 class="heading-quarternary date">Monday</h4>
                <img src="../img/side arrow.svg" alt="" class="rightNav nav">
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
}
addCards();

let DOMselections = {
    'main': document.getElementById('main'),
    'cards': Array.from(document.querySelectorAll('.card')),
    'cardsFront': Array.from(document.querySelectorAll('.card--front')),
    'cost': Array.from(document.querySelectorAll('.cost')),
    'dates': document.querySelectorAll('.date'),
    'orderBtn': document.querySelectorAll('.orderBtn'),
    'leftNav': document.querySelector('.L_Arrow'),
    'rightNav': document.querySelector('.R_Arrow'),
    'cardsContainer': document.querySelector('.cards'),
    'javaMobileDetector': document.querySelector('#javaMobileDetector'),
    'futureMovies': document.querySelector('.futureMovies'),
    'trendingMovies': document.querySelector('.trendingTrailers'),
    'popupTrailer': document.querySelector('.popupTrailer'),
    'exitBtn': document.querySelector('.exitBtn'),
    'futureTrailers': Array.from(document.querySelectorAll('.futureMovie-trailer')),
    'trendingTrailers': Array.from(document.querySelectorAll('.trendingMovie-trailer')),
    'iframeLoader': document.querySelector('.holds-the-iframe'),
}

let addImages = () => {
    let i = 0;
    while (i < cards) {
        DOMselections.cardsFront[i].style.backgroundImage = `url(../../img/M_${i}.jpg)`;
        i++;
    }
}
addImages();

var today = new Date();
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
DOMselections.dates.forEach(e => {
    e.innerHTML = days[today.getDay()];
})


// if true then child, if true then two
let childOrAdult = [],
    twoDorThreeD = [],
    color, lastSelectedD = [],
    lastSelectedAge = [];
let currentCardDOM;

for (let i = 0; i < cards; i++) {
    ageCost[i] = 15;
    dimensionCost[i] = 15;
    childOrAdult[i] = false;
    twoDorThreeD[i] = false;
    total[i] = 0;
}

DOMselections.main.addEventListener('click', (e) => {
    if (e.target.tagName.toLowerCase() === 'a') {
        e.preventDefault();
        if (e.target.matches('.time')) {
            getCardNum(e.target);
            currentCardDOM.querySelectorAll('.time').forEach(e => {
                e.classList.remove('selected');
            })
            e.target.classList.toggle('selected');
        } else if (e.target.matches('.seat') && !e.target.matches('.taken')) {
            getCardNum(e.target.parentNode);
            selectSeat(e);
        } else if (e.target.matches('.dimension')) {
            getCardNum(e.target);
            currentCardDOM.querySelectorAll('.dimension').forEach(e => {
                clearPreviousSelections(e);
            })
            if (e.target.matches('.twoD')) {
                dimensionCost[cardNum] = 10;
                twoDorThreeD[cardNum] = true;
            } else {
                dimensionCost[cardNum] = 15;
                twoDorThreeD[cardNum] = false;
            }
            lastSelectedD[cardNum] = e.target;
            select(e);
        } else if (e.target.matches('.age')) {
            getCardNum(e.target);
            currentCardDOM.querySelectorAll('.age').forEach(e => {
                clearPreviousSelections(e);
            })
            if (e.target.matches('.child')) {
                ageCost[cardNum] = 10;
                childOrAdult[cardNum] = true;
            } else {
                ageCost[cardNum] = 15;
                childOrAdult[cardNum] = false;
            }
            lastSelectedAge[cardNum] = e.target;
            select(e);
        }
        //Setting initial 3D and adult choices prone to changing color 
        if (lastSelectedAge[cardNum] === undefined) {
            lastSelectedAge[cardNum] = currentCardDOM.querySelector('.adult');
            changeColors(e);
        }
        if (lastSelectedD[cardNum] === undefined) {
            lastSelectedD[cardNum] = currentCardDOM.querySelector('.threeD');
            changeColors(e);
        }
    }
})
let getCardNum = (e, steps = 4) => {
    let card;
    if (steps === 3) {
        card = e.parentNode.parentNode.parentNode;
    } else {
        card = e.parentNode.parentNode.parentNode.parentNode;
    }
    for (let i = 0; i < cards; i++) {
        if (card.matches(`.card--${i}`)) {
            cardNum = i;
        }
    }
    currentCardDOM = DOMselections.cards[cardNum];
}
let updateCost = (e) => {
    if (!e.target.matches('.selected')) {
        total[cardNum] += ageCost[cardNum] + dimensionCost[cardNum];
        DOMselections.cost[cardNum].innerHTML = `$${total[cardNum]}`;
    }
    // If seat is already selected, take away the cost
    else if (e.target.matches('.selected')) {
        switch (e.target.style.background) {
            // if adult + 3d
            case 'rgb(8, 217, 214)':
                total[cardNum] -= 30;
                break;
                // if adult + 2d
            case 'rgb(252, 186, 211)':
                total[cardNum] -= 25;
                break;
                // if child + 3d
            case 'yellow':
                total[cardNum] -= 25;
                break;
                // if child + 2d
            default:
                total[cardNum] -= 20;
                break;
        }
        DOMselections.cost[cardNum].innerHTML = `$${total[cardNum]}`;
    }
}
let changeColors = (e) => {
    if (!e.target.matches('.orderBtn')) {
        if (!childOrAdult[cardNum] && !twoDorThreeD[cardNum] && !e.target.matches('.time')) {
            if (lastSelectedD[cardNum] !== undefined) {
                lastSelectedD[cardNum].style.background = '#08D9D6';
            }
            if (lastSelectedAge[cardNum] !== undefined) {
                lastSelectedAge[cardNum].style.background = '#08D9D6';
            }
            e.target.style.background = '#08D9D6';
        } else if (!childOrAdult[cardNum] && twoDorThreeD[cardNum]) {
            if (lastSelectedD[cardNum] !== undefined) {
                lastSelectedD[cardNum].style.background = '#fcbad3';
            }
            if (lastSelectedAge[cardNum] !== undefined) {
                lastSelectedAge[cardNum].style.background = '#fcbad3';
            }
            e.target.style.background = '#fcbad3';
        } else if (childOrAdult[cardNum] && !twoDorThreeD[cardNum]) {
            if (lastSelectedD[cardNum] !== undefined) {
                lastSelectedD[cardNum].style.background = 'yellow';
            }
            if (lastSelectedAge[cardNum] !== undefined) {
                lastSelectedAge[cardNum].style.background = 'yellow';
            }
            e.target.style.background = 'yellow';
        } else if (childOrAdult[cardNum] && twoDorThreeD[cardNum]) {
            if (lastSelectedD[cardNum] !== undefined) {
                lastSelectedD[cardNum].style.background = 'orange';
            }
            if (lastSelectedAge[cardNum] !== undefined) {
                lastSelectedAge[cardNum].style.background = 'orange';
            }
            e.target.style.background = 'orange';
        }
    }
}
let clearPreviousSelections = (e) => {
    e.classList.remove('selected');
    e.style.background = '#EAEAEA';
}
let select = (e) => {
    e.target.classList.toggle('selected');
    changeColors(e);
}
let selectSeat = (e) => {
    updateCost(e);
    //If click again on colored seat, it becomes grey again
    if (e.target.matches('.selected')) {
        e.target.style.background = '#EAEAEA';
    } else {
        changeColors(e);
    }
    e.target.classList.toggle('selected');
}
let order = (e) => {
    getCardNum(e, 3);

    if (currentCardDOM === undefined || (Array.from(currentCardDOM.querySelectorAll('.time.selected')).length === 0 && Array.from(currentCardDOM.querySelectorAll('.seat.selected')).length === 0)) {
        alert('please select seats and a time');
    } else if (Array.from(currentCardDOM.querySelectorAll('.time.selected')).length === 0) {
        alert('please select a time');
    } else if (Array.from(currentCardDOM.querySelectorAll('.seat.selected')).length === 0) {
        alert('please select seats');
    } else {
        currentCardDOM.querySelectorAll('.seat.selected').forEach(e => {
            e.classList.remove('selected');
            e.classList.add('taken');
            e.style.background = 'black';
            total[cardNum] = 0;
            DOMselections.cost[cardNum].innerHTML = `$${total[cardNum]}`;
        })
    }
}
DOMselections.orderBtn.forEach(e => {
    e.addEventListener('click', (e) => {
        e.preventDefault();
        order(e.target);
    })
})

// SLIDING ***************************
let movement = 48,
    upperLimit = 0,
    lowerLimit = -336,
    distance = 0;
let media2000 = window.matchMedia('(max-width: 2000px)')
let media1950 = window.matchMedia('(max-width: 1950px)');
let media1900 = window.matchMedia('(max-width: 1900px)');
let media1800 = window.matchMedia('(max-width: 1800px)');
let media1700 = window.matchMedia('(max-width: 1700px)');
let media1600 = window.matchMedia('(max-width: 1600px)');
let media1450 = window.matchMedia('(max-width: 1450px)');
let media1000 = window.matchMedia('(max-width: 1000px)');
let media865 = window.matchMedia('(max-width: 865px)');
let media600 = window.matchMedia('(max-width: 600px)');
let media500 = window.matchMedia('(max-width: 500px)');

let checkMedia = () => {
    // IPAD etc
    if (media1450.matches && window.getComputedStyle(DOMselections.javaMobileDetector).getPropertyValue('display') == 'none') {
        movement = 48;
        lowerLimit = -432;
    } else if (media500.matches) {
        movement = 48;
        lowerLimit = -432;
    } else if (media600.matches) {
        movement = 41;
        lowerLimit = -410;
    } else if (media865.matches) {
        movement = 65;
        lowerLimit = -390;
    } else if (media1000.matches) {
        movement = 60;
        lowerLimit = -360;
    } else if (media1450.matches) {
        movement = 42;
        lowerLimit = -336;
    } else if (media1600.matches) {
        movement = 48;
        lowerLimit = -336;
    } else if (media1700.matches) {
        movement = 50;
        lowerLimit = -320;
    } else if (media1800.matches) {
        movement = 62;
        lowerLimit = -310;
    } else if (media1900.matches) {
        movement = 50;
        lowerLimit = -300;
    } else if (media1950.matches) {
        movement = 65;
        lowerLimit = -325;
    } else if (media2000.matches) {
        movement = 61;
        lowerLimit = -305;
    }
}
checkMedia();
window.addEventListener('resize', () => {
    checkMedia();
})

DOMselections.leftNav.addEventListener('click', () => {
    if (distance >= upperLimit) {
        distance = upperLimit;
    } else {
        distance += movement;
    }
    DOMselections.cardsContainer.style.webkitTransform = `translate(${distance}rem,-50%)`;
})
DOMselections.rightNav.addEventListener('click', () => {
    if (distance <= lowerLimit) {
        distance = lowerLimit;
    } else {
        distance -= movement;
    }
    DOMselections.cardsContainer.style.webkitTransform = `translate(${distance}rem,-50%)`;
})

// COMING SOON SECTION ----> CLICK AND TRAILER POPS UP ************
let futureTrailerNum = 0,
    trendingTrailerNum = 0;
    let iframeLoaded = false;
DOMselections.futureMovies.addEventListener('click', e => {
    for (let i = 0; i < 4; i++) {
        if (e.target.matches(`.futureMovie--${i}`)) {
            futureTrailerNum = i;
            DOMselections.popupTrailer.classList.remove('hide');
            if(iframeLoaded){
                DOMselections.futureTrailers[futureTrailerNum].classList.remove('hide');
            }
            else{
                DOMselections.iframeLoader.classList.remove('hide');
            }
            // When Iframes load once initially
            DOMselections.futureTrailers[futureTrailerNum].onload = () => {
                iframeLoaded = true;
                DOMselections.iframeLoader.classList.add('hide');
                DOMselections.futureTrailers[futureTrailerNum].classList.remove('hide');
            }
        }
    }
})
DOMselections.trendingMovies.addEventListener('click', e => {
    for (let i = 0; i < 2; i++) {
        if (e.target.matches(`.trendingTrailer--${i}`)) {
            trendingTrailerNum = i;
            DOMselections.popupTrailer.classList.remove('hide');
            if(iframeLoaded){
                DOMselections.trendingTrailers[trendingTrailerNum].classList.remove('hide');
            }
            else{
                DOMselections.iframeLoader.classList.remove('hide');
            }
            // When Iframes load once initially
            DOMselections.trendingTrailers[trendingTrailerNum].onload = () => {
                iframeLoaded = true;
                DOMselections.iframeLoader.classList.add('hide');
                DOMselections.trendingTrailers[trendingTrailerNum].classList.remove('hide');
            }
        }
    }
})
DOMselections.exitBtn.addEventListener('click', () => {
    DOMselections.popupTrailer.classList.add('hide');
    DOMselections.futureTrailers[futureTrailerNum].classList.add('hide');
    DOMselections.trendingTrailers[trendingTrailerNum].classList.add('hide');
    resetIframesOnExit();
})
let resetIframesOnExit = ()=>{
    document.querySelectorAll("iframe").forEach(e=>{
        e.src = e.src;
    })
}