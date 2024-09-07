import chess
import Compute

class TranspositionTable:
    def __init__(self):
        self.table = {}

    def lookup(self, board):
        """Looks up the board in the transposition table using FEN."""
        board_fen = board.fen()
        return self.table.get(board_fen, None)

    def store(self, board, score, depth, flag):
        """Stores the board evaluation in the transposition table using FEN."""
        board_fen = board.fen()
        self.table[board_fen] = {
            'score': score,
            'depth': depth,
            'flag': flag
        }

class minimax_alphabeta_prune:
    def __init__(self, depth, compute):
        self.depth = depth
        self.compute = compute
        self.transposition_table = TranspositionTable()

    def move_ordering(self, board, color):
        """
        Order moves to improve alpha-beta pruning efficiency.
        Sort captures and checks first, followed by quiet moves.
        """
        moves = list(board.legal_moves)
        ordered_moves = []
        quiet_moves = []

        for move in moves:
            board.push(move)
            if board.is_check() or board.is_capture(move):
                ordered_moves.append(move)  # Prioritize checks and captures
            else:
                quiet_moves.append(move)  # Quiet moves
            board.pop()

        return ordered_moves + quiet_moves

    def quiescence_search(self, board, alpha, beta, color):
        """
        Quiescence search to avoid the horizon effect by extending captures and checks.
        """
        stand_pat = self.compute.evaluate_position(board, color)

        if stand_pat >= beta:
            return beta
        if alpha < stand_pat:
            alpha = stand_pat

        for move in board.legal_moves:
            if not board.is_capture(move):
                continue  # Only search captures in quiescence search
            board.push(move)
            score = -self.quiescence_search(board, -beta, -alpha, not color)
            board.pop()

            if score >= beta:
                return beta
            if score > alpha:
                alpha = score

        return alpha

    def alphabeta(self, board, depth, alpha, beta, maximizing_player, color):
        """
        Alpha-beta pruning function with move ordering, quiescence search, and transposition table lookup using FEN.
        """

        # Transposition Table Lookup
        tt_entry = self.transposition_table.lookup(board)
        if tt_entry is not None and tt_entry['depth'] >= depth:
            if tt_entry['flag'] == 'exact':
                return tt_entry['score']
            elif tt_entry['flag'] == 'lowerbound':
                alpha = max(alpha, tt_entry['score'])
            elif tt_entry['flag'] == 'upperbound':
                beta = min(beta, tt_entry['score'])
            if alpha >= beta:
                return tt_entry['score']

        if depth == 0:
            return self.quiescence_search(board, alpha, beta, color)

        legal_moves = self.move_ordering(board, color)

        if maximizing_player:
            max_eval = float('-inf')
            for move in legal_moves:
                board.push(move)
                eval = self.alphabeta(board, depth - 1, alpha, beta, False, color)
                board.pop()
                max_eval = max(max_eval, eval)
                alpha = max(alpha, eval)
                if beta <= alpha:
                    break  # Beta cutoff

            # Store the result in the transposition table
            if max_eval <= alpha:
                self.transposition_table.store(board, max_eval, depth, 'upperbound')
            elif max_eval >= beta:
                self.transposition_table.store(board, max_eval, depth, 'lowerbound')
            else:
                self.transposition_table.store(board, max_eval, depth, 'exact')

            return max_eval

        else:
            min_eval = float('inf')
            for move in legal_moves:
                board.push(move)
                eval = self.alphabeta(board, depth - 1, alpha, beta, True, color)
                board.pop()
                min_eval = min(min_eval, eval)
                beta = min(beta, eval)
                if beta <= alpha:
                    break  # Alpha cutoff

            # Store the result in the transposition table
            if min_eval <= alpha:
                self.transposition_table.store(board, min_eval, depth, 'upperbound')
            elif min_eval >= beta:
                self.transposition_table.store(board, min_eval, depth, 'lowerbound')
            else:
                self.transposition_table.store(board, min_eval, depth, 'exact')

            return min_eval

    def get_best_move(self, board, color):
        """
        Get the best move from the current board position using alpha-beta pruning.
        """
        best_move = None
        best_value = float('-inf') if color == chess.WHITE else float('inf')

        for move in self.move_ordering(board, color):
            board.push(move)
            board_value = self.alphabeta(board, self.depth - 1, float('-inf'), float('inf'), False, color)
            board.pop()

            if (color == chess.WHITE and board_value > best_value) or (color == chess.BLACK and board_value < best_value):
                best_value = board_value
                best_move = move

        return best_move
