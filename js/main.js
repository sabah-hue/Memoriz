// DOM Elements
const gameBoard = document.getElementById("game-board");
const layer = document.querySelector(".select-icons");
const container = document.querySelector(".container");
const win = document.querySelector(".win");
const lose = document.querySelector(".lose");
const lives = document.querySelector(".lives");
const timer = document.querySelector(".timer");

// Sounds with error handling
// const sounds = {
//     match: new Audio('../sounds/match.wav'),
//     mismatch: new Audio('../sounds/mismatch.wav'),
//     win: new Audio('../sounds/win.wav'),
//     lose: new Audio('../sounds/lose.wav')
// };

const sounds = {
    match: document.getElementById("match"),
    mismatch: document.getElementById("mismatch"),
    win: document.getElementById("win"),
    lose: document.getElementById("lose")
};


Object.values(sounds).forEach(sound => {
    sound.addEventListener('error', () => console.log('Sound loading failed'));
});

// Initial Setup
container.classList.add('hide');
win.classList.add('hide');
lose.classList.add('hide');

// Game Data
const icons = {
    fruits: ["🍎", "🍌", "🍒", "🍇", "🍉", "🍋"],
    emojis: ["😀", "😎", "🎉", "👍", "👏", "🥳"],
    crystals: ["💎", "💍", "👑", "💫", "✨", "⚡"],
};

// Timer formatting function
function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    // padStart(2, '0') guarantees consistent two-digit display for seconds.
    // 9 becomes "09"
}

// Game State Variables
let live = 5;
let time = 0;
const maxTime = 120;
let timerInterval;
let timeouts = [];
let isGameActive = false;
lives.innerHTML = `Lives:  ${live}`;
timer.innerHTML = `Timer:  ${formatTime(time)}`;
let randomIcons = [];
let matchIcons = [];
let firstCard = null;
let secondCard = null;
let canClick = true;

// Icon Selection Handler
let iconsType = document.getElementById("select-type");
iconsType.addEventListener("change", function() {
    if (isGameActive) {
        resetGame();
    }
    let selectedIcons = icons[iconsType.value];
    const myIcons = [...selectedIcons, ...selectedIcons];
    randomIcons = myIcons.sort(() => 0.5 - Math.random());
});

// Game Control Functions
function startGame() {
    if (!iconsType.value) {
        alert('Please select icons type before starting the game!');
        return;
    }
    
    isGameActive = true;
    live = 5;
    lives.innerHTML = `Lives: ${live}`;
    matchIcons = [];
    container.classList.remove('hide');
    gameBoard.innerHTML = "";
    layer.classList.add('hide');

    // Start timer counting up
    clearInterval(timerInterval);
    time = 0;
    timerInterval = setInterval(() => {
        time++;
        timer.innerHTML = `Timer:  ${formatTime(time)}`;
        if (time >= maxTime) {
            clearInterval(timerInterval);
            lose.classList.remove('hide');
            sounds.lose.play();
            setTimeout(resetGame, 3000);
        }
    }, 1000);

    randomIcons.forEach(icon => {
        const div = document.createElement('div');
        div.textContent = icon;
        div.classList.add('icon');
        gameBoard.appendChild(div);

        const timeout = setTimeout(() => {
            div.classList.add('flip');
        }, 1000);
        timeouts.push(timeout);

        div.onclick = function() {
            if (!canClick || div === firstCard) return;
            
            div.classList.remove('flip');

            if (!firstCard) {
                firstCard = div;
            } else {
                secondCard = div;
                canClick = false;
                checkMatch();
            }
        }
    });
}

function checkMatch() {
    let match = firstCard.textContent === secondCard.textContent;
    
    if (!match) {
        live--;
        sounds.mismatch.play();
        lives.innerHTML = `Lives: ${live}`;
        if (live === 0) {
            lose.classList.remove('hide');
            sounds.lose.play();
            setTimeout(resetGame, 3000);
        }
        setTimeout(() => {
            firstCard.classList.add('flip');
            secondCard.classList.add('flip');
            resetCards();
        }, 1000);
    } else {
        sounds.match.play();
        matchIcons.push(firstCard.textContent);
        if(matchIcons.length === randomIcons.length / 2) {
            win.classList.remove('hide');
            sounds.win.play();
            setTimeout(resetGame, 4000);
        }
        resetCards();
    }
}

function resetCards() {
    firstCard = null;
    secondCard = null;
    canClick = true;
}

function resetGame() {
    isGameActive = false;
    clearInterval(timerInterval);
    timeouts.forEach(timeout => clearTimeout(timeout));
    timeouts = [];
    
    live = 5;
    time = 0;
    lives.innerHTML = `Lives:  ${live}`;
    timer.innerHTML = `Timer:  ${formatTime(time)}`;
    matchIcons = [];
    gameBoard.innerHTML = "";
    layer.classList.remove('hide');
    container.classList.add('hide');
    win.classList.add('hide');
    lose.classList.add('hide');
}
