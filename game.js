"use strict";
let width = 10;
let height = 10;
let mineNum = 10;
let unclicked;
let board;
let minefield = document.getElementById("minefield");

function newBoard(x, y) {
    board = new Array(x);

    let chanceCut = mineNum / (width * height);
    
    let mines = 0;
    for (let i = 0; i < x; i++) {
        board[i] = new Array(y);
        for (let j = 0; j < y; j++) {
            let isMine = Math.random() < chanceCut;
            board[i][j] = new Tile(i, j, isMine);
            if (isMine) {
                mines++;
            }
            //alert(board[i][j]);
        }
    }
    unclicked = width * height - mines;
}

class Tile {
    constructor(x, y, mine) {
        this.x = x;
        this.y = y;
        this.mine = mine;
        this.clicked = false;
    }

    find = (direction) => {

        let xOffset = 0;
        if (direction == 0 || direction == 3 || direction == 5) {
            xOffset = -1;
        } else if (direction == 2 || direction == 4 || direction == 7) {
            xOffset = 1
        }

        let yOffset = 0;
        if (direction < 3) {
            yOffset = -1;
        } else if (direction > 4) {
            yOffset = 1;
        }

        let newX = xOffset + this.x;
        let newY = yOffset + this.y;
        
        if (newY < 0 || newY >= height || newX < 0 || newX >= width) {
            return null;
        }
        return board[newX][newY];
    }

    click = () => {
        if (this.mine) {
            return true;
        }
        if (this.clicked) {
            return false;
        }
        this.clicked = true;
        unclicked--;
        let mineCount = 0;
        for (let i = 0; i < 8; i++) {
            let found = this.find(i);
            if (found == null) {
                continue;
            }
            if (found.mine) {
                mineCount++;
            }
        }
        
        if (mineCount == 0) {
            //reveal neighbours
            for (let i = 0; i < 8; i++) {
                let found = this.find(i);
                if (found != null) {
                    //alert(`Clicking tile at ${i} from x: ${this.x} and y: ${this.y}`);
                    found.click();
                }
            }
            minefield.firstChild.rows[this.y].cells[this.x].classList.toggle('unrevealed');
            return false;
        }
        //alert("Made it here: " + minefield.firstChild.rows[this.y].cells[this.x]);
        minefield.firstChild.rows[this.y].cells[this.x].textContent = mineCount;
        minefield.firstChild.rows[this.y].cells[this.x].classList.toggle('unrevealed');
        return false;
    }
}

function renderBoard(x, y) {
    let table = '<table id="mine-table">';
    for (let j = 0; j < y; j++) {
        table += '<tr>';
        for (let i = 0; i < x; i++) {
            table += '<td class="unrevealed"></td>';
        }
        table += '</tr>';
    }
    table += '</table>';
    minefield.innerHTML = table;
}

function startMenu() {

    let start = document.getElementById('start');
    let difficulty_field = document.getElementById('difficulty');
    let size_field = document.getElementById('size');
    let settings = document.getElementById('settings');
    start.addEventListener('click', function(event) {
        let difficulty = difficulty_field.value;
        let size = size_field.value;
        width = size;
        height = size;
        if (difficulty == "easy") {
            mineNum = 0.05 * size * size;
        } else if (difficulty == "hard") {
            mineNum = 0.20 * size * size;
        } else if (difficulty == "medium") {
            mineNum = 0.10 * size * size;
        } else {
            alert("Error");
        }

        newBoard(size, size);
        renderBoard(size, size);
        let table = document.getElementById('mine-table');
        

        var allowedTime = 300;
        var a = setInterval(function() {
            allowedTime -= 0.02;
            document.getElementById('time').innerHTML = Math.round(allowedTime * 100) / 100;
            if (allowedTime <= 0) {
                alert("You lose because you ran out of time");
                table.remove();
                clearInterval(a);
            }
        }
        ,20);

        table.addEventListener('click', function(event) {
            let target = event.target;

            let i = target.cellIndex;
            let j = target.parentNode.rowIndex;

            if (board[i][j].click()) {
                alert("You lose");
                table.remove();
                clearInterval(a);
            }
            if (unclicked == 0) {
                alert("You win with " + Math.round(300 - allowedTime) + " seconds taken");
                table.remove();
                clearInterval(a);
            }

        });
    });
}

startMenu();




