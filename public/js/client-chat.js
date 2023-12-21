// <div id='chat-box'></div> -- Put this where you want the chatbox to be
// <script src="/socket.io/socket.io.js"></script> -- Put these two on the bottom of body tag
// <script src="client-chat.js"></script>
document.addEventListener('DOMContentLoaded', ()=>{
    const socket = io()
    const chatBox = document.getElementById('chat-box')
    chatBox.innerHTML = `
        <div id="messages">

        </div>
        <small></small>
        <form id="input-box" action="">
            <textarea></textarea>
            <button>Send</button>
        </form>
    `
    const form = chatBox.querySelector('form')
    const input = chatBox.querySelector('textarea')
    const messages = chatBox.querySelector('#messages')
    const typing = chatBox.querySelector('small')
    form.addEventListener('submit', e=>{
        e.preventDefault()
        if (input.value){
            socket.emit('chat message',input.value);
            input.value= ''
        }
    })
    input.addEventListener('input', ()=>{
        socket.emit('typing', "User is typing...")
    })

    socket.on('typing', typers=>{
        if (typers.length > 3) {typing.textContent = 'Several people are typing...'; cooldown = true}
        else if (typers.length = 1) {typing.textContent = `${typers[0]} is typing...`; cooldown = true}
        else if (typers.length <= 2) {typing.textContent = `${typers[0]} and ${typers[1]} are typing...`; cooldown = true}
        let time = setTimeout(()=>{
            if (!cooldown){
                typing.textContent = ''
                cooldown = true
            }else{
                cooldown = false
                time.clearTimeout()
            }}, 1000)
    })
    socket.on('chat message', msg=>{
        const p = document.createElement('p')
        p.textContent = msg
        messages.appendChild(p)
    })
    socket.on('join', msg=>{
        const p = document.createElement('p')
        p.textContent = msg
        messages.appendChild(p)
    })
    socket.on('leave', msg=>{
        const p = document.createElement('p')
        p.textContent = msg
        messages.appendChild(p)
    })
})
