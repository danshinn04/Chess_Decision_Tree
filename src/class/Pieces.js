

import {white} from '../assets/whitePieces/WhiteExport'
import {black} from '../assets/blackPieces/BlackExport'

export class Pieces {

    constructor(color, piece) {
        const pieceColor = color === 'white' ? white : black;


        // Choose the piece based on the number provided piece name
        switch(piece) {
            case 'king':
                this.piece = ['king', color, pieceColor.King];
                break;
            case 'pawn':
                this.piece = ['pawn', color, pieceColor.Pawn];
                break;
            case 'knight':
                this.piece = ['knight', color, pieceColor.Knight];
                break;
            case 'bishop':
                this.piece = ['bishop', color, pieceColor.Bishop];
                break;
            case 'rook':
                this.piece = ['rook', color, pieceColor.Rook];
                break;
            case 'queen':
                this.piece = ['queen', color, pieceColor.Queen];
                break;
            }
    }

}