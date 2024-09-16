
import React, {useEffect, useRef, useState} from 'react';
import {MouseEvent} from 'react'

import './Test.css'
import {Pieces} from '../class/Pieces'
import TailwindTest from "./TailwindTest";
const Test = () => {


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

            if (valid && takenByOpponent) {

                e.target.parentNode.parentNode.append(draggedElement.firstChild)
                e.target.parentNode.parentNode.removeChild(e.target.parentNode)
                changePlayer()
            }
            if (taken) {
                console.log('you cant go here')
            }
            if (valid) {
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
                if ((targetId-startId) % 9 !== 0 && (targetId-startId) % 7 !== 0) {
                    console.log('invalid bishop move')
                    return false


                }

                if ((targetId-startId) % 9 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*9
                }
                if ((targetId-startId) % 7 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*7
                }
                console.log(dir, 'dir')
                if (checkForPiecesInWay(dir, startId, targetId)) return false
                return true



            case 'queen':

            case 'rook':
                if ((targetId-startId) % 8 !== 0 && Math.abs(targetId-startId) > 8) {
                    console.log('bad rook move')
                    return false
                }

                if ((targetId-startId) % 8 === 0) {
                    dir = (targetId-startId)/Math.abs(targetId-startId)*8
                }
                else {
                    dir = 1
                }
                return true
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

    useEffect(() => {
        const piece1 = new Pieces('black', 1)
        const grid = document.getElementById('chessBoard') //need to create an element to append

        //Grid contains 8 cells. Each cell contains 8 squares.
        //Each square might contain a piece, which contains a pieceImg.

        for (let file = 0; file < 8; file++) {
            const cells = document.createElement('div')
            cells.className = 'Horizontal'
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


    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    const pieceDict = {
        'k': 'king',
        'p': 'pawn',
        'n': 'knight',
        'b': 'bishop',
        'r': 'rook',
        'q': 'queen',
    }
    const FENtoGrid = (FEN) => {

        let file = 0;
        let rank = 7;
        for (let i = 0; i < fen.length; i++) {

            if (fen[i] === '/') {
                file=0
                rank--
            }
            else {
                if (!isNaN(Number(fen[i]))) {
                    if (fen[i] === '8') {
                        file=0
                    }
                    else {
                        file = file + parseInt(fen[i], 10)
                    }
                }
                else if (typeof fen[i] === 'string') {
                    const whatColor = fen[i] === fen[i].toUpperCase() ? 'white' : 'black'




                    const temp = document.getElementById(`${String(63-((7-rank)*8+file))}`)
                    console.log(temp.id, 'id')

                    const temp2 = new Pieces(whatColor, pieceDict[fen[i].toLowerCase()])
                    const piece = document.createElement('div')
                    const pieceImg = document.createElement('img')




                    pieceImg.src = temp2.piece[2].default
                    pieceImg.className = `individualPiece ${whatColor}`


                    piece.append(pieceImg)
                    piece.className=`piece ${whatColor}`

                    piece.setAttribute('draggable', true) //child doesn't exist at createBoard function yet
                    piece.id = pieceDict[fen[i].toLowerCase()]


                    temp.append(piece)

                    file++
                }

            }
        }
    }
        useEffect(() => {
            FENtoGrid(fen)
        }, [1])

    return <div>

        <div id='chessBoard' className='chessBoard'></div>
        <div draggable='true'>test</div>
        <div>
            <section className="bg-green-100 m-12 flex justify-center items-center ">
                <p>This is testing tailwind css irsuhgo8rtehgnugivrehnuighnti</p></section>

        </div>
        <div>It's {playerTurn}'s turn</div>


        <TailwindTest/>
    </div>
}

export default Test;