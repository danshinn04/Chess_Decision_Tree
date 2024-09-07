import chess
import random
import re
import opening_pull

class opening_tree(opening_pull.opening_pull):
    def __init__(self, color, move):

        if move is not None:
            move = encoder(move)

        super().__init__(color, move) # If engine is white, move will be none 
        self.database = []

        if color == 1: #Engine is white

            self.seed = random()

        
        else: 
            opening_black(move_sequence)
            # Engine is black

    def encoder(move):
        row_from, row_destination = move[0].lower(), move[2].lower()
        col_from, col_destination = move[1], move[3]

        encoding = ((ord(row_from) - ord('a')) * 8 + col_from, (ord(row_destination) - ord('a')) * 8 + col_destination)

    def opening_black(self, move_sequence):
        return None

    def opening_white(self, move_sequence):
        return None
