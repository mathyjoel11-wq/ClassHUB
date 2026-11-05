
const aulas = {
    1: {
        nombre: "Aula 1",
        referencia: 36,
        capacidad: "Pendiente de relevamiento",
        estado: "Disponible"
    },
    2: {
        nombre: "Aula 2",
        referencia: 30,
        capacidad: "Pendiente de relevamiento",
        estado: "Disponible"
    },
    3: {
        nombre: "Aula 3",
        referencia: 27,
        capacidad: "Pendiente de relevamiento",
        estado: "Disponible"
    }
};

const elementosAulas = document.querySelectorAll(".classroom");
const panelInfo = document.getElementById("infoAula");

function seleccionarAula(elemento) {
    const numero = elemento.dataset.aula;
    const aula = aulas[numero];

    if (!aula) return;

    // Quitar selección anterior
    elementosAulas.forEach((item) => {
        item.classList.remove("selected");
    });

    // Marcar aula seleccionada
    elemento.classList.add("selected");

    const estadoClase = aula.estado.toLowerCase();

    let claseEstado = "info-state";

    if (estadoClase === "reservada") {
        claseEstado += " reserved";
    } else if (estadoClase === "no disponible") {
        claseEstado += " unavailable";
    }

    panelInfo.innerHTML = `
        <div class="info-content">
            <h3>${aula.nombre}</h3>

            <p>
                <strong>Referencia del plano:</strong>
                ${aula.referencia}
            </p>

            <p>
                <strong>Capacidad:</strong>
                ${aula.capacidad}
            </p>

            <p>
                <strong>Estado:</strong>
            </p>

            <span class="${claseEstado}">
                ${aula.estado} · Datos de demostración
            </span>
        </div>
    `;
}

// Selección con clic o teclado
elementosAulas.forEach((elemento) => {
    elemento.addEventListener("click", () => {
        seleccionarAula(elemento);
    });

    elemento.addEventListener("keydown", (evento) => {
        if (evento.key === "Enter" || evento.key === " ") {
            evento.preventDefault();
            seleccionarAula(elemento);
        }
    });
});
