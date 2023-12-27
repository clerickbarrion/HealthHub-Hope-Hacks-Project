const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')

async function getArticle(diagnosis){
    return fetch(`https://medlineplus.gov/ency/encyclopedia_${diagnosis[0].toUpperCase()}.htm`)
    .then(res=>res.text()).then(html=>{
        const root = HTMLParser.parse(html)
        let article
        root.querySelectorAll('a').forEach(a=>{ if ( a.innerText.toUpperCase().trim() === diagnosis.toUpperCase() ) { article = a.rawAttrs } })
        try {return article.replaceAll('"','').replace('href=','')}
        catch {return ''}
    })
}

async function getRemedy(diagnosis){
    const article = await getArticle(diagnosis)
    if (!article) return 'No home care found'
    return fetch(`https://medlineplus.gov/ency/${article}`)
    .then(res=>res.text()).then(html=>{
        const root = HTMLParser.parse(html)
        let homeCare
        root.querySelectorAll('div.section').forEach(section=>{
            try{
                if (section.querySelector('h2').innerText === 'Home Care' || section.querySelector('h2').innerText === 'Treatment'){
                    homeCare = section.querySelector('.section-body')
                }
            } catch{}
        })
        try{return {homeCare: homeCare.innerText.replaceAll('.','. ').replaceAll('  ', ' ').replaceAll(':',": ")}}
        catch{return {error: 'No home care found'}}
    })
}

module.exports = getRemedy