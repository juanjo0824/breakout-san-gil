const canvas = document.getElementById("juego");
const ctx = canvas.getContext("2d");

const puntosTexto = document.getElementById("puntos");
const vidasTexto = document.getElementById("vidas");


// ==============================
// VARIABLES DEL JUEGO
// ==============================

let puntos = 0;
let vidas = 3;

let izquierda = false;
let derecha = false;


// ==============================
// PELOTA
// ==============================

let pelota = {
    x: 400,
    y: 430,
    radio: 10,
    velocidadX: 4,
    velocidadY: -4
};


// ==============================
// PLATAFORMA
// ==============================

let plataforma = {
    x: 350,
    y: 465,
    ancho: 100,
    alto: 12,
    velocidad: 7
};


// ==============================
// BLOQUES
// ==============================

const filas = 5;
const columnas = 8;

const anchoBloque = 85;
const altoBloque = 22;
const separacion = 10;

const inicioX = 30;
const inicioY = 40;

let bloques = [];


// ==============================
// CREAR BLOQUES
// ==============================

function crearBloques() {

    for (let fila = 0; fila < filas; fila++) {

        bloques[fila] = [];

        for (let columna = 0; columna < columnas; columna++) {

            bloques[fila][columna] = true;

        }
    }
}


// ==============================
// DIBUJAR PELOTA
// ==============================

function dibujarPelota() {

    ctx.beginPath();

    ctx.arc(
        pelota.x,
        pelota.y,
        pelota.radio,
        0,
        Math.PI * 2
    );

    ctx.fillStyle = "#ffffff";
    ctx.fill();

    ctx.strokeStyle = "#f2c94c";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.closePath();
}


// ==============================
// DIBUJAR PLATAFORMA
// ==============================

function dibujarPlataforma() {

    ctx.fillStyle = "#f2c94c";

    ctx.fillRect(
        plataforma.x,
        plataforma.y,
        plataforma.ancho,
        plataforma.alto
    );
}


// ==============================
// DIBUJAR BLOQUES
// ==============================

function dibujarBloques() {

    const colores = [
        "#f2c94c",
        "#27ae60",
        "#219653",
        "#2d9cdb",
        "#eb5757"
    ];

    for (let fila = 0; fila < filas; fila++) {

        for (let columna = 0; columna < columnas; columna++) {

            if (bloques[fila][columna] === true) {

                const x =
                    inicioX +
                    columna * (anchoBloque + separacion);

                const y =
                    inicioY +
                    fila * (altoBloque + separacion);

                ctx.fillStyle = colores[fila];

                ctx.fillRect(
                    x,
                    y,
                    anchoBloque,
                    altoBloque
                );
            }
        }
    }
}


// ==============================
// MOVER PELOTA
// ==============================

function moverPelota() {

    pelota.x += pelota.velocidadX;
    pelota.y += pelota.velocidadY;


    // Pared izquierda
    if (pelota.x - pelota.radio <= 0) {

        pelota.x = pelota.radio;

        pelota.velocidadX *= -1;
    }


    // Pared derecha
    if (pelota.x + pelota.radio >= canvas.width) {

        pelota.x = canvas.width - pelota.radio;

        pelota.velocidadX *= -1;
    }


    // Pared superior
    if (pelota.y - pelota.radio <= 0) {

        pelota.y = pelota.radio;

        pelota.velocidadY *= -1;
    }


    // ==========================
    // COLISIÓN CON PLATAFORMA
    // ==========================

    if (
        pelota.y + pelota.radio >= plataforma.y &&
        pelota.y - pelota.radio <= plataforma.y + plataforma.alto &&
        pelota.x >= plataforma.x &&
        pelota.x <= plataforma.x + plataforma.ancho &&
        pelota.velocidadY > 0
    ) {

        pelota.y = plataforma.y - pelota.radio;

        pelota.velocidadY *= -1;
    }


    // ==========================
    // PELOTA CAE
    // ==========================

    if (pelota.y - pelota.radio > canvas.height) {

        vidas--;

        vidasTexto.textContent = vidas;

        reiniciarPelota();


        if (vidas <= 0) {

            alert(
                "GAME OVER\n\nPuntos obtenidos: " + puntos
            );

            location.reload();
        }
    }
}


// ==============================
// REINICIAR PELOTA
// ==============================

function reiniciarPelota() {

    pelota.x = 400;
    pelota.y = 430;

    pelota.velocidadX = 4;
    pelota.velocidadY = -4;
}


// ==============================
// MOVER PLATAFORMA
// ==============================

function moverPlataforma() {

    if (izquierda) {

        plataforma.x -= plataforma.velocidad;
    }

    if (derecha) {

        plataforma.x += plataforma.velocidad;
    }


    // Evitar que salga por la izquierda

    if (plataforma.x < 0) {

        plataforma.x = 0;
    }


    // Evitar que salga por la derecha

    if (
        plataforma.x + plataforma.ancho >
        canvas.width
    ) {

        plataforma.x =
            canvas.width - plataforma.ancho;
    }
}


// ==============================
// REVISAR COLISIONES CON BLOQUES
// ==============================

function revisarBloques() {

    for (let fila = 0; fila < filas; fila++) {

        for (let columna = 0; columna < columnas; columna++) {

            if (bloques[fila][columna] === false) {

                continue;
            }


            const x =
                inicioX +
                columna * (anchoBloque + separacion);

            const y =
                inicioY +
                fila * (altoBloque + separacion);


            // Detectar choque con el bloque

            if (
                pelota.x + pelota.radio > x &&
                pelota.x - pelota.radio < x + anchoBloque &&
                pelota.y + pelota.radio > y &&
                pelota.y - pelota.radio < y + altoBloque
            ) {

                bloques[fila][columna] = false;

                pelota.velocidadY *= -1;

                puntos += 10;

                puntosTexto.textContent = puntos;
            }
        }
    }
}


// ==============================
// CONTROLES DEL TECLADO
// ==============================

document.addEventListener("keydown", function(event) {

    if (event.key === "ArrowLeft") {

        izquierda = true;
    }

    if (event.key === "ArrowRight") {

        derecha = true;
    }

});


document.addEventListener("keyup", function(event) {

    if (event.key === "ArrowLeft") {

        izquierda = false;
    }

    if (event.key === "ArrowRight") {

        derecha = false;
    }

});


// ==============================
// DIBUJAR JUEGO
// ==============================

function dibujar() {

    // Limpiar tablero

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    // Fondo negro

    ctx.fillStyle = "#000000";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    dibujarBloques();

    dibujarPelota();

    dibujarPlataforma();
}


// ==============================
// BUCLE PRINCIPAL
// ==============================

function juego() {

    moverPlataforma();

    moverPelota();

    revisarBloques();

    dibujar();

    requestAnimationFrame(juego);
}


// ==============================
// INICIAR JUEGO
// ==============================

crearBloques();

juego();