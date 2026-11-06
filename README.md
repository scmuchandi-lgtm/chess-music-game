# Chess Music Game

A browser-based chess game that allows users to play against a computer opponent while listening to their favorite music.

The application combines chess gameplay and a music player in a single interface, making it possible to enjoy music while playing chess.

## Features

### Chess Game
- Play chess against the computer.
- Stockfish chess engine for computer moves.
- Multiple difficulty levels.
- Drag-and-drop chess pieces.
- Automatic validation of legal moves.
- Check, checkmate, and draw detection.
- Undo moves.
- Flip the chessboard.
- Display move history in PGN format.

### Music Player
- Upload and play audio files from your device.
- Play and pause songs.
- Skip to the next or previous song.
- Adjust volume.
- Seek to any position in a song.
- View and select songs from a playlist.
- Automatically play the next song.

## Technologies Used

| Technology | Purpose |
|---|---|
| HTML5 | Website structure |
| CSS3 | Styling and responsive layout |
| JavaScript | Game logic and music player |
| Chess.js | Chess rules and move validation |
| Chessboard.js | Interactive chessboard |
| Stockfish | Computer chess engine |
| Web Audio/HTML5 Audio | Audio playback |

## Project Structure

```text
chess-music-game/
├── index.html
├── style.css
├── script.js
├── img/
│   └── chesspieces/
│       └── [chess piece images]
└── README.md
```

## How to Run

1. Clone the repository:

   ```bash
   git clone git@github.com:scmuchandi-lgtm/chess-music-game.git
   ```

2. Open the project folder in Visual Studio Code.

3. Open `index.html` using the Live Server extension.

4. Wait for the chess engine to load.

5. Start playing chess and select music files from your device.

**Note:** An internet connection is required to load the external chess libraries and Stockfish engine.

## How to Play

1. Select your preferred difficulty level.
2. Move chess pieces using drag and drop.
3. The computer responds using Stockfish.
4. Use **New Game** to restart.
5. Use **Undo Move** to take back moves.
6. Use **Flip Board** to change your playing side.
7. Select audio files to create your music playlist.

## Future Improvements

- Improved chess engine difficulty balancing.
- Better chessboard themes and animations.
- Chess timers and game statistics.
- Save and resume games.
- Improved music playlist management.
- Mobile-friendly interface.
- Fully offline gameplay.

## Author

**scmuchandi-lgtm**

GitHub: https://github.com/scmuchandi-lgtm

## License

No license has been specified yet.
