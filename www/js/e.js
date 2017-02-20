/*jslint devel: true, browser:true */
/*global $:false */

//objetos json barcos
//posteriormente lo almacenamos en localStorage
var barcos = null;
var filas = null;
var columnas = null;

//variable ara almacenar el tablero
//matriz del tablero
var tablero = null;

/* Esta funcion responde al evento "ready" y 
carga la configuracion inicial de mi APP, 
si no hay configuracion, 
cargamos una configuración por defecto */
$(document).ready(function(){
    //¿hay localStorage disponible (almacenamos la configuración ahí)?
    if (typeof(Storage) !== "undefined") {
        barcos = JSON.parse(localStorage.getItem("barcos"));
        filas = parseInt(localStorage.getItem("filas"));
        columnas = parseInt(localStorage.getItem("columnas"));
        console.log(barcos);
        console.log(filas);
        console.log(columnas);
        
        if (barcos === null){
            barcos = [
            {tam:2, letra:'f', nombre:'fragata'},
            {tam:3, letra:'b', nombre:'buque'},
            {tam:3, letra:'s', nombre:'submarino'},
            {tam:4, letra:'d', nombre:'destructor'},
            {tam:5, letra:'p', nombre:'portaaviones'},
            ];
            localStorage.setItem("barcos",JSON.stringify(barcos));
        }
         
        filas = parseInt(localStorage.getItem("filas"));
        columnas = parseInt(localStorage.getItem("columnas"));
        
        if (isNaN(filas) || isNaN(columnas)) {
            filas = 8;
            columnas = 8;
            localStorage.setItem("filas",8);
            localStorage.setItem("columnas",8);
        }
        
    } 
    else { //No hay localStorage no podemos guardar conf. ni información de las partidas
            console.log("No tenemos LocalStorage");
    }
});

//funcion que crea una estructura de datos tipo matriz (js --> array de arrays)
function crearMatriz(filas, columnas) {
    
    var matriz = new Array(filas);
    
    for(var i=0;i<filas;i++){
        matriz[i] = new Array(columnas);
    }
    
    return matriz;
}

/*esta funcion "rellena" con dato cada uno de los elementos de
la matriz que se le pasa como parámetro */
function inicializarMatriz(dato, matriz){
    for (var i=0;i<matriz.length;i++){
        for (var j=0;j<matriz[i].length;j++){
            matriz[i][j]=dato;
        }
    }
}

/* vuelca el contenido de la matriz a consola */

function matriz2Console(matriz){
    var aux;
    for (var i=0;i<matriz.length;i++){
        aux = "";
        for (var j=0;j<matriz[i].length;j++){
            aux+=matriz[i][j]+"\t";
        }
        console.log(aux);
    }
}

//funciones auxiliares

/* funcion que devuelve un aleatorio desde 0 hasta valor-1 */
function dado(tamaño){
    var aleatorio = parseInt(Math.random() * tamaño);
    return aleatorio;
}

/*devuelve de 0 a 1 */

function moneda(){
    return dado(2);
   
}

/* codificación para el tablero:
a = agua
s = submarino (3)
d = destructor (4)
p = portaaviones (5)
f = fragata (2)
b = buque (3) */

function colocarBarcos(matriz){
    /* comprueba que haya más de 8 filas
    y la primera fila sean más de 8 columnas (se
    supone que todas las filas son iguales en número de columnas) */
    for (var i=0;i<barcos.length;i++){
        var barco = barcos[i];
        var libre;
        do {
            //intento colocar el barco hasta
            //que encuentre espacio libre
            libre = true;
            var direccion = moneda();
            var fila;
            var columna;
            var j;
            if (direccion===0){ //horizontal
                fila = dado(matriz.length);
                columna = dado(matriz[fila].length-barco.tam);
                for (j = 0;j<barco.tam;j++){
                    if (matriz[fila][j+columna] != "a"){
                        libre = false;
                    }
                }
                if(libre){
                    for(j = 0;j<barco.tam;j++){
                        matriz[fila][j+columna] = barco.letra;
                    }
                }
            }
            else { //vertical
                fila = dado(matriz.length-barco.tam);
                columna = dado(matriz[fila].length);
                for (j = 0;j<barco.tam;j++){
                    if (matriz[j+fila][columna] != "a"){
                        libre = false;
                    }
                }
                if(libre){
                    for(j = 0;j<barco.tam;j++){
                        matriz[j+fila][columna] = barco.letra;
                    }
                }
            }
        }while(!libre);
    }
}


var html = "<table>";
function generarTablero(){
        for(var i=0;i<filas;i++){
            html += "<tr>";
            for(var j=0;j<columnas;j++){
                html += "<td id='celda_"+i+"_"+j+"' class='vacio' onclick=disparo('celda_"+i+"_"+j+"',"+i+","+j+")><td>";
            }
        
        html += "</tr>";
            
    }
    
    html += "</table>";
    document.getElementById("partida").innerHTML = html;
    
}

function disparo(celda,i,j){
   //alert(celda);
   switch (tablero[i][j]) {
       case 'a':
           tablero[i][j] = 'A';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('agua');
           break;
        case 'b':
           tablero[i][j] = 'B';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('buque');
           break;
        case 'f':
           tablero[i][j] = 'F';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('fragata');
           break;
        case 's':
           tablero[i][j] = 'S';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('submarino');
           break;
        case 'd':
           tablero[i][j] = 'D';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('destructor');
            break;
        case 'p':
           tablero[i][j] = 'P';
           $('#'+celda).removeClass('vacio');
           $('#'+celda).addClass('portaaviones');
           break;
        default:
    }
}
    
/*  */
function crearPartida(){
    //crear una matriz de filas * columnas
    tablero = crearMatriz(filas, columnas);
    
    //rellenar la matriz "a"
    inicializarMatriz("a", tablero);
    colocarBarcos(tablero);
    generarTablero();
    
    //volcar la matriz a consola
    matriz2Console(tablero);
}f