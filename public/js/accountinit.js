if (localStorage.getItem('username')){
    const logButton = document.querySelector('nav').querySelector('a.btn')
    logButton.href = '#'
    logButton.textContent = localStorage.getItem('username')
    logButton.addEventListener('click',()=>{window.location = `${window.location.origin}/html/account.html`})
}