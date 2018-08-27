//Arreglar lista saltadas al reiniciar

$(document).ready(function(){
    var turno = "",
        turnoStatus = 0,
        juegoIniciado = false,
        movimientoValido = false,
        efecto = "fade",
        transicion = "swing",
        duracion = 500;
        activoJugador1 = 12;
        activoJugador2 = 12;
        nombreJugador1="Jugador 1";
        nombreJugador2 = "Jugador 2";
        colorJugador1="",
        colorJugador2="",
        reyLista = [],
        jugador1Lista = [],
        jugador2Lista = [],
        posicionListado = [],
        posicionSaltar = [],
        posicionInicial="",
        offset = "",
        fichaActual= "",
        fichaSaltar = "",
        dragCol = "",
        dragFila = "",
        dropCol="",
        dropFila="",
        dropFicha="",       
        //Manejo de alertas
        tituloInvalido = "Movimiento Inválido",
        msjInvalido = '<span class="fa"></span>Ha ocurrido un error al procesar el movimiento. Intenta de nuevo',
        tituloIniciar ="Advertencia!",
        msjIniciar = '<p>¿Está seguro que desea <b>reiniciar</b> la partida actual?</p>';
        tituloGanador = "Juego Terminado",
        msjGanador1 = '<span class="fa"></span> Felicidades'+nombreJugador1+'. Has vencido a '+nombreJugador2+' </span>',
        msjGanador2 = '<span class="fa"></span> Felicidades'+nombreJugador2+'. Has vencido a '+nombreJugador1+' </span>';
        msjSinMovimientos = '<span class="fa"></span> El jugador se ha quedado sin movimientos</span>';

    /*----------------------------------------------------------------------------
            Crear Widget de juego
    ----------------------------------------------------------------------------*/
    $.widget("com.damas", {
        _create: function(){
            //Numero de filas del tablero
            this._tablero = 8;
            //Columnas pares e impares
            this._colImpar =    ["black","white","black","white","black","white","black","white"];
            this._colPar =      ["white","black","white","black","white","black","white","black" ];
            
            for ( var j = 1; j <= this._tablero; j++){
                this._fila = $("<div>");
                this._fila.attr("id", "fila-"+j);
                for (var i = 0; i < this._tablero; i++){
                    this._posicion = $('<div>');
                        if(j %2 != 0){//Si la fila es Impar
                            this._posicion.addClass(this._colImpar[i]);
                        }else{//Si la fila es par
                            this._posicion.addClass(this._colPar[i]);
                        }
                    //Agregar atributos data-fila y data-columna
                    this._posicion.attr({"data-fila": j, "data-columna":(i+1)});
                    $(this._fila).append(this._posicion);
                }
                $(this.element).append(this._fila);
            }
            //Obtener el tamaño de cada posición
            gridSize = $(".white").height();
            personalizarTablero();
            $(".custom-radios").hide("slide");
        },

        posicionarFichas: function(){           
            for(var fila = 1; fila <= this._tablero; fila++){
                if(fila <= (this._tablero/2)-1){
                    $("#fila-"+fila+" .white").append("<div class='jugador1'>").children().hide().show(efecto, transicion, duracion);
                }
                if (fila > (this._tablero/2)+1){
                    $("#fila-"+fila+" .white").append("<div class='jugador2'>").children().hide().show(efecto, transicion, duracion);
                }
            }
            //Inicializar los objetos como Draggables
            $(".jugador1").addClass(colorJugador1).draggable();
            $(".jugador2").addClass(colorJugador2).draggable();
            turno = "";
            jugador1Lista = [],
            jugador2Lista = [],
            reyLista = [],
            verificarJugador();
            actualizarContador();
            nombreJugador1 = $("#nombreJugador1").val();
            nombreJugador2 = $("#nombreJugador2").val();
        }
    });

    function personalizarTablero(){
        var i=1;
        var j=1;
         // <div class="panel-jugador1">
		// 	<h3><input type="text" id="nombreJugador1" value="Jugador1"/></h3>
		// 	<div class="contenedorjugador2">
		// 		<p class="remaining">Fichas Disponibles<br><span id="activoJugador1"></span></p>
		// 		<p class="saltadas"></p>
		// 	</div>
		// </div>
        var container = document.getElementById('side-left')
        for (var i = 1; i <= 2; i++){
            var div = document.createElement('div');
            var row = div;
            //Asignarle un id al contenedor
             row.setAttribute("class", "panel-jugador"+i +" active");
            //Asignarle una clase al contenedor
            container.appendChild(row);
            var panel = document.getElementsByClassName("panel-jugador"+i)
            var h3 = document.createElement('h3');
            var inputText = document.createElement('input');
            Object.assign(inputText, {
                type: 'text',
                id: "nombreJugador"+i,
               name: 'color-player-'+i,
               value: "Jugador "+i
              })

            panel[0].appendChild(h3).appendChild(inputText);

            var legend = document.createElement("p");
            legend.setAttribute("id","changeColor"+i);
            var legendText = document.createTextNode("Cambiar color");
            legend.appendChild(legendText);
            row.appendChild(legend);

            var fieldset = document.createElement("div");
            fieldset.setAttribute("id","colorPlayer"+i);
            row.appendChild(fieldset);

            

            var customradios = document.createElement('div');
            customradios.setAttribute("class", "custom-radios");
            var divradios = document.createElement('div');

            for (j=1; j<=6; j++){
            var input = document.createElement('input');
            // input.setAttribute({"type":"radio", "id":"jugador"});
            Object.assign(input, {
                type: 'radio',
                id: "jugador-"+i+"color-"+j,
               name: 'color-player-'+i,
               value: "color-"+j
              })
            
              var label = document.createElement('label');
              label.setAttribute("for", "jugador-"+i+"color-"+j);
              var span = document.createElement('span');
              span.setAttribute("class","color-"+j);
              var p = document.createElement('p');
              p.innerHTML = "";
    
                divradios.appendChild(input);
                divradios.appendChild(label).appendChild(span).appendChild(p);
            }
            customradios.appendChild(divradios);
            var contenedor = document.createElement("div");
            contenedor.setAttribute("id","contenedorjugador"+i);
            fieldset.appendChild(customradios)
            var remaining = document.createElement("p");
            remaining.setAttribute("class","remaining");
            remaining.innerHTML = 'Fichas Disponibles<br><span id="activoJugador'+i+'"></span>';
            var saltadas = document.createElement("p");
            saltadas.setAttribute("class","saltadas")
            contenedor.appendChild(remaining);            
            contenedor.appendChild(saltadas);
            // fieldset.appendChild(remaining);
            // fieldset.appendChild(saltadas);
            fieldset.appendChild(contenedor)
        }
    }
   /*----------------------------------------------------------------------------
            Verificar jugador en turno
    ----------------------------------------------------------------------------*/
    function verificarJugador(){
        $("#side-left .panel-"+turno).toggleClass("active", duracion, transicion)
        if(turno == "jugador1"){
            turno = "jugador2";
            $("#tablero .jugador1").draggable("disable");
            $("#tablero .jugador1").removeClass("turno");
            $("#tablero .jugador2").draggable("enable");
            $("#tablero .jugador2").addClass("turno");
            
        }else{
            turno =  "jugador1";
            $("#tablero .jugador2").draggable("disable");
            $("#tablero .jugador2").removeClass("turno");
            $("#tablero .jugador1").draggable("enable");
            $("#tablero .jugador1").addClass("turno");
        };
        $("#side-left .panel-"+turno).toggleClass("active", duracion, transicion)
        var obtenerFichas = $(".turno")
        // console.log(obtenerFichas);
        $.each(obtenerFichas, function(index, obj){
            obtenerMovimientos($(obj));
        });

        console.log($(".disponible").length);
        console.log(activoJugador1)
        console.log(activoJugador2)
        if(activoJugador1 == 0){
            mostrarAlerta(tituloGanador,msjGanador2);
        }else if (activoJugador2 == 0){
            mostrarAlerta(tituloGanador, msjGanador1);
        }else if ( ($(".disponible").length == 0  && activoJugador1 > 1) || ( $(".disponible").length == 0 && activoJugador2 > 1) ){
            mostrarAlerta(tituloGanador, msjSinMovimientos)
        }

        $(".disponible").removeClass("disponible");
        obtenerDisponibles();
    }
    /*----------------------------------------------------------------------------
            Mostrar movimientos Disponibles
    ----------------------------------------------------------------------------*/
    function obtenerMovimientos(ficha){
        var j_fila = parseInt($(ficha).parent().data("fila")),
            j_col = parseInt($(ficha).parent().data("columna")),
            verificarRey = "";
            t_fila = "",
            esRey = null;
            disponible1 = null,
            disponible2 = null,
            disponible3 = null,
            disponible4 = null;
            verificarRey = ficha.data("king");
            if (verificarRey !== undefined){
                esRey = $.inArray(verificarRey, reyLista);
            }
        if (turno == "jugador1" || esRey !== null ){
            n_fila = parseInt(j_fila+1);
            sig_fila = parseInt(j_fila+2);
            recorrerFila();
        }

        if (turno == "jugador2" || esRey !== null){
            n_fila = parseInt(j_fila-1);
            sig_fila = parseInt(j_fila-2);
            recorrerFila();
        }
        //Obtener elementos de la siguiente fila con clase white
        function recorrerFila(){
            t_fila = $("#fila-"+(n_fila+ " .white"));
            disponible1 = t_fila.filter("[data-columna='"+ (j_col+1)+"']");
            disponible2 = t_fila.filter("[data-columna='"+ (j_col-1)+"']");
            //obtener los elementos hijos de las filas
            disponible1_mov = disponible1.children();
            disponible2_mov = disponible2.children();

            var siguiente1 = mostrarDisponibles(disponible1 ,disponible1_mov);
            var siguiente2 = mostrarDisponibles(disponible2, disponible2_mov);

            if (!siguiente1){
                var salto_fila = $("#fila-"+(sig_fila+ " .white"));
                disponible1_salto = salto_fila.filter("[data-columna='"+ (j_col+2)+"']");
                disponible1_salto_mov = disponible1_salto.children();
                mostrarDisponibles(disponible1_salto ,disponible1_salto_mov, true);
            }
            if (!siguiente2){
                var salto_fila = $("#fila-"+(sig_fila+ " .white"));
                disponible2_salto = salto_fila.filter("[data-columna='"+ (j_col-2)+"']");
                disponible2_salto_mov = disponible2_salto.children();
                mostrarDisponibles(disponible2_salto, disponible2_salto_mov, true);
            }
        }
        
        var isObligada = $(".obligado");
        if (isObligada.length > 0){
            posicionSaltar.push(isObligada)
        }
    }

    function mostrarDisponibles(disponible, disponible_mov, saltarFicha){
        if (disponible_mov.length == 0 ){
            //Agregar el elemento al arreglo
            if (saltarFicha){
                $(disponible).addClass("obligado");
            }
            $(disponible).addClass("disponible");
            return true;
        }else if(disponible_mov.length == 1){
            if ($(disponible_mov).hasClass(turno)){
                //Verificar que la ficha no sea del mismo jugador
                return true;
            }else{
                //verificar que la ficha sea del jugador contrario
                if(!saltarFicha){
                    $(disponible_mov).addClass("saltar");
                }
                return false;
            }
        }
    }
    
    function verificarTurno(){
        // verificar si se ha saltado una ficha y existen posiciones Disponibles
        if(fichaSaltar.length > 0 && posicionSaltar.length > 0){
            //Enviar ficha saltada al contenedor del jugador contrario
            agregarSaltada();
            removerDisponibles();
            //Simular entrada del mouse para recalcular movimientos disponibles
            $(fichaActual).trigger('mouseenter');
            if(posicionSaltar.length > 0){
                fichaSaltar = "";
                posicionSaltar = [];
            }else{
                cambiarTurno()
            }
           
        }else{
            cambiarTurno();
        }
    }; 

    function cambiarTurno(){
        turnoStatus = 0;
        if(turnoStatus == 0){
            $.each($(".turno"), function(index, objeto){ 
                //Eliminar los eventos de mouse enter en las fichas del jugador de turno
                $(objeto).unbind("mouseenter mouseleave");
            })
        }
        removerDisponibles();
        verificarJugador();
    }

    function agregarSaltada(){
            $("#contenedor"+turno +" .saltadas").append(fichaSaltar);
            if (turno == "jugador1"){
                jugador2Lista.push(fichaSaltar); 
            }
            else{
                jugador1Lista.push(fichaSaltar); 
            }
            actualizarContador();
            var eliminadas = $(".saltadas div");
            $.each(eliminadas, function(index, obj){
                $(obj).removeClass("turno")
            })
    }
    function obtenerDisponibles(){
            $(".turno").mouseenter(function(){
            fichaActual = $(this);
            obtenerMovimientos(fichaActual);
            $("."+turno).draggable({
                containment: "#side-right",
                hoverClass: "hover",
                cursor: "pointer",
                // grid: [gridSize,gridSize],
                zIndex: 100,
                revert: "invalid",
                start: function(event,ui){
                    turnoStatus = 1;
                    movimientoValido = false;
                    offset = ui.offset;
                    dragCol = (ui.helper.parent().data("columna"));
                    dragFila = (ui.helper.parent().data("fila"));
                    verificarMovimiento();
                },
                drag: function(event,ui){
                  
                },
                stop: function( event, ui ) {
                    convertirRey();
                    if(movimientoValido){
                        verificarTurno();
                    }else{
                        $(fichaActual).css({"left":"", "top":""});
                        mostrarAlerta(tituloInvalido, msjInvalido);
                    }
                },
            });
        });

    
    function verificarMovimiento(){
        $(".disponible").droppable({
            accept: "."+turno,
            tolerance: "touch",
            create: function(){

            },
            activate: function(event, ui){
                offset = ui.offset;       
                posicionInicial = ui.position
                posicionFinal = "";
            },
            drop: function(event, ui){
                if( offset.top != ui.offset.top || offset.left != ui.offset.left){
                    var movida = ui.draggable[0]
                    event.target.append(movida)
                    $(movida).css({"left":"0", "top":"0"})
                    dropFicha = ui.draggable;
                    dropFila = ui.draggable.parent().data("fila")
                    dropCol = ui.draggable.parent().data("columna")
                    var getFila = parseInt(dragFila-dropFila);
                    var getCol = parseInt(dropCol-dragCol)/2;

                    if (Math.abs(getFila) > 1){
                        if (dropFila > dragFila){
                            var newFila = (dragFila + 1);
                        }else{
                            var newFila = (dragFila - 1);
                        }
                        var newCol = (dragCol + getCol);
                        var filaOcupada = $("#fila-"+newFila).children();
                        filaOcupada.removeClass("disponible");
                        fichaSaltar = filaOcupada.filter("[data-columna='"+newCol+"']").children()
                    }
                    movimientoValido = true; 
                }
            },
            deactivate: function(event, ui){
                // removerDisponibles();
            },
            out: function(event, ui){
                movimientoValido = false;
                return
            }
        });
    }

    $("."+turno).mouseleave(function(){
            removerDisponibles()
        });
    }

    /*----------------------------------------------------------------------------
            Remover indicadores de movimientos disponibles
    ----------------------------------------------------------------------------*/
    function removerDisponibles(){
        posicionListado = [];
        posicionDisponible = [];
        posicionSaltar = [];
        fichaSaltar = "";
        $(".disponible").removeClass("disponible");
        $(".obligado").removeClass("obligado");
        $(".saltar").removeClass("saltar")
        $(".white").droppable().droppable("destroy");
    }

    function actualizarContador(){
            activoJugador1 = (12 - jugador1Lista.length);
            activoJugador2 = (12 - jugador2Lista.length);
            $("#activoJugador1").html(activoJugador1);
            $("#activoJugador2").html(activoJugador2);
    }

    function convertirRey(){
        if (dropFila == 1 && turno == "jugador2" || dropFila == 8 && turno == "jugador1"){
            var reySig = turno +"-"+ (reyLista.length + 1)
            fichaActual.addClass("king");
            fichaActual.attr("data-king", reySig)
            reyLista.push(reySig);
        }
    }

    function mostrarAlerta(titulo, mensaje, botones = null,){
        $("#mensaje").html(mensaje);
        $("#mensaje").dialog({
            title: titulo,
            autoOpen: true,
            modal: true,
            show: {
                effect:efecto,
                duration: duracion,
                easing: transicion
            },
            buttons: botones,
        })
    }
    /*----------------------------------------------------------------------------
            Estados del partido
    ----------------------------------------------------------------------------*/

    function reiniciar(){
        removerDisponibles();
        $("#iniciar span").html("");
        $('[class^="jugador"]').hide(efecto, transicion, duracion).remove();
        $('[class^="panel"').removeClass("active");
        $("#tablero").damas("posicionarFichas");
        
    }
    function iniciarJuego(){
        if (juegoIniciado){
             mostrarAlerta(tituloIniciar, msjIniciar, { Reiniciar: function () { reiniciar(); $(this).dialog("close");}});
            return
        }
        reiniciar()
        juegoIniciado = true;
    }    

    /*----------------------------------------------------------------------------
            Crear Tablero
    ----------------------------------------------------------------------------*/
    $("#tablero").damas();
    $("#iniciar").click(function(){
        iniciarJuego();
    })

    /*----------------------------------------------------------------------------
           Personalizacion del juego
    ----------------------------------------------------------------------------*/
    $("#nombreJugador1").change(function(){
        nombreJugador1 = $(this).val();
    });
    $("#nombreJugador2").change(function(){
        nombreJugador2 = $(this).val();
    });

    $('[id^="changeColor"]').click(function(){
        $(".custom-radios").toggle("slide");
        $(".remaining").toggle("slide");
        $(".saltadas").toggle("slide");
    })

    $('#colorPlayer1 input[type="radio"]').click(function(){
        colorJugador1 = $(this).attr("value");
        if(colorJugador2 != colorJugador1){    
            for (i=1; i <=6; i++){
                $(".jugador1").removeClass("color-"+i);
            }
            $(".jugador1").addClass(colorJugador1);
        }else{
            mostrarAlerta("Alerta", "No puede seleccionar el mismo color que el "+nombreJugador2)
        }
    })
    $('#colorPlayer2 input[type="radio"]').click(function(){
        colorJugador2 = $(this).attr("value");
        if(colorJugador2 != colorJugador1){    
            for (i=1; i <=6; i++){
                $(".jugador2").removeClass("color-"+i);
            }
            $(".jugador2").addClass(colorJugador2);
            // $("#colorPlayer2 .custom-radios").toggle("fold");
        }else{
            mostrarAlerta("Alerta", "No puede seleccionar el mismo color que el "+nombreJugador1)
        }
    })
})


