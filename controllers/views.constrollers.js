const path = require('path');//libreria que nos ayuda contruir rutas para llegar archivos 


//enviado un archivo
const rederIndex = async (req, res, next) => {
    try {
        const indexPath = path.join(__dirname, "..", "public", "index.html")

        res.status(200).render("baseEmail", {
            status: "success",
        })

    } catch (error) {
        next(error)
    }

};


//exportamos 
module.exports = { rederIndex }