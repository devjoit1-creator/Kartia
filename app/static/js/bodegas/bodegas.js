//Constantes
const btnNuevaBodega = document.getElementById("btnNuevaBodega");
const modalNuevaBodega = document.getElementById("modalNuevaBodega");
const idBodega = document.getElementById("idBodega");
const nomBodega = document.getElementById("nomBodega");
const btnGuardar = document.getElementById("btnGuardar");
const btnCancelar = document.getElementById("btnCancelar");

//Activar Modal
btnNuevaBodega.addEventListener("click", (e) => {
    e.preventDefault();
    modalNuevaBodega.classList.remove("is-hidden");
    modalNuevaBodega.classList.add("is-active");
});

//Desactivar Modal
btnCancelar.addEventListener("click", (e) => {
    e.preventDefault();
    modalNuevaBodega.classList.add("is-hidden");
    modalNuevaBodega.classList.remove("is-active");
});

// Async guardar nueva bodega
const guardarBodega = async () => {
    let id = idBodega.value;
    let nombre = nomBodega.value;
    try {
        const response = await fetch("/addBodega", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ id, nombre })
        });

        const result = await response.json();

        if(!response.ok){
            throw new Error(result.Error || 'Error');
        };

        
        console.log("Exito", result.message);
        console.log("datos", result.data);

    } catch (error) {
        console.error("error: ", error)
    }
};

btnGuardar.addEventListener("click", (e) => {
    e.preventDefault();
    guardarBodega();
});