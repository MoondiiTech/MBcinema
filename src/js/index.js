import Barcode from './models/Barcode';
import Cards from './models/Cards';
import {displayBarcode} from './views/barcodeView';
import {addCards,addImages} from './views/cardsView';
let ageCost = [],
    dimensionCost = [],
    cardNum = 0,
    cards = 10,
    total = [],
    movement = 48,
    upperLimit = 0,
    lowerLimit = -336,
    distance = 0,
    // barcode ratio is 1:30
    barcodeW = 10,
    barcodeH = 300,
    ordered = false,
    barcode = 0,
    triggerTickedAnim = false;

// *********************** CARD ADDING ******************************
const cardsModule = new Cards();
addCards(cards,cardsModule.randHour,cardsModule.randMinute,cardsModule.fillRandomSeats);

// Adding images to the cards, must be called after they are created
addImages(cards);

// Upper title of the card --> Day is set dynamically
var today = new Date();
let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
document.querySelectorAll('.date').forEach(e => {
    e.innerHTML = days[today.getDay()];
})

// DOM should be set up after cards are created since it is referencing card components
let DOMselections = {
    'main': document.getElementById('main'),
    'cards': document.querySelectorAll('.card'),
    'cost': document.querySelectorAll('.cost'),
    'orderBtn': document.querySelectorAll('.orderBtn'),
    'leftNav': document.querySelector('.L_Arrow'),
    'rightNav': document.querySelector('.R_Arrow'),
    'cardsContainer': document.querySelector('.cards'),
    'javaMobileDetector': document.querySelector('#javaMobileDetector'),
    'futureMovies': document.querySelector('.futureMovies'),
    'trendingMovies': document.querySelector('.trendingTrailers'),
    'popupTrailer': document.querySelector('.popupTrailer'),
    'popupOrder': document.querySelector('.popupOrder'),
    'popupOrderClose': document.querySelector('.popupOrderClose'),
    'popupTrailerClose': document.querySelector('.popupTrailerClose'),
    'futureTrailers': document.querySelectorAll('.futureMovie-trailer'),
    'trendingTrailers': document.querySelectorAll('.trendingMovie-trailer'),
    'iframeLoader': document.querySelector('.holds-the-iframe'),
    'ticketBtn': document.getElementById('ticketBtn'),
}

// BARCODE ********************************
const barcodeModule = new Barcode(ordered, barcode);
barcodeModule.getData();
barcodeModule.randomBarcode();
barcode = barcodeModule.barcode;
ordered = barcodeModule.ordered;
displayBarcode(barcode,barcodeW,barcodeH);

// SCROLLING ******************************
let preventScrolling = () => {
    document.querySelector('body').classList.add('stop-scrolling');
}
let resumeScrolling = () => {
    document.querySelector('body').classList.remove('stop-scrolling');
}
// ******************* TICKET ORDERING ***********************
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
// Change colors when different choice combination is selected eg 3d+Adult blue, 2d+Adult pink
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
    // Update Cost when seat is chosen
    updateCost(e);

    //If clicked again on colored seat, it becomes grey again
    if (e.target.matches('.selected')) {
        e.target.style.background = '#EAEAEA';
    } else {
        changeColors(e);
    }
    e.target.classList.toggle('selected');
}
let order = () => {
    if (currentCardDOM === undefined || (Array.from(currentCardDOM.querySelectorAll('.time.selected')).length === 0 && Array.from(currentCardDOM.querySelectorAll('.seat.selected')).length === 0)) {
        alert('please select seats and a time');
    } else if (Array.from(currentCardDOM.querySelectorAll('.time.selected')).length === 0) {
        alert('please select a time');
    } else if (Array.from(currentCardDOM.querySelectorAll('.seat.selected')).length === 0) {
        alert('please select seats');
    } else {
        currentCardDOM.querySelectorAll('.seat.selected').forEach(e => {
            getCardNum(e, 3);

            // Show barcode 
            preventScrolling();
            DOMselections.popupOrder.classList.remove('hide');
            ordered = true;
            triggerTickedAnim = true;
            barcodeModule.randomBarcode();
            displayBarcode(barcode,barcodeW,barcodeH);
            // Occupy chosen seats
            e.classList.remove('selected');
            e.classList.add('taken');
            e.style.background = 'black';
            total[cardNum] = 0;
            DOMselections.cost[cardNum].innerHTML = `$${total[cardNum]}`;
        })
    }
}
// Each order btn of the cards will call order function on click
DOMselections.orderBtn.forEach(e => {
    e.addEventListener('click', (e) => {
        e.preventDefault();
        order();
    })
})

// ************************ SLIDING ***************************

// Media query break points 
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

// the lowerlimit (right side limit) is changing based on the screen size and needs to be changed accordingly along with movement
// barcode image needs to resize properly
let checkMedia = () => {
    // IPAD pro etc
    if (media1450.matches && window.getComputedStyle(DOMselections.javaMobileDetector).getPropertyValue('display') == 'none') {
        movement = 48;
        lowerLimit = -432;
        barcodeW = 10,
            barcodeH = 300;
    } else if (media500.matches) {
        movement = 48;
        lowerLimit = -432;
        barcodeW = 4,
            barcodeH = 120;
    } else if (media600.matches) {
        movement = 41;
        lowerLimit = -410;
        barcodeW = 5,
            barcodeH = 150;
    } else if (media865.matches) {
        movement = 65;
        lowerLimit = -390;
    } else if (media1000.matches) {
        movement = 60;
        lowerLimit = -360;
        barcodeW = 5,
            barcodeH = 150;
    } else if (media1450.matches) {
        movement = 42;
        lowerLimit = -336;
        barcodeW = 7,
            barcodeH = 210;
    } else if (media1600.matches) {
        movement = 48;
        lowerLimit = -336;
        barcodeW = 10,
            barcodeH = 300;
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

// Check dimensions of the screen intially to know what device the user is using
checkMedia();


// Adapt everytime screen is resized
window.addEventListener('resize', () => {
    checkMedia();
})

// Move/translate cards section when left or right btn is clicked
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

// *************************** COMING SOON SECTION ----> CLICK AND TRAILER POPS UP **************************
let futureTrailerNum = 0,
    trendingTrailerNum = 0;

// if futureOrNot = false then, last clicked element is trending 
let iframeLoaded = false,
    futureOrNot = false;

// Future movie thumbnail click
DOMselections.futureMovies.addEventListener('click', e => {
    for (let i = 0; i < 4; i++) {
        if (e.target.matches(`.futureMovie--${i}`)) {
            preventScrolling();
            futureTrailerNum = i;
            futureOrNot = true;
            DOMselections.popupTrailer.classList.remove('hide');
            if (iframeLoaded) {
                DOMselections.futureTrailers[futureTrailerNum].classList.remove('hide');
            } else {
                DOMselections.iframeLoader.classList.remove('hide');
            }
            // Only when Iframes load once initially. This will try to be called when src refreshes on exitBtn click but iframeloaded will not allow it
            DOMselections.futureTrailers[futureTrailerNum].onload = () => {
                if (!iframeLoaded) {
                    iframeLoaded = true;
                    DOMselections.iframeLoader.classList.add('hide');
                    DOMselections.futureTrailers[futureTrailerNum].classList.remove('hide');
                }
            }
        }
    }
})

// Trending movie thumbnail click
DOMselections.trendingMovies.addEventListener('click', e => {
    for (let i = 0; i < 2; i++) {
        if (e.target.matches(`.trendingTrailer--${i}`)) {
            preventScrolling();
            futureOrNot = false;
            trendingTrailerNum = i;
            DOMselections.popupTrailer.classList.remove('hide');
            if (iframeLoaded) {
                DOMselections.trendingTrailers[trendingTrailerNum].classList.remove('hide');
            } else {
                DOMselections.iframeLoader.classList.remove('hide');
            }
            // Only when Iframes load once initially. This will try to be called when src refreshes on exitBtn click but iframeloaded will not allow it
            DOMselections.trendingTrailers[trendingTrailerNum].onload = () => {
                if (!iframeLoaded) {
                    iframeLoaded = true;
                    DOMselections.iframeLoader.classList.add('hide');
                    DOMselections.trendingTrailers[trendingTrailerNum].classList.remove('hide');
                }
            }
        }
    }
})
// Popup exit btn click
DOMselections.popupTrailerClose.addEventListener('click', () => {
    DOMselections.popupTrailer.classList.add('hide');
    resumeScrolling();
    if (futureOrNot) {
        DOMselections.futureTrailers[futureTrailerNum].classList.add('hide');
        DOMselections.futureTrailers[futureTrailerNum].src = DOMselections.futureTrailers[futureTrailerNum].src;
    } else {
        DOMselections.trendingTrailers[trendingTrailerNum].classList.add('hide');
        DOMselections.trendingTrailers[trendingTrailerNum].src = DOMselections.trendingTrailers[trendingTrailerNum].src;
    }
})

// Barcode exit btn click
DOMselections.popupOrderClose.addEventListener('click', () => {
    resumeScrolling();
    DOMselections.popupOrder.classList.add('hide');
    // only if the trigger is order, ticketBtn plays animation after barcode is updated
    if (triggerTickedAnim) {
        // to make the animation play each time new order appears, animation name is removed and added after short delay
        DOMselections.ticketBtn.classList.remove('animated', 'tada');
        setTimeout(() => {
            DOMselections.ticketBtn.classList.add('animated', 'tada');
        }, 100);
    }
})

// ticketBtn show last ordered barcode
DOMselections.ticketBtn.addEventListener('click', () => {
    triggerTickedAnim = false;
    if (ordered) {
        preventScrolling();
        DOMselections.popupOrder.classList.remove('hide');
        displayBarcode(barcode,barcodeW,barcodeH);
    } else {
        alert('You have not ordered any tickets');
    }
})