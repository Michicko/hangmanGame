const reset = document.querySelector('#reset');
const guessesLeft = document.querySelector('.guess');
let totalGuesses = 3;
let randomWord;

// Event Listeners
reset.addEventListener('click', () => {
    window.location.reload();
});

// start game
function startTheGame() {
document.addEventListener('keypress', startGame); 
}

// Get random word
function getRandomWords() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://random-word-api.herokuapp.com/word?number=1', true);
    
    xhr.onload = function (err) {
        if (this.status === 200) {
            const data = JSON.parse(this.responseText);
            randomWord = data[0];
            
            populateDom(randomWord);
            startTheGame();
        } else {
            console.log(err);
        }
    }
    xhr.send();
}

// start game
function startGame(e) {
    const guessedLetter = String.fromCharCode(e.keyCode);
    const fillers = document.querySelectorAll('.word');
    // const word = pickedWord;
    let wordArray = randomWord.split("");
    let guessedLettersArrar = [];
    let i;

    // listen for only [a - z]
    if (/[a-z]/i.test(guessedLetter)) {
        // if guessed does not letter exist
        if (randomWord.indexOf(guessedLetter) < 0) {
            totalGuesses--;
            showAlert(`Guesses Left: ${totalGuesses}`, 'error');

        // if guessed letter exists
        } else if (randomWord.indexOf(guessedLetter) > -1) {
            // if guessed letter appears more than once
            fillers.forEach((filler, i) => {
                if (filler.innerText === guessedLetter) {
                    i = randomWord.indexOf(guessedLetter, i + 1);
                    guessedLettersArrar.push({
                        letter: guessedLetter,
                        index: i
                    });
               }
            });

            // if guessed letter appears only once
            i = randomWord.indexOf(guessedLetter);
            guessedLettersArrar.push({
                letter: guessedLetter,
                index: i
            });
        }
    }

    // replace fillers with guessed letter on the DOM
    guessedLettersArrar.forEach((guess) => {
        for (let i = 0; i < fillers.length; i++) {
            if (guess.index > -1) {
                fillers[guess.index].innerHTML = guess.letter;
            }
        }
    });
    
    // check if word is correct
    checkIfCorrect(wordArray, randomWord);
}


function checkIfCorrect(wordArray, randomWord) {
    const fillers = document.querySelectorAll('.word');
    const wordsContainer = document.querySelector('.words');
    let completedWord = [];
    fillers.forEach((filler) => {
        completedWord.push(filler.textContent);
    });

    const guessedWord = completedWord.join("");
    // check if game over
    if (totalGuesses === 0) {
        // display alert
        showAlert(`Game Over!! Try again`, 'error');

        // display correct answer
        wordArray.forEach((word, i) => {
            fillers[i].innerHTML = word;
        });

        // remove event Listener
        document.removeEventListener('keypress', startGame);

        // if guessed word is correct
    } else if (guessedWord === randomWord) {
        wordsContainer.classList.add('success');
        // display alert
        showAlert(`${guessedWord} is Correct!!`, 'success');
        
        // remove event Listener
        document.removeEventListener('keypress', startGame);  
    }
}

// display word fillers
function populateDom(word) {
    const wordsContainer = document.querySelector('.words');
    for (let i = 0; i < word.length; i++) {
        const span = document.createElement('span');
        span.classList.add('word');
        span.appendChild(document.createTextNode('*'));
        wordsContainer.appendChild(span);
    }
}

// Display alert
function showAlert(msg, className) {
    const feedback = document.querySelector(".feedback");
    const p = document.createElement('p');
    p.className = className;
    p.appendChild(document.createTextNode(msg));
    removeAlert();
    feedback.appendChild(p);
}

// remove alert if it exists
function removeAlert() {
    const feedback = document.querySelector(".feedback");
    if (feedback.firstElementChild) {
        feedback.firstElementChild.remove();
    }
}

getRandomWords();