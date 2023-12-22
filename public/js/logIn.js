const origin = window.location.origin
class AccountHandler {
    constructor(){
        this.loginSwitch = document.getElementById('login-switch')
        this.signupSwitch = document.getElementById('signup-switch')
        this.loginSection = document.getElementById('login-section')
        this.signupSection = document.getElementById('signup-section')
        this.signupMark = this.loginSection.querySelector('mark')
        this.loginMark = this.signupSection.querySelector('mark')
        this.loginButton = this.loginSection.querySelector('button')
        this.signupButton = this.signupSection.querySelector('button')
        this.loginUsername = document.getElementById('login-username')
        this.loginPassword = document.getElementById('login-password')
        this.errorMessage = document.getElementById('error-message')
        this.signupUsername = document.getElementById('signup-username')
        this.signupPassword = document.getElementById('signup-password')
        this.confirmPassword = document.getElementById('confirm-password')
        this.middlename = document.getElementById('middlename')

        this.loginSwitch.addEventListener('click', ()=> this.switchSection(this.signupSwitch,this.signupSection,this.loginSwitch,this.loginSection))
        this.loginMark.addEventListener('click', ()=> this.switchSection(this.signupSwitch,this.signupSection,this.loginSwitch,this.loginSection))
        this.signupSwitch.addEventListener('click', ()=> this.switchSection(this.loginSwitch,this.loginSection,this.signupSwitch,this.signupSection))
        this.signupMark.addEventListener('click', ()=> this.switchSection(this.loginSwitch,this.loginSection,this.signupSwitch,this.signupSection))

        this.loginButton.addEventListener('click',()=>this.login(this.loginUsername.value,this.loginPassword.value))
        this.signupButton.addEventListener('click',()=>{
            if(this.signupPassword.length < 7){this.displayError('Password too short')}
            else if(this.signupPassword.value !== this.confirmPassword.value) {this.displayError('Passwords do not match')}
            else if(this.signupUsername.value.length > 20) {this.displayError('Username too long')}
            else if(!this.signupUsername.value.match('^[a-zA-Z0-9]+$')) {this.displayError('Only alphanumeric chars allowed')}
            else if (!this.middlename.value) {this.displayError('Enter a middle name')}
            else {this.signup(this.signupUsername.value,this.signupPassword.value,this.middlename.value)}
        })
    }
    switchSection(currentSwitch,currentSection,nextSwitch,nextSection){
        nextSwitch.style.backgroundColor = 'navy'
        nextSwitch.style.color = 'white'
        currentSwitch.style.backgroundColor = 'initial'
        currentSwitch.style.color = 'initial'
        currentSection.style.display = 'none'
        nextSection.style.display = 'flex'
    }
    async login(username,password){
        const result = await fetch(`${origin}/login?username=${username}&password=${password}`).then(res=>res.json()).catch(err=>err)

        if(result.error){
            this.displayError(result.error)
        } else {
            const account = result.result[0]
            localStorage.setItem('username', account.username)
            localStorage.setItem('hex', account.hex)
            window.location = `${origin}/html/account.html`
        }
    }
    async signup(username,password,middlename){
        const data = {
            username,
            password,
            middlename,
            hex: Math.floor(Math.random() * 1000000)
        }
        const options = {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(data)
        }
        const result = await fetch(`${origin}/signUp`,options).then(res=>res.json()).catch(err=>err)
        if(result.error){
            this.displayError(result.error)
        } else {
            localStorage.setItem('username', data.username)
            localStorage.setItem('hex', data.hex)
            window.location = `${origin}/html/account.html`
        }
    }
    displayError(error){this.errorMessage.textContent = error}
}
const accounthandler = new AccountHandler
