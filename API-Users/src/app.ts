import express from 'express';
import swaggerUi from "swagger-ui-express";
import fs from 'fs';
import path from 'path'
import { RegisterRoutes } from './routes/v1/routes';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { CheckPromistion } from './middleware/check-req';




const swaggerDocument = JSON.parse(fs.readFileSync(path.join(__dirname, 'docs/swagger.json'), 'utf8'));

// ========================
// Initialize App Express
// ========================
const app = express();



app.use(cookieParser());

const corsOptions = {
    origin: true,// Allow only this origin
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };
  const corsOptions1 = {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
    credentials: true,
  };

  app.use(cors(corsOptions1));

  app.use(cors(corsOptions));

 app.use(CheckPromistion)  


// ========================
// Global Middleware
// ========================
app.use(express.json())  // Help to get the json from request body
// app.use(loger);
// ========================
// Global API V1
// ========================
RegisterRoutes(app)

// ========================
// API Documentations
// ========================
app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// ========================
// ERROR Handler
// ========================


export default app;