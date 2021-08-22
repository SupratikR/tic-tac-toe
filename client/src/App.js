import { useEffect, useState } from "react";
import "./App.css";
import { GamePage, LandingPage } from "./pages";
import io from "socket.io-client";

const initialState = {
  id: null,
  playerX: null,
  playerO: null,
  currentGameState: [
    ["", "", ""],
    ["", "", ""],
    ["", "", ""],
  ],
  winner: null,
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [currentGame, setCurrentGame] = useState(initialState);
  const [isGameOver, setIsGameOver] = useState(false);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io("http://localhost:5000");
    setSocket(newSocket);

    newSocket.on("new-game-created", ({ newGame, username }) => {
      setUsername(username);
      setCurrentGame(newGame);
      setIsLoggedIn(true);
      // newSocket.emit("join-game", { username, gameId: newGame.id });
    });

    newSocket.on("game-joined", (currentGame) => {
      setIsLoggedIn(true);
      setUsername(currentGame.playerO);
      setCurrentGame(currentGame);
    });

    newSocket.on("new-player-joined", ({ username }) => {
      alert(`New player ${username} has joined`)
    });

    newSocket.on("player-turn-over", (currentGame) => {
      setCurrentGame(currentGame);
    });

    newSocket.on("game-over", (currentGame) => {
      setCurrentGame(currentGame);
      setIsGameOver(true);
    });

    return () => newSocket.close();
  }, [setSocket]);

  return socket ? (
    !isLoggedIn ? (
      <LandingPage socket={socket} />
    ) : (
      <GamePage
        socket={socket}
        username={username}
        currentGame={currentGame}
        isGameOver={isGameOver}
      />
    )
  ) : null;
}

export default App;