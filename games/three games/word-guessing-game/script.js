const inputs = document.querySelector(".inputs"),
hintTag = document.querySelector(".hint span"),
guessLeft = document.querySelector(".guess-left span"),
wrongLetter = document.querySelector(".wrong-letter span"),
resetBtn = document.querySelector(".reset-btn"),
typingInput = document.querySelector(".typing-input");

let word, maxGuesses, incorrectLetters = [], correctLetters = [];

async function randomWord() {
    let ranItem = wordList[Math.floor(Math.random() * wordList.length)];
    word = ranItem.word;
    maxGuesses = word.length >= 5 ? 8 : 6;
    correctLetters = []; incorrectLetters = [];
    hintTag.innerText = ranItem.hint;
    guessLeft.innerText = maxGuesses;
    wrongLetter.innerText = incorrectLetters;

    // Call the fetchImage function to get the image for the current word
    await fetchImage(word, 400, ranItem.hint);

    let html = "";
    for (let i = 0; i < word.length; i++) {
        html += `<input type="text">`;
    }
    inputs.innerHTML = html;
}
randomWord();

function initGame(e) {
    let key = e.target.value.toLowerCase();
    if(key.match(/^[A-Za-z]+$/) && !incorrectLetters.includes(` ${key}`) && !correctLetters.includes(key)) {
        if(word.includes(key)) {
            for (let i = 0; i < word.length; i++) {
                if(word[i] == key) {
                    correctLetters += key;
                    inputs.querySelectorAll("input")[i].value = key;
                }
            }
        } else {
            maxGuesses--;
            incorrectLetters.push(` ${key}`);
        }
        guessLeft.innerText = maxGuesses;
        wrongLetter.innerText = incorrectLetters;
    }
    typingInput.value = "";

    setTimeout(() => {
        if(correctLetters.length === word.length) {
            alert(`Congrats! You found the word ${word.toUpperCase()}`);
            return randomWord();
        } else if(maxGuesses < 1) {
            alert("Game over! You don't have remaining guesses");
            for(let i = 0; i < word.length; i++) {
                inputs.querySelectorAll("input")[i].value = word[i];
            }
        }
    }, 100);
}

async function fetchImage(word, imageSize, hint) {
    const accessKey = 'jm90J3ZazTikjKYhh4Ot4K_FHY-UoTfTzlvMTmlJ8d8'; // Replace with your Unsplash access key
  
    try {
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${word}&client_id=${accessKey}`);
      const data = await response.json();
  
      if (data.results.length > 0) {
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('image-container');
  
        const imageElement = document.createElement('img');
        // Set the desired image size in the URL
        imageElement.src = data.results[0].urls.raw + `&w=${imageSize}`;
        imageElement.alt = `Image for ${word}`;
        imageContainer.appendChild(imageElement);
  
        const hintElement = document.createElement('p');
        hintElement.classList.add('hint-text');
        hintElement.innerText = `Hint: ${hint}`;
        imageContainer.appendChild(hintElement);
  
        // Append the image container to the hintTag element
        hintTag.innerHTML = '';
        hintTag.appendChild(imageContainer);
      } else {
        // If no image is found, display a default text message
        hintTag.innerText = 'No image available for the hint';
      }
    } catch (error) {
      console.error('Error fetching image:', error);
    }
  }
  

resetBtn.addEventListener("click", randomWord);
typingInput.addEventListener("input", initGame);
inputs.addEventListener("click", () => typingInput.focus());
document.addEventListener("keydown", () => typingInput.focus());