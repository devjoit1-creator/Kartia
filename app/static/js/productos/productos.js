// Constantes
const modalProductos = document.getElementById("modalProductos");
const formProductos = document.getElementById("formProductos");
const idProducto = document.getElementById("idProducto");
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
const searchInput = document.getElementById("searchInput");
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
    modalProductos.classList.remove("is-hidden");
    modalProductos.classList.add("is-active");
    btnGuardar.classList.remove("is-active");
    btnGuardar.classList.add("is-hidden");
    btnActualizar.classList.remove("is-hidden");
    btnActualizar.classList.add("is-active");
    fetch(`/getProductosId/${id}`)
    .then(response => response.json())
    .then(data => {
        if(!Array.isArray(data) || data.length === 0){
            alert("No hay datos");
            return;
        };

        data.forEach(producto => {
            idProducto.value = producto.idProducto;
            codProducto.value = producto.codProducto;
            codBarraProducto.value = producto.codBarraProducto;
            nomProducto.value = producto.nomProducto;
            descripcionProducto.value = producto.descripcionProducto;
            precioCompra.value = producto.precioCompra;
            precioVenta.value = producto.precioVenta;
            stockMinimo.value = producto.stockMinimo;
            stockMaximo.value = producto.stockMaximo;
            categoriaId.value = producto.categoriaId;
            btnActualizar.dataset.idOriginal = producto.idProducto;
        });
    })
    .catch(error => console.error("error: ", error))
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

//Datos en Tabla
let allProductos = [];
let filteredProductos = [];
let currentPage = 1;
const rowsPerPage = 5;
const getProductos = async () => {
    try {
        const response = await fetch("/getProductos");
        if(!response.ok) throw new Error('Error cargando los datos');

        const result = await response.json();
        allProductos = result;

        filteredProductos = [...allProductos];
        renderTabla();
        renderPaginas();
    } catch (err) {
        console.error("error: ", err)
    }
};

const renderTabla = () => {
    const tbody = document.getElementById("productosTbody");
    tbody.innerHTML = '';

    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = inicio + rowsPerPage;
    const datosPagina = filteredProductos.slice(inicio, fin);

    if(datosPagina.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="has-text-centered">No se encontraron resultados</td></tr>
        `
        return;  
    };

    datosPagina.forEach(producto => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${producto.idProducto}</td>
            <td>${producto.codProducto}</td>
            <td>${producto.nomProducto}</td>
            <td>
                <a onclick="activarModalEditar('${producto.idProducto}')" class="has-icon button is-small is-info has-tooltip-bottom" data-tooltip="Editar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-pencil"></i></span>
                </a>
                <a onclick="eliminarProducto('${producto.idProducto}')" class="has-icon button is-small is-danger has-tooltip-bottom" data-tooltip="Eliminar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-trash-can"></i></span>
                </a>
            </td>
        `
        tbody.appendChild(tr);
    });
};

//Paginacion de filas en tabla
const renderPaginas = () => {
    const paginacionList = document.getElementById("paginationList");
    paginacionList.innerHTML = '';

    const totalPages = Math.ceil(filteredProductos.length / rowsPerPage);
    if (totalPages <= 1 ) return;

    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement('li');
        const a = document.createElement('a');

        a.classList.add('pagination-link');
        if(i === currentPage){
            a.classList.add('is-current');
            a.setAttribute('aria-current', 'page');
        }

        a.textContent = i;
        a.href = '#';

        a.addEventListener("click", (e) => {
            e.preventDefault();
            currentPage = i;
            renderTabla();
            renderPaginas();
        });

        li.appendChild(a);
        paginacionList.appendChild(li)
    }
};

//Filtrar Datos
searchInput.addEventListener("input", (e) => {
    const termino = e.target.value.toLowerCase().trim();
    filteredProductos = allProductos.filter(producto => {
        const id = String(producto.idProducto || '').toLowerCase();
        const codigo = String(producto.codProducto || '').toLowerCase();
        const nombre = String(producto.nomProducto || '').toLowerCase();

        return id.includes(termino) || codigo.includes(termino) || nombre.includes(termino);
    });

    currentPage = 1;
    renderTabla();
    renderPaginas();
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
        getProductos();
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

//Async Actualizar Datos de Producto
btnActualizar.addEventListener("click", async () => {
    const datosForm = new FormData(formProductos);
    const idOriginal = btnActualizar.dataset.idOriginal;
    try {
        const response = await fetch("/updateProducto", {
            method: "POST",
            body: datosForm
        });

        const result = await response.json();
        if(!response.ok){
            throw new Error(result.error);
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
        getProductos();
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

//Async Eliminar Producto
const eliminarProducto = async (id) => {
    if(confirm("Desea eliminar este producto del sistema ?")){
        try {
            const response = await fetch(`/deleteProducto/${id}`);
            const result = await response.json();
            if(!response.ok){
                throw new Error(result.error);
                Toastify({
                    text: `Se presentó un error: ${result.error}`,
                    className: "error",
                    style: {
                        background: "linear-gradient(to right, #b01500, #c93d3d)",
                    }
                }).showToast();
                return;
            };

            getProductos();
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
    };
};

//Cargar Datos
document.addEventListener("DOMContentLoaded", () => {
    getProductos();
})