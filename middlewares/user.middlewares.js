//importamos model user
const { User } = require('../models/user.model');

//utilis
const { AppError } = require('../utils/appError');

//realizamos la funcion con req, res, next
const userExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await User.findOne({ where: { id } });

    if (!user) {
      return next(new AppError('user does not exist', 404));
    }

    //envio de infomacion del usuario encontrado
    req.user = user;

    user.password = undefined;

    next();
  } catch (error) {
    next(error);
  }
};

//exportamos la funcion
module.exports = { userExists };
