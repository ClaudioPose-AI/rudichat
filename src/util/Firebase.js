const firebase = require('firebase');
require('firebase/firestore');

export class Firebase{
    constructor(){
        this._config = {
            apiKey: "AIzaSyCB_WmlBlQtBEXykLYalh2HkeKmAiaLxxY",
            authDomain: "rudi-chatbot.firebaseapp.com",
            databaseURL: "https://rudi-chatbot.firebaseio.com",
            projectId: "rudi-chatbot",
            storageBucket: "gs://rudi-chatbot.appspot.com",
            messagingSenderId: "469924925742"
        };

        this.init();
    };

    init(){

        if (!window._initializedFirebase){
            firebase.initializeApp(this._config);

            //Para garantir que será visto o tempo todo
            firebase.firestore().settings({
                timestampsInSnapshots: true
            });

            window._initializedFirebase = true;
        };

    };

    static db(){

        return firebase.firestore()
    };

    static hd(){

        return firebase.storage();

    };

    initAuth(type, email, password){

        return new Promise((s,f)=>{

            switch (type) {
                case 'login':
                    
                    firebase.auth().signInWithEmailAndPassword(email, password).then(onfulfilled => {
                        let user = onfulfilled.user
                        s({
                            user
                        });
                    }).catch(err => {
                        f(err);
                    });

                    break;
            
                case 'record':

                    firebase.auth().createUserWithEmailAndPassword(email, password).then(onfulfilled => {
                        let user = onfulfilled.user
                        s({
                            user
                        });
        
                    }).catch(err => {
                        f(err);
                    });

                    break;
                
                default:

                    break;
            }

            })
            .catch(err=>{
                f(err);
            });
    };
}