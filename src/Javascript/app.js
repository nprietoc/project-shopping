// dom para modificar donde accedemos a los elementos #3
const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()

// un objeto donde se va a almacenar los productos del carrito compras #7
let carrito = {}

// EVENTO cuando el documento HTML ha sido completamente me muestra fetch cargado #2
document.addEventListener("DOMContentLoaded", () => {
    fetchData()
    if (localStorage.getItem('keyCarrito')) {
        // si llega a existir algo en el local storage (key) en el objeto lo llenamos con esa informacion LOCAL STORAGE
        carrito = JSON.parse(localStorage.getItem('keyCarrito'))
        pintarCarrito()
    }
})

//  EVENTO delegation click para detectar cada elemento #5 + con el paso #6
cards.addEventListener('click', e => {
    addCarrito(e)
})

// EVENTO  delegation para los botones + - #12 + con el paso #13
items.addEventListener('click', e => {
    bntAccion(e)
})

// traer productos #1
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


// pintar los productos #4
const pintaCards = (data) => {
    // console.log(data)
    data.forEach(producto => {
        // console.log(templateCard.querySelector('h5'))
        templateCard.querySelector('.titulo').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        // templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.getElementById('img').setAttribute("src", producto.thumbnailUrl)
        // para poner id dinamico a cada card
        templateCard.querySelector('.btn-dark').dataset.id = producto.id
        
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone);
    });
    cards.appendChild(fragment)
}

// funcion donde agregar al carrito si le doy click #6 
const addCarrito = e => {
    // console.log(e.target)
    // muestra true si click en el boton
    // console.log(e.target.classList.contains('btn-dark'))
    if (e.target.classList.contains('btn-dark')) {
        // console.log(e.target.parentElement)
        setCarrito(e.target.parentElement)
    }
    // detener el evento
    e.stopPropagation()
}

// aqui se guarda toda la informacion del carrito de compras, cada item tiene id- titulo- precio y si quiero mas de una cantidad esta el if #8
const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('.titulo').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }

    if(carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    } 

    // una vez almacenado se empuja al carrito que es donde se muestra, los tres puntos es que hace una copia y no sobre escribe  #9
    carrito[producto.id] ={...producto}
    pintarCarrito()

    // console.log(carrito)
}

// pintar el carrito #10
// se necesita un for each pero como es un objeto se utiliza object.values
const pintarCarrito = () => {
    // console.log(carrito)
    // limpiar el html para que no se repita 
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        // como hay varios td se tiene que especificar
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const clone = templateCarrito.cloneNode(true)
        fragment.appendChild(clone)
    });
    items.appendChild(fragment)

    pintarFooter()

    // guardar la informacion del local storage #14
    localStorage.setItem('keyCarrito', JSON.stringify(carrito))
}

// pintar footer # 11
const pintarFooter = () => {
    // para que no se sobrescriba 
    footer.innerHTML = ''
    // sino tiene elementos
    if(Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
        return
    }
    // en caso de que si haya elementos = total productos y total precio
    const totalCantidad = Object.values(carrito).reduce((acumulador, {cantidad}) => acumulador + cantidad, 0)
    const totalPrecio = Object.values(carrito).reduce((acumulador, {cantidad, precio}) => acumulador + cantidad * precio, 0)
    // console.log(Object.values(carrito))
    console.log(totalPrecio)

    // pintar el footer = totales 
    templateFooter.querySelectorAll('td')[0].textContent = totalCantidad
    templateFooter.querySelector('span').textContent = totalPrecio

    const clone = templateFooter.cloneNode(true)
    fragment.appendChild(clone)
    footer.appendChild(fragment)

    // boton vaciar carrito 
    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        pintarCarrito()
    })
}
// funcion donde esta el evento de los botones delegation #13 
const bntAccion = e => {
    // console.log(e.target)
    // accion de aumentar
    if (e.target.classList.contains('btn-info')) {
        console.log(carrito[e.target.dataset.id])
        // carrito[e.target.dataset.id]
        const producto = carrito[e.target.dataset.id]
        // modificar solo la cantidad
        producto.cantidad = carrito[e.target.dataset.id].cantidad + 1
        // producto.cantidad++
        // guardarlo 
        carrito[e.target.dataset.id] = {...producto}
        // pintarlo
        pintarCarrito()
    }
    // accion de disminuir 
    if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad = carrito[e.target.dataset.id].cantidad - 1
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        } 
        pintarCarrito()       
    }

    e.stopPropagation()
}