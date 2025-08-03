import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // elimina propiedades no incluidas en el DTO
      forbidNonWhitelisted: true, // lanza error si hay propiedades no permitidas
      transform: true // convierte payloads a clases automáticamente
    })
  );

  app.enableCors();

  await app.listen(process.env.PORT ? parseInt(process.env.PORT, 10) : 3000);
}

bootstrap().catch((err) => {
  console.error('Error al iniciar la app:', err); // <- no silencies los errores
});
