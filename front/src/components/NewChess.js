
import React, {useEffect, useRef, useState} from 'react';
import {MouseEvent} from 'react'
import {Chess} from 'chess.js'
import './NewChess.css'
import {Pieces} from '../class/Pieces'
import TailwindTest from "./TailwindTest";
import Chessboard from "./Chessboard";
import Particles from "./Particles";
import AnimatedBackground from "./AnimatedBackground";
const NewChess = () => {

    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());
    console.log(game.board());

    const [isLoaded, setIsLoaded] = useState(false);

    const pieceDict = {
        'k': 'king',
        'p': 'pawn',
        'n': 'knight',
        'b': 'bishop',
        'r': 'rook',
        'q': 'queen',
    }

    const FENtoGrid = (fen, remove) => {

        const removeAll = document.getElementById('chessBoard')

        for (let i = 0; i < removeAll.children.length; i++) {
            for (let k = 0; k < removeAll.children[i].children.length; k++) {
                const square = removeAll.children[i].children[k]
                square.innerHTML = ''
            }
        }
        let file = 0;
        let rank = 7;
        for (let i = 0; i < fen.length; i++) {

            if (fen[i] === '/') {
                file=0
                rank--
            }
            else if (fen[i] === " ") {
                break;
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

                    if (temp.firstChild) {
                        temp.removeChild(temp.firstChild)
                    }


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
        // Simulate loading or checking when the page is ready
        const timer = setTimeout(() => {
            setIsLoaded(true);
        }, 10); // Adjust timing as necessary

        return () => clearTimeout(timer);
    }, []);

    const handleMoves = (from, to) => {
        try {
            const move = game.move({
                from,
                to
            });

            if (move === null) {
                console.log('Invalid move');
                return false; // Move was invalid
            } else {
                console.log('Move was valid');
                return true; // Move was valid
            }
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    };

    let draggedElement
    let startPositionId
    let startPositionRole
    const [playerTurn, changePlayerTurn] = useState('white')

    const playerTurnRef = useRef(playerTurn);
    useEffect(() => {
        playerTurnRef.current = playerTurn;

    }, [playerTurn]);

    let targetRole
    const dragStart = (e) => {

        draggedElement=e.target.parentNode.parentNode //the square
        console.log(draggedElement, 'dragged')
        startPositionId = e.target.parentNode.parentNode.id
        startPositionRole = e.target.parentNode.parentNode.role
        setTimeout(() => {
            draggedElement.firstChild.style.display = 'none';
        }, 0);

    }

    function dragOver(e) {
        e.preventDefault()
    }
    function dragDrop(e) {
        draggedElement.firstChild.style.display = 'block'
        targetRole = e.target.role || e.target.parentNode.parentNode.role
        const move = handleMoves(startPositionRole, targetRole)

        if (move) {
            console.log(game.fen())
            FENtoGrid(game.fen())
        }
    }



    //set up FEN
    const FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR'

    const letters = {
        1: "a",
        2: "b",
        3: "c",
        4: "d",
        5: "e",
        6: "f",
        7: "g",
        8: "h"
    }

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
                square.role = letters[rank+1]+(8-file)
                console.log(letters[rank+1]+(8-file), 'added')
                square.addEventListener('dragstart', dragStart) //when you click the object
                square.addEventListener('dragover', dragOver) //when you're dragging and holding it
                square.addEventListener('drop', dragDrop)

                cells.append(square)

            }
            grid.append(cells)
        }
    }, [])

    return <div>



        <div className="video-background">
            <video autoPlay loop muted playsInline className='clip'>
                <source src="../assets/images/4k%20Storm%20for%20Live%20Wallpaper.mp4" type="video/mp4"/>
            </video>
        </div>

        <div className="mainContainer">
            <div id='chessBoard' className='chessBoard'></div>
        </div>

        {isLoaded && <Chessboard fen={FEN}/>}
        <AnimatedBackground/>

    </div>
}

export default NewChess;