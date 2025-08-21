import app from '@adonisjs/core/services/app'
import server from '@adonisjs/core/services/server'
import { Server } from 'socket.io'

interface Room {
  code: string
  moderatorId: string
  players: { id: string; nickname: string; score: number }[]
}

const rooms = new Map<string, Room>()

app.ready(() => {
  const io = new Server(server.getNodeServer(), {
    cors: {
      origin: '*', // 👈 permite conexiones desde cualquier origen (desarrollo)
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
  })
})
