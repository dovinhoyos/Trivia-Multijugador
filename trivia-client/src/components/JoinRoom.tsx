import { useState } from "react";
import { io } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const socket = io("http://localhost:3333");

export function JoinRoom() {
  const [code, setCode] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [players, setPlayers] = useState<{ nickname: string; score: number }[]>(
    [],
  );

  const handleJoin = () => {
    socket.emit(
      "player:joinRoom",
      { code, nickname },
      (res: { success: boolean; error?: string }) => {
        if (!res.success) {
          setError(res.error ?? "Error desconocido");
        } else {
          setError(null);
        }
      },
    );
  };

  // Escuchamos cambios en la sala
  socket.on("room:updated", (players) => {
    setPlayers(players);
  });

  return (
    <Card className="w-[400px]">
      <CardHeader>
        <CardTitle>Unirse a una Sala</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        <Input
          placeholder="Código de sala"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
        />
        <Input
          placeholder="Tu nickname"
          value={nickname}
          onChange={(e) => setNickname(e.target.value)}
        />
        <Button onClick={handleJoin} className="w-full">
          Unirse
        </Button>

        {error && (
          <div className="text-red-600 text-sm font-semibold">{error}</div>
        )}

        {players.length > 0 && (
          <div className="mt-4">
            <p className="font-bold">Jugadores en sala:</p>
            <ul className="list-disc ml-5">
              {players.map((p) => (
                <li key={p.nickname}>{p.nickname}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
