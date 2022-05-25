//importamos express
const express = require('express');

//importamos los middlewares
const { userExists } = require('../middlewares/user.middlewares');
const {
  ckeckValidator,
  createValidator,
  loginValidator,
} = require('../middlewares/validations.middlewares');

const {
  validatorToken,
  protectAccountOwner,
} = require('../middlewares/validateToken.middlewares');

//importamos contollers
const {
  getAllUser,
  createUser,
  searchUserId,
  updateUser,
  deleteUser,
  loginUser,
} = require('../controllers/user.controller');

// creamos una variable con otro nombre de app
const router = express.Router();

// logica endpoint

router.post('/', createValidator, ckeckValidator, createUser);

router.post('/login', loginValidator, ckeckValidator, loginUser);

//aplicar validateToken a todos los router
router.use(validatorToken);

//listado de usuarios
router.get('/', getAllUser);

router
  .route('/:id')
  .get(userExists, protectAccountOwner, searchUserId)
  .patch(userExists, protectAccountOwner, updateUser)
  .delete(userExists, protectAccountOwner, deleteUser);

//exportamos el archivo
module.exports = { userRouter: router };
