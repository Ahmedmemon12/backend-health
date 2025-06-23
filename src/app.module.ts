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
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'root',
      database: 'health_intelligence_guardian',
      autoLoadEntities: true,
      synchronize: true, // dev mode only
    }),
    HealthMoniteringModule,
    AuthModule,
    DiseaseDataModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
