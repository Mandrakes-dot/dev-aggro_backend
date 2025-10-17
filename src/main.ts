import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as process from 'node:process';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';

async function bootstrap() {

  console.log('ENV seen by API =>', {
    MINIO_ENDPOINT: process.env.MINIO_ENDPOINT,
    MINIO_PRIVATE_ENDPOINT: process.env.MINIO_PRIVATE_ENDPOINT,
    MINIO_PRIVATE_HOST: process.env.MINIO_PRIVATE_HOST,
    MINIO_PRIVATE_PORT: process.env.MINIO_PRIVATE_PORT,
    MINIO_PORT: process.env.MINIO_PORT,
    MINIO_USE_SSL: process.env.MINIO_USE_SSL,
    HAS_ACCESS: !!(process.env.MINIO_ACCESS_KEY || process.env.MINIO_ROOT_USER),
    HAS_SECRET: !!(
      process.env.MINIO_SECRET_KEY || process.env.MINIO_ROOT_PASSWORD
    ),
    MINIO_BUCKET: process.env.MINIO_BUCKET,
  });
  const app = await NestFactory.create(AppModule);

  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);

  const config = new DocumentBuilder()
    .setTitle('DEV_AGRO API')
    .setDescription('Routes description of Dev-agro API')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/doc-swagger', app, document, {
    swaggerOptions: { persistAuthorization: true, filter: true },
  });
  app.use(
    '/api/doc',
    apiReference({ spec: { content: document }, theme: 'moon' }),
  );

  const port = Number(process.env.PORT) || 3000;
  await app.listen(port, '0.0.0.0');
}
void bootstrap();
