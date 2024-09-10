import chess
import random
import re
import opening_pull
import Compute
from Minimax_Alphabeta_Prune import minimax_alphabeta_prune

class engine_main(opening_pull.opening_pull):
    def __init__(self, color, move):
        super().__init__(color, move)
        self.color = color  # 0 for white, 1 for black
        self.board = chess.Board()
        self.move_sequence = []
        self.compute = Compute.Compute()
        self.search_engine = minimax_alphabeta_prune(depth=4, compute=self.compute)  # Initialize Minimax with Alpha-Beta pruning
        self.querycondition = True

        if len(move) % 2 == color:
            p = self.query(move)
            if p is None:
                self.make_move()
            else:
                self.push_move(p)

    def push_move(self, move):
        try:
            self.board.push_uci(move)
            self.move_sequence.append(move)
            print(f"Move pushed: {move}")
        except Exception as e:
            print(f"Invalid move: {move}, error: {e}")

    def make_move(self):
        legal_moves = list(self.board.legal_moves)
        if self.querycondition:
            opening_move = self.query(self.move_sequence)
            if opening_move:
                self.move_sequence.append(opening_move)
                self.board.push_uci(opening_move)
                print(f"Engine made move from opening theory: {opening_move}")
                return

        if legal_moves:
            self.querycondition = False  # Turn off opening book after deviating
            chosen_move = self.search_engine.get_best_move(self.board, chess.WHITE if self.color == 0 else chess.BLACK)
            self.move_sequence.append(chosen_move.uci())
            self.board.push(chosen_move)
            print(f"Engine made move: {chosen_move.uci()}")
        else:
            print("No legal moves available.")

    def player_move(self):
        while True:
            try:
                player_move = input("Enter your move in UCI format (e.g., e2e4): ")
                self.board.push_uci(player_move)
                self.move_sequence.append(player_move)
                print(f"Player made move: {player_move}")
                break
            except Exception as e:
                print(f"Invalid move: {player_move}. Try again.")

    def query(self, move_sequence):
        result = super().query(move_sequence)
        if result is None:
            print("No opening found or query failed.")
            return None
        return result

    def print_board(self):
        print(self.board)

# Example usage

if __name__ == "__main__":
    color = 0 
    engine = engine_main(color, [])

    while not engine.board.is_game_over():
        engine.print_board()
        if engine.board.turn == chess.BLACK:
            engine.player_move()
        else:
            engine.make_move()
