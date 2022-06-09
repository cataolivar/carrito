const cards = document.getElementById("cards")
const items = document.getElementById("items")
const footer = document.getElementById("footer")
const templateCard = document.getElementById("template-card").content
const templateFooter = document.getElementById("template-footer").content
const templateCarrito = document.getElementById("template-carrito").content
const fragment = document.createDocumentFragment()
let carrito = {}

//FETCH

document.addEventListener("DOMContentLoaded", () => {
    fetchData()

//LOCAL STORAGE
if (localStorage.getItem("carrito")) {
    carrito = JSON.parse(localStorage.getItem("carrito"))
    pintarCarrito()
}


})
cards.addEventListener("click", e => {
    addCarrito (e)
    
})

items.addEventListener("click", e => {btnAccion(e)})

const fetchData = async () => {

    try {
        const res = await fetch("/api.json")
        const data = await res.json()
        // console.log (data)
        pintarCards(data)
    }

    catch (error) {
        console.log(error)
    }
}


//AGREGANDO CONTENIDO AL HTML
const pintarCards = data => {
    data.forEach(producto => {
        templateCard.querySelector("h5").textContent = producto.title
        templateCard.querySelector("p").textContent = producto.precio
        templateCard.querySelector(".btn-dark").dataset.id = producto.id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}

//AÑADIR A CARRITO

const addCarrito = e => {
if (e.target.classList.contains ("btn-dark")) {
setCarrito (e.target.parentElement)
} 
e.stopPropagation ()
}

const setCarrito = objeto => {
const producto = {
    id: objeto.querySelector(".btn-dark").dataset.id,
    title: objeto.querySelector("h5").textContent,
    precio: objeto.querySelector("P").textContent,
    cantidad: 1 
}
if(carrito.hasOwnProperty (producto.id))
{
    producto.cantidad = carrito [producto.id].cantidad + 1
}

carrito [producto.id] = {...producto}
pintarCarrito ()

}

const pintarCarrito = () => {
items.innerHTML = " "
Object.values(carrito).forEach(producto => {
templateCarrito.querySelector("th").textContent = producto.id
templateCarrito.querySelectorAll("td")[0].textContent = producto.title
templateCarrito.querySelectorAll("td")[1].textContent = producto.cantidad
templateCarrito.querySelector(".btn-info").dataset.id = producto.id
templateCarrito.querySelector(".btn-danger").dataset.id = producto.id
templateCarrito.querySelector("span").textContent = producto.cantidad * producto.precio

const clone = templateCarrito.cloneNode(true)
fragment.appendChild(clone)
})

items.appendChild(fragment)

pintarFooter ()

localStorage.setItem("carrito", JSON.stringify(carrito))

}

const pintarFooter = () => {
    footer.innerHTML = " "

    if (Object.keys(carrito).length === 0) {
        footer.innerHTML = `
        <th scope="row" colspan="5">Carrito vacío con innerHTML</th>
        `
         
        return

        }

        const nCantidad = Object.values(carrito).reduce((acc, { cantidad }) => acc + cantidad, 0)
        const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio ,0)

        templateFooter.querySelectorAll('td')[0].textContent = nCantidad
        templateFooter.querySelector('span').textContent = nPrecio
    
        const clone = templateFooter.cloneNode(true)
        fragment.appendChild(clone)
        footer.appendChild(fragment)

        //VACIAR CARRITO

        const btnVaciar = document.getElementById("vaciar-carrito")
        btnVaciar.addEventListener("click", () => {
            carrito = {}
            pintarCarrito ()

        //LIBRERIAS

            Toastify({
                text: "Vaciaste tu carrito",
                duration: 3000,
                gravity: 'top',
                position: 'right',
        
                style: {
                    background: "black",
                }
            }).showToast();
        })
}

const btnAccion = e  => {

    //BTN +
    
    if (e.target.classList.contains("btn-info"))
    {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad++ //+1
        carrito [e.target.dataset.id] = {...producto}
        pintarCarrito ()
    }

    //BTN -

    if (e.target.classList.contains("btn-danger"))
    {
        const producto = carrito[e.target.dataset.id]
        producto.cantidad-- //-1
        if(producto.cantidad === 0) {
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito ()
    }

    e.stopPropagation()

}