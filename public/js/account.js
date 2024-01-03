const username = localStorage.getItem('username')
const greeting = document.getElementById('greeting')
const logButton = document.querySelector('nav').querySelector('a.btn')
logButton.addEventListener('click',()=>{ localStorage.setItem('username','') })
greeting.textContent = `Welcome to your profile ${username}`

const history = document.getElementById('diagnosis-history')
const description = document.getElementById('description')
const remedy = document.getElementById('remedy')
const summary = document.getElementById('summary')
const descriptionSwitch = document.getElementById('description-switch')
const remedySwitch = document.getElementById('remedy-switch')

fetch(`${window.location.origin}/retrieveHistory?username=${username}`)
.then(res=>res.json()).then(diagnosisList=>{
    diagnosisList.forEach(diagnosis=>{
        const li = document.createElement('li')
        li.innerText = diagnosis.diagnosis
        history.appendChild(li)
        li.addEventListener('click',()=>{
            summary.style.display = 'block'
            summary.querySelector('h2').innerHTML = `<div class="preloader-wrapper big active"><div class="spinner-layer spinner-red-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div></div></div>`
            fetch(`${window.location.origin}/apimedic/getRemedy?diagnosis=${diagnosis.diagnosisID}`)
            .then(res=>res.json()).then(issue=>{
                summary.querySelector('h2').innerText = diagnosis.diagnosis
                description.innerText = issue.Description
                remedy.innerText = issue.TreatmentDescription
            })
        })
    })
})

descriptionSwitch.addEventListener('click',()=>switchSection(descriptionSwitch,description,remedySwitch,remedy))
remedySwitch.addEventListener('click',()=>switchSection(remedySwitch,remedy,descriptionSwitch,description))

function switchSection(currentSwitch,currentSection,nextSwitch,nextSection){
    nextSwitch.style.backgroundColor = 'white'
    nextSwitch.style.color = 'navy'
    currentSwitch.style.backgroundColor = 'navy'
    currentSwitch.style.color = 'white'
    currentSection.style.display = 'none'
    nextSection.style.display = 'flex'
}