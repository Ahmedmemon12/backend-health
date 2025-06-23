import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET || 'your_jwt_secret', // You should move this to env variable
      signOptions: { expiresIn: '1d' }, // optional
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
