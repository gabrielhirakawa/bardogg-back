/* eslint-disable prettier/prettier */
require('dotenv').config();
const cors = require('cors');
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cors());
  await app.listen(3333);
}
bootstrap();
