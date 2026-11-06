let board = null;
const game = new Chess();

let playerColor = "white";
let stockfish = null;
let isEngineThinking = false;

const statusEl = document.getElementById("status");
const turnEl = document.getElementById("turn");
const pgnEl = document.getElementById("pgn");
const difficultyEl = document.getElementById("difficulty");

const audio = document.getElementById("audio");
const songInput = document.getElementById("songInput");
const playlistEl = document.getElementById("playlist");
const nowPlayingEl = document.getElementById("nowPlaying");
const timeInfoEl = document.getElementById("timeInfo");
const playPauseBtn = document.getElementById("playPauseBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const seekBar = document.getElementById("seekBar");
const volumeBar = document.getElementById("volumeBar");

let songs = [];
let currentSongIndex = -1;

function loadEngine() {
  const stockfishUrl = "https://cdnjs.cloudflare.com/ajax/libs/stockfish.js/10.0.2/stockfish.js";
  const workerCode = `importScripts("${stockfishUrl}");`;
  const workerBlob = new Blob([workerCode], { type: "application/javascript" });
  const workerUrl = URL.createObjectURL(workerBlob);

  stockfish = new Worker(workerUrl);

  stockfish.onerror = function () {
    isEngineThinking = false;
    statusEl.textContent = "Chess engine failed to load. Check your internet connection.";
  };

  stockfish.postMessage("uci");
  stockfish.postMessage("isready");

  stockfish.onmessage = function (event) {
    const line = typeof event.data === "string" ? event.data : "";

    if (line.startsWith("bestmove")) {
      const parts = line.split(" ");
      const bestMove = parts[1];

      isEngineThinking = false;

      if (bestMove && bestMove !== "(none)") {
        const move = game.move({
          from: bestMove.slice(0, 2),
          to: bestMove.slice(2, 4),
          promotion: "q"
        });

        if (move) {
          board.position(game.fen());
          updateStatus();
        }
      }
    }
  };
}

function updateStatus() {
  let status = "";

  if (game.in_checkmate()) {
    const winnerColor = game.turn() === "w" ? "black" : "white";
    const winner = winnerColor === playerColor ? "You" : "Computer";
    status = `${winner} won by checkmate.`;
  } else if (game.in_draw()) {
    status = "Draw.";
  } else {
    status = game.turn() === "w" ? "White to move" : "Black to move";

    if (game.in_check()) {
      status += " — Check";
    }
  }

  statusEl.textContent = status;
  turnEl.textContent = game.turn() === "w" ? "White" : "Black";
  pgnEl.textContent = game.pgn() || "-";
}

function requestEngineMove() {
  if (game.game_over() || isEngineThinking) return;

  isEngineThinking = true;

  const moveTime = difficultyEl.value;
  stockfish.postMessage("position fen " + game.fen());
  stockfish.postMessage("go movetime " + moveTime);
}

function makeEngineMove() {
  if (game.game_over()) return;
  requestEngineMove();
}

function onDragStart(source, piece) {
  if (game.game_over()) return false;
  if (isEngineThinking) return false;

  if (playerColor === "white" && piece.startsWith("b")) return false;
  if (playerColor === "black" && piece.startsWith("w")) return false;

  if (playerColor === "white" && game.turn() !== "w") return false;
  if (playerColor === "black" && game.turn() !== "b") return false;
}

function onDrop(source, target) {
  const move = game.move({
    from: source,
    to: target,
    promotion: "q"
  });

  if (move === null) return "snapback";

  updateStatus();
  window.setTimeout(makeEngineMove, 250);
}

function onSnapEnd() {
  board.position(game.fen());
}

function newGame() {
  game.reset();
  board.start();
  updateStatus();

  if (playerColor === "black") {
    window.setTimeout(makeEngineMove, 300);
  }
}

function formatTime(seconds) {
  if (isNaN(seconds)) return "00:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function renderPlaylist() {
  playlistEl.innerHTML = "";

  songs.forEach((song, index) => {
    const li = document.createElement("li");
    li.textContent = song.name;

    if (index === currentSongIndex) {
      li.classList.add("active");
    }

    li.addEventListener("click", () => loadSong(index, true));
    playlistEl.appendChild(li);
  });
}

function loadSong(index, autoPlay = false) {
  if (!songs.length || index < 0 || index >= songs.length) return;

  currentSongIndex = index;
  audio.src = songs[index].url;
  nowPlayingEl.textContent = songs[index].name;

  renderPlaylist();

  if (autoPlay) {
    audio.play();
    playPauseBtn.textContent = "Pause";
  } else {
    playPauseBtn.textContent = "Play";
  }
}

board = Chessboard("board", {
  draggable: true,
  position: "start",
  pieceTheme: "img/chesspieces/{piece}.png",
  onDragStart,
  onDrop,
  onSnapEnd
});

loadEngine();
updateStatus();

document.getElementById("newGameBtn").addEventListener("click", newGame);

document.getElementById("undoBtn").addEventListener("click", () => {
  if (isEngineThinking) return;

  if (game.history().length >= 1) game.undo();
  if (game.history().length >= 1) game.undo();

  board.position(game.fen());
  updateStatus();
});

document.getElementById("flipBtn").addEventListener("click", () => {
  board.flip();
  playerColor = playerColor === "white" ? "black" : "white";
  newGame();
});

document.getElementById("hintBtn").addEventListener("click", () => {
  if (game.game_over() || isEngineThinking) return;

  statusEl.textContent = "Engine is calculating best move...";
  requestEngineMove();
});

songInput.addEventListener("change", (e) => {
  const files = Array.from(e.target.files);

  const newSongs = files.map((file) => ({
    name: file.name,
    url: URL.createObjectURL(file)
  }));

  songs = [...songs, ...newSongs];

  if (currentSongIndex === -1 && songs.length) {
    loadSong(0, false);
  } else {
    renderPlaylist();
  }

  songInput.value = "";
});

playPauseBtn.addEventListener("click", () => {
  if (!songs.length) return;

  if (audio.paused) {
    audio.play();
    playPauseBtn.textContent = "Pause";
  } else {
    audio.pause();
    playPauseBtn.textContent = "Play";
  }
});

prevBtn.addEventListener("click", () => {
  if (!songs.length) return;

  const prevIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(prevIndex, true);
});

nextBtn.addEventListener("click", () => {
  if (!songs.length) return;

  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex, true);
});

volumeBar.addEventListener("input", () => {
  audio.volume = volumeBar.value;
});

seekBar.addEventListener("input", () => {
  if (!audio.duration) return;

  audio.currentTime = (seekBar.value / 100) * audio.duration;
});

audio.addEventListener("timeupdate", () => {
  if (!audio.duration) return;

  const progress = (audio.currentTime / audio.duration) * 100;
  seekBar.value = progress;
  timeInfoEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
});

audio.addEventListener("ended", () => {
  if (!songs.length) return;

  const nextIndex = (currentSongIndex + 1) % songs.length;
  loadSong(nextIndex, true);
});

audio.volume = volumeBar.value;