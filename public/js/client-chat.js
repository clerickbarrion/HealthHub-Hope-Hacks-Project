// <div id='chat-box'></div> -- Put this where you want the chatbox to be
// <script src="/socket.io/socket.io.js"></script> -- Put these two on the bottom of body tag
// <script src="client-chat.js"></script>
document.addEventListener('DOMContentLoaded', ()=>{
    const socket = io()
    const chatBox = document.getElementById('chat-box')
    chatBox.innerHTML = `
        <button>Chat</button>
        <div id='chat-container'>
            <div id="messages"></div>
            <small></small>
            <form id="input-box">
                <textarea placeholder='Write a message'></textarea>
            </form>
        </div>
    `
    const openChatBtn = chatBox.querySelector('button')
    const chatContainer = chatBox.querySelector('#chat-container')
    const input = chatBox.querySelector('textarea')
    const messages = chatBox.querySelector('#messages')
    const typing = chatBox.querySelector('small')
    let time
    
    openChatBtn.addEventListener('click', ()=>{
        if (chatContainer.style.display === 'none'){
            chatContainer.style.display = 'block'
            socket.emit('join')
        }else{
            chatContainer.style.display = 'none'
            socket.emit('leave')
        }
    })

    input.addEventListener('keydown', e=>{
        if (e.key === 'Enter' && input.value ){ 
            socket.emit('chat message',input.value)
            input.value= ''
            input.blur()
        }
    })

    input.addEventListener('input', () => socket.emit('typing'))

    socket.emit('get user', localStorage.getItem('username'))

    socket.on('typing', typers=>{
        switch(typers.length){
            case 1:
                typing.textContent = `${typers[0]} is typing...`;
                break;
            case 2:
                typing.textContent = `${typers[0]} and ${typers[1]} are typing...`;
                break;
            default:
                typing.textContent = 'Several people are typing...';
        }        
        
        clearTimeout(time)
        time = setTimeout(()=>{typing.textContent = ''}, 1000)
    })
    socket.on('chat message', msg=>{
        const p = document.createElement('p')
        p.innerHTML = msg
        p.querySelector('mark').style.color = '#'+localStorage.getItem('hex')
        p.querySelector('mark').style.backgroundColor = 'initial'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
    socket.on('join', msg=>{
        const p = document.createElement('p')
        p.innerHTML = msg
        p.querySelector('mark').style.color = '#'+localStorage.getItem('hex')
        p.querySelector('mark').style.backgroundColor = 'initial'
        p.style.color = 'green'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
    socket.on('leave', msg=>{
        const p = document.createElement('p')
        p.innerHTML = msg
        p.querySelector('mark').style.color = '#'+localStorage.getItem('hex')
        p.querySelector('mark').style.backgroundColor = 'initial'
        p.style.color = 'red'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
})
