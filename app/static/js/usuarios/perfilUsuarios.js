//Constantes
const idRol = document.getElementById("idRol");
const nomRol = document.getElementById("nomRol");
const descripcionRol = document.getElementById("descripcionRol");
const searchInput = document.getElementById("searchInput");
const perfilesTbody = document.getElementById("perfilesTbody");
const modalPerfiles = document.getElementById("modalPerfiles");
const formPerfil = document.getElementById("formPerfil");
const btnNuevoPerfil = document.getElementById("btnNuevoPerfil");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");

//Uppercase
nomRol.addEventListener("keyup", () => {
    nomRol.value = nomRol.value.toUpperCase();
});

descripcionRol.addEventListener("keyup", () => {
    descripcionRol.value = descripcionRol.value.toUpperCase();
});

//Activar Modal Nuevo Perfil
const activarModal = () => {
    modalPerfiles.classList.remove("is-hidden");
    modalPerfiles.classList.add("is-active");
};
btnNuevoPerfil.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
});

const activarModalEditar = (id) => {
    modalPerfiles.classList.remove("is-hidden");
    modalPerfiles.classList.add("is-active");
    btnActualizar.classList.remove("is-hidden");
    btnActualizar.classList.add("is-active");
    btnGuardar.classList.remove("is-active");
    btnGuardar.classList.add("is-hidden");
    fetch(`/getPerfilId/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if(!Array.isArray(data) || data.length === 0){
            alert("No hay datos");
            return;
        };

        data.forEach(perfil => {
            idRol.value = perfil.idRol;
            nomRol.value = perfil.nomRol;
            descripcionRol.value = perfil.descripcionRol;
            btnActualizar.dataset.idOriginal = perfil.idRol;
        });
    })
    .catch(error => console.error("error: ", error))
}

//Desactivar Modal
const desactivarModal = () => {
    modalPerfiles.classList.remove("is-active");
    modalPerfiles.classList.add("is-hidden");
};
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    formPerfil.reset();
    desactivarModal();
});


//Datos en Tabla
let allPerfiles = [];
let filteredPerfiles = [];
let currentPage = 1;
const rowsPerPage = 5;
const getPerfiles = async () => {
    try {
        const response = await fetch("/getPerfiles");
        if(!response.ok) throw new Error('Error cargando los datos');

        const result = await response.json();
        allPerfiles = result;

        filteredPerfiles = [...allPerfiles];
        renderTabla();
        renderPaginas();
    } catch (err) {
        console.error("error: ", err)
    }
};

const renderTabla = () => {
    const tbody = perfilesTbody;
    tbody.innerHTML = '';

    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = inicio + rowsPerPage;
    const datosPagina = filteredPerfiles.slice(inicio, fin);

    if(datosPagina.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="4" class="has-text-centered">No se encontraron resultados</td></tr>
        `
        return;  
    };

    datosPagina.forEach(perfil => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${perfil.idRol}</td>
            <td>${perfil.nomRol}</td>
            <td>${perfil.descripcionRol}</td>
            <td>
                <a onclick="activarModalEditar('${perfil.idRol}')" class="has-icon button is-small is-info has-tooltip-bottom" data-tooltip="Editar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-pencil"></i></span>
                </a>
                <a onclick="eliminarPerfil('${perfil.idRol}')" class="has-icon button is-small is-danger has-tooltip-bottom" data-tooltip="Eliminar" style="padding: 0em 1.0em">
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

    const totalPages = Math.ceil(filteredPerfiles.length / rowsPerPage);
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
    filteredPerfiles = allPerfiles.filter(perfil => {
        const id = String(perfil.idRol || '').toLowerCase();
        const nombre = String(perfil.nomRol || '').toLowerCase();
        const descripcion = String(perfil.descripcionRol || '').toLowerCase();

        return id.includes(termino) || nombre.includes(termino) || descripcion.includes(termino);
    });

    currentPage = 1;
    renderTabla();
    renderPaginas();
});

//Async Guardar Nuevo Perfil
formPerfil.addEventListener("submit", async (e) => {
    e.preventDefault();
    const dataForm = new FormData(e.target);
    try {
        const response = await fetch('/addPerfil', {
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

        formPerfil.reset();
        getPerfiles();
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

//Async Actualizar datos de perfil
btnActualizar.addEventListener("click", async () => {
    const datosForm = new FormData(formPerfil);
    const idOriginal = btnActualizar.dataset.idOriginal;

    try{
        const response = await fetch("/editPerfil", {
            method: "POST",
            body: datosForm
        });

        const result = await response.json();
        if(!response.ok){
            throw new Error(result.Error)
            Toastify({
                text: `Se presentó un error: ${result.Error}`,
                className: "error",
                style: {
                    background: "linear-gradient(to right, #b01500, #c93d3d)",
                }
            }).showToast();
            return;
        };

        formPerfil.reset();
        getPerfiles();
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

// Async Eliminar Perfil de usuario
const eliminarPerfil = async (id) => {
    if(confirm("Desea eliminar este Perfil ?")){
        try {
            const response = await fetch(`/deletePerfil/${id}`);
            const result = await response.json();
            if(!response.ok){
                throw new Error(result.Error)
                Toastify({
                    text: `Se presentó un error: ${result.Error}`,
                    className: "error",
                    style: {
                        background: "linear-gradient(to right, #b01500, #c93d3d)",
                    }
                }).showToast();
                return;
            };

            getPerfiles();
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

// Cargar Datos
document.addEventListener("DOMContentLoaded", () => {
    getPerfiles();
});