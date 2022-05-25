const { User } = require('../models/user.model'); //models
const jwt = require('jsonwebtoken'); //libreria jsonwebtoken
const { AppError } = require('../utils/appError'); //utils

//validamos el token
const validatorToken = async (req, res, next) => {
  try {
    let token;

    //confirmar si token esta en el header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      //quitamos bearer del token
      token = req.headers.authorization.split(' ')[1];
    }

    //confirmar si el token existe
    if (!token) {
      return next(new AppError('credenciales invalid', 404));
    }

    //varificar token
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);

    //retornar vairable decoded
    const user = await User.findOne({
      where: { id: decoded.id, status: 'available' },
    });

    if (!user) {
      return next(
        new AppError('the owner of this token is not loger available', 404)
      );
    }

    req.sessionUser = user;

    next();
  } catch (error) {
    next(error);
  }
};

const validateEmployees = async (req, res, next) => {
  try {
    if (req.sessionUser.role !== 'employee') {
      return next(new AppError('access not granted', 403));
    }
    next();
  } catch (error) {
    next(error);
  }
};

const protectAccountOwner = async (req, res, next) => {
  // Obtenga el usuario de la sesión actual y el usuario que se actualizará
  const { sessionUser, user } = req;

  //compramos las id
  if (sessionUser.id !== user.id) {
    return next(new AppError('you do not own this account', 403));
  }

  //si las id son iguales pasa la respuesta
  next();
};

module.exports = { validatorToken, validateEmployees, protectAccountOwner };
