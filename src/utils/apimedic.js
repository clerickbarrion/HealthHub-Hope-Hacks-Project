const fetch = require('node-fetch')

async function getToken(){
    const options = {
        method: 'POST',
        headers: {
          accept: 'application/json',
          Authorization: 'Bearer Xj6z3_GMAIL_COM_AUT:KG/RIxvrPBFnoY8re/ZgCA=='
        }
    }
    return fetch('https://authservice.priaid.ch/login',options).then(res=>res.json()).then(res=>res.Token)
}

async function getSymptomsList(){
    const token = await getToken()
    return fetch(`https://healthservice.priaid.ch/symptoms?token=${token}&format=json&language=en-gb`)
    .then(res=>res.json()).then(symptoms=>symptoms)
}

async function getDiagnosisList(){
    const token = await getToken()
    return fetch(`https://healthservice.priaid.ch/issues?token=${token}&format=json&language=en-gb`)
    .then(res=>res.json()).then(list=>list)
}

async function getDiagnosis(symptoms, birthYear, gender){
    const token = await getToken()
    let symptomsIds = await getSymptomsList()
    symptomsIds = symptomsIds.filter(symptom => symptoms.includes(symptom.Name)).map(symptom => symptom.ID)
    return fetch(`https://healthservice.priaid.ch/diagnosis?symptoms=[${symptomsIds}]&gender=${gender}&year_of_birth=${birthYear}&token=${token}&format=json&language=en-gb`).then(res=>res.json()).then(diagnosis=>diagnosis)
}

async function getRemedy(diagnosis){
    const token = await getToken()
    return fetch(`https://healthservice.priaid.ch/issues/${diagnosis}/info?token=${token}&format=json&language=en-gb`)
    .then(res=>res.json()).then(issue=>issue)
}

module.exports = {
    getSymptomsList,
    getDiagnosisList,
    getDiagnosis,
    getRemedy,
    getToken,
}