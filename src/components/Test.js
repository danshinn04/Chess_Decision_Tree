
import React, { useEffect, useRef} from 'react';
import {MouseEvent} from 'react'

import './Test.css'
import {Pieces} from '../class/Pieces'
const Test = () => {




    const list = ["beijing", "tokyo", "testing"]
    const handleClick = (event) => {console.log(event.target)}


    const piece1 = new Pieces('black', 1)


    const grid = []


        for (let file = 0; file < 8; file++) {
            var cells = []
            for (let rank = 0; rank < 8; rank++) {

                var BlackWhite = ((file + rank) % 2) !== 0 ? 'black' : 'white'
                const added = file*8 + rank
                console.log(piece1.piece[2].default)

                cells.push(<div key = {added} id = {added} className={`Cell ${BlackWhite}`}></div>)
                console.log(BlackWhite, added)

            }
            grid.push(<div key ={file} className='Horizontal'>{cells}</div>)

        }


        console.log(grid, piece1.piece[2])


    const fen = 'rnbqkbnr/pppppppp/8/8/5P2/2P1P3/PP1P2PP/RNBQKBNR'
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
                        console.log('eight', file, rank)
                        file=0
                    }
                    else {
                        file = file + parseInt(fen[i], 10)
                    }
                }
                else if (typeof fen[i] === 'string') {
                    const whatColor = fen[i] === fen[i].toUpperCase() ? 'white' : 'black'
                    console.log(pieceDict[fen[i].toLowerCase()], (7-rank)*8+file, 1)



                    const temp = document.getElementById(`${String((7-rank)*8+file)}`)


                    const temp2 = new Pieces(whatColor, pieceDict[fen[i].toLowerCase()])
                    const pieceImg = document.createElement('img')
                    console.log(temp2.piece[2].default)
                    pieceImg.src = temp2.piece[2].default
                    pieceImg.classname = 'individualPiece'
                    temp.append(pieceImg)

                    file++
                }

            }
        }
    }
        useEffect(() => {
            FENtoGrid(fen)
        }, [])

    return <>

       <div className='chessBoard'>{grid}</div>
    </>
}

export default Test;