const { User } = require('../models/user.model'); //importamos user de models
const bcrypt = require('bcryptjs'); //importamos bcrypt
const { AppError } = require('../utils/appError');
const jwt = require('jsonwebtoken');

//listado de usuarios
const getAllUser = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: {
        exclude: ['password'],
      },
    });
    res.status(200).json({
      users,
    });
  } catch (error) {
    next(error);
  }
};

//login user
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    //validar si el usuario existe
    const user = await User.findOne({
      where: { email, status: 'available' },
    });

    if (!user) {
      return next(new AppError('user does not exist', 404));
    }

    //validar contraseñas
    const validpassword = await bcrypt.compare(password, user.password);

    if (!validpassword) {
      return next(new AppError('credenciales invalid', 404));
    }

    //generar jswebtoken
    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_SECRET_EXPIRES,
    });

    //excluimos la contraseña
    user.password = undefined;

    //enviamos la respues positiva
    res.status(200).json({
      token,
      user,
    });
  } catch (error) {
    next(error);
  }
};

//buscar usuario
const searchUserId = async (req, res, next) => {
  try {
    const { user } = req;

    res.status(200).json({
      user,
    });
  } catch (error) {
    next(error);
  }
};

//crear usuarios nuevo
const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const salt = await bcrypt.genSalt(12);
    const hashPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name,
      email,
      password: hashPassword,
      role,
    });

    newUser.password = undefined;

    res.status(200).json({ newUser });
  } catch (error) {
    next(error);
  }
};

//modificar usuario
const updateUser = async (req, res, next) => {
  try {
    const { user } = req;
    const { name, email } = req.body;

    await user.update({ name, email });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

//eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    const { user } = req;

    await user.update({ status: 'delete' });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUser,
  createUser,
  searchUserId,
  updateUser,
  deleteUser,
  loginUser,
};
