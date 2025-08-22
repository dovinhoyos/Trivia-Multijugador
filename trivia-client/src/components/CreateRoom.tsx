import { useState } from "react";
import { io } from "socket.io-client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Copy } from "lucide-react";

const socket = io("http://localhost:3333");

export function CreateRoom() {
  const [roomCode, setRoomCode] = useState<string | null>(null);

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
        )}
      </CardContent>
    </Card>
  );
}
