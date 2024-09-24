
import React, {useEffect, useRef, useState} from 'react';
import {MouseEvent} from 'react'

import './ChessMain.css'
import {Pieces} from '../class/Pieces'
import TailwindTest from "./TailwindTest";
import Chessboard from "./Chessboard";
const ChessMain = () => {


    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Simulate loading or checking when the page is ready
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 10); // Adjust timing as necessary

        return () => clearTimeout(timer);
    }, []);


    let draggedElement
    let startPositionId
    const forever = 0

    const [playerTurn, changePlayerTurn] = useState('white')

    const playerTurnRef = useRef(playerTurn);
    useEffect(() => {
        playerTurnRef.current = playerTurn;

    }, [playerTurn]);

    const dragStart = (e) => {

        draggedElement=e.target.parentNode.parentNode //the square
        startPositionId = e.target.parentNode.parentNode
        console.log(draggedElement, 'dragged')

    }

    function dragOver(e) {
        e.preventDefault()

    }
    const dragDrop = (e) => {

        /*

        To clarify:
        If landing on square:
        -e.target = the square

        If landing on piece:
        -e.target= pieceImg

         */

        e.stopPropagation()

        const correctPlayer = draggedElement.firstChild.classList.contains(playerTurnRef.current)

        const opponentTurn = playerTurnRef.current === 'white' ? 'black': 'white'
        const takenByOpponent = e.target.classList.contains(opponentTurn) // check if opp piece occupies that square
        const taken = e.target.classList.contains(playerTurnRef.current) //checks if friendly piece occupies that square


        const valid = checkIfValid(e.target)
        console.log(valid, 'valid2')
        if (correctPlayer) {

            if (valid && takenByOpponent) { //checks if it's a valid move AND if there's an opponent piece on that square

                e.target.parentNode.parentNode.append(draggedElement.firstChild)
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
                changePlayer()
            }
            else if (taken) { //checks if there's an ally piece on that square
                console.log('you cant go here')
            }
            else if (valid) { //checks if the move is valid
                e.target.append(draggedElement.firstChild)
                console.log('append done')
                changePlayer()
            }

        }

    }
    const checkIfValid = (target) => {
        const targetId = Number(target.id) || Number(target.parentNode.parentNode.id)
        const startId = Number(startPositionId.id)
        const piece = draggedElement.firstChild.id
        console.log(targetId, startId, piece, startId+16)


        let dir
        switch(piece) {

            case 'pawn':

                const starterRow = [8, 9, 10, 11, 12, 13, 14, 15]

                if (starterRow.includes(startId) && startId+8*2 === targetId ) {
                    //pawn moves 2 squares forward
                    return true
                }
                else if (startId + 8 === targetId) {
                    //pawn moves 1 square after first move
                    return true
                }
                return false
            case 'knight':
                if (
                    startId+17 === targetId || startId+10 === targetId ||
                    startId-17 === targetId || startId-10 === targetId ||
                    startId+15 === targetId || startId+6 === targetId ||
                    startId-15 === targetId || startId-6 === targetId) {
                    return true
                }
            case 'king':
                if (
                    startId+1 === targetId || startId-1===targetId ||
                    startId+8 === targetId || startId-8===targetId ||
                    startId+9 === targetId || startId-9===targetId ||
                    startId+7 === targetId || startId-7===targetId
                ) {

                    return true
                }
            case 'bishop':
                const maxPieceGoThrough = 0;
                let piecesInWay = 0;
                //check if it's diagonal
                if ((targetId-startId) % 9 !== 0 && (targetId-startId) % 7 !== 0) {
                    console.log('invalid bishop move')
                    return false


                }

                if ((targetId-startId) % 9 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*9
                }
                else if ((targetId-startId) % 7 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*7
                }
                console.log(dir, 'dir')
                if (checkForPiecesInWay(dir, startId, targetId)) return false
                return true


            case 'rook':
                console.log(startPositionId.parentNode.id, target.parentNode.id, 'horizontal')
                if ((targetId-startId) % 8 !== 0 && Math.abs(targetId-startId) > 8) {
                    console.log('bad rook move')
                    return false
                }
                //if moving up/down
                if ((targetId-startId) % 8 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*8
                }
                //if moving left/right. Checks if it's in the same horizontal.
                else if(Math.abs(targetId-startId) < 8 && (startPositionId.parentNode.id === target.parentNode.id)) {
                    console.log('both are true')
                    dir = (targetId-startId)/Math.abs(targetId-startId)

                }
                console.log(dir, 'dir')
                if (dir !== undefined) {
                    if (!checkForPiecesInWay(dir, startId, targetId)) return true
                }

                return false

            case 'queen':
                if ((targetId-startId) % 9 !== 0 && (targetId-startId) % 7 !== 0  &&
                    ((targetId-startId) % 8 !== 0 && Math.abs(targetId-startId) > 8)) {
                    //if not diagonal or straight
                    console.log('invalid queen move')
                    return false


                }

                if ((targetId-startId) % 9 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*9
                }
                else if ((targetId-startId) % 7 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*7
                }
                else if ((targetId-startId) % 8 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*8
                }
                else if(Math.abs(targetId-startId) < 8 && (startPositionId.parentNode.id === target.parentNode.id)) {
                    console.log('both are true')
                    dir = (targetId-startId)/Math.abs(targetId-startId)

                }
                console.log(dir, 'dir')
                if (dir !== undefined) {
                    if (!checkForPiecesInWay(dir, startId, targetId)) return true
                }
                return false;
        }
    }
    const checkForPiecesInWay = (dir, startId, targetId) => {

        for (let i = 1; i < Math.abs((targetId-startId)/dir); i++) {
            console.log(startId+i*dir)
            let eachSquare = document.getElementById(`${startId+i*dir}`)
            console.log(eachSquare, 'eachSquare')
            if (eachSquare.firstChild?.classList.contains('piece')) {
                console.log('piece in the way', dir)
                return true; //if piece in way
            }
        }
        return false; //if piece not in way
    }


    const changePlayer = () => {

        changePlayerTurn(prevTurn => prevTurn === 'black' ? 'white' : 'black');

        console.log(playerTurn, 'after')
        flipSquareID()
    }

    const flipSquareID = () => {
        const temp = document.getElementById('chessBoard')
        for (let i = 0; i < temp.children.length; i++) {
            for (let k = 0; k < temp.children[i].children.length; k++) {
                temp.children[i].children[k].id = Number(63-Number(temp.children[i].children[k].id))
            }
        }
    }

    //set up FEN
    const FEN = '1nbqkbnr/8/r7/8/8/7R/8/RNBQKBN1'


    useEffect(() => {
        const piece1 = new Pieces('black', 1)
        const grid = document.getElementById('chessBoard') //need to create an element to append

        //Grid contains 8 cells. Each cell contains 8 squares.
        //Each square might contain a piece, which contains a pieceImg.

        for (let file = 0; file < 8; file++) {
            const cells = document.createElement('div')
            cells.className = `Horizontal`
            cells.id=`Rows${file}`
            for (let rank = 0; rank < 8; rank++) {

                const BlackWhite = ((file + rank) % 2) !== 0 ? 'black' : 'white'
                const added = file * 8 + rank

                const square = document.createElement('div')
                square.className = `Cell ${BlackWhite}Square`
                square.id = 63-added

                square.addEventListener('dragstart', dragStart) //when you click the object
                square.addEventListener('dragover', dragOver) //when you're dragging and holding it
                square.addEventListener('drop', dragDrop) //when you drop it

                cells.append(square)

            }
            grid.append(cells)
        }
    }, [forever])

    return <div>

        <div className="mainContainer">
            <div id='chessBoard' className='chessBoard'></div>
        </div>

        {isLoaded && <Chessboard fen={FEN}/>}
    </div>
}

export default ChessMain;