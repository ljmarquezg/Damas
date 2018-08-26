$(document).ready(function(){
    var turno = "",
        juegoIniciado = false
        turnoStatus = 0,
        offset = "",
        efecto = "fade",
        transicion = "swing",
        duracion = 500;
        posicionSaltar = [],
        posicionInicial="",
        movimientoValido = false;
        fichaActual= "",
        fichaSaltar = "",
        dragCol = "",
        dragFila = "",
        dropCol="",
        dropFila="",
        dropFicha="",
        jugador1Lista = [],
        jugador2Lista = [],
        reyLista = [],
        //Manejo de alertas
        tituloInvalido = "Movimiento Inválido",
        msjInvalido = "Ha ocurrido un error al procesar el movimietno. Intenta de nuevo",
        tituloIniciar ="Advertencia!"
        msjIniciar = '¿Está seguro que desea <b>reiniciar</b> la partida actual?<br><button onclick="reiniciar()">Aceptar</button>';
        tituloGanador = "Juego Terminado"
        msjGanador1 = '<span class="fa"><span> Felicidades Jugador1. Has vencido a tu rival</span>'
        msjGanador2 = '<span class="fa"><span> Felicidades Jugador2. Has vencido a tu rival</span>'

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
            $(".jugador1").draggable();
            $(".jugador2").draggable();
            turno = ""
            verificarJugador();
            actualizarContador();
        }
    });

    /*----------------------------------------------------------------------------
            Crear Tablero
    ----------------------------------------------------------------------------*/
    $("#tablero").damas();
    $("#iniciar").click(function(){
        iniciarJuego();
    })
   /*----------------------------------------------------------------------------
            Verificar jugador en turno
    ----------------------------------------------------------------------------*/
    function verificarJugador(){
        if(turno == "jugador1"){
            turno = "jugador2";
            $(".jugador1").draggable("disable");
            $(".jugador1").removeClass("turno");
            $(".jugador2").draggable("enable");
            $(".jugador2").addClass("turno");
            
        }else{
            turno =  "jugador1";
            $(".jugador2").draggable("disable");
            $(".jugador2").removeClass("turno");
            $(".jugador1").draggable("enable");
            $(".jugador1").addClass("turno");
        };
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
            
            verificarRey = fichaActual.data("king");
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
        var enTablero = $("#tablero ."+turno).length;
        var totalDisponibles = $(".disponible").length
        if(enTablero == 1 && totalDisponibles == 0){
            alert("no hay mas movimientos")
        }
    }

    function mostrarDisponibles(disponible, disponible_mov, saltarFicha){
        if (disponible_mov.length == 0 ){
            //Agregar el elemento al arreglo
            if (saltarFicha){
                $(disponible).addClass("obligado");
            }
            $(disponible).addClass("disponible")
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
            fichaSaltar.removeClass("turno");
            $(".contenedor"+turno +" .saltadas").append(fichaSaltar);
            if (turno == "jugador1"){
                jugador2Lista.push(fichaSaltar); 
            }
            else{
                jugador1Lista.push(fichaSaltar); 
            }
            actualizarContador();
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
            tolerance: "pointer",
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
        posicionDisponible = [];
        posicionSaltar = [];
        fichaSaltar = "";
        $(".disponible").removeClass("disponible");
        $(".obligado").removeClass("obligado");
        $(".saltar").removeClass("saltar")
        $().droppable().droppable("destroy");
    }

    function actualizarContador(){
        var activoJugador1 = (12 - jugador1Lista.length);
            activoJugador2 = (12 - jugador2Lista.length);
            $("#activoJugador1").html(activoJugador1);
            $("#activoJugador2").html(activoJugador2);
        if(activoJugador1 == 0){
            mostrarAlert(tituloGanador,msjGganador2);
        }

        if (activoJugador2 == 0){
            alert(tituloGanador, msjGanador1);
        }
    }

    function convertirRey(){
        if (dropFila == 1 || dropFila == 8){
            var reySig = turno +"-"+ (reyLista.length + 1)
            fichaActual.addClass("king");
            fichaActual.attr("data-king", reySig)
            reyLista.push(reySig);
        }
    }

    function mostrarAlerta(titulo, mensaje){
        $("#mensaje").html(mensaje);
        $("#mensaje").dialog({
            title: titulo,
            autoOpen: true,
            modal: true,
            show: {
                effect:efecto,
                duration: duracion,
                easing: transicion
            }
        })
    }

    function reiniciar(){
        if (juegoIniciado){
            $( "#mensaje" ).dialog( "close" );
        }
        $("#iniciar span").html("");
        $('[class^="jugador"]').hide(efecto, transicion, duracion).remove();
        $("#tablero").damas("posicionarFichas");
    }
    function iniciarJuego(){
        if (juegoIniciado){
            mostrarAlerta(tituloIniciar, msjIniciar);
            return
        }
        reiniciar()
        juegoIniciado = true;
    }    
})


