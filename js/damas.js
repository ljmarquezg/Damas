$(document).ready(function(){
    $("h3").button();
    var turno = "",
        turnoActivo = false,
        mensaje = "",
        offset = "",
        gridSize = 0,
        efecto = "slide",
        transicion = "swing",
        duracion = 500;

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
            Remover indicadores de movimientos disponibles
    ----------------------------------------------------------------------------*/
    function removerDisponibles(){
        $(".disponible").removeClass("disponible");
        $(".white").droppable().droppable("destroy");
    }

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
        mostrarDisponibles();
    }

    /*----------------------------------------------------------------------------
            Mostrar movimientos Disponibles
    ----------------------------------------------------------------------------*/
    function obtenerMovimientos(ficha){
        console.log(ficha)
    }
    
    function mostrarDisponibles(){
        $(".turno").mouseenter(function(){
            $(this).addClass("hover");
            obtenerMovimientos($(this));
            var j_fila = parseInt($(this).parent().data("fila"));
            var j_col = parseInt($(this).parent().data("columna"));
            var t_fila = "";
            var i=1;
            var disponible1 = null;
            var disponible2 = null;
            if (turno == "jugador1"){
                n_fila = parseInt(j_fila+i)
            }else{
                n_fila = parseInt(j_fila-i);
            }
            //Obtener elementos de la siguiente fila con clase white
            t_fila = $("#fila-"+(n_fila+ " .white"));
            //Filtrar los elementos con el atributo columna +1 y -1
            disponible1 = t_fila.filter("[data-columna='"+ (j_col+1)+"']");
            disponible2 = t_fila.filter("[data-columna='"+ (j_col-1)+"']");
            disponible1_mov = disponible1.children();
            disponible2_mov = disponible2.children();
            // console.log(disponible1_mov.length);
            // console.log(disponible2_mov.length);
            if (disponible1_mov.length == 0 ){
                disponible1.addClass("disponible");
                verificarMovimiento(disponible1);
            }else if(disponible1_mov.length == 1){
                console.log("existe una ficha en esa posicion")
                if ($(disponible1_mov).hasClass(turno)){
                    console.log("La ficha es del mismo jugador")
                }else{
                    console.log("La ficha es del jugador contrario")
                    var j_fila = parseInt($(disponible1_mov).parent().data("fila"));
                    var j_col = parseInt($(disponible1_mov).parent().data("columna"));
                    var t_fila = "";
                    var i=1;
                    var disponible1 = null;
                    var disponible2 = null;
                    if (turno == "jugador1"){
                        n_fila = parseInt(j_fila+i)
                    }else{
                        n_fila = parseInt(j_fila-i);
                    }
                    //Obtener elementos de la siguiente fila con clase white
                    t_fila = $("#fila-"+(n_fila+ " .white"));
                    //Filtrar los elementos con el atributo columna +1 y -1
                    disponible1 = t_fila.filter("[data-columna='"+ (j_col+1)+"']");
                    disponible2 = t_fila.filter("[data-columna='"+ (j_col-1)+"']");
                    disponible1_mov = disponible1.children();
                    disponible2_mov = disponible2.children();
                    console.log(disponible1_mov)
                    disponible1.addClass("disponible");
                    verificarMovimiento(disponible1);
                }

            }
            if (disponible2.children().length == 0 ){
                disponible2.addClass("disponible");
                verificarMovimiento(disponible2);
            }

            

            // $.each(t_fila, function(index, objeto){
            //     var t_col =  objeto.attributes[2].nodeValue;
            //     if($(objeto).children().size() == 0){
            //         if((t_col) == (j_col+1) && $(objeto).children().size() == 0){
            //             $(objeto).addClass("disponible");
            //             verificarMovimiento(objeto);
            //         }
            //         if((t_col) == (j_col-1) && $(objeto).children().size() == 0){
            //             $(objeto).addClass("disponible");
            //             verificarMovimiento(objeto);
            //         }
            //     }else if ($(objeto).children().size() == 1){
            //         if ($(objeto).children().hasClass(turno)){
            //             //El objeto es una ficha del mismo jugador
            //             console.log("Exsite una ficha con la posicion del jugador actual")
            //             console.log($(objeto).children())
            //         }else{
            //             if((t_col+1) == (j_col+2) && $(objeto).children().size() == 0){
            //                 console.log("Movimiento Permitido")
            //                 $(objeto).addClass("disponible");
            //                 verificarMovimiento(objeto);
            //             }
            //             if((t_col-1) == (j_col-2) && $(objeto).children().size() == 0){
            //                 $(objeto).addClass("disponible");
            //                 verificarMovimiento(objeto);
            //             }
            //         }
            //     }
            // });
          
            $("."+turno).draggable({
                containment: "#tablero",
                hoverClass: "hover",
                cursor: "pointer",
                zIndex: 100,
                // grid: [ gridSize, gridSize],
                revert: "invalid",
                // disabled: false,
                start: function(event,ui){
                    offset = ui.offset;
                },
                drag: function(event,ui){
                    // console.log($("#mensaje").html("DragTop:"+ui.position.top+" DragLeft:"+ui.position.left));
                    var distanciaTop = Math.abs(parseInt(ui.position.top));
                    var distanciaLeft = Math.abs(parseInt(ui.position.left));
                    $("#mensaje").html(distanciaLeft + " " + distanciaTop)
                    if((distanciaTop >= 67 || distanciaLeft == 0) || (distanciaTop ==0 || distanciaLeft >= 67)){
                        // $("#mensaje").html("Se paso");
                        return;
                    }else{
                        verificarMovimiento();
                    }
                    
                },
                stop: function( event, ui ) {
                    var distanciaTop = Math.abs(parseInt(offset.top - ui.offset.top));
                    var distanciaLeft = Math.abs(parseInt(offset.left - ui.offset.left));
                    $("#mensaje").html(distanciaTop + " " + distanciaLeft);
                    // if((distanciaTop >= 67 || distanciaLeft == 0) || (distanciaTop ==0 || distanciaLeft >= 67)){
                    //     $("#mensaje").html("Posicion Invalida en Stop")
                    //     return;
                    // }else{
                        verificarMovimiento();
                        removerDisponibles();
                    // }
                },
            });
        });

    function saltarPieza(t_fila){
        $(t_fila).addClass("saltar")
    }
    
    function verificarMovimiento(objeto){
        $(objeto).droppable({
            accept: "."+turno,
            tolerance: "fit",
            create: function(){
                // $(".disponible").droppable("disable")
                // $("#mensaje").html("Creado")
            },
            activate: function(event, ui){
                offset = ui.offset;
            },
            deactivate: function(){
                // mensaje += "Drop Desactivado <br>"
                // $("#mensaje").html(mensaje)
            },
            drop: function(event, ui){
                mensaje += "Drop Dropped <br>"
                // $("#mensaje").html(mensaje)
                if( offset.top != ui.offset.top || offset.left != ui.offset.left){
                    var movida = ui.draggable[0]
                    event.target.append(movida)
                    $(movida).css({"left":"0", "top":"0"})
                    verificarTurno();
                    removerDisponibles();
                    //Eliminar evento mouse Enter en la ficha movida
                    $(movida).unbind("mouseenter");
                }
            },
            out: function(event, ui){
                // console.log(event)
                // console.log(ui)
                // $(this).droppable("disable")
            }
        });
    }

        $("."+turno).mouseleave(function(){
            $(this).removeClass("hover");
            removerDisponibles()
        });
    }
   
    

    verificarTurno();
})


