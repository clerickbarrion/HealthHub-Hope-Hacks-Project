const username = localStorage.getItem('username')
const greeting = document.getElementById('greeting')
const logButton = document.querySelector('nav').querySelector('a.btn')
logButton.addEventListener('click',()=>{
    localStorage.clear()
})
greeting.textContent = `Welcome to your profile ${username}`