const fetch = require('node-fetch')
const HTMLParser = require('node-html-parser')

async function getArticle(diagnosis){
    return fetch(`https://medlineplus.gov/ency/encyclopedia_${diagnosis[0].toUpperCase()}.htm`)
    .then(res=>res.text()).then(html=>{
        const root = HTMLParser.parse(html)
        let article
        root.querySelector('ul#index').querySelectorAll('a').forEach(a=>{ if ( a.innerText.toUpperCase().trim() === diagnosis.toUpperCase() ) { article = a.rawAttributes.href } })
        try {return article}
        catch {return ''}
    })
}

async function getRemedy(diagnosis){
    const article = await getArticle(diagnosis)
    if (!article) return {error: 'No home care found'}
    return fetch(`https://medlineplus.gov/ency/${article}`)
    .then(res=>res.text()).then(html=>{
        const root = HTMLParser.parse(html)
        let homeCare
        let img
        root.querySelectorAll('div.section').forEach(section=>{
            try{
                if (section.querySelector('h2').innerText === 'Home Care' || section.querySelector('h2').innerText === 'Treatment'){
                    homeCare = section.querySelector('.section-body')
                }
            } catch{}
        })
        if (root.querySelector('article').querySelector('img')) img = root.querySelector('article').querySelector('img').rawAttributes.src
        try{return {
            homeCare: homeCare.innerText.replaceAll('.','. ').replaceAll('  ', ' ').replaceAll(':',": "),
            source: `https://medlineplus.gov/ency/${article}`,
            img: 'https:'+img
        }}
        catch{return {error: 'No home care found'}}
    })
}

module.exports = getRemedy