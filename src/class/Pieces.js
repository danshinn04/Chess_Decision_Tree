

import {white} from '../assets/whitePieces/WhiteExport'
import {black} from '../assets/blackPieces/BlackExport'

export class Pieces {

    constructor(color, piece) {
        const pieceColor = color === 'white' ? white : black;


        // Choose the piece based on the number provided (1-6)
        switch(piece) {
            case 1:
                this.piece = [1, color, pieceColor.King];
                break;
            case 2:
                this.piece = [2, color, pieceColor.Pawn];
                break;
            case 3:
                this.piece = [3, color, pieceColor.Knight];
                break;
            case 4:
                this.piece = [4, color, pieceColor.Bishop];
                break;
            case 5:
                this.piece = [5, color, pieceColor.Rook];
                break;
            case 6:
                this.piece = [6, color, pieceColor.Queen];
                break;
            default:
                throw new Error("Invalid piece number. Must be between 1 and 6.");
        }
    }

}