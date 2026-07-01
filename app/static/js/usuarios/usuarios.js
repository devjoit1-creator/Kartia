//Constantes
const usuario = document.getElementById("usuario");
const passwd = document.getElementById("passwd");
const nomUsuario = document.getElementById("nomUsuario");
const rolId = document.getElementById("rolId");
const isActive = document.querySelectorAll("input[name='isActive']");
const modalUsuarios = document.getElementById("modalUsuarios");
const btnNuevoUsuario = document.getElementById("btnNuevoUsuario");
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