import { useState } from "react";
import { Button } from "@/components/ui/button";
import { JoinRoom } from "./components/JoinRoom";

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

      {mode === "player" && <JoinRoom />}
      {mode === "moderator" && <div>⚡ Pantalla moderador (ya hecha)</div>}
    </div>
  );
}
