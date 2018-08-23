$(document).ready(function(){
    $("h3").button();
    var turno = "",
        turnoStatus = 0,
        offset = "",
        efecto = "slide",
        transicion = "swing",
        duracion = 500;
        posicionSaltar = [],
        fichaActual= "",
        fichaSaltar = "",
        movimientoValido = false;
        dragCol = "",
        dragFila = "",
        dropCol="",
        dropFila="",
        dropFicha="";

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
            
        }
    });

    /*----------------------------------------------------------------------------
            Crear Tablero
    ----------------------------------------------------------------------------*/
    $("#tablero").damas();
    $("#tablero").damas("posicionarFichas")
    /*----------------------------------------------------------------------------
            Verificar jugador en turno
    ----------------------------------------------------------------------------*/
    function verificarTurno(){
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
        var j_fila = parseInt($(ficha).parent().data("fila"));
        var j_col = parseInt($(ficha).parent().data("columna"));
        var t_fila = "";
        var disponible1 = null;
        var disponible2 = null;
        if (turno == "jugador1"){
            n_fila = parseInt(j_fila+1)
            sig_fila = parseInt(j_fila+2)
        }else{
            n_fila = parseInt(j_fila-1);
            sig_fila = parseInt(j_fila-2);
        }
        //Obtener elementos de la siguiente fila con clase white
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
    
    function cambiarTurno(){
        console.log(fichaActual);
        console.log("Obetner nuevamente movimiento");
        obtenerMovimientos(fichaActual);
        console.log("Remover Movimientos");
        if (fichaSaltar){
            console.log("se ha saltado una ficha");
            console.log(fichaActual)
            console.log("PosicionSaltar")
            console.log(posicionSaltar)          
            obtenerMovimientos(fichaActual);
            if (posicionSaltar.length == 0){
                alert("Si hay disponibles")
            }else{
                // alert("No hay disponibles")
                // removerDisponibles();
                // verificarTurno();
            }
           
        }else{
            console.log("Terminar turno");
            fichaSaltar = "";
            turnoStatus = 0;
            if(turnoStatus == 0){
                $.each($(".turno"), function(index, objeto){ 
                    //Eliminar los eventos de mouse enter en las fichas del jugador de turno
                    $(objeto).unbind("mouseenter");
                })
            }else{
                
            }
            verificarTurno();
            removerDisponibles();
        }
        console.log("turnoStatus: "+turnoStatus);
    }; 
    function obtenerDisponibles(){
        $(".turno").mouseenter(function(){
            // $(this).addClass("hover");
            fichaActual = $(this);
            obtenerMovimientos(fichaActual);
            $("."+turno).draggable({
                containment: "#tablero",
                hoverClass: "hover",
                cursor: "pointer",
                // grid: [gridSize,gridSize],
                zIndex: 100,
                revert: "invalid",
                start: function(event,ui){
                    turnoStatus = 1;
                    offset = ui.offset;
                    dragCol = (ui.helper.parent().data("columna"));
                    dragFila = (ui.helper.parent().data("fila"));
                    var isObligada = $(".obligado");
                    if (isObligada.length > 0){
                        posicionSaltar.push(isObligada)
                    }
                    verificarMovimiento();
                },
                drag: function(event,ui){
                    // console.log($("#mensaje").html("DragTop:"+ui.position.top+" DragLeft:"+ui.position.left));
                    var distanciaTop = Math.abs(parseInt(ui.position.top));
                    var distanciaLeft = Math.abs(parseInt(ui.position.left));
                    $("#mensaje").html(distanciaLeft + " " + distanciaTop)
                },
                stop: function( event, ui ) {
                    var distanciaTop = Math.abs(parseInt(offset.top - ui.offset.top));
                    var distanciaLeft = Math.abs(parseInt(offset.left - ui.offset.left));
                    $("#mensaje").html(distanciaTop + " " + distanciaLeft);
                    if(fichaSaltar.length > 0){
                        // console.log(fichaSaltar)
                        $(".contenedor"+turno).append(fichaSaltar);
                    }
                    console.log("Stop")
                    if(ui.originalPosition != ui.position || movimientoValido == true){
                        cambiarTurno();
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
            },
            drop: function(event, ui){
                console.log(ui)
                mensaje += "Drop Dropped <br>"
                // $("#mensaje").html(mensaje)
                if( offset.top != ui.offset.top || offset.left != ui.offset.left){
                    var movida = ui.draggable[0]
                    event.target.append(movida)
                    $(movida).css({"left":"0", "top":"0"})
                    
                    // $(movida).unbind("mouseenter");
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
                        // console.log(newCol)ss
                        var filaOcupada = $("#fila-"+newFila).children();
                        console.log("esta es la fila")
                        filaOcupada.removeClass("disponible");
                        fichaSaltar = filaOcupada.filter("[data-columna='"+newCol+"']").children()
                    }
                    console.log("drop");
                    console.log(ui)
                    
                    
                        if(posicionSaltar.length > 0){
                            // s
                            console.log(ui.draggable.parent().hasClass("obligado"));

                            // if (ui.position == posicionSaltar[0].position()){
                            //     alert("Pieza comida")
                            // }else{
                            //     alert("Hay un movimiento obligado");
                            //     return false
                            // }
                    //         if (turno == "jugador1"){
                    //             $(".contenedor2").append(fichaSaltar[0])
                    //         }
                    //         if (turno == "jugador2"){
                    //             $(".contenedor1").append(fichaSaltar[0])
                    //         }
                            // dropcol = ui.draggable.parent().data("columna");
                            // dropfila = ui.draggable.parent().data("fila");
                            // if(posicionSaltar.length == 1){
                            //     // posicionSaltar[0].hide("explode", 500);
                            //     if (turno == "jugador1"){
                                    
                            //             // .show("blind", 500));
                            //     }
                            //     if (turno == "jugador2"){
                                    
                            //         // .show("blind", 500));
                            //     }
                            // }else{
                            //     if (turno == "jugador1"){
                            //         $(".contenedor2").append(posicionSaltar[0]);
                            //         if(dropcol > dragCol){
                            //             $(".contenedor2").append(posicionSaltar[0]);
                            //         }
                            //         if(dropcol < dragCol){
                            //             $(".contenedor2").append(posicionSaltar[1]);
                            //         }
                            //     }else if (turno == "jugador2"){
                            //         if(dropcol < dragCol){
                            //             $(".contenedor1").append(posicionSaltar[1]);
                            //         }
                            //         if(dropcol > dragCol){
                            //             $(".contenedor1").append(posicionSaltar[0]);
                            //         }
                            //     }
                            // }
                        }
                    //Cambiar de turno
                    // verificarTurno();
                    // cambiarTurno();
                    //Eliminar las clases 
                }
            },
            deactivate: function(event, ui){
                // removerDisponibles();
            },
            out: function(event, ui){

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
        // $(".white").unbind("mouseover")
        posicionDisponible = [];
        $(".disponible").removeClass("disponible");
        // $(".obligado").removeClass("obligado");
        $(".saltar").removeClass("saltar")
        $().droppable().droppable("destroy");
        mostrarActivos();
        // obtenerDisponibles();
    }

    function mostrarActivos(){
        activoJugador1 = $("#tablero .jugador1").length;
        activoJugador2 = $("#tablero .jugador2").length;
        $("#activoJugador1").html(activoJugador1);
        $("#activoJugador2").html(activoJugador2);
    }

    verificarTurno();
    mostrarActivos();
})


