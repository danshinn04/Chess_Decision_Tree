import chess
import random
import re
import opening_pull
import Compute

class opening_tree(opening_pull.opening_pull):
    def __init__(self, color, move):
        self.color = color  # 0 for white, 1 for black
        self.board = chess.Board()
        super().__init__(color, move)
        if len(move) % 2 == color:
            p = self.query(move)
            if p is None:
                # If lichess is crappy or out of theory
                self.make_move()
            else:
                #Move from the opening theory
                self.push_move(p)
    
    # Push the move onto the chess board
    def push_move(self, move):
        try:
            # Push move in UCI format onto the board, which looks like e2e4 stuff or Ng1f3 will look like g1f3
            self.board.push_uci(move)
            print(f"Move pushed: {move}")
        except Exception as e:
            print(f"Invalid move: {move}, error: {e}")
    
    def make_move(self):
        
        if legal_moves:
            chosen_move = random.choice(legal_moves)  # Randomly pick a move
            self.board.push(chosen_move)  # Push the move onto the board
            print(f"Engine made move: {chosen_move.uci()}")
        else:
            print("No legal moves available.")
    
    # Overriding query method to interact with the opening database
    def query(self, move_sequence):
        result = super().query(move_sequence)  # Call the parent query method from opening_pull
        if result is None:
            print("No opening found or query failed.")
            return None
        return result  # Return the optimal move from opening theory

# Example of usage
color = 0  # Let's assume the engine plays white
move_sequence = []  # Empty at start of the game

# Initialize the opening tree
engine = opening_tree(color, move_sequence)

# Simulate some moves
engine.push_move('e2e4')
engine.push_move('e7e5')
engine.make_move()