/* Step 1: Create a list that holds all of your cards
 */ 

// List that holds all of the cards
let card = document.getElementsByClassName("card");
let cards = [...card]

/* Step 2: Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

// Fisher–Yates Shuffle function - see https://en.wikipedia.org/wiki/Fisher–Yates_shuffle#The_modern_algorithm
    // @description shuffles cards
    // @param {array}
    // @returns shuffledarray

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// Select the deck
const deck = document.querySelector(".deck"); // .querySelector creates static content while getElementsbyClassName creates live content

// @description function to start a new play 
function gameStart(){
	var shuffledCards = shuffle(cards);
	shuffledCards.forEach(function(item) {
		deck.appendChild(item)
	});
}

// @description shuffles cards when page is refreshed / loads
window.onload = gameStart();

/* Step 3: Set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

// Event Listener for click on card
deck.addEventListener("click", event => {
    const cardClick = event.target;
    if (isClickvalid(cardClick)) {
        displayCard(cardClick);
        addOpenedcards(cardClick);
        if (openList.length === 2) {
            movesCounter();
            checkMatch(cardClick);
            rateGame();
            if (finished.length === 16) {
                stopTimer();
                showModal();
            }
        }
    }
});

// Function that toggles (turns on/off) a class when a click event fires
function displayCard(cardClick) {
	cardClick.classList.toggle("open");
	cardClick.classList.toggle("show");
}

// Adds card to a list of open cards
    // First: Create empty list
let openList = [];

    //Second: Add opened cards to list
function addOpenedcards(cardClick){
    openList.push(cardClick);
}

// Ensures card is only clickable once
function isClickvalid(cardClick) {
    return (
        cardClick.classList.contains('card') && 
        !cardClick.classList.contains('match') && 
        openList.length < 2 && 
        !openList.includes(cardClick)
    );
}

//Checks if the clicked cards match
function checkMatch() {
    if (openList[0].firstElementChild.className === openList[1].firstElementChild.className) {
        cardsMatch();
    } else {
        setTimeout(() => {
            noMatch();
        }, 1000);
    }
}

// Runs if match
function cardsMatch() {
    openList[0].classList.toggle("match");
    openList[1].classList.toggle("match");
    openList = [];    
}

// Runs if no Match
function noMatch() {
    openList[0].classList.toggle("open")
    openList[1].classList.toggle("open")
    openList[0].classList.remove("show")
    openList[1].classList.remove("show")
    openList = [];
}

// Adds moves counter
let moves = 0;
const movesText = document.querySelector(".moves");
function movesCounter() {
    moves++;
    movesText.innerHTML = moves;
    // Starting timer
    if (moves === 1) {
        startTimer();
    }
}

// Adds star rating
function rateGame() {
    if (moves === 16) {
        hideStar();
    } else if (moves === 20) {
        hideStar();
    } else if (moves === 24) {
        hideStar();
    } else if (moves === 28) {
        console.log("Better start working on your memory!");
    }
}

// Hides one star at a time
function hideStar() {
    const stars = document.querySelectorAll(".stars li");
    for (star of stars) {
        if (star.style.display !== 'none') {
            star.style.display = 'none';
            break;
        }
    }
}

// Adds clock to measure time to completion
var second = 00, minute = 00; hour = 00;
var clock = document.querySelector(".clock");
var interval;
let timerOff = true;

function startTimer(){
    interval = setInterval(() => {
        clock.innerHTML = hour+":"+minute+":"+second;
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

// Stops game timer
let finished = document.getElementsByClassName("match");
function stopTimer(){
    clearInterval(interval);
}

// Adds Modal for congratulating on finish
let show = document.querySelector(".modal-background");
function showModal() {
    show.classList.toggle("hide");
        // Adding modalStats to Modal
    modalStats();
}

function removeModal() {
    show.classList.remove("hide");
}

// Creating statistics for modal
function modalStats() {
    // Moves stat
    const moveStat = document.querySelector(".modal-moves");

    moveStat.innerHTML = `Your moves = ${moves}`;

    // Times stat    
    const timeStat = document.querySelector(".modal-time");
    const timeSpend = document.querySelector(".clock").innerHTML;

    timeStat.innerHTML = `Your time = ${timeSpend}`;

    // Times stat    
    const ratingStat = document.querySelector(".modal-rating");
    const starsLeft = document.querySelector(".stars").innerHTML;

    ratingStat.innerHTML = `Your rating = ${starsLeft}`;
}

// Adds function for resetting game
function resetGame() {
    gameStart();
    stopTimer();
    resetStars();
    resetCards();
    moves = 0;
    movesText.innerHTML = '0';
    second = 0;
    minute = 0;
    hour = 0;
    clock.innerHTML = '0:00';
}

// Add function for replaying game after modal shows
function replayGame() {
    resetGame();
    showModal();
    resetCards();
}

// Adds function to reset star rating
function resetStars () {
    const starList = document.querySelectorAll(".stars li");
    for (star of starList) {
        star.style.display = 'inline';
    }
}

// Adds function to reset all open (or turned) cards
function resetCards() {
    const turnedCards = document.querySelectorAll('.card');
    for (let turnedCard of turnedCards) {
        turnedCard.className = 'card';
    }
}

