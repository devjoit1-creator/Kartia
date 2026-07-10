//Constantes
const modalCategorias = document.getElementById("modalCategorias");
const formCategorias = document.getElementById("formCategorias");
const idCategoria = document.getElementById("idCategoria");
const codCategoria = document.getElementById("codCategoria");
const nomCategoria = document.getElementById("nomCategoria");
const btnNuevo = document.getElementById("btnNuevo");
const searchInput = document.getElementById("searchInput");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");

//Uppercase
codCategoria.addEventListener("keyup", () => {
    codCategoria.value = codCategoria.value.toUpperCase();
});

nomCategoria.addEventListener("keyup", () => {
    nomCategoria.value = nomCategoria.value.toUpperCase();
});

//Activar Modal
const activarModal = () => {
    modalCategorias.classList.remove("is-hidden");
    modalCategorias.classList.add("is-active");
};
btnNuevo.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
})

//Activar Modal Editar
const activarModalEditar = (id) => {
    modalCategorias.classList.remove("is-hidden");
    modalCategorias.classList.add("is-active");
    btnActualizar.classList.remove("is-hidden");
    btnActualizar.classList.add("is-active");
    btnGuardar.classList.remove("is-active");
    btnGuardar.classList.add("is-hidden");
    fetch(`/getCategoriasId/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if(!Array.isArray(data) || data.length === 0){
            alert("No hay datos");
            return;
        };

        data.forEach(categoria => {
            idCategoria.value = categoria.idCategoria;
            codCategoria.value = categoria.codCategoria;
            nomCategoria.value = categoria.nomCategoria;
            btnActualizar.dataset.idOriginal = categoria.idCategoria;
        });
    })
    .catch(error => console.error("error: ", error))
};

//Desactivar Modal
const desactivarModal = () => {
    modalCategorias.classList.add("is-hidden");
    modalCategorias.classList.remove("is-active");
};
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    formCategorias.reset();
    desactivarModal();
});

//Datos en Tabla
let allCategorias = [];
let filteredCategorias = [];
let currentPage = 1;
const rowsPerPage = 5;
const getCategorias = async () => {
    try {
        const response = await fetch("/getCategorias");
        if(!response.ok) throw new Error('Error cargando los datos');

        const result = await response.json();
        allCategorias = result;

        filteredCategorias = [...allCategorias];
        renderTabla();
        renderPaginas();
    } catch (err) {
        console.error("error: ", err)
    }
};

const renderTabla = () => {
    const tbody = document.getElementById("categoriasTbody");
    tbody.innerHTML = '';

    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = inicio + rowsPerPage;
    const datosPagina = filteredCategorias.slice(inicio, fin);

    if(datosPagina.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="has-text-centered">No se encontraron resultados</td></tr>
        `
        return;  
    };

    datosPagina.forEach(categoria => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${categoria.idCategoria}</td>
            <td>${categoria.codCategoria}</td>
            <td>${categoria.nomCategoria}</td>
            <td>
                <a onclick="activarModalEditar('${categoria.idCategoria}')" class="has-icon button is-small is-info has-tooltip-bottom" data-tooltip="Editar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-pencil"></i></span>
                </a>
                <a onclick="eliminarCategoria('${categoria.idCategoria}')" class="has-icon button is-small is-danger has-tooltip-bottom" data-tooltip="Eliminar" style="padding: 0em 1.0em">
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

    const totalPages = Math.ceil(filteredCategorias.length / rowsPerPage);
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
    filteredCategorias = allCategorias.filter(categoria => {
        const id = String(categoria.idCategoria || '').toLowerCase();
        const codigo = String(categoria.codCategoria || '').toLowerCase();
        const nombre = String(categoria.nomCategoria || '').toLowerCase();

        return id.includes(termino) || codigo.includes(termino) || nombre.includes(termino);
    });

    currentPage = 1;
    renderTabla();
    renderPaginas();
});

//Async Guardar Nueva Categoria
formCategorias.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    try {
        const response = await fetch("/addCategoria", {
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

        formCategorias.reset();
        getCategorias();
        desactivarModal();
        Toastify({
            text: `${result.message}`,
            className: "success",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();
        
        
    } catch (err) {
        console.error("error: ", err);
        Toastify({
            text: `Se presentó un error: ${result.error}`,
            className: "error",
            style: {
                background: "linear-gradient(to right, #b01500, #c93d3d)",
            }
        }).showToast();
    }
});

//Async Actualizar Categoria
btnActualizar.addEventListener("click", async () => {
    const datosForm = new FormData(formCategorias);
    const idOriginal = btnActualizar.dataset.idOriginal;
    try {
        const response = await fetch("/editCategoria", {
            method: "POST",
            body: datosForm
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

        formCategorias.reset();
        getCategorias();
        desactivarModal();
        Toastify({
            text: `${result.message}`,
            className: "success",
            style: {
                background: "linear-gradient(to right, #00b09b, #96c93d)",
            }
        }).showToast();

    } catch (err) {
        console.error("error: ", err);
        Toastify({
            text: `Se presentó un error: ${err}`,
            className: "error",
            style: {
                background: "linear-gradient(to right, #b01500, #c93d3d)",
            }
        }).showToast();
    }
});

//Async Eliminar Categoria
const eliminarCategoria = async (id) => {
    if (confirm("Desea Eliminar esta categoría ?")) {
        try {
            const response = await fetch(`/deleteCategoria/${id}`);
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

            getCategorias();
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
    getCategorias();
})