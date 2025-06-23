import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HealthMoniteringModule } from './health-monitering/health-monitering.module';
import { AuthModule } from './auth/auth.module';
import { DiseaseDataModule } from './disease-data/disease-data.module';
@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: true, // only use in dev
    }),
    HealthMoniteringModule,
    AuthModule,
    DiseaseDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
