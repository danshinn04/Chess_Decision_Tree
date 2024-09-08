# NOTE: THIS IS NOT FINISHED; The Engine part is complete but the neural network is still work in progress!
# Part I 
# Chess Engine with Minimax Alpha-Beta Pruning and Opening Book

This chess engine project implements an advanced AI player using Minimax Alpha-Beta Pruning, enhanced with various heuristic techniques. It also incorporates an opening book retrieval system to improve early-game play using historical game data from a Lichess API. The engine can be used to simulate chess games, evaluate board positions, and play against a human opponent.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [File Descriptions](#file-descriptions)
- [Algorithm Details](#algorithm-details)
  - [Minimax with Alpha-Beta Pruning](#minimax-with-alpha-beta-pruning)
  - [Opening Book](#opening-book)
  - [Heuristics](#heuristics)
- [Contributing](#contributing)
- [License](#license)

## Overview

This chess engine simulates real-time chess games with the following components:
- **Minimax Algorithm with Alpha-Beta Pruning** for efficient move decision-making.
- **Opening Book Integration** via the Lichess Masters database, providing the engine with optimal early-game strategies.
- **Heuristic Board Evaluation** to assess and score chess positions based on various positional factors.

## Features

- **Minimax Alpha-Beta Pruning**: Implements efficient move searching with several optimizations.
- **Opening Book Retrieval**: Queries a Lichess API to access opening moves played by grandmasters in master-level games.
- **Heuristic Evaluation**: Evaluates board positions based on material, mobility, pawn structure, King Safety, and more.
- **Move Ordering and Pruning Techniques**: Includes enhancements such as killer move heuristic, null move pruning, and quiescence search.

## Installation

1. Clone this repository:
   git clone https://github.com/danshinn04/chess-engine.git
2. Install dependencies:
   pip install -r requirements.txt
3. Run
   python engine_main.py on Terminal

## File Descriptions

### `engine_main.py`
This is the primary file that controls the chess game simulation. It manages the main game loop and integrates both the opening book (`opening_pull.py`) and the Minimax search engine (`Minimax_Alphabeta_Prune.py`). It evaluates the current game state and determines the best move based on opening theory or search algorithms.

Key functions:
- **`make_move()`**: Uses the Minimax Alpha-Beta Pruning algorithm to find the best move. If the game is still in the opening phase, the engine consults the opening book to retrieve master-level moves.
- **`player_move()`**: Handles user input for making moves during a game.
- **`push_move()`**: Pushes a move onto the board and updates the move sequence.
- **`query()`**: Queries the opening book based on the move sequence and retrieves suggested opening moves from the Lichess Masters database.
- **`print_board()`**: Displays the current chess board in the console.

### `Minimax_Alphabeta_Prune.py`
This file contains the implementation of the **Minimax Algorithm** with several optimizations, including:
- **Alpha-Beta Pruning**: Reduces the number of nodes evaluated in the game tree, speeding up decision-making.
- **Move Ordering**: Orders moves by importance to improve the efficiency of Alpha-Beta Pruning.
- **Null Move Pruning**: Implements null move pruning to skip unpromising branches.
- **Quiescence Search**: Searches beyond the regular depth for capturing moves to avoid the horizon effect.
- **Killer Move Heuristic**: Prioritizes moves that were successful at similar depths in the past.
- **Transposition Tables**: Caches and reuses results from previously evaluated positions to avoid redundant calculations.

### `Compute.py`
The `Compute.py` file handles the heuristic evaluation of chess board positions. It assesses a variety of factors that contribute to a player's advantage:
- **Piece-Square Tables**: Provides positional bonuses or penalties for pieces based on their location on the board. These tables are flipped for black to reflect board symmetry.
- **Pawn Structure**: Evaluates pawn formations, including passed pawns, isolated pawns, and doubled pawns.
- **King Safety**: Assesses the king’s safety based on the presence of a pawn shield and overall vulnerability to attacks.
- **Mobility**: Evaluates how many legal moves are available for each player, rewarding greater mobility.
- **Bishop Pair Bonus**: Rewards having both bishops, which is a significant advantage in open positions.
- **Rook Activity**: Rewards rooks on open files and on the opponent's seventh rank.
- **Connected Rooks**: Gives a bonus when rooks are placed on the same rank or file and can support each other.
- **Outpost Bonus**: Rewards knights placed on outposts—squares that are protected by pawns and cannot be easily attacked by enemy pawns.

### `opening_pull.py`
This file is responsible for querying and caching opening book moves from the Lichess Masters database. It uses the following:
- **`query()`**: Queries the Lichess API for opening moves based on the current game sequence. It returns the best available move or `None` if no valid moves are found.
- **`save_cache()`**: Caches opening moves to avoid querying the API repeatedly for the same position. The cache is saved locally and used for future lookups.

## Algorithm Details

### Minimax with Alpha-Beta Pruning
The **Minimax Algorithm** is a decision-making process used to evaluate possible game states. It assumes that both players will make optimal moves and attempts to minimize the possible loss for a worst-case scenario. **Alpha-Beta Pruning** improves this algorithm by eliminating branches of the game tree that don't need to be explored, speeding up the search without affecting the outcome.

### Opening Book
The engine uses an **opening book** to reference strong, historically validated opening moves from the Lichess Masters database. During the initial phase of the game, the engine will use this book to make optimal moves without needing to rely on the Minimax algorithm. If no moves are found in the database or the game deviates from opening theory, the engine will revert to the Minimax search.

### Heuristics
The engine uses various heuristics implemented in `Compute.py` to evaluate positions:
- **Piece-Square Tables**: Rewards certain positions based on piece placement.
- **Pawn Structure**: Evaluates the quality of a player's pawns, penalizing doubled, isolated, or backward pawns, and rewarding passed pawns.
- **King Safety**: Checks for a solid pawn structure around the king to ensure its safety.
- **Mobility**: Rewards having a higher number of legal moves.
- **Bishop Pair Bonus**: Provides a bonus for controlling both bishops, which are powerful in open games.
- **Rook Activity**: Encourages placing rooks on open files or the seventh rank.
- **Connected Rooks**: Rewards rooks that are connected and working together on the same rank or file.
- **Outpost Bonus**: Provides a bonus for knights placed on strong outpost squares where they are difficult to challenge.
