import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS for frontend origin (e.g., Vite, React, etc.)
  app.enableCors({
    origin: [
      'http://localhost:5173',
      'https://precious-hamster-eb01f4.netlify.app',
      'https://68596c6c18651508c349a0cd--precious-hamster-eb01f4.netlify.app/',
    ],
    credentials: true, // if using cookies/auth headers
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
