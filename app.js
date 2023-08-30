const cards = document.getElementById('cards')
const items = document.getElementById('items')
const fragmento = document.createDocumentFragment()
const footer = document.getElementById('footer')

const templateCard = document.getElementById('template-card').content
const templateFooter = document.getElementById('template-footer').content
const templateFlor = document.getElementById('template-flor').content

// -------------------- CREACION DEL OBJETO CARRITO VACIO

let flor = {}

// ------------ 

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    console.log(data)
})

// ---------------- EVENTO ON CLICK

cards.addEventListener('click', e => {
    addFlor(e)
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

const mostrarProductos = data => {
    data.forEach(producto => {
        templateCard.querySelector('h5').textContent = producto.title
        templateCard.querySelectorAll('h6').textContent = producto.sign
        templateCard.querySelector('p').textContent = producto.precio
        templateCard.querySelector('img').setAttribute("src", producto.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = producto.id

        const clone = templateCard.cloneNode(true)

        fragmento.appendChild(clone)
    });
    cards.appendChild(fragmento)
}

//--------------- DAR SALIDA AL CARRITO

const addFlor = e => {
    if (e.target.classList.contains('btn-dark')) {
        setFlor(e.target.parentElement)
    }
    e.stopPropagation()
}

const setFlor = objeto => {
    const producto = {
        id: objeto.querySelector('.btn-dark').dataset.id,
        title: objeto.querySelector('h5').textContent,
        sign: objeto.querySelector('h6').textContent,
        precio: objeto.querySelector('p').textContent,
        cantidad: 1
    }
    if (flor.hasOwnProperty(producto.id)) {
        producto.cantidad = flor[producto.id].cantidad + 1
    }
    flor[producto.id] = { ...producto }
    mostrarFlor()
}
const mostrarFlor = () => {
    items.innerHTML = ''
    Object.values(flor).forEach(producto => {
        templateFlor.querySelector('th').textContent = producto.id
        templateFlor.querySelectorAll('td')[0].textContent = producto.title
        templateFlor.querySelectorAll('th').textContent = producto.sign
        templateFlor.querySelectorAll('td')[1].textContent = producto.cantidad
        templateFlor.querySelector('.btn-info').dataset.id = producto.id
        templateFlor.querySelector('.btn-danger').dataset.id = producto.id
        templateFlor.querySelector('span').textContent = producto.cantidad * producto.precio

        const cloneProducto = templateFlor.cloneNode(true)
        fragmento.appendChild(cloneProducto)
    })
    items.appendChild(fragmento)
    mostrarFooter()
}

//------------------- MOSTRAR FOOTER

const mostrarFooter = () => {
    footer.innerHTML = '';
    if (Object.keys(flor).length === 0) {
        footer.innerHTML = '<th scope="row" colspan="6"> ¿Nada que comprar? Vuelve a revisar!</th>';
        return
    }
    const nCantidad = Object.values(flor).reduce((acc, { cantidad }) => acc + cantidad, 0)
    const nPrecio = Object.values(flor).reduce((acc, { cantidad, precio }) => acc + cantidad * precio, 0)


    templateFooter.querySelectorAll('td')[0].textContent = nCantidad
    templateFooter.querySelector('span').textContent = nPrecio

    const clone = templateFooter.cloneNode(true)
    fragmento.appendChild(clone)
    footer.appendChild(fragmento)

    const btnVaciar = document.getElementById('vaciar-carrito')
    btnVaciar.addEventListener('click', () => {
        flor = {}
        mostrarFlor()
    })
}

//---------------------------- BTN ACCION

const btnAccion = e => {
    console.log(e.target);
    if (e.target.classList.contains('btn-info')) {
        const producto = flor[e.target.dataset.id];
        producto.cantidad++;
        flor[e.target.dataset.id] = { ...producto };
        mostrarFlor();
    } else if (e.target.classList.contains('btn-danger')) {
        const producto = flor[e.target.dataset.id];
        if (producto.cantidad === 0) {
            delete flor[e.target.dataset.id];
        } else {
            producto.cantidad--;
            flor[e.target.dataset.id] = { ...producto };
        }
        mostrarFlor();
    }
    e.stopPropagation();
};

