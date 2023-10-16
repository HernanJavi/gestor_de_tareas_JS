//PROYECTO AGREGAR TAREAS

//VARIABLES GLOBALES
const ESTADO = {
    PENDIENTE: 'Pendiente',
    EN_CURSO: 'En-Curso',
    TERMINADA: 'Terminada'
}
let almacenamientoTareas = []
let listaOrigen = null;

//ELEMENTOS IDENTICADOS DEL DOM
let header_lista = document.getElementById('header_lista');
let ul_lista = document.getElementById('cajita_uno');
let btn_add = document.getElementById('btn_add');
let btn_delete = document.getElementById('btn_delete')
let btn_edit = document.getElementById('btn_edit_task');
let listaItems = ul_lista.querySelectorAll('li');
let cajita_destino = document.getElementById('cajita_dos')


//MANEJADORES DE EVENTOS
btn_add.addEventListener('click', agregarTarea);
btn_edit.addEventListener('click', editarTarea);
btn_delete.addEventListener('click', BorrarTarea);


//FUNCION AGREGAR TAREA A TRAVES DE BOTON=>Pido al usuario el nombre de la tarea, y creo un objeto con la misma, 
//asignandole un ID por default y un estado inicial,luego agrego el valor al 
//array global y llamo A generarTareaEnDom() para agregarlo al DOM
function agregarTarea(e) {

    let nombre_Tarea = prompt('Ingrese nombre de Tarea nueva:');

    if (nombre_Tarea === null) {

        return;

    }
    let Tarea = {
        nombre: nombre_Tarea,
        id: generarIDUnico(),
        ESTADO: ESTADO.EN_CURSO
    }

    almacenamientoTareas.push(Tarea);

    generarTareaEnDom(Tarea)
}
//FUNCION GENERAR RANDOM
function generarIDUnico() {
    return Math.floor(Math.random() * 1000000);
}

//FUNCION generarTareaEnDom(tarea)=>Permite crear el nodo de ese elemento a agregar al DOM,
// le agrego al nodo el atributo 'data-id' para poder identificarlo posteriormente y manipularlo
//le agrego a cada <li> el comportamiento draggable para que pueda ser arrastrable y manipulable 

function generarTareaEnDom(tarea) {

    let NodoLi = document.createElement('li');

    NodoLi.innerHTML = `ID: <span class="id-destacado">${tarea.id}</span> Nombre de Tarea:<span class="tarea-destacado"> ${tarea.nombre}</span> Estado: <span class="estado-destacado">${ESTADO.EN_CURSO}</span>`;
    NodoLi.setAttribute('data-id', tarea.id)
    NodoLi.setAttribute('draggable', true)
    ul_lista.appendChild(NodoLi)

    //Pongo a la escucha del evento a cada li agregado dinamicamente,este detectara cuando un elemento empieza a ser arrastrado
    // NodoLi.addEventListener('dragstart', arrastrar)

}


//FUNCION BorrarTarea()=>Pide al usuario un ID a buscar,y lo compara con el array global para saber si existe,de ser asi, llama a eliminarTareaEndDom(), quien recibe ese elemento del array
function BorrarTarea() {
    let ID = prompt('Indique ID tarea a eliminar:')
    let tareaEncontrada = almacenamientoTareas.find(tarea => tarea.id == ID)

    if (tareaEncontrada) {

        eliminarTareaEnDom(tareaEncontrada, ul_lista)
        eliminarTareaEnDom(tareaEncontrada, cajita_destino)
    }
}

//FUNCION eliminarTareaEnDom()=>busca ese elemento del array global en el DOM, y lo elimina
function eliminarTareaEnDom(tarea, lista) {


    let elementoLista = lista.querySelector(`li[data-id="${tarea.id}"]`)
    if (elementoLista) {

        elementoLista.remove();
    }
}

//FUNCION EDITAR TAREA(BUSQUEDA POR ID)=>El usuario ingresa tanto ID como nombre de la nueva tarea, 
//y recorro con el metodo find mi array global,
//si lo encuentra lo modifico en mi array y llamo a la funcion actualizarTareaEnDom()
function editarTarea() {
    let id = prompt("Ingrese el ID de la tarea que desea editar:");
    if (id === null) {

        return;
    }


    let nombre_tarea = prompt('Indique el nuevo nombre para la tarea:');



    let tareaEncontrada = almacenamientoTareas.find(item => item.id == id);

    if (tareaEncontrada) {
        tareaEncontrada.nombre = nombre_tarea

        actualizarTareaEnDom(tareaEncontrada);
    } else {
        alert("No se encontró una tarea con el ID proporcionado.");
    }
}
//FUNCION actualizarTareaEnDom()
//Una vez detectado en mi array global recibo ese elemento, 
//lo busco en el DOM,le asigno el valor del elemento del array
function actualizarTareaEnDom(tarea) {

    let elementoLista = ul_lista.querySelector(`li[data-id="${tarea.id}"]`)


    elementoLista.innerHTML = `ID: <span class="id-destacado">${tarea.id}</span> Nombre de Tarea:<span class="tarea-destacado"> ${tarea.nombre}</span> Estado: <span class="estado-destacado">${ESTADO.EN_CURSO}</span>`;


}

//FUNCIONALIDAD ADICIONAL: DRAG AND DROP
//El proceso de drag and drop es posible en primera instancia gracias al atributo 'draggable'=true asignado en cada <li>,que me habilita que ese componente sea arrastrable
//Como paso 2 me asegure de poner esta instruccion cuando genero el nodo en el DOM " NodoLi.addEventListener('dragstart', arrastrar)" para que se llame a dicha funcion ni bien se empieze a arrastrar el elemento focuseado



//FUNCION arrastrar()
//Primero capturo el elemento que desencadeno el "dragstart" , 
//Almaceno y capturo el atributo "data-id" para luego asignarselo al li-destino de la lista-destino


ul_lista.addEventListener("dragstart", arrastrar)
cajita_destino.addEventListener("dragstart", arrastrar)

function arrastrar(evento) {

    const elementoArrastrado = evento.target;

    listaOrigen = evento.currentTarget;


    const id = elementoArrastrado.getAttribute("data-id");

    //con esta linea obtengo el contenido de la etiqueta
    evento.dataTransfer.setData("text/plain", evento.target.innerHTML)
    //con esta linea obtengo el id del <li> y lo guardo en "text/id"
    evento.dataTransfer.setData("text/id", id)

}

//Prevengo el comportamiento por default del evento, asi puedo arrastrar y soltar elementos donde yo desee , de manera personalizada 
cajita_destino.addEventListener('dragover', (e) => e.preventDefault())

//Pongo a la escucha a la lista destino del evento drop,que sucede cuando suelto el click mantenido por mi:

cajita_destino.addEventListener("drop", function (e) {


    e.preventDefault();

    if (listaOrigen == cajita_destino) {
        return;
    }

    //Capturo los valores y los guardo en variables
    const data = e.dataTransfer.getData("text/plain");
    const id = e.dataTransfer.getData("text/id")

    const tareaEncontrada = almacenamientoTareas.find(tarea => tarea.id == id)

    if (tareaEncontrada) {

        tareaEncontrada.ESTADO = ESTADO.PENDIENTE

    }

    //creo el nodo y almaceno el contenido
    const nuevoElemento = document.createElement("li");
    nuevoElemento.innerHTML = data;

    nuevoElemento.innerHTML = `ID: <span class="id-destacado">${tareaEncontrada.id}</span> Nombre de Tarea: <span class="tarea-destacado">${tareaEncontrada.nombre}</span> Estado: <span class="estado-destacado">${tareaEncontrada.ESTADO}</span>`;
    //le asigno los atributos nuevamente ya que innerHTML solo me trae el contenido de la etiqueta
    nuevoElemento.setAttribute('draggable', true)
    //le asigno el atributo 'data-id' con el valor que tenia el li en su lista anterior
    nuevoElemento.setAttribute('data-id', id)
    //agrego el elemento al DOM gracias a que lo identifique a traves de su id
    cajita_destino.appendChild(nuevoElemento);

    //Por ultimo elimino el elemento de su lista anterior gracias a que capture su id
    eliminarTareaDeOrigen(id);

    //vuelvo a poner al li destino a la escucha del evento,asi detecta cuando empieza a ser arrastrado


})

//FUNCION eliminarTareaDeOrigen()
//Busca el elemento en el DOM y lo elimina
function eliminarTareaDeOrigen(id) {

    const elementoListaOrigen = ul_lista.querySelector(`li[data-id="${id}"]`)

    if (elementoListaOrigen) {

        elementoListaOrigen.remove();
    }
}


//Se repite el proceso pero ahora DESDE DESTINO HACIA ORIGEN

ul_lista.addEventListener('dragover', (e) => e.preventDefault())


ul_lista.addEventListener("drop", function (e) {


    e.preventDefault();

    //Aca le digo, si la lista de origen es la misma lista donde quiero soltar el elemento, que no haga nada
    if (listaOrigen == ul_lista) {
        return;
    }

    const data = e.dataTransfer.getData("text/plain");
    const id = e.dataTransfer.getData("text/id")


    const tareaEncontrada = almacenamientoTareas.find(tarea => tarea.id == id)

    if (tareaEncontrada) {

        tareaEncontrada.ESTADO = ESTADO.EN_CURSO
        console.log(tareaEncontrada.ESTADO);
        console.log(tareaEncontrada.nombre);
    }


    const nuevoElemento = document.createElement("li");
    nuevoElemento.innerHTML = data;
    nuevoElemento.innerHTML = `ID: <span class="id-destacado">${tareaEncontrada.id}</span> Nombre de Tarea: <span class="tarea-destacado">${tareaEncontrada.nombre}</span> Estado: <span class="estado-destacado">${tareaEncontrada.ESTADO}</span>`;
    nuevoElemento.setAttribute('draggable', true)
    nuevoElemento.setAttribute('data-id', id)
    console.log(nuevoElemento)
    ul_lista.appendChild(nuevoElemento);

    eliminarTareaDeOrigen2(id);

    nuevoElemento.addEventListener('dragstart', arrastrar)

})

function eliminarTareaDeOrigen2(id) {

    const elementoListaOrigen = cajita_destino.querySelector(`li[data-id="${id}"]`)

    if (elementoListaOrigen) {

        elementoListaOrigen.remove();
    }
}



//FUNCIONALIDAD ADICIONAL: ELIMINAR ELEMENTO CON CLICK DERECHO
//Utilizo delegacion de eventos ,poniendo la escucha a la lista y asi
// puedo detectar de manera dinamica a medida que se van agregando tareas (elementos <li>),
//Cuando haga click derecho detectara el li focuseado y lo eliminara


ul_lista.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    if (e.target.tagName === 'LI') {
        e.target.remove()
    }
})

cajita_destino.addEventListener('contextmenu', (e) => {
    e.preventDefault()
    if (e.target.tagName === 'LI') {
        e.target.remove();
    }
})



