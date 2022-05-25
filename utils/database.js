const Sequelize = require('sequelize'); // importamos la libreria Sequelize
const dotenv = require('dotenv'); // importamos la libreria dotenv para hacer variables de entorno

dotenv.config({ path: './config.env' });

const db = new Sequelize({
  dialect: 'postgres',
  host: process.env.DB_HOST,
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB,
  logging: false,
  dialectOption:
    process.env.NODE_ENV === 'production'
      ? {
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        }
      : {},
});

module.exports = { db };
