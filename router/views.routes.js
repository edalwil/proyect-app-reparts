const express = require('express');

//controller 
const { rederIndex } = require('../controllers/views.constrollers')

//activamos express
const router = express.Router()

//enpoint
router.get("/", rederIndex)

//exportamos 
module.exports = { viewRouter: router }
