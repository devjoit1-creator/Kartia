// Constantes
const modalProductos = document.getElementById("modalProductos");
const formProductos = document.getElementById("formProductos");
const codProducto = document.getElementById("codProducto");
const codBarraProducto = document.getElementById("codBarraProducto");
const nomProducto = document.getElementById("nomProducto");
const descripcionProducto = document.getElementById("descripcionProducto");
const precioCompra = document.getElementById("precioCompra");
const precioVenta = document.getElementById("precioVenta");
const stockMinimo = document.getElementById("stockMinimo");
const stockMaximo = document.getElementById("stockMaximo")
const categoriaId = document.getElementById("categoriaId");
const btnNuevo = document.getElementById("btnNuevo");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");

//Uppercase
codProducto.addEventListener("keyup", () => {
    codProducto.value = codProducto.value.toUpperCase();
});

nomProducto.addEventListener("keyup", () => {
    nomProducto.value = nomProducto.value.toUpperCase();
});

descripcionProducto.addEventListener("keyup", () => {
    descripcionProducto.value = descripcionProducto.value.toUpperCase();
});


//Activar Modal
const activarModal = () => {
    modalProductos.classList.remove("is-hidden");
    modalProductos.classList.add("is-active");
};
btnNuevo.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
});

//Activar Modal Editar
const activarModalEditar = (id) => {

};

//Desactivar Modal
const desactivarModal = () => {
    modalProductos.classList.remove("is-active");
    modalProductos.classList.add("is-hidden");
};
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault()
    formProductos.reset();
    desactivarModal();
});


// Async Nuevo Producto
formProductos.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    try {
        const response = await fetch("/addProducto", {
            method: "POST",
            body: dataForm
        });
        const result = await response.json();
        if(!response.ok){
            throw new Error(result.error)
            Toastify({
                text: `Se presentó un error: ${result.error}`,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #b01500, #c93d3d)",
                }
            }).showToast();
            return;
        };

        formProductos.reset();
        desactivarModal();
        Toastify({
            text: `${result.message}`,
            className: "success",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
    } catch (err) {
        console.error("error: ", err)
        Toastify({
            text: `Se presentó un error: ${err}`,
            className: "error",
            style: {
                background: "linear-gradient(to right, #b01500, #c93d3d)",
            }
        }).showToast();
    };
});