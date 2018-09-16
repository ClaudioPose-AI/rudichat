import { Format } from '../util/Format';
import { CaremaController } from './CameraController';
import { MicrophoneController } from './MicrophoneController';
import { DocumentPreviewController } from './DocumentPreviewController';
import { Chat } from '../model/Chat';
import { Message } from '../model/Message';
import { Base64 } from "../util/Base64"
import { Upload } from '../util/Upload';
import { Firebase } from "../util/Firebase";
import { User } from '../model/User';

export class ChatController {

    constructor(){

        console.log('ChatController Active')

        this._firebase = new Firebase();        
        this.loginEvents()
    };

    loginEvents() {

        let btnLogin = document.querySelector('#btnlogin');
        let btnRecord = document.querySelector('#btnrecord');
        let linkRecordLogin = document.querySelector('#linkRecordLogin'); 
        let linkLoginRecord = document.querySelector('#linkLoginRecord');


        if(btnLogin) {
            btnLogin.addEventListener('click', e => {
                this.login()            
            })
        }
        
        if (btnRecord) {
            btnRecord.addEventListener('click', e => {
                this.record()
            })
        }

        if (linkRecordLogin) {
            linkRecordLogin.addEventListener('click', e => {
                this.loadScreenLogin()
            })
        }

        if (linkLoginRecord) {
            linkLoginRecord.addEventListener('click', e => {
                this.loadScreenRecord()
            })
        }
    };

    login() {

        let email = document.querySelector('#emailLogin').value;
        let password = document.querySelector('#passwordLogin').value;

        this._firebase.initAuth('login', email, password).then(data => {

        this.init(data.user.email)

        });			
    }

    init(emailLogin) {

        this._active = true    

        this.elementsPrototype()
        this.loadElements()   

        this.initAuth(emailLogin)

        this.initEvents()
        this.checkNotifications()

        this.loadScreensMain()

    }

    loadScreenLogin() {
        document.getElementById('recordRudi').style.display = 'none'
        document.getElementById('loginRudi').style.display = 'flex'
    }

    loadScreenRecord() {
        document.getElementById('recordRudi').style.display = 'flex'
        document.getElementById('loginRudi').style.display = 'none'
    }

    loadScreensMain() {

        document.getElementById('loginRudi').style.display = 'none'

        document.getElementById('app').style.display = 'flex'

        document.getElementById('app-content').style.display = 'flex'

    }

    record() {

        let email = document.querySelector('#emailRecord').value;
        let password = document.querySelector('#passwordRecord').value;

        this._firebase.initAuth('record', email, password).then(user => {

            let dbUser = new User(email);
            dbUser.email = email
            dbUser.name = document.querySelector('#nameRecord').value;
            dbUser.company = document.querySelector('#companyRecord').value;
            dbUser.photo = '';
            dbUser.save();
        });

    };

    recover() {
        // Implement
    };

    checkNotifications() {

        if (typeof Notification === 'function') {

            if (Notification.permission !== 'granted') {

                this.el.alertNotificationPermission.show();

            } else {

                this.el.alertNotificationPermission.hide();

            }

            this.el.alertNotificationPermission.on('click', e => {

                Notification.requestPermission(permission => {

                    if (permission === 'granted') {

                        this.el.alertNotificationPermission.hide();
                        console.info('notificações permitidas');


                    }

                });

            });
        };
    };

    notification(data){

        if (Notification.permission === 'granted' && !this._active) {

            let n = new Notification(this._contactActive.name, {

                icon: this._contactActive.photo,
                body: data.content

            });

            let sound = new Audio('../assets/audio/alert.mp3');
            sound.currentTime = 0;
            sound.play();

            setTimeout(() => {

                if (n) n.close();

            }, 3000)

        }

    }


    initAuth(emailLogin){

            this._user = new User(emailLogin);

            this._user.on('datachange', data => {

                document.querySelector('title').innerHTML = 'RUDI - ' + data.name;

                this.el.inputNamePanelEditProfile.innerHTML = data.name;

                if (data.photo) {

                    let photo = this.el.imgPanelEditProfile;
                    photo.src = data.photo;
                    photo.show();
                    this.el.imgDefaultPanelEditProfile.hide();

                    let photo2 = this.el.myPhoto.querySelector('img');
                    photo2.src = data.photo;
                    photo2.show();

                };

                this.initContacts();
                

                this._user.save().then(()=>{
                    console.log('ok - user save')
                });
            
            });
    };

    initContacts(){

                this._user.on('contactschange', docs => {

                    //Limpa a lista atual
                    this.el.contactsMessagesList.innerHTML = '';
                    //Preenche lista de contatos
                    docs.forEach(doc => {

                        let contact = doc.data();
                        let div = document.createElement('div');

                        div.className = 'contact-item';

                        div.innerHTML =
                                `<div class="dIyEr">
                                    <div class="_1WliW" style="height: 49px; width: 49px;">
                                        <img src="#" class="Qgzj8 gqwaM photo" style="display:none;">
                                        <div class="_3ZW2E">
                                            <span data-icon="default-user" class="">
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 212 212" width="212" height="212">
                                                    <path fill="#DFE5E7" d="M106.251.5C164.653.5 212 47.846 212 106.25S164.653 212 106.25 212C47.846 212 .5 164.654.5 106.25S47.846.5 106.251.5z"></path>
                                                    <g fill="#FFF">
                                                        <path d="M173.561 171.615a62.767 62.767 0 0 0-2.065-2.955 67.7 67.7 0 0 0-2.608-3.299 70.112 70.112 0 0 0-3.184-3.527 71.097 71.097 0 0 0-5.924-5.47 72.458 72.458 0 0 0-10.204-7.026 75.2 75.2 0 0 0-5.98-3.055c-.062-.028-.118-.059-.18-.087-9.792-4.44-22.106-7.529-37.416-7.529s-27.624 3.089-37.416 7.529c-.338.153-.653.318-.985.474a75.37 75.37 0 0 0-6.229 3.298 72.589 72.589 0 0 0-9.15 6.395 71.243 71.243 0 0 0-5.924 5.47 70.064 70.064 0 0 0-3.184 3.527 67.142 67.142 0 0 0-2.609 3.299 63.292 63.292 0 0 0-2.065 2.955 56.33 56.33 0 0 0-1.447 2.324c-.033.056-.073.119-.104.174a47.92 47.92 0 0 0-1.07 1.926c-.559 1.068-.818 1.678-.818 1.678v.398c18.285 17.927 43.322 28.985 70.945 28.985 27.678 0 52.761-11.103 71.055-29.095v-.289s-.619-1.45-1.992-3.778a58.346 58.346 0 0 0-1.446-2.322zM106.002 125.5c2.645 0 5.212-.253 7.68-.737a38.272 38.272 0 0 0 3.624-.896 37.124 37.124 0 0 0 5.12-1.958 36.307 36.307 0 0 0 6.15-3.67 35.923 35.923 0 0 0 9.489-10.48 36.558 36.558 0 0 0 2.422-4.84 37.051 37.051 0 0 0 1.716-5.25c.299-1.208.542-2.443.725-3.701.275-1.887.417-3.827.417-5.811s-.142-3.925-.417-5.811a38.734 38.734 0 0 0-1.215-5.494 36.68 36.68 0 0 0-3.648-8.298 35.923 35.923 0 0 0-9.489-10.48 36.347 36.347 0 0 0-6.15-3.67 37.124 37.124 0 0 0-5.12-1.958 37.67 37.67 0 0 0-3.624-.896 39.875 39.875 0 0 0-7.68-.737c-21.162 0-37.345 16.183-37.345 37.345 0 21.159 16.183 37.342 37.345 37.342z"></path>
                                                    </g>
                                                </svg>
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <div class="_3j7s9">
                                    <div class="_2FBdJ">
                                        <div class="_25Ooe">
                                            <span dir="auto" title="${contact.name}" class="_1wjpf">${contact.name}</span>
                                        </div>
                                        <div class="_3Bxar">
                                            <span class="_3T2VG">${contact.lastMessageTime}</span>
                                        </div>
                                    </div>
                                    <div class="_1AwDx">
                                        <div class="_itDl">
                                            <span title="digitando…" class="vdXUe _1wjpf typing" style="display:none">digitando…</span>

                                            <span class="_2_LEW last-message">
                                                <div class="_1VfKB">
                                                    <span data-icon="status-dblcheck" class="">
                                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="18" height="18">
                                                            <path fill="#263238" fill-opacity=".4" d="M17.394 5.035l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-.427-.388a.381.381 0 0 0-.578.038l-.451.576a.497.497 0 0 0 .043.645l1.575 1.51a.38.38 0 0 0 .577-.039l7.483-9.602a.436.436 0 0 0-.076-.609zm-4.892 0l-.57-.444a.434.434 0 0 0-.609.076l-6.39 8.198a.38.38 0 0 1-.577.039l-2.614-2.556a.435.435 0 0 0-.614.007l-.505.516a.435.435 0 0 0 .007.614l3.887 3.8a.38.38 0 0 0 .577-.039l7.483-9.602a.435.435 0 0 0-.075-.609z"></path>
                                                        </svg>
                                                    </span>
                                                </div>
                                                <span dir="ltr" class="_1wjpf _3NFp9">${contact.lastMessage}</span>
                                                <div class="_3Bxar">
                                                    <span>
                                                        <div class="_15G96">
                                                            <span class="OUeyt messages-count-new" style="display:none;">1</span>
                                                        </div>
                                                </span></div>
                                                </span>
                                        </div>
                                    </div>
                                </div>`;

                        if (contact.photo) {
                            let img = div.querySelector('.photo');
                            img.src = contact.photo;
                            img.show();
                        };

                        div.on('click', e => {
                            
                            this.setActiveChat(contact);

                        });

                        this.el.contactsMessagesList.appendChild(div);

                    });
                });

                this._user.getContacts();
    };

    setActiveChat(contact){

            //Para de ouvir o contato / conversa anterior neste momento
            if(this._contactActive) {
                Message.getRef(this._contactActive.chatId).onSnapshot(() => {});
            };

            this._contactActive = contact;

            this.el.activeName.innerHTML = contact.name;
            this.el.activeStatus.innerHTML = contact.status;

            if (contact.photo) {

                let img = this.el.activePhoto;
                img.src = contact.photo;
                img.show();

            };

            this.el.home.hide();
            this.el.main.css({

                display : 'flex'

            });

            // Limpa as mensagens para carregar num novo assunto de um novo contato
            this.el.panelMessagesContainer.innerHTML = '';
            this._messagesReceived = [];

            Message.getRef(this._contactActive.chatId).orderBy('timeStamp').onSnapshot(docs => {

                let scrollTop = this.el.panelMessagesContainer.scrollTop;
                let scrollTopMax =
                    (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
                let autoScroll = (scrollTop <= scrollTopMax);

                docs.forEach(doc => {

                    let data = doc.data();
                    data.id = doc.id;

                    // VALIDACAO PARA GARANTIR QUE È O USUARIO ATIVO - VERIFICAR UMA FORMA MELHOR DEPOIS
                    //if (this._user.chatId === contact.chatId || data.from === this._user.email){

                    let message = new Message();

                    message.fromJson(data);

                    let me = (data.from === this._user.email);

                    if (!me && this._messagesReceived.filter(id => { return (id == data.id)}).length === 0) {

                        this.notification(data);
                        this._messagesReceived.push(data.id);

                    }

                    let view = message.getViewElement(me);

                    if (!this.el.panelMessagesContainer.querySelector('#_'+ data.id)) {
                        // avaliar a leitura do usuário
                        if(!me){
                            doc.ref.set({
                                status: 'read'
                            }, {
                                merge: true
                            });
                        }

                        this.el.panelMessagesContainer.appendChild(view);

                    } else {

                        let parent = this.el.panelMessagesContainer.querySelector('#_'+ data.id).parentNode;

                        // Troca o elemento :D - Assim não perde a referência e os eventos
                        parent.replaceChild(view, this.el.panelMessagesContainer.querySelector('#_'+ data.id));

                    };

                    if(this.el.panelMessagesContainer.querySelector('#_'+ data.id) && me) {

                        // Deve apenas atualizar o status :D
                        let msgEl = this.el.panelMessagesContainer.querySelector('#_'+ data.id);
                        msgEl.querySelector('.message-status').innerHTML = message.getStatusViewElement().outerHTML;
                    };
                    //};
                });

                // aplica regras do Scroll - Está no limite inferior?
                if(autoScroll){
                    this.el.panelMessagesContainer.scrollTop =
                    (this.el.panelMessagesContainer.scrollHeight - this.el.panelMessagesContainer.offsetHeight);
                } else{
                    this.el.panelMessagesContainer.scrollTop = scrollTop;
                };
            })

    };

    loadElements(){

        this.el = {};

        document.querySelectorAll('[id]').forEach(element=>{
            this.el[Format.getCamelCase(element.id)] = element;
        });
    };

    elementsPrototype(){

        Element.prototype.hide = function(){
            this.style.display = 'none';
            return this;
        }
        Element.prototype.show = function(){
            this.style.display = 'block';
            return this;
        }
        Element.prototype.toggle = function(){
            this.style.display = (this.style.display === 'none') ? 'block' : 'none';
            return this;
        }
        Element.prototype.on = function(events, fn){
            events.split(' ').forEach(event=>{
                this.addEventListener(event, fn);
            });
            return this;
        }
        Element.prototype.css = function(styles){
            for( let name in styles){
                this.style[name] = styles[name];
            }
            return this;
        }
        Element.prototype.addClass = function(name){
            this.classList.add(name);
        }
        Element.prototype.removeClass = function(name){
            this.classList.remove(name);
        }
        Element.prototype.toggleClass = function(name){
            this.classList.toggle(name);
        }
        Element.prototype.hasClass = function(name){
            this.classList.contains(name);
        }

        HTMLFormElement.prototype.getForm = function(){

            return new FormData(this);

        }

        HTMLFormElement.prototype.toJSON = function(){

            let json = {};

            this.getForm().forEach((value, key)=>{

                json[key] = value;

            });

            return json;

        }

    }

    initEvents(){

        window.addEventListener('focus', e => {

            this._active = true;

        })

        window.addEventListener('blur', e => {

            this._active = false;

        })

        this.el.inputSearchContacts.on('keyup', e=>{

            if(this.el.inputSearchContacts.value.length > 0){

                this.el.inputSearchContactsPlaceholder.hide();

            }else{

                this.el.inputSearchContactsPlaceholder.show();

            };

            this._user.getContacts(this.el.inputSearchContacts.value);

        });

        this.el.myPhoto.on('click', e=>{

            this.closeAllLeftPanel();
            this.el.panelEditProfile.show();
            this.el.panelEditProfile.addClass('open');

        })

        this.el.btnNewContact.on('click', e=>{

            this.closeAllLeftPanel();
            this.el.panelAddContact.show();
            this.el.panelAddContact.addClass('open');

        })

        this.el.btnClosePanelEditProfile.on('click', e=>{

            this.el.panelEditProfile.removeClass('open');

        })

        this.el.btnClosePanelAddContact.on('click', e=>{

            this.el.panelAddContact.removeClass('open');
        })

        this.el.photoContainerEditProfile.on('click', e=>{

            this.el.inputProfilePhoto.click();

        })

        this.el.inputProfilePhoto.on('change', e => {

            if (this.el.inputProfilePhoto.files.length > 0) {

                let file = this.el.inputProfilePhoto.files[0];

                Upload.send(file, this._user.email).then(url => {

                    this._user.photo = url;
                    this._user.save().then(() => {

                        this.el.btnClosePanelEditProfile.click();

                    });

                });

            };

        });

        this.el.inputNamePanelEditProfile.on('keypress', e=>{

            if(e.key === 'Enter'){

                e.preventDefault();
                this.el.btnSavePanelEditProfile.click();

            };

        });

        this.el.btnSavePanelEditProfile.on('click', e=>{

            this.el.btnSavePanelEditProfile.disabled = true;

            this._user.name = this.el.inputNamePanelEditProfile.innerHTML;

            this._user.save().then(()=>{
                this.el.btnSavePanelEditProfile.disabled = false;
            });

        });

        this.el.formPanelAddContact.on('submit', e=>{

            e.preventDefault();

            let formData = new FormData(this.el.formPanelAddContact);

            let contact = new User(formData.get('email'));

            //verifica se o usuário existe
            contact.on('datachange', data=>{

                if (data.name){

                    Chat.createIfNotExists(this._user.email, contact.email).then(chat => {

                        // Guardando o chat ID para o meu contato
                        contact.chatId = chat.id;

                        // Guardando o chat ID gerado para o meu user
                        this._user.chatId = chat.id;

                        // Se auto adicionando como contato para o contado na outra ponta
                        contact.addContact(this._user);

                        // Adicionar um novo contato a minha lista de contats
                        this._user.addContact(contact).then(()=>{

                            this.el.btnClosePanelAddContact.click();
                            console.info('Contato foi adicionado');

                    });

                    });

                }else{
                    console.error('Usuário não foi encontrado');
                };
            })

        });

        this.el.contactsMessagesList.querySelectorAll('.contact-item').forEach(item=>{

            item.on('click', e=>{

                this.el.home.hide();
                this.el.main.css({
                    display: 'flex'
                });
            });
        });

        this.el.btnAttach.on('click', e=>{

            e.stopPropagation();
            this.el.menuAttach.addClass('open');
            document.addEventListener('click', this.closeMenuAttach.bind(this))
        });

        this.el.btnAttachPhoto.on('click', e=>{

            this.el.inputPhoto.click();

        });

        this.el.inputPhoto.on('change', e=>{

            // [...] - usado em caso de coleções - para transformar em array e liberar o uso do forEach
            [...this.el.inputPhoto.files].forEach(file=>{

                Message.sendImage(this._contactActive.chatId, this._user.email, file);

            });
        })

        this.el.btnAttachCamera.on('click', e=>{

            this.closeAllMainPanel();
            this.el.panelCamera.addClass('open');
            this.el.panelCamera.css({
                'height' : 'calc(100% - 120px)'
            });

            this._camera = new CaremaController(this.el.videoCamera);

        });

        this.el.btnClosePanelCamera.on('click', e=>{

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
            this._camera.stop();
        });

        this.el.btnTakePicture.on('click',e=>{

            let dataUrl = this._camera.takePicture();

            this.el.pictureCamera.src = dataUrl;
            this.el.pictureCamera.show();
            this.el.videoCamera.hide();
            this.el.btnReshootPanelCamera.show();
            this.el.containerTakePicture.hide();
            this.el.containerSendPicture.show();
        });

        this.el.btnReshootPanelCamera.on('click', e=>{

            this.el.pictureCamera.hide();
            this.el.videoCamera.show();
            this.el.btnReshootPanelCamera.hide();
            this.el.containerTakePicture.show();
            this.el.containerSendPicture.hide();

        });

        this.el.btnSendPicture.on('click', e=>{

            this.el.btnSendPicture.disabled = true;

            let regex = /^data:(.+);base64,(.*)$/;

            let result = this.el.pictureCamera.src.match(regex);

            let mimeType = result[1];
            let ext = mimeType.split('/')[1]; // Pegar a extenção

            let filename = `camera${Date.now()}.${ext}`;

            let picture = new Image();
            picture.src = this.el.pictureCamera.src;
            picture.onload = e=>{

                let canvas = document.createElement('canvas');
                let context = canvas.getContext('2d');

                canvas.width = picture.width;
                canvas.height = picture.height;

                context.translate(picture.width, 0); // Girar a imagem, para o caso da imagem invertida
                context.scale(-1, 1);

                context.drawImage(picture, 0, 0, canvas.width, canvas.height);

                // Lendo o arquivo base64
                fetch(canvas.toDataURL(mimeType))
                    .then( res => { return res.arrayBuffer(); })
                    .then(buffer => { return new File([buffer], filename, { type: mimeType }); })
                    .then(file => {

                        Message.sendImage(this._contactActive.chatId, this._user.email, file);

                        this.el.btnSendPicture.disabled = false;
                        this._camera.stop();
                        this.el.btnReshootPanelCamera.hide();
                        this.el.pictureCamera.hide();
                        this.el.videoCamera.show();
                        this.el.containerSendPicture.hide();
                        this.el.containerTakePicture.show();
                        this.el.panelMessagesContainer.show();

                });

            };


        });

        this.el.btnAttachDocument.on('click', e=>{

            this.closeAllMainPanel();
            this.el.panelDocumentPreview.addClass('open');
            this.el.panelDocumentPreview.css({
                'height' : 'calc(100% - 120px)'
            });

            this.el.inputDocument.click();

        });

        this.el.inputDocument.on('change', e=>{

            if (this.el.inputDocument.files.length) {

                this.el.panelDocumentPreview.css({
                    'height' : '1%'
                });

                let file = this.el.inputDocument.files[0];

                this._documentPreviewController = new DocumentPreviewController(file);

                this._documentPreviewController.getPreviewData().then(result=>{

                    this.el.imgPanelDocumentPreview.src = result.src;
                    this.el.infoPanelDocumentPreview.innerHTML = result.info;
                    this.el.imagePanelDocumentPreview.show();
                    this.el.filePanelDocumentPreview.hide();

                    this.el.panelDocumentPreview.css({
                        'height' : 'calc(100% - 120px)'
                    });

                }).catch(err=>{

                    this.el.panelDocumentPreview.css({
                        'height' : 'calc(100% - 120px)'
                    });

                    switch (file.type){

                        case 'application/vnd.ms-excel':
                        case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
                            this.el.iconPanelDocumentPreview.ClassName = 'jcxhw icon-doc-xls';
                        break;

                        case 'application/vnd.ms-powepoint':
                        case 'application/vnd.openxmlformats-officedocument.presentationml.presentation':
                            this.el.iconPanelDocumentPreview.ClassName = 'jcxhw icon-doc-ppt';

                        break;

                        case 'application/vnd.msword':
                        case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
                            this.el.iconPanelDocumentPreview.ClassName = 'jcxhw icon-doc-doc';
                        break;

                        default:
                            this.el.iconPanelDocumentPreview.ClassName = 'jcxhw icon-doc-generic';

                        break;

                    };

                    this.el.filenamePanelDocumentPreview.innerHTML = file.name;
                    this.el.imagePanelDocumentPreview.hide();
                    this.el.filePanelDocumentPreview.show();
                });
            };
        });

        this.el.btnClosePanelDocumentPreview.on('click', e=>{

            this.closeAllMainPanel();
            this.el.panelMessagesContainer.show();
        });

        this.el.btnSendDocument.on('click', e=>{

            let file = this.el.inputDocument.files[0];
            let base64 = this.el.imgPanelDocumentPreview.src;

            if ( file.type === 'application/pdf') {

                Base64.toFile(base64).then(filePreview => {

                    Message.sendDocument(this._contactActive.chatId,
                                        this._user.email,
                                        file,
                                        filePreview,
                                        this.el.infoPanelDocumentPreview.innerHTML);

                });

            }else {

                Message.sendDocument(this._contactActive.chatId,
                                     this._user.email,
                                     file);

            };

            this.el.btnClosePanelDocumentPreview.click()



        });

        this.el.btnAttachContact.on('click', e=>{

            this.el.modalContacts.show();

        });

        this.el.btnCloseModalContacts.on('click', e=>{

            this.el.modalContacts.hide();
        });

        this.el.btnSendMicrophone.on('click', e=>{

            this.el.recordMicrophone.show();
            this.el.btnSendMicrophone.hide();
            //this.startRecordMicrophoneTime();

            this._microphoneController = new MicrophoneController();


            this._microphoneController.on('ready', musica=>{

                this._microphoneController.startRecorder();
            });

            this._microphoneController.on('recordtimer', timer=>{

                this.el.recordMicrophoneTimer.innerHTML = Format.toTime(timer);
            });
        });

        this.el.btnCancelMicrophone.on('click',e=>{

            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();

        });

        this.el.btnFinishMicrophone.on('click',e=>{

            this._microphoneController.stopRecorder();
            this.closeRecordMicrophone();

        });

        this.el.inputText.on('keypress', e=>{

            if (e.key === 'Enter' && !e.ctrlKey){

                e.preventDefault();
                this.el.btnSend.click();
            };

        });

        this.el.inputText.on('keyup', e=>{

            if (this.el.inputText.innerHTML.length) {

                this.el.inputPlaceholder.hide();
                this.el.btnSendMicrophone.hide();
                this.el.btnSend.show();

            } else {

                this.el.inputPlaceholder.show();
                this.el.btnSendMicrophone.show();
                this.el.btnSend.hide();

            };
        });

        this.el.btnSend.on('click', e=>{

            Message.send(this._contactActive.chatId,
                         this._user.email,
                         'text',
                         this.el.inputText.innerHTML);

            this.el.inputText.innerHTML = '';
            this.el.panelEmojis.removeClass('open');

        });

        this.el.btnEmojis.on('click', e=>{

            this.el.panelEmojis.toggleClass('open');
        });

        this.el.panelEmojis.querySelectorAll('.emojik').forEach(emoji=>{

            emoji.on('click', e=>{

                let img = this.el.imgEmojiDefault.cloneNode();
                img.style.cssText = emoji.style.cssText;
                img.dataset.unicode = emoji.dataset.unicode;
                img.alt = emoji.dataset.unicode;

                emoji.classList.forEach(name=>{

                    img.classList.add(name);
                });

                let cursor = window.getSelection();

                //saber se o cursor tá definido
                if (!cursor.focusNode || !cursor.focusNode.id == 'input-text'){
                    //forçar o foco no input text
                    this.el.inputText.focus();
                    cursor = window.getSelection();
                }

                let range = document.createRange();

                range = cursor.getRangeAt(0);

                range.deleteContents();

                let frag = document.createDocumentFragment();

                frag.appendChild(img);

                range.insertNode(frag);

                range.setStartAfter(img);

                // forçando que um evento aconteça:
                this.el.inputText.dispatchEvent(new Event('keyup'));


            });
        });


    };

    /*startRecordMicrophoneTime(){


    };*/

    closeRecordMicrophone(){

        this.el.recordMicrophone.hide();
        this.el.btnSendMicrophone.show();

    };

    closeAllMainPanel(){

        this.el.panelMessagesContainer.hide();
        this.el.panelDocumentPreview.removeClass('open');
        this.el.panelCamera.removeClass('open');
    };

    closeMenuAttach(e){

        document.removeEventListener('click', this.closeMenuAttach);
        this.el.menuAttach.removeClass('open');
    };

    closeAllLeftPanel(){
        this.el.panelAddContact.hide();
        this.el.panelEditProfile.hide();
    };
};
