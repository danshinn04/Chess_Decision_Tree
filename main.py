import pygame
import chess
import os
from engine_main import engine_main

# Constants
WIDTH, HEIGHT = 512, 512
SQUARE_SIZE = WIDTH // 8
pygame.init()
WHITE = (240, 240, 240)
BLACK = (120, 120, 120)
HIGHLIGHT_COLOR = (255, 255, 0)
window = pygame.display.set_mode((WIDTH, HEIGHT))
pygame.display.set_caption("Chess Visualization")
PIECE_IMAGES = {}
PIECES_FOLDER = "C:/Users/Dan/Documents/GitHub/Chess_Decision_Tree/Pieces"

def load_images():
    """Loads chess piece images."""
    pieces = ['wp', 'wr', 'wn', 'wb', 'wq', 'wk', 'bp', 'br', 'bn', 'bb', 'bq', 'bk']
    for piece in pieces:
        image = pygame.image.load(os.path.join(PIECES_FOLDER, f'{piece}.png')).convert_alpha()
        # Scale each image to fit inside the square size, with better aspect ratio
        PIECE_IMAGES[piece] = pygame.transform.smoothscale(image, (SQUARE_SIZE, SQUARE_SIZE))

def draw_board():
    """Draws the chess board."""
    for row in range(8):
        for col in range(8):
            color = WHITE if (row + col) % 2 == 0 else BLACK
            pygame.draw.rect(window, color, pygame.Rect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))

def draw_pieces(board, dragged_piece=None, drag_pos=None):
    """Draws the chess pieces on the board based on the current board state."""
    for square in chess.SQUARES:
        piece = board.piece_at(square)
        if piece:
            piece_str = piece.symbol()
            piece_color = 'w' if piece.color == chess.WHITE else 'b'
            piece_type = piece_color + piece_str.lower()
            row = 7 - chess.square_rank(square)  # Invert row for correct rendering
            col = chess.square_file(square)
            if dragged_piece and square == dragged_piece:
                # Draw the dragged piece at the current mouse position
                window.blit(PIECE_IMAGES[piece_type], pygame.Rect(drag_pos[0] - SQUARE_SIZE // 2, drag_pos[1] - SQUARE_SIZE // 2, SQUARE_SIZE, SQUARE_SIZE))
            else:
                window.blit(PIECE_IMAGES[piece_type], pygame.Rect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE))

def highlight_square(row, col):
    """Highlights a square."""
    pygame.draw.rect(window, HIGHLIGHT_COLOR, pygame.Rect(col * SQUARE_SIZE, row * SQUARE_SIZE, SQUARE_SIZE, SQUARE_SIZE), 3)

def get_square_under_mouse():
    """Returns the chess square (file, rank) under the mouse cursor."""
    mouse_pos = pygame.mouse.get_pos()
    x, y = [int(v // SQUARE_SIZE) for v in mouse_pos]
    return chess.square(x, 7 - y)

def main():
    load_images()
    
    # Initialize the engine (1 for black)
    move_sequence = []  # Empty sequence at the start
    engine = engine_main(color=0, move=move_sequence)  # Engine plays black, change to 0 for white
    
    selected_square = None
    dragging_piece = None
    drag_position = None
    running = True

    while running:
        draw_board()
        draw_pieces(engine.board, dragged_piece=dragging_piece, drag_pos=drag_position)
        pygame.display.flip()

        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                # Select a piece to drag
                selected_square = get_square_under_mouse()
                if engine.board.piece_at(selected_square) and engine.board.turn == chess.WHITE:  # Only let white drag for now
                    dragging_piece = selected_square
                    drag_position = pygame.mouse.get_pos()  # Track the piece being dragged

            if event.type == pygame.MOUSEMOTION and dragging_piece is not None:
                # Update the drag position while dragging
                drag_position = pygame.mouse.get_pos()

            if event.type == pygame.MOUSEBUTTONUP and dragging_piece is not None:
                # Drop the piece
                target_square = get_square_under_mouse()
                move = chess.Move(dragging_piece, target_square)
                if move in engine.board.legal_moves:
                    engine.board.push(move)
                    engine.move_sequence.append(move.uci())  # Add the player's move
                    print(f"Player made move: {move.uci()}")
                    
                    # Let the engine respond only if it's the engine's turn
                    if engine.board.turn == chess.BLACK:  # Assuming the engine plays black
                        engine.make_move()

                # Reset dragging state
                dragging_piece = None
                drag_position = None
                selected_square = None

            if event.type == pygame.KEYDOWN:
                if event.key == pygame.K_r:
                    engine.board = chess.Board()  # Reset the board

        if dragging_piece is not None:
            # Highlight the square the piece was originally on
            col = chess.square_file(dragging_piece)
            row = 7 - chess.square_rank(dragging_piece)
            highlight_square(row, col)

    pygame.quit()

if __name__ == "__main__":
    main()
