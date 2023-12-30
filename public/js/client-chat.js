// <div id='chat-box'></div> -- Put this where you want the chatbox to be
// <script src="/socket.io/socket.io.js"></script> -- Put these two on the bottom of body tag
// <script src="client-chat.js"></script>
document.addEventListener('DOMContentLoaded', ()=>{
    if (localStorage.getItem('username') && !window.location.href.includes('account.html')){
        const logButtons = document.querySelectorAll('a.btn')
        Array.from(logButtons).forEach(button=>{
            button.href='#'
            button.textContent = localStorage.getItem('username')
            button.addEventListener('click',()=>{window.location = `${window.location.origin}/html/account.html`})
        })
    }
    M.Sidenav.init(document.querySelectorAll('.sidenav'));
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
            
            if (input.value.includes('@')){
                let user = ''
                for (let i = input.value.indexOf('@')+1; i< input.value.indexOf(' ', input.value.indexOf('@')); i++){
                    user += input.value[i]
                }
                socket.emit('ping', {
                    sender: localStorage.getItem('username'), 
                    receiver: user, 
                    msg: input.value
                })
                input.value= '' 
            }else if (input.value.includes('/w')) {
                let user = ''
                for (let i = input.value.indexOf('/w')+3; i< input.value.indexOf(' ', input.value.indexOf('/w')+3); i++){
                    user += input.value[i]
                }
                socket.emit('whisper', {
                    sender: localStorage.getItem('username'), 
                    receiver: user, 
                    msg: input.value.replace(`/w ${user}`,'')
                })
                const p = document.createElement('p')
                p.innerHTML = `To ${user}: ${input.value.replace(`/w ${user}`,'')}`
                p.style.color = 'blue'
                messages.appendChild(p)
                messages.scrollTop += 1000
                input.value = `/w ${user}`
            } else { 
                socket.emit('chat message',input.value)
                input.value= '' 
            }
            input.blur()
        }
    })

    input.addEventListener('input', () => socket.emit('typing'))

    socket.emit('get user', {
        name: localStorage.getItem('username'),
        hex: localStorage.getItem('hex')}
    )

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
        p.querySelector('mark').style.backgroundColor = 'initial'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
    socket.on('join', msg=>{
        const p = document.createElement('p')
        p.innerHTML = msg
        p.querySelector('mark').style.backgroundColor = 'initial'
        p.style.color = 'green'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
    socket.on('leave', msg=>{
        const p = document.createElement('p')
        p.innerHTML = msg
        p.querySelector('mark').style.backgroundColor = 'initial'
        p.style.color = 'red'
        messages.appendChild(p)
        messages.scrollTop += 1000
    })
    socket.on('ping',ping=>{
        if (ping.receiver.toUpperCase() === localStorage.getItem('username').toUpperCase()){
            const h1 = document.createElement('h1')
            h1.textContent = `${ping.sender} pinged you: ${ping.msg}`.replace(`@${ping.receiver}`,'')
            h1.classList = 'ping'
            document.querySelector('body').appendChild(h1)
            setTimeout(()=>{h1.remove()},3000)
        }
    })
    socket.on('whisper',whisper=>{
        if (whisper.receiver.toUpperCase() === localStorage.getItem('username').toUpperCase()){
            const p = document.createElement('p')
            p.innerHTML = `From ${whisper.sender}: ${whisper.msg}`
            p.style.color = 'blue'
            messages.appendChild(p)
            messages.scrollTop += 1000
        }
    })
})
