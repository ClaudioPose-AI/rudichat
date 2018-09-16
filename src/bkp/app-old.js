import './assets/css/style.css'
import './controller/WhatsAppController'

//import {WhatsAppController} from './controller/WhatsAppController'


//window.app = new WhatsAppController()


// Adiciona novo usuário
function userRecord(){

    console.log('Entrou no evento')

    let email = document.querySelector('#email').innerHTML;
    let password = document.querySelector('#password').innerHTML;

    console.log(email);
    console.log(password);
};


// recordBtn.addEventListener('click', e => {

//     let email = document.querySelector('#email').innerHTML
//     let password = document.querySelector('#password').innerHTML

//     console.log(email);
//     console.log(password);

// });    

// Login


