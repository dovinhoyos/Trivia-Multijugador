import { useState } from "react";
import { io } from "socket.io-client";
import { Button } from "./components/ui/button";

const socket = io("http://localhost:3333");
export default function App() {
  const [roomCode, setRoomCode] = useState<string | null>(null);

  const createRoom = () => {
    socket.emit("moderator:createRoom", {}, (response: { code: string }) => {
      setRoomCode(response.code);
    });
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      {!roomCode ? (
        <Button
          onClick={createRoom}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          Crear Sala
        </Button>
      ) : (
        <div className="text-xl">
          Sala creada con código: <span className="font-bold">{roomCode}</span>
        </div>
      )}
    </div>
  );
}
