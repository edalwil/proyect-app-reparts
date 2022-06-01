//impotamos los datos de app
const { app } = require('./app');

//importamos los datos de utils
const { db } = require('./utils/database');

//importamos los models
const { User } = require('./models/user.model');
const { Repairs } = require('./models/repairs.model');

//establecemos uniones
User.hasMany(Repairs);
Repairs.belongsTo(User);

//autenticacion de credenciales de base de datos
db.authenticate()
  .then(() => console.log('database authenticated'))
  .catch((err) => console.log(err));

db.sync({ force: true })
  .then(() => console.log('database sync'))
  .catch((err) => console.log(err));

// girar el servidor
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`express app runngin on port: ${PORT}`);
});
