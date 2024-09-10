import chess
import chess.pgn
import chess.engine
import random
import numpy as np

class PGNProcessor:
    def __init__(self, pgn_file, engine_path, depth=8):
        self.pgn_file = pgn_file
        self.engine_path = engine_path
        self.engine = chess.engine.SimpleEngine.popen_uci(engine_path)
        self.depth = depth

    def load_pgn(self):
        """Loads the PGN file and returns the games."""
        with open(self.pgn_file) as f:
            while True:
                game = chess.pgn.read_game(f)
                if game is None:
                    break
                yield game

    def random_positions(self, games, num_positions=1000):
        """Extracts random positions from the given games."""
        positions = []
        for game in games:
            board = game.board()
            moves = list(game.mainline_moves())
            for move in moves:
                board.push(move)
                if random.random() < 0.01:  # 1% chance to grab this position
                    positions.append(board.copy())
        return random.sample(positions, min(num_positions, len(positions)))

    def board_to_vector(self, board):
        """Converts a chess board to a vector representation."""
        piece_map = board.piece_map()
        vector = np.zeros(64, dtype=int)
        for square, piece in piece_map.items():
            piece_value = self.piece_to_int(piece)
            vector[square] = piece_value
        return vector

    def piece_to_int(self, piece):
        """Encodes a chess piece to an integer."""
        piece_type = piece.piece_type
        color_offset = 6 if piece.color == chess.BLACK else 0
        return piece_type + color_offset

    def move_to_vector(self, move):
        """Converts a move into a vector representation (start square, end square)."""
        return np.array([move.from_square, move.to_square], dtype=int)

    def get_stockfish_eval(self, board):
        """Gets the top 3 moves from Stockfish at the given depth."""
        with self.engine.analysis(board, chess.engine.Limit(depth=self.depth)) as analysis:
            top_moves = []
            for info in analysis:
                if 'pv' in info:
                    top_moves.append(info['pv'][0])
                if len(top_moves) == 3:
                    break
            return top_moves

    def exclude_high_variance_positions(self, board, top_moves):
        """Excludes positions where the variance between the top 3 Stockfish moves is too large."""
        if len(top_moves) < 3:
            return True

        scores = []
        for move in top_moves:
            board.push(move)
            score = self.engine.analyse(board, chess.engine.Limit(depth=self.depth))["score"].relative.score(mate_score=10000)
            scores.append(score)
            board.pop()

        variance = np.var(scores)
        return variance > 69

    def generate_training_data(self, num_positions=1000):
        """Generates training data with board vectors, move vectors, and Stockfish evaluations."""
        training_data = []
        games = self.load_pgn()
        positions = self.random_positions(games, num_positions)

        for board in positions:
            top_moves = self.get_stockfish_eval(board)
            if self.exclude_high_variance_positions(board, top_moves):
                continue

            board_vector = self.board_to_vector(board)
            move_vectors = [self.move_to_vector(move) for move in top_moves]
            training_data.append((board_vector, move_vectors))

        return training_data

    def save_training_data(self, training_data, output_file):
        """Saves the training data to a file."""
        np.save(output_file, training_data)

    def close(self):
        self.engine.quit()

# Main execution
if __name__ == "__main__":
    pgn_file = "lichess_elite_games.pgn"
    engine_path = "/path/to/stockfish"
    output_file = "training_data.npy"

    processor = PGNProcessor(pgn_file, engine_path)
    training_data = processor.generate_training_data(num_positions=1000)
    processor.save_training_data(training_data, output_file)
    processor.close()
