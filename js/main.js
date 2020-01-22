'use strict'
var gBoard;
var gLevel = { size: 8, mines: 10 }
var gGame = {
    isOn: false,
    shownCount: 0,
    markCount: 0,
    secsPassed: 0
}
const MINE = 'X';
const FLAG = 'F';

function initGame() {
    gGame.isOn = true;
    gBoard = createBoard();
    // gBoard[1][1].isMine = true;
    // gBoard[2][2].isMine = true;
    setMines();
    //setMinesNegsCount();
    renderBoard();



}

function createBoard() {
    var board = [];
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = [];
        for (var j = 0; j < gLevel.size; j++) {
            board[i][j] = {
                minesAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false,
            }
        }
    }
    return board;
}

function renderBoard() {
    var strHtml = ``;
    for (var i = 0; i < gBoard.length; i++) {
        strHtml += `<tr>`
        for (var j = 0; j < gBoard.length; j++) {
            var cellValue = '';
            if (gBoard[i][j].isShown) cellValue = gBoard[i][j].minesAroundCount;


            strHtml += `<td class ="cell" id="cell-${i}-${j}" onclick="cellClicked(this)">${cellValue}</td>`
            //strHtml += `<td class ="cell" data-posi="${i}" data-posj="${j}" onclick="cellClicked(this)">${cellValue}</td>`

        }
        strHtml += `</tr>`
    }

    var elTable = document.querySelector('table tbody');
    elTable.innerHTML = strHtml;

}

function setMinesNegsCount(posI, posJ) {
    var cellClicked = { i: posI, j: posJ };
    var minesAroundCount = countNeighbors(posI, posJ, cellClicked);
    gBoard[posI][posJ].minesAroundCount = minesAroundCount;
    if (minesAroundCount > 0) gBoard[posI][posJ].isShown = true;
}


function countNeighbors(posI, posJ, cellClicked) {
    var neighboursCount = 0;
    var negsArr = [];
    for (var i = posI - 1; i <= posI + 1; i++) {
        if (i < 0 || i >= gBoard.length) continue;
        for (var j = posJ - 1; j <= posJ + 1; j++) {
            if (j < 0 || j >= gBoard[i].length) continue;
            if (i === posI && j === posJ) continue;
            negsArr.push({ i: i, j: j });
            if (gBoard[i][j].isMine) {
                neighboursCount++;
            }
        }
    }
    if (neighboursCount === 0) expendShown(negsArr);
    return neighboursCount;
}

function expendShown(negsArr) {
    for (var i = 0; i < negsArr.length; i++) {
        var posI = negsArr[i].i;
        var posJ = negsArr[i].j;

        var minesAroundCount = countNeighborsOnce(posI, posJ);
        gBoard[posI][posJ].minesAroundCount = minesAroundCount;
        if (minesAroundCount > 0) gBoard[posI][posJ].isShown = true;

    }

    function countNeighborsOnce(posI, posJ) {
        var neighboursCount = 0;
        for (var i = posI - 1; i <= posI + 1; i++) {
            if (i < 0 || i >= gBoard.length) continue;
            for (var j = posJ - 1; j <= posJ + 1; j++) {
                if (j < 0 || j >= gBoard[i].length) continue;
                if (i === posI && j === posJ) continue;
                if (gBoard[i][j].isMine) {
                    neighboursCount++;
                }
            }
        }
        return neighboursCount;
    }
}

    function cellClicked(elCell) {
        if (!gGame.isOn) return;
        var cellId = elCell.id;
        var coord = getCellCoord(cellId);

        var i = coord.i
        var j = coord.j;

        if (gBoard[i][j].isMine) {
            gameOverLoos();
        } else {
            setMinesNegsCount(i, j);
            renderBoard();
        }

        //elCell.innerText = gBoard[i][j].minesAroundCount;

    }

    function getCellCoord(strCellId) {
        var parts = strCellId.split('-')
        var coord = { i: +parts[1], j: +parts[2] };
        return coord;
    }


    function gameOverLoos() {
        for (var i = 0; i < gBoard.length; i++) {
            for (var j = 0; j < gBoard.length; j++) {
                if (gBoard[i][j].isMine) {
                    var cellname = `cell-${i}-${j}`;
                    console.log(cellname);
                    var elCell = document.querySelector(`#${cellname}`);
                    console.log('elCell', elCell);
                    elCell.innerText = MINE;



                }
            }
        }
        gGame.isOn = false;
    }

    function setMines() {
        var count = 0;
        while (count < gLevel.mines) {
            var i = getRandomInt(0, gLevel.size);
            var j = getRandomInt(0, gLevel.size);
            if (gBoard[i][j].isMine) continue;
            count++;
            gBoard[i][j].isMine = true;
        }
    }


    function getRandomInt(min, max) {
        min = Math.ceil(min);
        max = Math.floor(max);
        return Math.floor(Math.random() * (max - min)) + min; //The maximum is inclusive and the minimum is inclusive 
    }