import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { scanFacades } from './decorators/facade.decorator';

/**
 * Bootstrap function that initializes and starts the NestJS application.
 * This is the entry point of the application.
 */
async function bootstrap() {
  // Create a new NestJS application instance using the root AppModule.
  // The AppModule contains all the configuration, controllers, and providers.
  const app = await NestFactory.create(AppModule);

  // Enable global validation pipe to automatically validate incoming request payloads.
  // This uses class-validator decorators defined in DTO classes to validate data.
  // Invalid requests will receive a 400 Bad Request response with validation errors.
  app.useGlobalPipes(new ValidationPipe());

  // Scan and log all @Facade decorated classes and their methods.
  scanFacades();

  // Start the HTTP server and listen for incoming requests.
  // Uses PORT environment variable if set, otherwise defaults to port 3000.
  await app.listen(process.env.PORT ?? 3000);
}

void bootstrap();
