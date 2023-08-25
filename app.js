const cards = document.getElementById('cards')
const items = document.getElementById('items')
const fragmento = document.createDocumentFragment()
const footer = document.getElementById('footer')

const templatecard = document.getElementById('template-card').content
const templatefooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-Carrito').content

// -------------------- CREACION DEL OBJETO CARRITO VACIO

let carrito = {}

// ------------ 

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    console.log(data)
})

// ---------------- EVENTO ON CLICK

cards.addEventListener('click', e => {
    addCarrito(e)
})

//--------------- AGREGAR LOS DATOS POR DOCUMENTO API.JSON

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        mostrarProductos(data)

    } catch (error) {
        console.log(error)
    }
}

//------------------------------------ METODO MOSTRAR PRODUCTOS
let data = []; // Define la variable data a nivel global

// ...

document.addEventListener('DOMContentLoaded', () => {
    fetchData();
});

const mostrarProductos = data => {
    console.log(data)
    data.forEach(producto => {
        templatecard.querySelector('h5').textContent = producto.title
        templatecard.querySelector('p').textContent = producto.precio
        templatecard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templatecard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templatecard.cloneNode(true)

        fragmento.appendChild(clone)
    });
    cards.appendChild(fragmento)
}

//--------------- DAR SALIDA AL CARRITO


const addCarrito = e => {
    if (e.target.classList.contains('btn-dark')) {
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        console.log(data)
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    mostrarCarrito()
}
//  Object.values(carrito).forEach(producto => {
const mostrarCarrito = () => {
    items.innerHTML = ''
    Object.values(carrito).forEach(producto => {
        templateCarrito.querySelector('th').textContent = producto.id
        templateCarrito.querySelectorAll('td')[0].textContent = producto.title
        templateCarrito.querySelectorAll('td')[1].textContent = producto.cantidad
        templateCarrito.querySelector('.btn-info').dataset.id = producto.id
        templateCarrito.querySelector('.btn-danger').dataset.id = producto.id
        templateCarrito.querySelector('span').textContent = producto.cantidad * producto.precio

        const cloneProducto = templateCarrito.cloneNode(true)
        fragmento.appendChild(cloneProducto)
    })
    items.appendChild(fragmento)
    mostrarFooter()
}

const mostrarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5"> Carrito Vacio - Comience a Comprar</th>';
    }
}