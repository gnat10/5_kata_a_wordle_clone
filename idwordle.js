import { realDictionary } from './word_list.js';
const dictionary = realDictionary;
const state = {
  secret: dictionary[Math.floor(Math.random() * dictionary.length)],
};
console.log(state.secret)
const boardHeight = 6; 
const wordLength = 5; 
let guessRow = 0; 
let guessCol = 0; 
const gameOver = false;

function getTile(placement, row, column, letter = ""){
    const tile = document.createElement('div');
    tile.className = 'tile';
    tile.textContent = letter;
    tile.id = `tile${row}${column}`;

    placement.appendChild(tile);
    return tile;
}

function getBoard(placement) {
    const board = document.createElement('div');
    board.className = 'board';
  
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 5; j++) {
        getTile(board, i, j);
      }
    }
    placement.appendChild(board);
}

function getKeyInput(){
    document.addEventListener("click", getMouseClick)
    document.addEventListener("keydown", getKeyboardPress)
}

function stopKeyInput(){
    document.removeEventListener("click", getMouseClick)
    document.removeEventListener("keydown", getKeyboardPress)
  }

function getMouseClick(e){
    if (e.target.matches("[data-key]")){
        keyInput(e.target.dataset.key)
        return
    }
    
    if (e.target.matches("[data-enter]")){
        submitGuess()
        return
    }
    if (e.target.matches("[data-backspace]")){
        deleteKey()
        return
    }
}

function getKeyboardPress(e){
    if (e.key === "Enter"){
        submitGuess()
        return
    }
    if (e.key === "Backspace" || e.key === "Delete"){
        deleteKey()
        return
    }
    if (e.key.match(/^[A-Z]$/) || e.key.match(/^[a-z]$/)){
        keyInput(e.key)
        return
    }
}

function keyInput(key){
    if (guessCol < wordLength){
        let currentTile = document.getElementById('tile' + guessRow.toString() + guessCol.toString());
        if (currentTile.innerText == "") {
            currentTile.innerText = key;
            currentTile.dataset.letter = key.toLowerCase();
            currentTile.dataset.state = "active";
            guessCol += 1;
        }
    }
}

function deleteKey(){
    if (0 < guessCol && guessCol <= wordLength) {
        guessCol -=1;
    }
    let currentTile = document.getElementById('tile' + guessRow.toString() + guessCol.toString());
    currentTile.textContent = "";
    delete currentTile.dataset.letter
    delete currentTile.dataset.state
}

function submitGuess(){
    //let guess = ""
    const activeTile = [...getActiveTiles()]
    let guess = activeTile.reduce((word, tile) => {
        return word + tile.dataset.letter
      }, "")

    //for (let c = 0; c < wordLength; c++) {
        //let currentTile = document.getElementById('tile' + guessRow.toString() + guessCol.toString());
        //let letter = currentTile.innerText;
        //guess += letter;
    //}

    guess = guess.toLowerCase(); //case sensitive
    console.log(guess);

    if (validWord(guess)) {
        checkWord(guess);
        for (let i = 0; i < 5; i++) {
            let previousTile = document.getElementById('tile' + guessRow.toString() + i);
            delete previousTile.dataset.letter;
            delete previousTile.dataset.state;
        }
        guessRow +=1;
        guessCol =0;
    }
    else{
        alert('Kata anda tidak valid.');
        return;
    }
 }

 function getActiveTiles() {
    return document.querySelectorAll('[data-state="active"]')
  }

 function checkWord(guess){

    const animation_duration = 500; // ms

    for (let i = 0; i < 5; i++) {
        const tile = document.getElementById('tile' + guessRow.toString() + i);
        let letter = tile.textContent;
        letter = letter.toLowerCase();
        const secret = [...state.secret]
        setTimeout(() => {
          if (secret[i] === letter) {
            tile.classList.add('right');

            let key = document.getElementById(letter);
            key.classList.add("right");
          } 
          else if (secret.includes(letter)) {
            tile.classList.add('exist');

            let key = document.getElementById(letter);
            key.classList.add("exist");
          } 
          else if (!secret.includes(letter)) {
            tile.classList.add('absent');

            let key = document.getElementById(letter);
            key.classList.add("absent");
          }
        }, ((i + 1) * animation_duration) / 2);
  
      tile.classList.add('animatedFlip');
      tile.style.animationDelay = `${(i * animation_duration) / 2}ms`;
    }
  
    const isWinner = state.secret === guess;
    const isGameOver = guessRow === 5;
  
    setTimeout(() => {
      if (isWinner) {
        alert('Selamat!');
        stopKeyInput();
      } else if (isGameOver) {
        alert(`Kesempatan habis! Kata: ${state.secret}.`);
        stopKeyInput();
      }
    }, 3 * animation_duration);
}

function validWord(guess){
    return dictionary.includes(guess);
}

function main(){
    const board = document.getElementById('wordle');
    getBoard(board);

    getKeyInput();
}

main();
