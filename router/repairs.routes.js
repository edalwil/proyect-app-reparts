//implement express
const express = require('express');

//importamos los middlewares
const { repairsExists } = require('../middlewares/repairs.middlewares');
const { userExists } = require('../middlewares/user.middlewares');
const {
  ckeckValidator,
  createRepairsValidation,
} = require('../middlewares/validations.middlewares');
const {
  validateEmployees,
  validatorToken,
  protectAccountOwner,
} = require('../middlewares/validateToken.middlewares');

//importamos controllers
const {
  getAllRepairs,
  createRepairs,
  searchRepairsId,
  updateRepairs,
  deleteUser,
} = require('../controllers/repairs.controller');

//cramos una variable con otro nombre de app
const router = express.Router();

//crear reparaciones
router.post('/', createRepairsValidation, ckeckValidator, createRepairs);

//aplicar validateToken a todos los router
router.use(validatorToken, validateEmployees);

//listado de reaparaciones
router.get('/', getAllRepairs);

//logica endpoint
router
  .route('/:id')
  .get(repairsExists, searchRepairsId)
  .patch(repairsExists, updateRepairs)
  .delete(repairsExists, deleteUser);

//exportamos el archivo
module.exports = { repairsRouter: router };
