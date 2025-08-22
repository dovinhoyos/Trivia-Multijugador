import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

const socket = io("http://localhost:3333");

interface Player {
  nickname: string;
  score: number;
}

export function CreateRoom() {
  const [roomCode, setRoomCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);

  const createRoom = () => {
    socket.emit("moderator:createRoom", {}, (response: { code: string }) => {
      setRoomCode(response.code);
      // Nos unimos al "room" para recibir actualizaciones
      socket.emit(
        "player:joinRoom",
        { code: response.code, nickname: "MODERADOR" },
        () => {},
      );
    });
  };

  const copyToClipboard = async () => {
    if (roomCode) {
      await navigator.clipboard.writeText(roomCode);
    }
  };

  // Suscribir a eventos de actualización de jugadores
  useEffect(() => {
    socket.on("room:updated", (players: Player[]) => {
      setPlayers(players);
    });

    return () => {
      socket.off("room:updated");
    };
  }, []);

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Moderador - Crear Sala</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!roomCode ? (
          <Button onClick={createRoom} className="w-full">
            Crear Sala
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Input value={roomCode} readOnly className="text-center" />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copiar código"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            {players.length > 0 && (
              <div>
                <p className="font-semibold mb-2">👥 Jugadores conectados:</p>
                <ul className="list-disc ml-5">
                  {players.map((p) => (
                    <li key={p.nickname}>
                      {p.nickname}{" "}
                      <span className="text-gray-500">(score: {p.score})</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
