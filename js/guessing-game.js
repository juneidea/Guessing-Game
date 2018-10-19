let pp = '';
for ( let i = 1; i <= 100; i++){
    pp += `${i} `;
}
document.querySelector('p').textContent = pp;


function generateWinningNumber() {
    let winNum = Math.ceil(Math.random() * 100);
    return winNum;
}

function shuffle(arr) {
    let m = arr.length, t, i;
    while(m){
        i = Math.floor(Math.random() * m--);
        t = arr[m];
        arr[m] = arr[i];
        arr[i] = t;
    }
    return arr;
}

function Game() {
    this.playersGuess = null;
    this.pastGuesses = [];
    this.winningNumber = generateWinningNumber();
    this.max = 100;
    this.min = 1;
    this.hint = [];
}

Game.prototype.difference = function() {
    return Math.abs(this.winningNumber - this.playersGuess);
}
Game.prototype.isLower = function() {
    if (this.playersGuess < this.winningNumber) return true;
    else return false;
}
let emoji = 0;
Game.prototype.playersGuessSubmission = function(num) {
    emoji = 0;
    if (num <= 0 || num > 100 || isNaN(num) || this.pastGuesses.length > 4) return 'That is an invalid guess.';
    else {
        this.playersGuess = num;
        if (this.pastGuesses.includes(num)) {
            document.getElementById('text').value = '';
            document.getElementById('text').placeholder = '*_*';
            emoji = 1;
            return 'You have already guessed that number.';
        }
        this.pastGuesses.push(num);
    }
    if (this.pastGuesses.includes(this.winningNumber)) {
        document.getElementById('text').value = '';
        document.getElementById('text').placeholder = '^_^';
        emoji = 1;
        document.querySelector('p').innerHTML = `<span>${this.winningNumber}</span>`;
        document.getElementById('back').style = `background: #DCE35B;
background: -webkit-linear-gradient( #45B649, #DCE35B);
background: linear-gradient( #45B649, #DCE35B);`;
        return 'You Win!';
    }
    return this.checkGuess();
}
Game.prototype.checkGuess = function() {
    let dir;
    pp = '';
    let max = this.pastGuesses.reduce( (acu, cur) =>{
        if(cur > this.winningNumber && cur < acu) acu = cur -1;
        return acu;
    }, 101);
    if (this.max > max) this.max = max;
    let min = this.pastGuesses.reduce( (acu, cur) =>{
        if(cur < this.winningNumber && cur > acu) acu = cur +1;
        return acu;
    }, 0);
    if (this.min < min) this.min = min;
    if (this.difference() < 10){
        if(this.playersGuess + 10 < this.max) this.max = this.playersGuess + 10;
        if(this.playersGuess - 10 > this.min) this.min = this.playersGuess - 10;
    }
    else if (this.difference() < 25){
        if(this.playersGuess + 25 < this.max) this.max = this.playersGuess + 25;
        if(this.playersGuess - 25 > this.min) this.min = this.playersGuess - 25;
    }    
    else if (this.difference() < 50){
        if(this.playersGuess + 50 < this.max) this.max = this.playersGuess + 50;
        if(this.playersGuess - 50 > this.min) this.min = this.playersGuess - 50;
    }
    if (this.winningNumber - this.playersGuess > 0) {
        dir = `>>${this.playersGuess}`;
        for ( let i = this.min; i <= this.max; i++){
            if(this.hint.length !== 0 && this.hint.includes(i)) pp += `<span>${i}</span> `;
            else pp += `${i} `;
        }
        document.querySelector('p').innerHTML = pp;
    }
    else {
        dir = `${this.playersGuess}<<`;
        for ( let i = this.min; i <= this.max; i++){
            if(this.hint.length !== 0 && this.hint.includes(i)) pp += `<span>${i}</span> `;
            else pp += `${i} `;
        }
        document.querySelector('p').innerHTML = pp;
    }
    if (this.pastGuesses.length === 5) {
        document.getElementById('text').value = '';
        document.getElementById('text').placeholder = '-_-';
        emoji = 1;
        return 'You Lose.';
    }
    if (this.difference() < 10) {
        document.getElementById('back').style = `background: #b92b27;
        background: -webkit-linear-gradient(to top, #1565C0, #b92b27);
        background: linear-gradient(to top, #1565C0, #b92b27);`;
        return `<prox 10> You\'re burning up! ${dir}`;
    }
    if (this.difference() < 25) {
        document.getElementById('back').style = `background: #12c2e9;
        background: -webkit-linear-gradient(#f64f59, #c471ed, #12c2e9);
        background: linear-gradient(#f64f59, #c471ed, #12c2e9);`;
        return `<prox 25> You\'re lukewarm. ${dir}`;
    }
    if (this.difference() < 50) return `<prox 50> You\'re a bit chilly. ${dir}`;
    if (this.difference() < 100) return `<prox 99> You\'re ice cold! ${dir}`;
}
Game.prototype.provideHint = function() {
    let hint = [], i = 0;
    hint.push(this.winningNumber);
    while ( i < 9 ){
        let rand = generateWinningNumber();
        if (rand !== this.winningNumber && !hint.includes(rand)) {
            hint.push(rand);
            i++;
        }
    }
    shuffle(hint);
    return hint;
}
function newGame() {
    return new Game();
}

let game = newGame(),
button1 = document.getElementById('go');
button1.addEventListener('click', function(){
    let text = Number(document.getElementById('text').value);
    let result = game.playersGuessSubmission(text);
    console.log(emoji);
    document.querySelector('H2').textContent = result;
    if (game.pastGuesses.length < 6 && emoji === 0){
    document.getElementById('text').value = '';
    document.getElementById('text').placeholder = `#${5-game.pastGuesses.length}`;
    }
});
button2 = document.getElementById('hint');
button2.addEventListener('click', function(){
    if (game.hint.length === 0) game.hint = game.provideHint();
    document.getElementById('text').value = '';
    document.getElementById('text').placeholder = '0_<';
    pp = '';
    for ( let i = game.min; i <= game.max; i++){
        if (game.hint.length !== 0 && game.hint.includes(i)) pp += `<span>${i}</span> `;
        else pp += `${i} `;
    }
    document.querySelector('p').innerHTML = pp;
    document.querySelector('p').style.fontSize = "small";
    document.querySelector('p').style.fontSize = "medium";
});
button3 = document.getElementById('reset');
button3.addEventListener('click', function(){
    // game = newGame();
    // pp = '';
    // for ( let i = 1; i <= 100; i++){
    //     pp += `${i} `;
    // }
    // document.querySelector('p').textContent = pp;
    // document.getElementById('text').value = '';
    // document.getElementById('text').placeholder = '#5';
    // document.querySelector('H2').textContent = 'Guess a number between 1-100';
    // document.getElementById('back').style = `height: 100%;
    // background: #2980B9;
    // background: -webkit-linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);
    // background: linear-gradient(to top, #FFFFFF, #6DD5FA, #2980B9);`;
    location.reload();
});