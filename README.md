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
- **Heuristic Evaluation**: Evaluates board positions based on material, mobility, pawn structure, and more.
- **Move Ordering and Pruning Techniques**: Includes enhancements such as killer move heuristic, null move pruning, and quiescence search.

## Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/danshinn04/chess-engine.git
