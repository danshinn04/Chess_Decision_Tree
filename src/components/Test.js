
import React, {useEffect, useRef, useState} from 'react';
import {MouseEvent} from 'react'

import './Test.css'
import {Pieces} from '../class/Pieces'
import TailwindTest from "./TailwindTest";
const Test = () => {


    let draggedElement
    const forever = 0

    const [playerTurn, changePlayerTurn] = useState('white')

    const playerTurnRef = useRef(playerTurn);
    useEffect(() => {
        playerTurnRef.current = playerTurn;
    }, [playerTurn]);

    const dragStart = (e) => {
        console.log(e.target.parentNode, "parent node")
        draggedElement=e.target.parentNode
        console.log(draggedElement)

    }

    function dragOver(e) {
        e.preventDefault()

    }
    const dragDrop = (e) => {
        e.stopPropagation()

        const correctPlayer = draggedElement.classList.contains(playerTurnRef.current)
        const opponentTurn = playerTurnRef.current === 'white' ? 'black': 'white'
        console.log(correctPlayer, draggedElement.classList, playerTurnRef.current)
        const takenByOpponent = e.target.parentNode?.classList.contains(opponentTurn)
        console.log(takenByOpponent, opponentTurn, e.target.parentNode, 'this')

        if (correctPlayer) {

            e.target.append(draggedElement)
            changePlayer()


            }

        }





    const changePlayer = () => {

        changePlayerTurn(prevTurn => prevTurn === 'black' ? 'white' : 'black');

        console.log(playerTurn, 'after')
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
                square.id = `${63-added}`

                square.addEventListener('dragstart', dragStart) //when you click the object
                square.addEventListener('dragover', dragOver) //when you're dragging and holding it
                square.addEventListener('drop', dragDrop) //when you drop it

                console.log('firstChild', square.firstChild)

                cells.append(square)
                console.log(BlackWhite, added, 'test')

            }
            console.log(cells, 'cells')
            grid.append(cells)


        }


        console.log(grid, piece1.piece[2])
    }, [forever])


    const fen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'
    const pieceDict = {
        'k': 1,
        'p': 2,
        'n': 3,
        'b': 4,
        'r': 5,
        'q': 6,
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




                    const temp = document.getElementById(`${String((7-rank)*8+file)}`)


                    const temp2 = new Pieces(whatColor, pieceDict[fen[i].toLowerCase()])
                    const piece = document.createElement('div')
                    const pieceImg = document.createElement('img')



                    pieceImg.src = temp2.piece[2].default
                    pieceImg.classname = 'individualPiece'

                    piece.append(pieceImg)
                    piece.className=`piece ${whatColor}`

                    piece.setAttribute('draggable', true) //child doesn't exist at createBoard function yet



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