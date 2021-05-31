//Se requiere el servidor de express
const express = require('express')
// Llama a dicho server a traves de una función
const app = express()
const server = require('http').Server(app)
const io = require('socket.io')(server)
//llmar libreria uuid para room dinamicas
const { v4: uuidV4 } = require('uuid')


//Iniciar el servidor de express en el localhost
app.set('view engine', 'ejs')
//Carpeta public para codigo javascript
app.use(express.static('public'))

app.get('/', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})

//Ruta para nuevas llamadas a la aplicación
app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
      //Usuario ha entrado a la llamada
      socket.join(roomId)
      //Mensaje a otros usuarios que userId ha entrado a la llamada
      socket.broadcast.to(roomId).emit('user-connected', userId)

      socket.on('disconnect', () => {
        socket.broadcast.to(roomId).emit('user-disconnected', userId)
      })
    })
})

//Iniciar el servidor en el puerto 3000
server.listen(3000)