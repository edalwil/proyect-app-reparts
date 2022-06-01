const express = require('express'); // importamos la libreria express
const cors = require('cors'); //importamos la libreria cors
const rateLimit = require('express-rate-limit'); // impotamos la libreria express-rate-limit
const helmet = require('helmet'); //importam la libreria helmet
const compression = require('compression'); //importamos la libreria compression
const morgan = require('morgan'); //importamos la libreria morgan

//init express app
const app = express();

//controller
const { errorGlobal } = require('./controllers/error.controllers');

//habilitamos cors
app.use(cors());

//habilitamos static assets
// app.use(express.static())

// habilitar pug
app.set("view engine", "pug")

//Routers
const { userRouter } = require('./router/user.routes');
const { repairsRouter } = require('./router/repairs.routes');
const { viewRouter } = require("./router/views.routes")

//Habilitar datos JSON entrantes
app.use(express.json());

//habilidar datos en formulario
app.use(express.urlencoded({ extended: true }));

//agregamos seguridad helmet
app.use(helmet());

//compression resposnes
app.use(compression());

//add morgan
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

//limit ip requests
const limiter = rateLimit({
  max: 10000, // cantidad de peticiones que queremos recibir
  windowMs: 1 * 60 * 60 * 1000, // tiempo que podemos recibir esas peticiones ejemplo 30 * 1000 = 30000 s = 30 s
  message: 'too many requests from this IP',
});

app.use(limiter); // estamos la escucha las const limiter

// Endpoints
app.use("/", viewRouter)
app.use("/api/v1/users", userRouter);
app.use('/api/v1/repairs', repairsRouter);

//escucha de mis error globales
app.use('*', errorGlobal);

module.exports = { app };