import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
        <CardTitle>Moderador - Sala</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {!roomCode ? (
          <Button onClick={createRoom} className="w-full">
            Crear Sala
          </Button>
        ) : (
          <>
            <div className="flex items-center gap-2">
              <Input
                value={roomCode}
                readOnly
                className="text-center font-mono"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={copyToClipboard}
                title="Copiar código"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>

            <div className="mt-4 space-y-2">
              <p className="font-semibold flex items-center gap-2">
                👑 Moderador <Badge variant="secondary">Tú</Badge>
              </p>

              <p className="font-semibold mt-4">👥 Jugadores conectados:</p>
              {players.length === 0 ? (
                <p className="text-sm text-gray-500">Esperando jugadores...</p>
              ) : (
                <ul className="space-y-1">
                  {players.map((p) => (
                    <li
                      key={p.nickname}
                      className="flex justify-between items-center border-b pb-1"
                    >
                      <span>{p.nickname}</span>
                      <Badge variant="outline">Score: {p.score}</Badge>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
