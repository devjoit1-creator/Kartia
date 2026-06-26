//Constantes
const btnNuevaBodega = document.getElementById("btnNuevaBodega");
const searchInput = document.getElementById("searchInput");
const modalBodega = document.getElementById("modalBodega");
const idBodega = document.getElementById("idBodega");
const nomBodega = document.getElementById("nomBodega");
const formBodega = document.getElementById("formBodega");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");
const tablaBodegas = document.getElementById("tablaBodegas");


//Uppercase
nomBodega.addEventListener("keyup", () => {
    nomBodega.value = nomBodega.value.toUpperCase();
});

//Activar Modal
const activarModal = () => {
    modalBodega.classList.remove("is-hidden");
    modalBodega.classList.add("is-active");
    btnGuardar.classList.add("is-active");
    btnGuardar.classList.remover("is-hidden");
    btnActualizar.classList.add("is-hidden");
    btnActualizar.classList.remove("is-active");
    
};
btnNuevaBodega.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
});

//Activar Modal Bodega Editar
const activarModalEditar = (id) => {
    modalBodega.classList.remove("is-hidden");
    modalBodega.classList.add("is-active");
    idBodega.setAttribute("readonly", true);
    btnActualizar.classList.remove("is-hidden");
    btnActualizar.classList.add("is-active");
    btnGuardar.classList.remove("is-active");
    btnGuardar.classList.add("is-hidden");
    fetch(`/getBodegasId/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if(!Array.isArray(data) || data.length === 0){
            alert("No hay datos");
            return;
        };
        
        data.forEach(bodega => {
            idBodega.value = bodega.idBodega;
            nomBodega.value = bodega.nomBodega;
            btnActualizar.dataset.idOriginal = bodega.idBodega;
        });
    })
}

//Desactivar Modal
const desactivarModal = () => {
    modalBodega.classList.add("is-hidden");
    modalBodega.classList.remove("is-active");
};

btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    formBodega.reset();
    desactivarModal();
});

//Datos en Tabla
let allBodegas = [];
let filteredBodegas = [];
let currentPage = 1;
const rowsPerPage = 5;
const getBodegas = async () => {
    try {
        const response = await fetch("/getBodegas");
        if(!response.ok) throw new Error('Error cargando los datos');

        const result = await response.json();
        allBodegas = result;

        filteredBodegas = [...allBodegas];
        renderTabla();
        renderPaginas();
    } catch (err) {
        console.error("error: ", err)
    }
};

const renderTabla = () => {
    const tbody = document.getElementById("bodegasTbody");
    tbody.innerHTML = '';

    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = inicio + rowsPerPage;
    const datosPagina = filteredBodegas.slice(inicio, fin);

    if(datosPagina.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="3" class="has-text-centered">No se encontraron resultados</td></tr>
        `
        return;  
    };

    datosPagina.forEach(bodega => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${bodega.idBodega}</td>
            <td>${bodega.nomBodega}</td>
            <td>
                <a onclick="activarModalEditar('${bodega.idBodega}')" class="has-icon button is-small is-info has-tooltip-bottom" data-tooltip="Editar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-pencil"></i></span>
                </a>
                <a onclick="eliminarBodega('${bodega.idBodega}')" class="has-icon button is-small is-danger has-tooltip-bottom" data-tooltip="Eliminar" style="padding: 0em 1.0em">
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

    const totalPages = Math.ceil(filteredBodegas.length / rowsPerPage);
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
    filteredBodegas = allBodegas.filter(bodega => {
        const id = String(bodega.idBodega || '').toLowerCase();
        const nombre = String(bodega.nomBodega || '').toLowerCase();

        return id.includes(termino) || nombre.includes(termino);
    });

    currentPage = 1;
    renderTabla();
    renderPaginas();
});

// Async guardar nueva bodega
formBodega.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    try {
        const response = await fetch("/addBodega", {
            method: "POST",
            body: dataForm
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error(result.Error);
            Toastify({
                text: `Se presentó un error: ${result.Error}`,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #b01500, #c93d3d)",
                }
            }).showToast();
            return;
        };

        formBodega.reset();
        getBodegas();
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
    }
});

//Async Actualizar Datos Bodega
btnActualizar.addEventListener("click", async () => {
    const datosForm = new FormData(formBodega);
    const idOriginal = btnActualizar.dataset.idOriginal;

    try {
        const response = await fetch('/editBodega', {
            method: "POST",
            body: datosForm
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error(result.Error);
            Toastify({
                text: `Se presentó un error: ${result.Error}`,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #b01500, #c93d3d)",
                }
            }).showToast();
            return;
        };

        formBodega.reset();
        getBodegas();
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
    }
})

// Async Eliminar Bodega de BD
const eliminarBodega = async (id) => {
    if(confirm("Desea Eliminar esta bodega ?")){
        try {
            const response = await fetch(`/deleteBodega/${id}`)
            const result = await response.json()
            if(!response.ok){
                throw new Error(result.Error);
                Toastify({
                    text: `Se presentó un error: ${result.Error}`,
                    className: "error",
                    style: {
                        background: "linear-gradient(to right, #b01500, #c93d3d)",
                    }
                }).showToast();
                return;
            }

            getBodegas();
            Toastify({
                text: `${result.message}`,
                className: "success",
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                }
            }).showToast();
        } catch (error) {
            console.error("error: ", err)
            Toastify({
                text: `Se presentó un error: ${err}`,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #b01500, #c93d3d)",
                }
            }).showToast();
        }
    }
};

// Cargar Datos
document.addEventListener("DOMContentLoaded", () => {
    getBodegas();
});