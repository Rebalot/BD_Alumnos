class Grupo {
    constructor(nombre){
        this.nombre = nombre;
        this.alumnos = [];
        this.lenght = this.alumnos.length;
    }
}
class Alumno {
    constructor(matricula, nombre, apellido1, apellido2, fechaNaci, edad) {
        this.matricula = matricula;
        this.nombre = nombre;
        this.apellido1 = apellido1;
        this.apellido2 = apellido2;
        this.fechaNaci = fechaNaci;
        this.edad = edad;
        this.grupo = '';
        this.materias = [];
        this.calificaciones = {}
    }
}

class TablaAlumnos {
    constructor(tablaContenedor) {
        const newNode = [];
        this.contenedor = document.querySelector(`${tablaContenedor} tbody`);
        this.alumnos = newNode
        this.lenght = this.alumnos.length;
        this.matriculas = 0;
    }
    agregarAlumno(nombre, apellido1, apellido2, fechaNaci){

        const matricula = () => {
            let matriculaString = (this.matriculas + 1).toString().padStart(4, '0');
            return matriculaString
        }

        const calcularEdad = (fechaNacimiento) => {
            let hoy = new Date(),
                fechaNac = new Date(fechaNacimiento),
                edad = hoy.getFullYear() - fechaNac.getFullYear(),
                mes = hoy.getMonth() - fechaNac.getMonth();
        
            // Si el mes actual es menor que el mes de nacimiento o si están en el mismo mes pero el día actual es menor
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
                edad--;
            }
        
            return edad;
        }

        const matriculaGenerada = matricula(),
            edadCalculada = calcularEdad(fechaNaci),
            newNode = new Alumno(matriculaGenerada, nombre, apellido1, apellido2, fechaNaci, edadCalculada);
        
        this.contenedor.insertAdjacentHTML('beforeend', `
            <tr row_id='${matriculaGenerada}'>
                <th scope="row" class="row_data align-middle" col_name="matricula">${matriculaGenerada}</th>
                <td class="row_data align-middle" col_name="nombre">${nombre}</td>
                <td class="row_data align-middle" col_name="apellido1">${apellido1}</td>
                <td class="row_data align-middle" col_name="apellido2">${apellido2}</td>
                <td class="row_data align-middle" col_name="fechaNaci">${fechaNaci}</td>
                <td class="align-middle" col_name="edad">${edadCalculada}</td>
                <td class="align-middle" col_name="grupo"><a href="">N/A</a></td>
                <td class="align-middle" col_name="materias"><a href="">N/A</a></td>
                <td class="align-middle" col_name="calificaciones"><a href="">N/A</a></td>
                <td class="row_edit">
                    <div>
                        <span class="btn_edit">
                            <a href="#" class="btn btn-link btn_edit" row_id='${matriculaGenerada}'> Edit</a>
                        </span>
                        <span class="btn_save" style="display: none;">
                            <a href="#" class="btn btn-link btn_save" row_id='${matriculaGenerada}'> Save</a>
                        </span>
                        <span class="btn_cancel" style="display: none;">
                            <a href="#" class="btn btn-link btn_cancel" row_id='${matriculaGenerada}'> Cancel</a>
                        </span>
                    </div>
                    <div class="btn_delete_contenedor">
                        <span class="btn_delete">
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="rgb(160, 178, 192)" class="bi bi-trash-fill" viewBox="0 0 16 16">
                            <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                        </svg>
                        </span>
                    </div>
                </td>
            </tr>
        `);
        
        this.alumnos.push(newNode)
        this.lenght = this.alumnos.length;
        this.matriculas++
    }
    alumnosGrupoStatus(){
        const gruposStatus = {
            conGrupo: [],
            sinGrupo: []
        };
        this.alumnos.forEach(alumno => {
            if(alumno.grupo === ''){
                gruposStatus.sinGrupo.push(alumno)
            }else{
                gruposStatus.conGrupo.push(alumno)
            }
        })
        return gruposStatus
    }
    buscarAlumnoPorMatricula(matricula) {
        return this.alumnos.find(alumno => alumno.matricula === matricula);
    }
}

const bdEnLocal = localStorage.getItem("bdAlumnos")
let bdAlumnos

if(bdEnLocal){
    const bdAlumnosData = JSON.parse(bdEnLocal);
    bdAlumnos = new TablaAlumnos('#tabla_alumnos');

    // Iterar sobre los datos recuperados de la base de datos local
    bdAlumnosData.alumnos.forEach(alumno => {
        // Agregar cada alumno a la tabla utilizando el método agregarAlumno
        bdAlumnos.agregarAlumno(alumno.nombre, alumno.apellido1, alumno.apellido2, alumno.fechaNaci);
    });
}else{
    bdAlumnos = new TablaAlumnos('#tabla_alumnos')
}

console.log(bdAlumnos)

function pausa(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}
///////////////////////////////////
const grupos = [];
//boton agregar alumno toggle
ocultarMostrar('.agregar_alumno button', '.agregar_alumno_datos')

tabActive('#navTabs ul', 'li', '.tab-content')
mainSection(1, '.tab-content')

function mainSection(indice, sectionDiv){
    const sections = document.querySelectorAll(sectionDiv)

    sections.forEach(function(section) {
        section.classList.add('hide')
    })
    
    sections[indice].classList.remove('hide')
}

//Nav tabs comportamiento
function tabActive(tabsDiv, tabsChildsDiv, mostrarSeccion){
    const contenedorAll = document.querySelector(tabsDiv),
        contenedorAllChilds = contenedorAll.querySelectorAll(tabsChildsDiv);

    contenedorAllChilds.forEach(function(child, indice){
        child.addEventListener('click',() =>{
            contenedorAll.querySelector('.active').classList.remove('active');
            child.classList.add('active');
            mainSection(indice, mostrarSeccion)
        })
    });
}


//agrega eventlistener para submit de agregar alumno
submitBtn('form_agregarAlumno', agregarNuevoAlumno)

function submitBtn(idForm, funcionAEnviarDatos){
    document.getElementById(idForm).addEventListener('submit', function(event) {
        event.preventDefault();
    
        let formData = new FormData(this);
        funcionAEnviarDatos(formData)
        this.reset();
    });
}


//grupos status
function verificarGrupos(){
    const crearGrupoSec = document.querySelector('.crearGrupo')
    const gruposSec = document.querySelector('.grupos')
    const alumnosGruposStatus = bdAlumnos.alumnosGrupoStatus();

    //verifica los alumnos que ya tienen grupo asignado, si los hay, asignará el nombre del grupo dentro del array grupos
    for (let index = 0; index < alumnosGruposStatus.conGrupo.length; index++) {
        const alumnoConGrupoActual = alumnosGruposStatus.conGrupo[index];
        if (grupos.indexOf(alumnoConGrupoActual.grupo) === -1){
            grupos.push(alumnoConGrupoActual.grupo)
        }
    }
    
    if(grupos.length !== 0){
        crearGrupoSec.classList.add('hide');
        gruposSec.classList.remove('hide')
    }else{
        crearGrupoSec.classList.remove('hide');
        gruposSec.classList.add('hide')
    }
    return alumnosGruposStatus
}


function ocultarMostrar(eventList, div){
    //ocultar mostrar mediante toggle, para un contenido
    const objeto = document.querySelector(eventList),
        contenedor = document.querySelector(div);
    objeto.addEventListener('click',() =>{
        contenedor.classList.toggle('hide');
    })
}
function ocultarMostrarOtraSec(eventList, divOcultar, divMostrar){
    //ocultar una seccion y mostrar otra distinta
    const objeto = document.querySelector(eventList),
        contenedor1 = document.querySelector(divOcultar),
        contenedor2 = document.querySelector(divMostrar);

    objeto.addEventListener('click',() =>{
        contenedor1.classList.add('hide');
        contenedor2.classList.remove('hide')
    })
}

function agregarNuevoAlumno(formData){
    const nombreAlumno = formData.get('nombre_alumno'), 
        primerApellido = formData.get('primeraApellido_alumno'), 
        segundoApellido = formData.get('segundoApellido_alumno'), 
        fechaNacimiento = formData.get('fechaNacimiento_alumno');

    bdAlumnos.agregarAlumno(nombreAlumno, primerApellido, segundoApellido, fechaNacimiento)
    console.log(bdAlumnos)
    localStorage.setItem("bdAlumnos", JSON.stringify(bdAlumnos))
}

//Funcionamiento edit btn y casillas editables en tabla
document.querySelector('#tabla_alumnos tbody').addEventListener('click', function(event) {
    
    // Verifica si el clic se hizo en un botón con la clase .btn_edit
    if (event.target.closest('.btn_edit')) {
        event.preventDefault();
        let tbl_row = event.target.closest('tr');
        let row_id = tbl_row.getAttribute('row_id');

        tbl_row.querySelector('.btn_save').style.display = 'block';
        tbl_row.querySelector('.btn_cancel').style.display = 'block';

        // Ocultar el botón de edición
        tbl_row.querySelector('.btn_edit').style.display = 'none';

        // Hacer toda la fila editable
        let row_data_elements = tbl_row.querySelectorAll('.row_data');
        row_data_elements.forEach(function(row_data_element) {
 
            row_data_element.contentEditable = 'true';
            row_data_element.setAttribute('edit_type', 'button');
            row_data_element.classList.add('bg-warning');
            row_data_element.style.padding = '3px';

            // Añadir la entrada original para cancelar
            row_data_element.setAttribute('original_entry', row_data_element.innerHTML);
        });
    }
    if (event.target.classList.contains('btn_cancel')) {
        event.preventDefault();
        let tbl_row = event.target.closest('tr');
        let row_id = tbl_row.getAttribute('row_id');

        // Ocultar botones de guardar y cancelar
        tbl_row.querySelector('.btn_save').style.display = 'none';
        tbl_row.querySelector('.btn_cancel').style.display = 'none';

        // Mostrar botón de editar
        tbl_row.querySelector('.btn_edit').style.display = 'block';

        // Hacer las celdas no editables
        let row_data_elements = tbl_row.querySelectorAll('.row_data');
        row_data_elements.forEach(function(row_data_element) {
            // row_data_element.setAttribute('edit_type', 'click');
            row_data_element.classList.remove('bg-warning');
            row_data_element.style.padding = '';
            row_data_element.contentEditable = 'false';
            // Restaurar valores originales
            row_data_element.innerHTML = row_data_element.getAttribute('original_entry');
        });
    }

    // Guardar edición
    if (event.target.classList.contains('btn_save')) {
        event.preventDefault();
        let tbl_row = event.target.closest('tr');
        let row_id = tbl_row.getAttribute('row_id');

        // Ocultar botones de guardar y cancelar
        tbl_row.querySelector('.btn_save').style.display = 'none';
        tbl_row.querySelector('.btn_cancel').style.display = 'none';

        // Mostrar botón de editar
        tbl_row.querySelector('.btn_edit').style.display = 'block';

        // Hacer las celdas no editables
        let row_data_elements = tbl_row.querySelectorAll('.row_data');
        row_data_elements.forEach(function(row_data_element) {
            // row_data_element.setAttribute('edit_type', 'click');
            row_data_element.classList.remove('bg-warning');
            row_data_element.style.padding = '';
            row_data_element.contentEditable = 'false';
            row_data_element.setAttribute('original_entry', row_data_element.innerHTML);
        });

        // Obtener datos de la fila
        let rowData = {};
        tbl_row.querySelectorAll('.row_data').forEach(function(row_data_element) {
            let col_name = row_data_element.getAttribute('col_name');
            let col_val = row_data_element.innerHTML;
            rowData[col_name] = col_val;

            console.log(rowData)
        });

        // Lógica adicional para guardar los datos...
    }
    if (event.target.closest('.btn_delete')) {
        event.preventDefault();
        let tbl_row = event.target.closest('tr');
        let row_id = tbl_row.getAttribute('row_id');

        tbl_row.remove();
    }

});

const agregarGrupoSec = document.querySelector('.crearGrupo_agregar'),
    gruposSec = document.querySelector('.grupos'),
    agregarGrupoBtn = document.getElementById('agregarGrupo'),
    selectorGrupo = document.getElementById('letras'),
    gruposGrid = gruposSec.querySelector('.grupos_grid'),
    grupoInfoSec = gruposSec.querySelector('.grupo_informacion');

	ocultarMostrarOtraSec('.crearGrupo_a', '.crearGrupo_sinGrupo', '.crearGrupo_agregar')

agregarGrupoBtn.addEventListener('click', function(){
    if(selectorGrupo.value !== ""){
        agregarGrupoSec.classList.add('hide');
        gruposSec.classList.remove('hide');
        
    }else{
        alert('Nombre de grupo inválido')
    }
})

gruposGrid.querySelectorAll('.grupo_contenedor').forEach(grupo =>{
    tabActive('.grupos_grid', '.grupo_contenedor', '.grupo_contenedor')
    grupo.addEventListener('click', async function(){
        let estado = await grupoEstilosCard(grupo)
        
        if(estado){
            gruposSec.style.flexDirection = 'row'
            gruposGrid.style.width = 'auto'
            grupoInfoSec.classList.remove('hide')
            
        }else{
            gruposSec.style.flexDirection = 'column'
            gruposGrid.style.width = '100%'
            grupoInfoSec.classList.add('hide')
            gruposGrid.querySelectorAll('.grupo_contenedor').forEach(grupo =>{
                grupo.classList.remove('hide')
            })
        }
    })
    
})

async function grupoEstilosCard(grupo){
    const spans = grupo.querySelector('.grupo_letra').querySelectorAll('span');
    let estado = false
    await pausa(100);
    
    spans.forEach((span, index) => {
        
        if(index === 0){
            if (!span.classList.contains('letra')) {
                span.classList.add('letra');
                estado = true
            }else{
                span.classList.remove('letra');
                estado = false;
            }
            
        }if(index === 1){
            if (span.classList.contains('hide')) {
                span.classList.remove('hide');
                estado = true
            }else{
                span.classList.add('hide');
                estado = false;
            }
        }
        
    });
    return estado
}

function crearGrupo(){
    
}

