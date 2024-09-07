import chess

# Constants for piece values
PIECE_VALUES = {
    chess.PAWN: 100,
    chess.KNIGHT: 320,
    chess.BISHOP: 330,
    chess.ROOK: 500,
    chess.QUEEN: 900,
    chess.KING: 20000
}

# Piece-square tables for WHITE Ideas for updating it would be depending on whether it is middlegame or endgame to change the evaluation of table.
PAWN_TABLE_WHITE = [
    0, 0, 0, 0, 0, 0, 0, 0,
    35, 35, 35, 50, 50, 35, 35, 35,
    35, 25, 35, 45, 45, 35, 25, 35,
    0, 20, 30, 40, 40, 30, 20, 0,
    0, 10, 25, 30, 30, -5, 0, 0,
    0, 0, 0, 20, 20, -15, 0, 0,
    0, 0, 0, 0, 0, 10, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
]

BISHOP_TABLE_WHITE = [
    -20, -10, -10, -10, -10, -10, -10, -20,
    -10, 5, 0, 0, 0, 0, 5, -10,
    -10, 10, 10, 10, 10, 10, 10, -10,
    -10, 20, 10, 10, 10, 10, 20, -10,
    -10, 0, 15, 10, 10, 15, 0, -10,
    -10, 0, 5, 10, 10, 5, 0, -10,
    -10, 10, 0, 0, 0, 0, 10, -10,
    -20, -10, -10, -10, -10, -10, -10, -20
]

KNIGHT_TABLE = [
    -50, -40, -30, -30, -30, -30, -40, -50,
    -40, 20, 0, 0, 0, 0, 20, -40,
    10, 15, 30, 25, 25, 30, 15, 10,
    15, 5, 25, 20, 20, 25, 5, 15,
    20, 0, 15, 20, 20, 15, 0, 20,
    -30, 5, 10, 15, 15, 10, 5, -30,
    -40, -20, 0, 5, 5, 0, -20, -40,
    -50, -40, -30, -30, -30, -30, -40, -50
]

# Flipping piece-square tables for black (mirroring the table for white)
def flip_table(table):
    """Flips a piece-square table for black (mirror effect)."""
    return table[::-1]

PAWN_TABLE_BLACK = flip_table(PAWN_TABLE_WHITE)
KNIGHT_TABLE_BLACK = flip_table(KNIGHT_TABLE)
BISHOP_TABLE_BLACK = flip_table(BISHOP_TABLE_WHITE)
# Function to get piece-square value based on color
def piece_square_value(piece_type, square, color):
    if piece_type == chess.PAWN:
        return PAWN_TABLE_WHITE[square] if color == chess.WHITE else PAWN_TABLE_BLACK[square]
    if piece_type == chess.KNIGHT:
        return KNIGHT_TABLE[square] if color == chess.WHITE else KNIGHT_TABLE_BLACK[square]
    if piece_type == chess.BISHOP:
        return BISHOP_TABLE_WHITE[square] if color == chess.WHITE else BISHOP_TABLE_BLACK[square]
    # Add similar tables for other pieces
    return 0

class Compute:
    def __init__(self):
        pass

    def evaluate_position(self, board, color):
        if color == 0:
            color = True #White
        else:
            color = False # Black
        score = 0
        score += self.material_evaluation(board, color)
        score += self.pawn_structure(board, color)
        score += self.king_safety(board, color)
        score += self.mobility_evaluation(board, color)
        score += self.bishop_pair_bonus(board, color)
        score += self.rook_activity(board, color)
        score += self.connected_rooks(board, color)
        score += self.outpost_bonus(board, color)
        score -= self.pawn_structure(board, not color)
        score -= self.king_safety(board, not color)
        score -= self.mobility_evaluation(board, not color)
        score -= self.bishop_pair_bonus(board, not color)
        score -= self.rook_activity(board, not color)
        score -= self.connected_rooks(board, not color)
        score -= self.outpost_bonus(board, not color)
        return score

    def material_evaluation(self, board, color):
        score = 0
        for square in chess.SQUARES:
            piece = board.piece_at(square)
            if piece:
                value = PIECE_VALUES[piece.piece_type]
                positional_value = piece_square_value(piece.piece_type, square, piece.color)
                
                if piece.color == color:
                    score += value + positional_value
                else:
                    score -= value + positional_value
        return score

    def pawn_structure(self, board, color):
        score = 0
        pawns = board.pieces(chess.PAWN, color)
        for pawn in pawns:
            file = chess.square_file(pawn)
            rank = chess.square_rank(pawn)

            # Check for doubled pawns
            same_file_pawns = [sq for sq in pawns if chess.square_file(sq) == file]
            if len(same_file_pawns) > 1:
                score -= 50  # Penalty for doubled pawns

            # Check for isolated pawns (no adjacent pawns)
            adjacent_files = [file - 1, file + 1]
            adjacent_pawns = [sq for sq in pawns if chess.square_file(sq) in adjacent_files]
            if not adjacent_pawns:
                score -= 50  # Penalty for isolated pawns
            
            # Check for passed pawns
            passed = True
            for sq in board.pieces(chess.PAWN, not color):
                if chess.square_file(sq) == file and (
                    (color == chess.WHITE and chess.square_rank(sq) > rank) or
                    (color == chess.BLACK and chess.square_rank(sq) < rank)
                ):
                    passed = False
                    break
            if passed:
                score += 100  # Bonus for passed pawns

            # Check for backward pawns
            backward = True
            for adj_file in adjacent_files:
                adjacent_pawn = board.piece_at(chess.square(adj_file, rank - 1 if color == chess.WHITE else rank + 1))
                if adjacent_pawn and adjacent_pawn.piece_type == chess.PAWN and adjacent_pawn.color == color:
                    backward = False
                    break
            if backward:
                score -= 30  # Penalty for backward pawns
        
        return score

    def king_safety(self, board, color):
        score = 0
        king_square = board.king(color)

        # Check for pawn shield around the king
        king_file = chess.square_file(king_square)
        king_rank = chess.square_rank(king_square)
        
        if color == chess.WHITE:
            shield_squares = [chess.square(king_file - 1, king_rank - 1),
                              chess.square(king_file, king_rank - 1),
                              chess.square(king_file + 1, king_rank - 1)]
        else:
            shield_squares = [chess.square(king_file - 1, king_rank + 1),
                              chess.square(king_file, king_rank + 1),
                              chess.square(king_file + 1, king_rank + 1)]
        
        for sq in shield_squares:
            if board.piece_at(sq) is None or board.piece_at(sq).piece_type != chess.PAWN:
                score -= 50  # Penalty for missing pawn shield

        # Penalty for an open file near the king
        for file_offset in [-1, 0, 1]:
            if 0 <= king_file + file_offset < 8:
                if not any(board.piece_at(chess.square(king_file + file_offset, rank)) == chess.PAWN
                           for rank in range(king_rank - 1, king_rank + 2)):
                    score -= 30
        
        return score

    def mobility_evaluation(self, board, color):
        return len(list(board.legal_moves))

    def bishop_pair_bonus(self, board, color):
        """
        Bonus for owning both bishops, which is considered an advantage in open positions.
        """
        if len(board.pieces(chess.BISHOP, color)) == 2:
            return 30  # Bishop pair bonus
        return 0

    def rook_activity(self, board, color):
        score = 0
        for square in board.pieces(chess.ROOK, color):
            if board.is_open_file(chess.square_file(square)):
                score += 50  #open file
            if chess.square_rank(square) == 7 and color == chess.WHITE or chess.square_rank(square) == 0 and color == chess.BLACK:
                score += 30  # Rook on 7th or 8th rank
        return score

    def connected_rooks(self, board, color):
        """
        Bonus for connected rooks on the same rank or file.
        """
        rooks = list(board.pieces(chess.ROOK, color))
        if len(rooks) == 2:
            if chess.square_file(rooks[0]) == chess.square_file(rooks[1]) or chess.square_rank(rooks[0]) == chess.square_rank(rooks[1]):
                return 30  # Rook connection
        return 0

    def outpost_bonus(self, board, color):
        """
        Bonus for knights or bishops placed on outposts (squares that cannot be attacked by enemy pawns).
        """
        score = 0
        outposts = [chess.square_file(i) for i in range(8)]
        for square in board.pieces(chess.KNIGHT, color):
            file = chess.square_file(square)
            rank = chess.square_rank(square)
            if color == chess.WHITE and rank >= 4:
                if not any(board.piece_at(chess.square(file, r)) == chess.PAWN and board.piece_at(chess.square(file, r)).color != color for r in range(rank, 8)):
                    score += 40  # Bonus for knights on outposts
            elif color == chess.BLACK and rank <= 3:
                if not any(board.piece_at(chess.square(file, r)) == chess.PAWN and board.piece_at(chess.square(file, r)).color != color for r in range(0, rank + 1)):
                    score += 25  # Bonus for knights on outposts

        for square in board.pieces(chess.BISHOP, color):
            file = chess.square_file(square)
            rank = chess.square_rank(square)
            if color == chess.WHITE and rank >= 4:
                if not any(board.piece_at(chess.square(file, r)) == chess.PAWN and board.piece_at(chess.square(file, r)).color != color for r in range(rank, 8)):
                    score += 25  
            elif color == chess.BLACK and rank <= 3:
                if not any(board.piece_at(chess.square(file, r)) == chess.PAWN and board.piece_at(chess.square(file, r)).color != color for r in range(0, rank + 1)):
                    score += 10  

        return score
