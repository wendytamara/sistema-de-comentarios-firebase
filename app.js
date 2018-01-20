window.onload = inicializar;

var formCovalidaciones;
var refConvalidaciones;
var tbodyTablaConvalidaciones;
var CREATE = 'añadir comentario';
var UPDATE = 'modificar comentario'
var nodo = CREATE;
var refConvalidacionAEditar;

function inicializar () {
  formCovalidaciones = document.getElementById('form-coments');
  formCovalidaciones.addEventListener('submit' , enviarConvalidacionesAFirebase, false);
  refConvalidaciones = firebase.database().ref().child('convalidaciones');
  mostrarConvalidacionesDeFirebase();
  tbodyTablaConvalidaciones =  document.getElementById('publication');


}

function mostrarConvalidacionesDeFirebase() {
  refConvalidaciones.on('value', function(snap){
    var datos = snap.val();
    var filasAMostrar = '';
    for( var key in datos){

      filasAMostrar +=

                          "<div>" +
                          '<div class = "container-coments">' + datos[key].cicloAConvalidar + "</div>" +
                          '<div class = "cont-trash">'  +
                          '<span class="glyphicon glyphicon-trash borrar" data-convalidacion = "'+ key +'"></span>' +
                          '<span class="glyphicon glyphicon-pencil editar" data-convalidacion = "'+ key +'" ></span>' +

                        '</div>' +
                       '</div>';

    //                   '<div class="col s12 m12 border-post">' +  '<div id="public-header" class="col s12 m12">' + '<br>' + '<div class="col s2 m2">' + '<img id="photoProfile" class="img-perfil ">' + '</div>' + '<div class="col s10 m10  usersComent">' + '<br>' + '<span class="grey-text">' + 'Publicado a las :' + getTime() + '</span><br></div> ' + '<div class="col s12 m12 divider">'+
     //
    //  '</div></div>' +
     //
    //   '<div id="public-body" class="col s12 m12">' + '<div class="text-public">' +
    //    '<p class = "container-coments">'  + datos[key].cicloAConvalidar + ' </p></div>' + '</div>' + '<div class="col s12 m12 divider">' + '</div>' +
    //     '<div class="col s12 m12 ">' + '<a class="editar" data-convalidacion = "'+ key +'" >' + '<i class="large material-icons">' + create + '</i></a><a class="borrar" data-convalidacion = "'+ key +'">' + '<i class="large material-icons">' + create + '</i></a>' +
    //   '<p class="right grey-text" id="contador">' + '</p>' +'<div id="add-comment" class="col s12 m12">'+ '</div></div></div>';
    }
    function getTime() {
    var currentDate = new Date();
    var hh = currentDate.getHours();
    var mm = currentDate.getMinutes();
    return hh + ':' + ((mm < 10 ? '0' : '') + mm);
    }

    tbodyTablaConvalidaciones.innerHTML = filasAMostrar;
    if (filasAMostrar != ' ') {

      var elementosEditables = document.getElementsByClassName('editar');
      for (var i = 0; i < elementosEditables.length; i++) {
        elementosEditables[i].addEventListener('click', editarConvalidacionesDeFirebase,false);

      }
      var elementosBorrables = document.getElementsByClassName('borrar');
      for (var i = 0; i < elementosBorrables.length; i++) {
        elementosBorrables[i].addEventListener('click', borrarConvalidacionesDeFirebase,false);

      }
    }
  });
}

function editarConvalidacionesDeFirebase() {


  var keyDeConvalidacionAEditar = this.getAttribute('data-convalidacion');

  refConvalidacionAEditar = refConvalidaciones.child(keyDeConvalidacionAEditar);
  refConvalidacionAEditar.once('value', function(snap){

    var datos = snap.val();
    document.getElementById('convalidation').value = datos.cicloAConvalidar;



  });
  document.getElementById('btn-send-coments').value = UPDATE;


  nodo = UPDATE;

}


function borrarConvalidacionesDeFirebase() {
  var keyDeConvalidacionABorrar = this.getAttribute('data-convalidacion');
  var refConvalidacionABorrar = refConvalidaciones.child(keyDeConvalidacionABorrar);

  refConvalidacionABorrar.remove();
}


function enviarConvalidacionesAFirebase(event) {
  event.preventDefault();

  switch (nodo ) {
    case CREATE:
    refConvalidaciones.push({

      cicloAConvalidar: event.target.cicloAConvalidar.value,

    });
      break;
    case UPDATE:
      refConvalidacionAEditar.update({
        cicloAConvalidar: event.target.cicloAConvalidar.value,

      });
      nodo = CREATE;
      document.getElementById('btn-send-coments').value = CREATE;
      break;
  }

  formCovalidaciones.reset();
}
