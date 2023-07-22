import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
const config = require('config');

const start = async () => {
  try {
    const PORT = config.get('serverPort') || 5000;
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      credentials: true,
      origin: config.get('FRONTEND_URL'),
    });
    app.use(cookieParser());
    await app.listen(PORT, () => console.log(`Server started on port:${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
