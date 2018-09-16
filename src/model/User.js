import { Firebase } from './../util/Firebase';
import { Model } from './Model';

export class User extends Model{

    constructor(id){

        super();
        
        if (id) 
            this.getById(id).then(doc => {
                console.log('User created')
            });
            this._id = id;
    };

    get name(){ return this._data.name; };
    set name(value){ this._data.name = value; };

    get email(){ return this._data.email; };
    set email(value){ this._data.email = value; };
    
    get photo(){ return this._data.photo; };
    set photo(value){ this._data.photo = value; };

    get chatId(){ return this._data.chatId; };
    set chatId(value){ this._data.chatId = value; };

    get company(){ return this._data.company; };
    set company(value){ this._data.company = value; };


    // GETBYID TO GETUSER
    getUser(email) {
        let userRef = Firebase
            .db()
            .collection('/users')
            .doc(email)

        let userDoc = userRef.get();

        this.fromJson(userDoc.data())

        return userDoc
    }

    getById(id){

        return new Promise((s,f) => {

            Firebase
                .db()
                .collection('/users')
                .doc(id)
                .onSnapshot(doc => {
                    
                    this.fromJson(doc.data());
                    
                    s(doc);
                    
            }, err => {
                
                f(err)
           
            });
        });
    };

    save(){

        return new Promise((s,f) => {
                        
            let userSave = User
                            .findByEmail(this._id)
                            .set(this.toJson())
            
            if(userSave) {
                s(userSave);
            } else {
                f('Error Save')
            };
        });
    }

    static getRef(){

        return Firebase
            .db()
            .collection('/users');

        };

    static getContactRef(id){

        return Firebase
            .db()
            .collection('/users')
            .doc(id)
            .collection('contacts');

    };

    static findByEmail(email){

        return Firebase
            .db()
            .collection('/users')
            .doc(email);

    };

    addContact(contact){

        return User.getContactRef(this._id)
                   .doc(btoa(contact.email))
                   .set(contact.toJson());

    };

    getContacts(filter = ''){

        return new Promise((s,f)=>{
            
            User.getContactRef(this._id)
                .where('name', '>=', filter)
                .onSnapshot(docs =>{

                    let contacts = [];

                    docs.forEach(doc=>{

                        let data = doc.data();

                        data.id = doc.id;

                        contacts.push(data);

                    });

                    this.trigger('contactschange', docs);

                    s(contacts);
                });
        })

    };
}