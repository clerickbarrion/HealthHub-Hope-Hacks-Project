if (localStorage.getItem('username')){
    const logButtons = document.querySelectorAll('a.btn')
    Array.from(logButtons).forEach(button=>{
        button.href='#'
        button.textContent = localStorage.getItem('username')
        button.addEventListener('click',()=>{window.location = `${window.location.origin}/html/account.html`})
    })
}