const multer = require('multer')//nos envia los datos en un formulario sirver para enviar imagenes

const storage = multer.memoryStorage()//almacena en la nueva 

const upload = multer({ storage })

module.exports = { upload }