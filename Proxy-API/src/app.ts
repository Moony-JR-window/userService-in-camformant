import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware } from 'http-proxy-middleware';
import checkToken from './middleware/check-token';
import Access from './middleware/autoAccess';
import cors from 'cors'

const app = express();
app.use(cookieParser());
app.use(Access)

const corsOptions = {
  origin: true, // Allow only this origin
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};
app.use(cors(corsOptions))
const corsOptions1 = {
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  allowedHeaders: 'Content-Type, Authorization',
  credentials: true,
};



app.use(cors(corsOptions1));


declare module 'express' {
  interface Request {
    clientId?: string;
  }
}

function Post(post: string) {

  app.use(`/v1/user/${post}`, (req: Request, res: Response, next: NextFunction) => {
    let route
    if(post==="register"){
      route=''
    }
    else{
      route=post
    }
    console.log(`User ID is: ${req.clientId}`);
    const targetUrl = `${API_SERVICE_URL}/v1/user/${route}`;
    console.log(`Proxying request to: ${targetUrl}`);
    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/v1/user/${post}`]: '',
      },
    });
    proxyMiddleware(req, res, next);
  });
}
const post = ['register','verify','login'];
post.forEach(Post);


app.use(checkToken);

const API_SERVICE_URL = process.env.API_SERVICE_URL || 'http://localhost:3030';

function createDynamicRoute(endpoint: string) {
  app.use(`/v1/user/${endpoint}`, (req: Request, res: Response, next: NextFunction) => {
    if (!req.clientId) {
      console.log('No clientId found, returning 400');
      return res.status(400).send('User ID not found in cookies');
    }
    let route
    if(endpoint==="profile/"){
      route=''
    }
    else{
      route=endpoint
    }
    console.log(`User ID is: ${req.clientId}`);
    const targetUrl = `${API_SERVICE_URL}/v1/user/${route}${req.clientId}`;
    console.log(`Proxying request to: ${targetUrl}`);
    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/v1/user/${endpoint}`]: '',
      },
    });
    proxyMiddleware(req, res, next);
  });
}
const endpoints = ['profile/','bacis/', 'pfComplete/', 'education/', 'experince/','reference/','cv/','photo/'];
endpoints.forEach(createDynamicRoute);



function Update(update: string) {
  app.use(`/v1/user/${update}`, (req: Request, res: Response, next: NextFunction) => {
    console.log(`User ID is: ${req.clientId}`);
    const targetUrl = `${API_SERVICE_URL}/v1/user/${update}${req.clientId}`;
    console.log(`Proxying request to: ${targetUrl}`);
    const proxyMiddleware = createProxyMiddleware({
      target: targetUrl,
      changeOrigin: true,
      pathRewrite: {
        [`^/v1/user/${update}`]: '',
      },
    });
    proxyMiddleware(req, res, next);
  });
}
const update = ['','verify','login'];
update.forEach(Update);

app.get('/', (req: Request, res: Response) => {
  res.send('Proxy server is running');
});

export default app;
