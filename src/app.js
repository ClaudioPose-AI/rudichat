import './assets/css/style.css' // Webpack compile ( CSS and Assets )
import {ChatController} from './controller/ChatController' // Webpack Compile ( JS All ) and Controller

// Init Controller (CHAT)
window.app = new ChatController()