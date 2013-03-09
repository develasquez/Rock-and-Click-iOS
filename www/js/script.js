var iA = 0, iT = 0, iTPlayer = 0, iAPlayer = 0, albumActual = 3, myWidth = 240, myHeiht = 400, verTodas = false;
var jsonPosts = 0, jsonElPost = {}, jsonGaleria = 0, jsonGaleriaPlayer = {}, jsonDescarga = {}, galeriaSeleccionada = 0;
var mostroSplash = false, twitterUrl = "", faceUrl = "", networkState = "", nombreGaleria = "", imageList = 0, hayGalerias = false;
var iniciado = false, imageList = 0, postCargado = 0, galeriaCargada = 0, imageListCargada = 0, postPrincipal = 0;
var myaudio = {}, myTrackDesription = {"artista": "", "titulo": "", "caratula": "", "dico": "", "ano": ""}, reproduceRadio = false, hora=0, urlWall= "";
function setHeight(elemento, porcentaje) {
    $(elemento).height($(elemento).parent().height() * porcentaje / 100);
}
$(function() {
    var params = {    
            metodo : "getListaImagenes"
        }
        $.post('http://106.187.55.9/RockNclick/assets/www/wsRac.php',params,function(data){
          
            imageList = JSON.parse(data);

            localStorage.setItem("imageList",data);    
            $.getJSON('http://rockandclick.cl?json=get_recent_posts',function(data){
               
                localStorage.setItem("jsonPosts",JSON.stringify(data));
                traeGaleria(imageList[data.posts[0].id]);       
            });
        });  
    $.mobile.changePage("#radioPlayer");
    setInterval(function() {
        setHeight("#mnu_content", 100);
        setHeight(".columna2fila1", 16);
        $(".columna3fila2").css("top",$(window).height() - 110);
        if ($(window).width() > $(window).height()) {
            setHeight(".columna2fila2", 55);
            setHeight(".columna2fila3", 20);
            setHeight(".columna3fila1", 75);
            //setHeight(".columna3fila2", 25);
        } else {
            setHeight(".columna2fila2", 50);
        }
        
    }, 1000);
    $(".btnPlay").bind("vclick", function() {
            playStream();
            reproduceRadio = true;
        });
    $(document).swiperight(function(event, data) {
        botonera.back();
    });
    $(document).swipeleft(function(event, data) {
        botonera.next();
    });
    setHeight("#mnu_content", 100);
    setHeight(".columna2fila1", 16);
    if ($(window).width() > $(window).height()) {
        setHeight(".columna2fila2", 53);
        setHeight(".columna2fila3", 20);
        setHeight(".columna3fila1", 75);
        setHeight(".columna3fila2", 25);
    } else {
        setHeight(".columna2fila2", 50);
    }
    //aca  las funsiones del Player.
    $(".muestraRadio").bind("vclick", function() {
        if ($(".radio").css("visibility") === "hidden") {
            $(".radio").css("visibility", "visible");
        } else {
            $(".radio").css("visibility", "hidden");
        }
    });
    $(".btnPlay").bind("vclick", function() {
        playStream();
        reproduceRadio = true;
    });
    $(".btnStop").bind("vclick", function() {
                       alert(3);
        myaudio.pause();
        myaudio = {};
        reproduceRadio = false;
    });
    $(".mute").bind("vclick", function() {
        if ($(".mute img").attr("src") === "img/volumen.png") {
            $(".mute img").attr("src", "img/mute.png");
            myaudio.volume = 0;
        } else {
            $(".mute img").attr("src", "img/volumen.png");
            myaudio.volume = 0.6;
        }
    });
    $(".volumen").bind("change", function(event, ui) {
        myaudio.volume = parseInt($(this).val()) / 100;
    });
    //aca  las funsiones del Player.
    jsonGaleria = localStorage.getItem("jsonGaleria");
    jsonPosts = JSON.parse(localStorage.getItem("jsonPosts"));
    if (imageList === 0 && imageListCargada === 0) {
        var params = {
            metodo: "getListaImagenes"
        };
        $.post('http://106.187.55.9/RockNclick/assets/www/wsRac.php', params, function(data) {
            imageListCargada = 1;
            imageList = JSON.parse(data);
            traePost();
        });
    } else if (imageListCargada === 0) {
        imageList = JSON.parse(localStorage.getItem("imageList"));
    }
    document.addEventListener("deviceready", onDeviceReady, false);
    $("#galeria_img_full").css("display", "none");
    $(".post_img_principal")
            .click(function() {
        $("#post_div_principal").hide();
        $("#galeria_img_full").attr("src", $(".post_img_principal").attr("src"))
                .fadeIn().css("top", window.scrollY)
                .width($(window).width())
                .height($(window).height())
                .click(function() {
            $(this).fadeOut();
            $("#post_div_principal").show();
        });
                
        calculaTamano(jsonGaleria.gallery[iAPlayer].img[0].height, jsonGaleria.gallery[iAPlayer].img[0].width, $("#galeria_img_full"));
        /*
         var wtTot = parseInt(document.width);
         var htTot = parseInt(jsonGaleria.gallery[iAPlayer].img[0].height * wtTot / jsonGaleria.gallery[iAPlayer].img[0].width);
         $("#galeria_img_full").width(wtTot).height(htTot);       
         if( document.height > htTot  ){
         var newMargin = (document.height - htTot ) /2
         $("#galeria_img_full").css("margin-top", newMargin)
         }else{
         
         $("#galeria_img_full").css("margin-top", 0)
         }*/
    });
    $(window).on("scroll", function() {
        //$("#galeria_img_full").css("top",window.scrollY);
    });
});
onDeviceReady = function() {
    document.addEventListener("backbutton", function() {
            if (hora == 0){
                hora = (new Date()).getTime();     
            }else{
                if((hora - (new Date()).getTime()) > -300 )
                {
                    hora =0;
                    device.exitApp();
                }
            }
        }, false);
    networkState = navigator.network.connection.type;
    if (networkState === "none") {
        document.removeEventListener("deviceready", onDeviceReady, false);
        $.mobile.changePage("#errorPage");
        document.addEventListener("backbutton", function() {
            device.exitApp();
        }, false);
    }
};
$(window).on("orientationchange", function() {
    ajustaImagen();
});
buscaId = function(titulo) {
    var theId = 0;
    I = 0;
    $.each(jsonPosts, function(i, e) {
        if (jsonPosts.posts[I].title === titulo)
        {
            theId = jsonPosts.posts[I].id;
        }
        I++;
    });
    return theId;
};
traePost = function() {
    if (jsonPosts === 0 && postCargado === 0) {
        showLoading();
        $.getJSON('http://rockandclick.cl?json=get_recent_posts', function(data) {
            postCargado = 1;
            fn_traePost(data);
        });
    } else if (postCargado === 0) {
        postCargado = 1;
        fn_traePost(jsonPosts);
    }
};
fn_traePost = function(data) {
    try {
        postPrincipal = jsonPosts.posts[0].id;
        jsonPosts = data;
        nombreGaleria = jsonPosts.posts[0].slug;
        traeGaleria(imageList[jsonPosts.posts[0].id]);
        galeriaSeleccionada = jsonPosts.posts[0].id;
        url = jsonPosts.posts[0].url;
        faceUrl = "http://www.facebook.com/sharer/sharer.php?u=" + url;
        text = jsonPosts.posts[0].title + " Rock and Click - Radio Futuro 88.9 ";
        url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url);
        $("#banda").text(jsonPosts.posts[0].title);
        $("#div_text").html("<br>");
        $("#div_text").append(jsonPosts.posts[0].content);
        twitterUrl = url;
        $("#twitter_href").click(function() {
            var ref = window.open(twitterUrl, '_blank', 'location=yes');
            //document.location.href = twitterUrl;
        });
        $("#facebook_href").on("click", function() {
            var ref = window.open(faceUrl, '_blank', 'location=yes');
           
        });
        traeGalerias();
        traeWallpapers();
    } catch (ex) {
        hideLoading();
    }
};
traeElPost = function(idPost) {
    showLoading();
    $.getJSON('http://rockandclick.cl?json=get_post&post_id=' + idPost, function(data) {
        try {
            jsonPosts = data;
            nombreGaleria = jsonPosts.post.slug;
            url = jsonPosts.post.url;
            faceUrl = "http://www.facebook.com/sharer/sharer.php?u=" + url;
            text = jsonPosts.post.title + " Rock and Click - Radio Futuro 88.9 ";
            url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(text + ' ' + url);
            $("#banda").html($("<h3>").text(jsonPosts.post.title));
            $("#div_text").html("<br>");
            $("#div_text").html(jsonPosts.post.content);
            twitterUrl = url;
            $("#twitter_href").click(function() {
                var ref = window.open(twitterUrl, '_blank', 'location=yes');
//                document.location.href = twitterUrl;
            });
            $("#facebook_href").on("click", function() {
                var ref = window.open(faceUrl, '_blank', 'location=yes');
               
            });
            hideLoading();
        }
        catch (ex) {
            hideLoading();
        }
    });
};
/*compartir = function (){
 $.mobile.changePage("#share");
 }*/
traeGaleria = function(idGaleria) {
    if (jsonGaleria === 0 && galeriaCargada === 0) {
        var params = {
            action: 'get_galeryImages',
            gallery: idGaleria
        };
        showLoading();
        $.get('http://rockandclick.cl/wp-admin/admin-ajax.php', params, function(data) {
            galeriaCargada = 1;
            fn_traeGaleria(data);
        });
    } else if (galeriaCargada === 0) {
        galeriaCargada = 1;
        fn_traeGaleria(jsonGaleria);
    }
};
fn_traeGaleria = function(data) {
    try {
        jsonGaleria = JSON.parse(data);
        iTPlayer = jsonGaleria.gallery.length;
        $("#post_img_principal").attr("src", jsonGaleria.gallery[0].image);
        iAPlayer = 0;
        setInterval("botonera.cambiaImagen()", 6000);
        hideLoading();
        $.each(jsonGaleria.gallery, function(i, e) {
            jsonGaleria.gallery[i].img = $("<img/>").attr("src", e.image);
            //jsonGaleria.gallery[i].width = imagen[0].width;
            //jsonGaleria.gallery[i].height = imagen[0].height;
        });
    } catch (ex) {
        hideLoading();
    }
};
traeGaleriaPlayer = function(idGaleria) {
    showLoading();
    var params = {
        action: 'get_galeryImages',
        gallery: imageList[ idGaleria]
    };
    traeElPost(idGaleria);
    $.get('http://rockandclick.cl/wp-admin/admin-ajax.php', params, function(data) {
        try {
            jsonGaleria = JSON.parse(data);
            iTPlayer = jsonGaleria.gallery.length;
            $("#post_img_principal").attr("src", jsonGaleria.gallery[0].image);
            //botonera.play();
            //botonera.cambiaImagen();
            hideLoading();
            $.each(jsonGaleria.gallery, function(i, e) {
                jsonGaleria.gallery[i].img = $("<img/>").attr("src", e.image);
                //jsonGaleria.gallery[i].width = imagen[0].width;
                //jsonGaleria.gallery[i].height = imagen[0].height;
            });
        } catch (ex) {
            hideLoading();
        }
    });
};
traeGalerias = function() {
    if (hayGalerias === false) {
        showLoading();
        var params = {
            action: 'get_galleries',
            page: 1
        };
        $.get('http://rockandclick.cl/wp-admin/admin-ajax.php', params, function(data) {
            try {
                hayGalerias = true;
                $("#galeria_div").html("");
                var newGall = $("<div/>");
                var titulos = [];
                $.each($(data).find(".title"), function(i, div) {
                    newGall.append(
                            $("<div/>").attr("id", "galeria" + i).addClass("bloqueGaleria")
                            );
                    titulos[titulos.length] = $("<div/>").addClass("titulo_galeria").text($(div).text());
                });
                $.each($(data).find(".images"), function(i, div) {
                    var imagesDiv = $(div);
                    var gal = i;
                    $.each(imagesDiv.children(), function(i, a) {
                        if (i === 0) {
                            data = {
                                id: buscaId($(titulos[gal]).text())
                            };
                            $(newGall).children("#galeria" + gal).append(
                                    $("<img/>").addClass("img_galeria").data("data", data)
                                    .attr("src", $(a).children().attr("src"))).append(titulos[gal]);
                        }
                    });
                });
                hideLoading();
            } catch (ex) {
                hideLoading();
            }
            $("#galeria_div").html("");
            $("#galeria_div").append($(newGall));
            $(".img_galeria").on("vclick", function() {
                galeriaSeleccionada = $(this).data().data.id;
                $.mobile.changePage("#post_principal");
                traeGaleriaPlayer(galeriaSeleccionada);
            });
        });
    }
};
descargaGaleria = function(idGaleria) {
    if (confirm("Desea descargar la galeria a su tarjeta SD/RockandClick")) {
        showLoading();
        if (navigator.network.connection.type === "wifi") {
            var params = {
                action: 'get_galeryImages',
                gallery: imageList[ idGaleria]
            };
            try {
                alert("Se descargara la galeria, este proceso puede tardar...");
                $.get('http://rockandclick.cl/wp-admin/admin-ajax.php', params, function(data) {
                    jsonDescarga = JSON.parse(data);
                    var exitoDescarga = true;
                    var totalImagenes = jsonGaleria.gallery.length;
                    $.each(jsonDescarga.gallery, function(i, e) {
                        Downloader.prototype.downloadFile(
                                e.image,
                                {
                                    dirName: 'sdcard/rockandclick/' + nombreGaleria
                                },
                        function(e) {
                            if (e.status === 1 && totalImagenes === i && exitoDescarga === true) {
                                alert("La Galeria fue descargada con exito!");
                                hideLoading();
                            }
                        },
                                function(e) {
                                    exitoDescarga = false;
                                    alert("Error, al intentar obtener las Imagenes");
                                });
                    });
                    hideLoading();
                });
            }
            catch (e) {
                hideLoading();
            }
        } else {
            alert("Esta operacion esta solo disponible con Wi-FI");
        }
    }
};

toPhotos= function() {
    function fail(error) {
        alert(error.code);
    }
    
    function gotFS(fileSystem) {
        var saveToPath = fileSystem.root.fullPath;
        downloadTo( saveToPath );
    }
    
    function downloadTo(path) {
        var fileTransfer = new FileTransfer();
        var imageUri = urlWall;
        var uri = encodeURI(imageUri);
        
        
        function success() {
            alert("Listo!!");
            hideLoading();
        }
        
        function fail(err) {
            console.log('fail:err:'+err);
        }
        
        fileTransfer.download(
                              uri,
                              path + '/' + Date.now() + '.png',
                              function(entry) {
                              alert("Descargando");
                              window.plugins.SaveToPhotoAlbum.saveToPhotoAlbum( success, fail, entry.fullPath );
                              },
                              function(error) {
                              alert("ha ocurrido un error a intentar descargar la imagen")
                              }
                              );
    }
    
    window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, gotFS, fail);
    
    
};


descargaWallpaper = function(url) {
        urlWall= url;
        showLoading();
        alert("Este proceso puede tardar");
        toPhotos();
        return false;
    
    
};
traeWallpapers = function() {
    $.getJSON('http://rockandclick.cl/wallpapers/?json=1', function(data) {
        jsonWallpapers = data;
        var newWall = $("<div/>");
        $(newWall).addClass("contenedorWallpapers");
        $("#lista_walpapers").html("");
        $.each(jsonWallpapers.page.attachments, function(i, e) {
            $(newWall).append($("<img/>").on("click", function() {
                var obj = $(this).data().data;
                $.mobile.changePage("#wallpaperDownload");
                $("#wall_img_principal").data("data", obj)
                        .attr("src", obj.images.thumbnail.url)
                        .addClass("wall_img_principal")
                        .width("90%");
                $("#liHD").text("HD - " + obj.images.full.width + " X " + obj.images.full.height);
                $("#liSD").text("SD - " + obj.images.medium.width + " X " + obj.images.medium.height);
            })
                    .addClass("img_wallpaper")
                    .attr("src", e.images.thumbnail.url).data("data", e));
        });
        $("#lista_walpapers").append($(newWall));
    });
};
botonera = {
    reproduce: true,
    play: function() {
        if (botonera.reproduce === false) {
            botonera.reproduce = true;
        } else {
            botonera.reproduce = false;
        }
    },
    pause: function() {
    },
    back: function() {
        try {
            if (iAPlayer >= iTPlayer)
            {
                iAPlayer = 0;
            } else {
                iAPlayer--;
            }
            $("#post_img_principal").attr("src", jsonGaleria.gallery[iAPlayer].image);
            $("#galeria_img_full").attr("src", jsonGaleria.gallery[iAPlayer].image);
            calculaTamano(jsonGaleria.gallery[iAPlayer].img[0].height, jsonGaleria.gallery[iAPlayer].img[0].width, $("#galeria_img_full"));
            /*var wtTot = document.width;
             var htTot = jsonGaleria.gallery[iAPlayer].img[0].height * wtTot / jsonGaleria.gallery[iAPlayer].img[0].width;
             $("#galeria_img_full").width(wtTot).height(htTot)
             if( document.height > htTot  ){
             var newMargin = (document.height - htTot ) /2
             $("#galeria_img_full").css("margin-top", newMargin)
             }else{
             $("#galeria_img_full").css("margin-top", 0)
             }*/
        } catch (e) {
        }
    },
    next: function() {
        try {
            if (iAPlayer >= iTPlayer)
            {
                iAPlayer = 0;
            } else {
                iAPlayer++;
            }
            $("#post_img_principal").attr("src", jsonGaleria.gallery[iAPlayer].image);
            $("#galeria_img_full").attr("src", jsonGaleria.gallery[iAPlayer].image);
            calculaTamano(jsonGaleria.gallery[iAPlayer].img[0].height, jsonGaleria.gallery[iAPlayer].img[0].width, $("#galeria_img_full"));
            /* var wtTot = document.width;
             var htTot = jsonGaleria.gallery[iAPlayer].img[0].height * wtTot / jsonGaleria.gallery[iAPlayer].img[0].width;
             $("#galeria_img_full").width(wtTot).height(htTot);
             if( document.height > htTot  ){
             var newMargin = (document.height - htTot ) /2
             $("#galeria_img_full").css("margin-top", newMargin)
             } else{
             $("#galeria_img_full").css("margin-top", 0)
             }    */
        } catch (e) {
        }
    },
    cambiaImagen: function() {
        if (botonera.reproduce) {
            try {
                if (iAPlayer >= iTPlayer)
                {
                    iAPlayer = 0;
                } else {
                    iAPlayer++;
                }
                $("#post_img_principal").attr("src", jsonGaleria.gallery[iAPlayer].image);
                $("#galeria_img_full").attr("src", jsonGaleria.gallery[iAPlayer].image);
                calculaTamano(jsonGaleria.gallery[iAPlayer].img[0].height, jsonGaleria.gallery[iAPlayer].img[0].width, $("#galeria_img_full"));
                // var wtTot = parseInt(document.width);
                // var htTot = parseInt(jsonGaleria.gallery[iAPlayer].img[0].height * wtTot / jsonGaleria.gallery[iAPlayer].img[0].width);
                // $("#galeria_img_full").width(wtTot).height(htTot);
            } catch (e) {
            }
        }
    }
};
function ajustaImagen() {
    // $("#galeria_img_full").width($(window).width());
    // $("#galeria_img_full").height("auto");
}
/*function cambiaImagen(){
 if(botonera.reproduce == false){
 try{
 if(iA >= iT)
 {
 iA=0;
 }else{
 iA++;
 }
 $("#post_img_principal").attr("src",jsonGaleria.gallery[iA].image);
 $("#galeria_img_full").attr("src",jsonGaleria.gallery[iA].image);
 ajustaImagen();
 }catch(e){
 }
 }
 }*/
showLoading = function() {
    $("#carga").show().css({
        "top": ($(window).height() / 2) - 50,
        "left": ($(window).width() / 2) - 75
    });
};
hideLoading = function() {
    $("#carga").hide();
};
calculaTamano = function(pWidth, pHeight, imagen) {
    var dLandScape = false;
    var dPortrait = false;
    var iLandScape = false;
    var iPortrait = false;
    var dW = window.innerWidth;
    var dH = window.innerHeight;
    if (dW > dH) {
        dLandScape = true;
    } else {
        dPortrait = true;
    }
    if (pWidth > pHeight) {
        iLandScape = true;
    } else {
        iPortrait = true;
    }
    if (dLandScape) {
        if (iLandScape) {
            $(imagen).height(dH);
            $(imagen).width(pWidth * dH / pHeight);
        } else {
            $(imagen).height(dH);
            $(imagen).width(pHeight * dH / pWidth);
        }
    } else {
        if (iLandScape) {
            $(imagen).width(dW);
            $(imagen).height("auto");
        } else {
            $(imagen).width(dW);
            $(imagen).height("auto");
        }
    }
    if (dH > $(imagen).height()) {
        var newMargin = (dH - $(imagen).height()) / 2;
        $(imagen).css("margin-top", newMargin);
    } else {
        $(imagen).css("margin-top", 0);
    }
    if (dW > $(imagen).width()) {
        var newMargin = (dW - $(imagen).width()) / 2;
        $(imagen).css("margin-left", newMargin);
    } else {
        $(imagen).css("margin-left", 0);
    }
};
function playStream() {
    try {
        alert(1)
        myaudio.load();
        myaudio.play();
    }
    catch (e) {
        try {
            alert(2)
            myaudio = {};
            myaudio = new Audio('http://playerservices.streamtheworld.com/m3u/FUTUROAAC.m3u');
            myaudio.id = 'playerMyAdio';
            myaudio.load();
            myaudio.play();
            obtieneTrackDescription();
            /*setInterval(function(){
             $("#tiempo").text(humanReadableTime(myaudio.currentTime))
             },1000)*/
        } catch (e) {
            alert('No tienes soporte para audio!!');
        }
    }
}
function obtieneTrackDescription() {
    respuestaXML = null;
    setInterval(function() {
        if (reproduceRadio === true) {
                $.get('http://playerservices.streamtheworld.com/public/nowplaying?mountName=FUTURO&numberToFetch=4&eventType=track', function(xml) {
                      
                      respuestaXML = $.xml2json(xml);
                      
                      if(respuestaXML.nowplaying_info[0].property[1].text === "Radio Futuro"){
                        myTrackDesription.artista = respuestaXML.nowplaying_info[0].property[2].text; //Artista
                        myTrackDesription.titulo = respuestaXML.nowplaying_info[0].property[1].text; //titulo
                        myTrackDesription.caratula =respuestaXML.nowplaying_info[0].property[3].text; //caratula
                      }else{
                      
                      myTrackDesription.artista = respuestaXML.nowplaying_info[0].property[3].text; //Artista
                      myTrackDesription.titulo = respuestaXML.nowplaying_info[0].property[1].text; //titulo
                      myTrackDesription.caratula =respuestaXML.nowplaying_info[0].property[4].text; //caratula
                      myTrackDesription.disco = respuestaXML.nowplaying_info[0].property[2].text; //disco
                      myTrackDesription.ano = respuestaXML.nowplaying_info[0].property[2].text; //año
                      
                      }
                      
                      try {
                      
                      
                      myTrackDesription.disco1 = respuestaXML.nowplaying_info[1].property[4].text;
                      myTrackDesription.disco2 = respuestaXML.nowplaying_info[2].property[4].text;
                      myTrackDesription.disco3 = respuestaXML.nowplaying_info[3].property[4].text;
                      
                      
                      
                      } catch (ex) {
                      //nada;
                      }
                      $(".titulo h3").text(myTrackDesription.titulo);
                $("#tituloPrincipal h3").text(myTrackDesription.titulo);
                $(".detalle h4").text(myTrackDesription.artista);
                $("#detallePrincipal h4").text(myTrackDesription.artista);
                $(".caratula").css("background-image", "url(" + myTrackDesription.caratula + ")");
                $("#caratulaPrincipal").attr("src", myTrackDesription.caratula);
                var faceUrlPrincipal = "http://m.facebook.com/sharer.php?u=106.187.55.9/RockNclick/assets/www/index.php?";
                var twitterUrlPrincipal = "https://twitter.com/intent/tweet?text=yo%20escucho%20" + encodeURIComponent(myTrackDesription.titulo + " de " + myTrackDesription.artista + " en Radio Futuro 88.9 para iOS http://futuro.cl");
                $("#btnTwitter").click(function() {
                    var ref = window.open(twitterUrlPrincipal, '_blank', 'location=yes');                   
                    //document.location.href = twitterUrlPrincipal;
                });
                $("#btnFace").on("click", function() {
                    var rnd = randomnumber = Math.floor(Math.random() * 11111111111);
                   var ref = window.open(faceUrlPrincipal + rnd + "&_rdr", '_blank', 'location=yes');
                });
            });
        }
    }, 3000);
}
humanReadableTime = function(seconds) {
    seconds = seconds || 0;
    return ("0" + Math.floor(seconds / 60)).substr(-2, 2) + ":" + ("0" + Math.round(seconds % 60)).substr(-2, 2);
};
