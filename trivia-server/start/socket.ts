import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

interface Player {
  id: string
  nickname: string
  score: number
}

interface Room {
  code: string
  moderatorId: string
  players: Player[]
}

const rooms = new Map<string, Room>()

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  })

  io.on('connection', (socket) => {
    console.log('🔌 Cliente conectado:', socket.id)

    // Moderador crea sala
    socket.on('moderator:createRoom', (_, callback) => {
      const code = Math.random().toString(36).substring(2, 6).toUpperCase()

      const room: Room = {
        code,
        moderatorId: socket.id,
        players: [],
      }

      rooms.set(code, room)
      console.log(`🎲 Sala creada: ${code}`)

      callback({ code })
    })

    // Jugador se une a la sala
    socket.on(
      'player:joinRoom',
      (
        { code, nickname }: { code: string; nickname: string },
        callback: (res: { success: boolean; error?: string }) => void
      ) => {
        const room = rooms.get(code)
        if (!room) {
          return callback({ success: false, error: 'Sala no encontrada' })
        }

        if (room.players.some((p) => p.nickname === nickname)) {
          return callback({ success: false, error: 'Nickname ya en uso' })
        }

        const player: Player = {
          id: socket.id,
          nickname,
          score: 0,
        }

        room.players.push(player)
        socket.join(code) // socket se une a la "room" de socket.io

        console.log(`👤 ${nickname} se unió a la sala ${code}`)

        // Avisamos a todos en la sala que hay un nuevo jugador
        io.to(code).emit('room:updated', room.players)

        callback({ success: true })
      }
    )
  })
})
