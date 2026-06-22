//Constantes
const btnNuevaBodega = document.getElementById("btnNuevaBodega");
const searchInput = document.getElementById("searchInput");
const modalNuevaBodega = document.getElementById("modalNuevaBodega");
const idBodega = document.getElementById("idBodega");
const nomBodega = document.getElementById("nomBodega");
const formNuevaBodega = document.getElementById("formNuevaBodega");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");
const tablaBodegas = document.getElementById("tablaBodegas");


//Uppercase
nomBodega.addEventListener("keyup", () => {
    nomBodega.value = nomBodega.value.toUpperCase();
});

//Activar Modal
const activarModal = () => {
    modalNuevaBodega.classList.remove("is-hidden");
    modalNuevaBodega.classList.add("is-active");
};
btnNuevaBodega.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
});

//Desactivar Modal
const desactivarModal = () => {
    modalNuevaBodega.classList.add("is-hidden");
    modalNuevaBodega.classList.remove("is-active");
};

btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    formNuevaBodega.reset();
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
        `
        tbody.appendChild(tr);
    });
};

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
formNuevaBodega.addEventListener("submit", async (e) => {
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

        formNuevaBodega.reset();
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

// Cargar Datos
document.addEventListener("DOMContentLoaded", () => {
    getBodegas();
});