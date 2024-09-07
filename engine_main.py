import chess
import random
import re
import opening_pull
import Compute

class engine_main(opening_pull.opening_pull):
    def __init__(self, color, move):
        self.color = color  # 0 for white, 1 for black
        self.board = chess.Board()
        self.move_sequence = []
        super().__init__(color, move)
        if len(move) % 2 == color:
            p = self.query(move)
            if p is None:
                # If lichess is not responding or out of theory
                self.make_move()
            else:
                #Move from the opening theory
                self.push_move(p)

    # Push the move onto the chess board
    def push_move(self, move):
        try:
            self.board.push_uci(move)  # Push the move in UCI format
            self.move_sequence.append(move)  # Append move to the move_sequence
            print(f"Move pushed: {move}")
        except Exception as e:
            print(f"Invalid move: {move}, error: {e}")

    def make_move(self):
        legal_moves = list(self.board.legal_moves)
        s = self.query(self.move_sequence)  # Query opening database with current sequence
        if s == "":
            if legal_moves:
                # Compute move using engine (placeholder for real compute logic)
                print(random.choice(legal_moves))
                chosen_move = random.choice(legal_moves)  # For now, pick random legal move for engine
                self.move_sequence.append(chosen_move.uci())  # Append the UCI string of the move
                self.board.push(chosen_move)
                print(f"Engine made move: {chosen_move.uci()}")
            else:
                print("No legal moves available.")
        else:
            self.move_sequence.append(s)
            self.board.push_uci(s)
            print(f"Engine made move from opening theory: {s}")

    def player_move(self):
        while True:
            try:
                player_move = input("Enter your move in UCI format (e.g., e2e4): ")
                self.board.push_uci(player_move)
                self.move_sequence.append(player_move)  # Append player's move to move_sequence
                print(f"Player made move: {player_move}")
                break
            except Exception as e:
                print(f"Invalid move: {player_move}. Try again.")

    def query(self, move_sequence):
        result = super().query(move_sequence)  # Query the opening from opening_pull
        if result is None:
            print("No opening found or query failed.")
            return None
        return result  # Return from tablebase or opening cache

    def print_board(self):
        print(self.board)

# Example Test
color = 0  # Assume the engine plays white
move_sequence = []  # Empty at start of the game
engine = engine_main(color, move_sequence)

# Main loop for alternating between engine and player moves
while not engine.board.is_game_over():
    engine.print_board()
    
    # Player's turn
    if engine.board.turn == chess.BLACK:
        engine.player_move()  # Let the player (black) make a move
    
    # Engine's turn
    else:
        engine.make_move()  # Let the engine (white) make a move
