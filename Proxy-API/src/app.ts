import express, { Request, Response, NextFunction } from 'express';
import cookieParser from 'cookie-parser';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import Access from './middleware/autoAccess';
const app = express();
app.use(cookieParser());

app.use(Access)
// Middleware to extract user_id from cookies and attach to req
app.use((req: Request, res: Response, next: NextFunction) => {
  const userId = req.cookies?.user_id;
  if (userId) {
    req.clientId = userId; // Attach to req.clientId if needed
  }
  next();
});

// Define API_SERVICE_URL from environment variables
const API_SERVICE_URL = process.env.API || 'http://localhost:3030';

const proxyConfig: { [key: string]: Options } = {
  '/v1/users': {
    target: API_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: { '^/v1/users': '/v1/users' }
  }
};

// Apply the proxy middlewares dynamically based on the configuration
Object.keys(proxyConfig).forEach((context) => {
  app.use(context, createProxyMiddleware(proxyConfig[context]));
});

// Basic route for testing
app.get('/', (req: Request, res: Response) => {
  res.send('Proxy server is running');
});

export default app;
