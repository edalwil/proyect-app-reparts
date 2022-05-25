const { Repairs } = require('../models/repairs.model');
const { User } = require('../models/user.model');

//listado de reparaciones
const getAllRepairs = async (req, res, next) => {
  try {
    const repairs = await Repairs.findAll({
      where: { status: 'pending' },
      include: [{ model: User }],
    });

    res.status(200).json({
      repairs,
    });
  } catch (error) {
    next(error);
  }
};

//buscar reaparacion con id
const searchRepairsId = async (req, res, next) => {
  try {
    const { repairs } = req;

    res.status(200).json({
      repairs,
    });
  } catch (error) {
    next(error);
  }
};

//crear nueva reparacion
const createRepairs = async (req, res, next) => {
  try {
    const { date, userId } = req.body;

    const createRepairs = await Repairs.create({
      date,
      userId,
    });

    res.status(200).json({
      status: 'success',
    });
  } catch (error) {
    next(error);
  }
};

//actualizar reparaciones
const updateRepairs = async (req, res, next) => {
  try {
    const { repairs } = req;
    const { status } = req.body;

    await repairs.update({ status });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

//eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    const { repairs } = req;

    await repairs.update({ status: 'canceled' });

    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRepairs,
  createRepairs,
  searchRepairsId,
  updateRepairs,
  deleteUser,
};
