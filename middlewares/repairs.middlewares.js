//importamos model user
const { Repairs } = require('../models/repairs.model');
const { User } = require('../models/user.model');

//utils
const { AppError } = require('../utils/appError');

//realizamos la funcion con req, res, next
const repairsExists = async (req, res, next) => {
  try {
    const { id } = req.params;

    const repairs = await Repairs.findOne({
      where: { id },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });

    if (repairs.status === 'canceled') {
      return next(new AppError('repairs is canceled', 404));
    }

    //envio de infomacion del usuario encontrado
    req.repairs = repairs;

    repairs.password = undefined;

    next();
  } catch (error) {
    next(error);
  }
};

//exportamos la funcion
module.exports = { repairsExists };
