const { ref, uploadBytes, getDownloadURL } = require('firebase/storage');

//models
const { Repairs } = require('../models/repairs.model');
const { User } = require('../models/user.model');

//utlis
const { storage } = require('../utils/firebase');
const { Email } = require('../utils/email');

//listado de reparaciones
const getAllRepairs = async (req, res, next) => {
  try {
    //buscamos todos los reparaciones
    const repairs = await Repairs.findAll({
      where: { status: 'pending' },
      include: [{ model: User, attributes: { exclude: ['password'] } }],
    });

    //usamos map para buscar todas las img
    const repairsPromises = repairs.map(async (repair) => {
      //acceder a la imgen que creamos en firebase
      const imgRef = ref(storage, repair.imgPath);

      //le pasamos la imgen
      const url = await getDownloadURL(imgRef);

      //le asignamos el valor de url
      repair.imgPath = url;
      return repair;
    });

    //resolvemos la promesa
    const repairsResul = await Promise.all(repairsPromises);

    //enviamos la respuestas
    res.status(200).json({
      repairs: repairsResul,
    });
  } catch (error) {
    next(error);
  }
};

//buscar reaparacion con id
const searchRepairsId = async (req, res, next) => {
  try {
    //reparacion existente
    const { repairs } = req;

    //descargar la imagen
    const imgRef = ref(storage, repairs.imgPath);
    const url = await getDownloadURL(imgRef);

    //igualamos la url con imgPath
    repairs.imgPath = url;

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
    //datos enviados por cliente
    const { date, userId } = req.body;

    let imgUpload;

    if (req.file) {
      //generamos la referencia
      const imgRef = ref(
        storage,
        `repairs/${userId}-${Date.now()}-${req.file.originalname}`
      );

      //almacer los datos
      imgUpload = await uploadBytes(imgRef, req.file.buffer);
    }

    //creamos la reparacion
    const createRepairs = await Repairs.create({
      date,
      userId,
      imgPath: imgUpload ? imgUpload.metadata.fullPath : '',
    });

    res.status(200).json({
      createRepairs,
    });
  } catch (error) {
    next(error);
  }
};

//actualizar reparaciones
const updateRepairs = async (req, res, next) => {
  try {
    //reparacion
    const { repairs } = req;

    //datos enviados por el cliente
    const { status } = req.body;

    // modificando status
    await repairs.update({ status });

    //buscamos el correo del cliente
    const email = repairs.user.email;

    //buscamos el nombre del cliente
    const { name } = repairs.user.name;

    // envio de correo del cambio de status
    await new Email(email).sendStatusNoticiaCompleted(name);

    // envio de la respuesta
    res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

//eliminar usuario
const deleteUser = async (req, res, next) => {
  try {
    //repracion
    const { repairs } = req;

    // modificando status
    await repairs.update({ status: 'canceled' });

    //buscamos el correo del cliente
    const email = repairs.user.email;

    //buscamos el nombre del cliente
    const { name } = repairs.user.name;

    // envio de correo del cambio de status
    await new Email(email).sendStatusNoticiaCompleted(name);

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
