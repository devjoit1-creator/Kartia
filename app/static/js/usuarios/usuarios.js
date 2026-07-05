//Constantes
const idUsuario = document.getElementById("idUsuario");
const usuario = document.getElementById("usuario");
const passwd = document.getElementById("passwd");
const nomUsuario = document.getElementById("nomUsuario");
const rolId = document.getElementById("rolId");
//const isActive = document.querySelectorAll("input[name='isActive']");
const modalUsuarios = document.getElementById("modalUsuarios");
const btnNuevoUsuario = document.getElementById("btnNuevoUsuario");
const searchInput = document.getElementById("searchInput");
const btnGuardar = document.getElementById("btnGuardar");
const btnActualizar = document.getElementById("btnActualizar");
const btnCancelar = document.getElementById("btnCancelar");
const formUsuarios = document.getElementById("formUsuarios");

//Uppercase
usuario.addEventListener("keyup", () => {
    usuario.value = usuario.value.toUpperCase();
});

nomUsuario.addEventListener("keyup", () => {
    nomUsuario.value = nomUsuario.value.toUpperCase();
});

//Activar Modal Nuevo
const activarModal = () => {
    modalUsuarios.classList.remove("is-hidden");
    modalUsuarios.classList.add("is-active");
};
btnNuevoUsuario.addEventListener("click", (e) => {
    e.preventDefault();
    activarModal();
});

//Activar Modal Editar
const activarModalEditar = (id) => {
    modalUsuarios.classList.remove("is-hidden");
    modalUsuarios.classList.add("is-active");
    btnActualizar.classList.remove("is-hidden");
    btnActualizar.classList.add("is-active");
    btnGuardar.classList.remove("is-active");
    btnGuardar.classList.add("is-hidden");
    fetch(`/getUsuarioId/${id}`, {
        method: "GET"
    })
    .then(response => response.json())
    .then(data => {
        if(!Array.isArray(data) || data.length === 0){
            alert("No hay datos");
            return;
        };

        data.forEach(usr => {
            idUsuario.value = usr.idUsuario;
            usuario.value = usr.usuario;
            passwd.value = usr.passwd;
            nomUsuario.value = usr.nomUsuario;
            rolId.value = usr.rolId;
            const estadoValor = String(usr.isActive);
            const radioButton = document.querySelector(`input[name="isActive"][value="${estadoValor}"]`);
            if(radioButton){
                radioButton.checked = true;
            };
            btnActualizar.dataset.idOriginal = usr.idUsuario;
        });
    })
    .catch(error => console.error("error: ", error));
};

//Desactivar Modal
const desactivarModal = () => {
    modalUsuarios.classList.remove("is-active");
    modalUsuarios.classList.add("is-hidden");
};
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    formUsuarios.reset();
    desactivarModal();
});

//Datos en Tabla
let allUsuarios = [];
let filteredUsuarios = [];
let currentPage = 1;
const rowsPerPage = 5;
const getUsuarios = async () => {
    try {
        const response = await fetch("/getUsuarios");
        if(!response.ok) throw new Error('Error cargando los datos');

        const result = await response.json();
        allUsuarios = result;

        filteredUsuarios = [...allUsuarios];
        renderTabla();
        renderPaginas();
    } catch (err) {
        console.error("error: ", err)
    }
};

const renderTabla = () => {
    const tbody = document.getElementById("usuariosTbody");
    tbody.innerHTML = '';

    const inicio = (currentPage - 1) * rowsPerPage;
    const fin = inicio + rowsPerPage;
    const datosPagina = filteredUsuarios.slice(inicio, fin);

    if(datosPagina.length === 0) {
        tbody.innerHTML = `
            <tr><td colspan="3" class="has-text-centered">No se encontraron resultados</td></tr>
        `
        return;  
    };

    datosPagina.forEach(usuario => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${usuario.idUsuario}</td>
            <td>${usuario.usuario}</td>
            <td>${usuario.nomUsuario}</td>
            <td>
                <a onclick="activarModalEditar('${usuario.idUsuario}')" class="has-icon button is-small is-info has-tooltip-bottom" data-tooltip="Editar" style="padding: 0em 1.0em">
                    <span class="icon"><i class="mdi mdi-pencil"></i></span>
                </a>
                <a onclick="eliminarUsuario('${usuario.idUsuario}')" class="has-icon button is-small is-danger has-tooltip-bottom" data-tooltip="Eliminar" style="padding: 0em 1.0em">
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

    const totalPages = Math.ceil(filteredUsuarios.length / rowsPerPage);
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
    filteredUsuarios = allUsuarios.filter(usuario => {
        const id = String(usuario.idBodega || '').toLowerCase();
        const user = String(usuario.usuario || '').toLowerCase();
        const nombre = String(usuario.nomUsuario || '').toLowerCase();

        return id.includes(termino) || user.includes(termino) || nombre.includes(termino);
    });

    currentPage = 1;
    renderTabla();
    renderPaginas();
});

// Async Guardar nuevo usuario
formUsuarios.addEventListener("submit", async (e) => {
    e.preventDefault();
    const datosForm = new FormData(e.target);
    try {
        const response = await fetch("/addUsuario", {
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

        formUsuarios.reset();
        getUsuarios();
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
    };
});

//Async Actualizar datos de usuario
btnActualizar.addEventListener("click", async () => {
    const datosForm = new FormData(formUsuarios);
    const idOriginal = btnActualizar.dataset.idOriginal;
    try {
        const response = await fetch("/editUsuario", {
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

        formUsuarios.reset();
        getUsuarios();
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
    };
});

// Async Eliminar Usuario
const eliminarUsuario = async (id) => {
    if (confirm("Desea Eliminar este usuario del sistema ?")) {
        try {
            const response = await fetch(`/deleteUsuario/${id}`);
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

            getUsuarios();
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
    getUsuarios();
});