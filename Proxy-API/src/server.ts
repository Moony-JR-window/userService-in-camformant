import app from './app';
import dotenv from 'dotenv';

function RunningPorts() {
  dotenv.config({ path: '.env.development' });
  const PORT = process.env.Host_PORT||3040 ;
  app.listen(PORT, () => {
    console.log(`Proxy server is running on port ${PORT}`);
  });

}

RunningPorts()