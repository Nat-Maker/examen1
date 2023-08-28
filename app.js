const cards = document.getElementById('cards')
const items = document.getElementById('items')
const fragmento = document.createDocumentFragment()
const footer = document.getElementById('footer')

const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateCarrito = document.getElementById('template-Carrito').content

// -------------------- CREACION DEL OBJETO CARRITO VACIO

let carrito = {}

// ------------ 

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    //console.log(data)
})

// ---------------- EVENTO ON CLICK

cards.addEventListener('click', e => {
    addCarrito(e)
})

items.addEventListener('click', e => {
    btnAccion(e)
})

//--------------- AGREGAR LOS DATOS POR DOCUMENTO API.JSON

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        //console.log(data)
        mostrarProductos(data)

    } catch (error) {
        console.log(error)
    }
}

//------------------------------------ METODO MOSTRAR PRODUCTOS
// let data = []; // Define la variable data a nivel global

// ...

/* document.addEventListener('DOMContentLoaded', () => {
    fetchData();
}); */

const mostrarProductos = data => {
    //console.log(data)
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)

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
    //console.log(objeto)
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (carrito.hasOwnProperty(producto.id)) {
        producto.cantidad = carrito[producto.id].cantidad + 1
    }
    carrito[producto.id] = { ...producto }
    mostrarCarrito()
}
//  Object.values(carrito).forEach(producto => {
const mostrarCarrito = () => {
    //console.log(carrito)
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

//------------------- MOSTRAR FOOTER

const mostrarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="5"> Carrito Vacio - Comience a Comprar</th>';
        return
    }
    const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(carrito).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)

    //console.log(nPrecio)

    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragmento.appendChild(clone)
    footer.appendChild(fragmento)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        carrito = {}
        mostrarCarrito()
    })
}

//---------------------------- BTN ACCION

const btnAccion = e => {
    console.log(e.target);
    if (e.target.classList.contains('btn-info')) {
        const producto = carrito[e.target.dataset.id];
        producto.cantidad++;
        carrito[e.target.dataset.id] = { ...producto };
        mostrarCarrito();
    } else if (e.target.classList.contains('btn-danger')) {
        const producto = carrito[e.target.dataset.id];
        if (producto.cantidad === 0) {
            delete carrito[e.target.dataset.id];
        } else {
            producto.cantidad--;
            carrito[e.target.dataset.id] = { ...producto };
        }
        mostrarCarrito();
    }
    e.stopPropagation();
};

