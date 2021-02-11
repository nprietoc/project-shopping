const item = document.getElementById('items')
const templateCard = document.getElementById('template-card')
const fragment = document.createDocumentFragment()

document.addEventListener("DOMContentLoaded", () => {
    fetchData()
})


const fetchData = async () => {
    try {
        const res = await fetch('./Api.json')
        const data = await res.json()
        // console.log(data)
        pintaCards(data)
    } catch(error) {
        console.log(error)
    }

}

const pintaCards = data => {
    data.forEach(producto => {
        console.log(templateCard)
        templateCard.querySelector('.titulo').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone);
    });
    items.appendChild(fragment)
}


