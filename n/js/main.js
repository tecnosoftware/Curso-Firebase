

  // Initialize Firebase
  var config = {
    apiKey: "tus valores",
    authDomain: "proporcionados por ",
    databaseURL: "Firebase",
    storageBucket: "al momento de implementar el sdk",
  };
  firebase.initializeApp(config);

   var loginGoogle =document.getElementById('btn-google');
   var loginFacebook =document.getElementById('btn-facebook');
   var userPic= document.getElementById('user-pic');
   var userName=document.getElementById('user-name');
   var cerrarSesion= document.getElementById('cerrar');

   loginGoogle.addEventListener("click",ingresoGoogle);
   loginFacebook.addEventListener("click",ingresoFacebook);

   cerrarSesion.addEventListener("click",EliminarUserBD);

   
   var database = firebase.database();

   var conectados = null;
   var conectadokey="";

 

function ingresoGoogle () {
   // body...  

   if (!firebase.auth().currentUser){

    var provider = new firebase.auth.GoogleAuthProvider();

    provider.addScope('https://www.googleapis.com/auth/plus.login');

    firebase.auth().signInWithPopup(provider).then(function (result) {
       /* body... */ 

       var token = result.credential.accessToken;

       var user = result.user;



       $('#page').css("display", "none") && $('#page2').css("display", "block");

    InicializarFireChat();

    }).catch(function (error){
       /* body... */ 
       var errorCode = error.code;

       var errorMessage=error.mesagge;

       var email = error.email;

       var credential=error.credential;

        
    });
   }else{
    firebase.auth().signOut();
   }
}

function ingresoFacebook () {
   // body...  

   if (!firebase.auth().currentUser){

    var provider = new firebase.auth.FacebookAuthProvider();

    provider.addScope('public_profile');

    firebase.auth().signInWithPopup(provider).then(function (result) {
       /* body... */ 

       var token = result.credential.accessToken;

       var user = result.user;

       var name =result.user.displayName;

       console.log(user);

    
    }).catch(function (error){
       /* body... */ 
       var errorCode = error.code;

       var errorMessage=error.mesagge;

       var email = error.email;

       var credential=error.credential;

        if (errorCode ==='auth/account-exists-with-different-credential'){
          alert("Has igresado con otra cuenta");
        }else{
          console.log(errorCode);
        }
    });
   }else{
    firebase.auth().signOut();
   }
}



function InicializarFireChat(){


    firebase.auth().onAuthStateChanged(function (user) {
     /* body... */ 

     if (user){
        var userDisplayName = user.displayName;
        var userPhoto  =user.photoURL;
        
        userName.textContent = userDisplayName;
       
        if (userPhoto){
          userPic.style.backgroundImage= 'url('+ userPhoto + ')'; 

        }else{
          userPic.style.backgroundImage= 'url( ../images/profile_placeholder.png)';
        }
        


        conectados = database.ref("/user");

        AgregarUserBD(user.uid,user.displayName);

        conectados.on('child_added',function (data) {
           // body...  
           console.log("Ha Ingresado a la sala "+data.val().name);
           console.log("Ha Ingresado a la sala "+data.val().uid);
        });

        conectados.on('child_removed',function(data){
          console.log("Ha Salido de la sala "+data.val().name);
        });
        




     }
    });

}

function AgregarUserBD (uid,name) {
// body...  
  var conectado= conectados.push({
    uid:uid,
    name:name
  });

 
  conectadokey = conectado.key;
 
 }

 function EliminarUserBD (argument) {
    // body...  

    database.ref("/user/"+conectadokey).remove();


      $('#page2').css ("display", "none") && $('#page').css ("display", "block");
 


 }


  



  

