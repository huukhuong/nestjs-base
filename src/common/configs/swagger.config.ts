import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export const swaggerConfig = (app: INestApplication) => {
  const excludeKeywords = ['nestlens'];

  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);

  if (document.paths) {
    for (const path of Object.keys(document.paths)) {
      if (excludeKeywords.some(p => path.toLowerCase().includes(p))) {
        delete document.paths[path];
      }
    }
  }

  if (document.tags) {
    document.tags = document.tags.filter(
      t => !excludeKeywords.some(tag => t.name?.toLowerCase().includes(tag)),
    );
  }

  const documentFactory = () => document;

  SwaggerModule.setup('swagger', app, documentFactory);
};
