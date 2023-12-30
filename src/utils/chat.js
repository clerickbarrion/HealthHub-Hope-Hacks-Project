const socketIO = require('socket.io')

// pass app.listen(3000) as the argument

function connectChat(server) {
    const io = socketIO(server)
    let typers = []
    io.on('connection', socket=>{
        let user
        let time
        let hex

        socket.on('get user', cred =>{
            cred.name ? user = cred.name : user = `Anon ${socket.id.substring(0,5)}`
            cred.hex ? hex = cred.hex : hex = '000000'
        })
        socket.on('chat message', msg=>io.emit('chat message', `<mark style="color:#${hex}">${user}:</mark> ${msg}`))
        socket.on('join', ()=>io.emit('join', `<mark style="color:#${hex}">${user}</mark> has entered the chat`))
        socket.on('disconnect',()=>io.emit('leave', `<mark style="color:#${hex}">${user}</mark> has left the chat`))
        socket.on('leave',()=>io.emit('leave', `<mark style="color:#${hex}">${user}</mark> has left the chat`))
        socket.on('ping', ping=>io.emit('ping',ping))
        socket.on('whisper', whisper=>io.emit('whisper',whisper))
        socket.on('typing',()=>{
            if (!typers.includes(user)) { typers.push(user) }
            io.emit('typing', typers)
            clearTimeout(time)
            time = setTimeout(()=>typers = typers.filter(typer => typer != user), 1000)
        })
    })
}

module.exports = connectChat