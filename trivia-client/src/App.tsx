import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JoinRoom } from "./components/JoinRoom";
import { CreateRoom } from "./components/CreateRoom";

export default function App() {
  const [mode, setMode] = useState<"moderator" | "player" | null>(null);

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-6">
      {!mode && (
        <div className="flex gap-4">
          <Button onClick={() => setMode("moderator")}>Soy Moderador</Button>
          <Button onClick={() => setMode("player")}>Soy Jugador</Button>
        </div>
      )}

      {mode === "moderator" && <CreateRoom />}
      {mode === "player" && <JoinRoom />}
    </div>
  );
}
