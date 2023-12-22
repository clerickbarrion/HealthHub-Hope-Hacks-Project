const socketIO = require('socket.io')

// pass app.listen(3000) as the argument

function connectChat(server) {
    const io = socketIO(server)
    let typers = []
    io.on('connection', socket=>{
        const user = `User ${socket.id.substring(0,5)}`
        // io.emit('join', `${user} has entered the chat`)

        socket.on('chat message', msg=>{
            io.emit('chat message', `${user}: ${msg}`)
        })

        socket.on('disconnect',()=>{
            io.emit('leave', `${user} has left the chat`)
        })

        socket.on('join', ()=>{
            io.emit('join', `${user} has entered the chat`)
        })

        socket.on('typing',()=>{
            if (!typers.includes(user)) {typers.push(user)}
            io.emit('typing', typers)
            typers = typers.filter(typer => typer != user)
        })
    })
}

module.exports = connectChat