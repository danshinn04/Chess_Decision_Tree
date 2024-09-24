import {Pieces} from "../class/Pieces";
import {useEffect} from "react";


const Chessboard = ({fen}) => {

    const pieceDict = {
        'k': 'king',
        'p': 'pawn',
        'n': 'knight',
        'b': 'bishop',
        'r': 'rook',
        'q': 'queen',
    }

    const FENtoGrid = () => {

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
    }, [])
}

export default Chessboard