const socketIO = require('socket.io')

// pass app.listen(3000) as the argument

function connectChat(server) {
    const io = socketIO(server)
    let typers = []
    io.on('connection', socket=>{
        let user
        let time

        socket.on('get user', name=>name ? user = name : user = `Anon ${socket.id.substring(0,5)}`)
        socket.on('chat message', msg=>io.emit('chat message', `<mark>${user}:</mark> ${msg}`))
        socket.on('join', ()=>io.emit('join', `<mark>${user}</mark> has entered the chat`))
        socket.on('disconnect',()=>io.emit('leave', `<mark>${user}</mark> has left the chat`))
        socket.on('leave',()=>io.emit('leave', `<mark>${user}</mark> has left the chat`))
        socket.on('typing',()=>{
            if (!typers.includes(user)) { typers.push(user) }
            io.emit('typing', typers)
            clearTimeout(time)
            time = setTimeout(()=>typers = typers.filter(typer => typer != user), 1000)
        })
    })
}

module.exports = connectChat