import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { CreateAuthDto } from './dto/create-auth.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { User } from './entities/user.entities';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async register(createAuthDto: CreateAuthDto) {
    const { fullName, email, password } = createAuthDto;
    console.log('====================================');
    console.log('fullName, email, password', fullName, email, password);
    console.log('====================================');
    const existingUser = await this.usersRepository.findOne({
      where: { email },
    });
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.usersRepository.create({
      fullName,
      email,
      password: hashedPassword,
      isEmailVerified: false,
    });

    await this.usersRepository.save(user);

    return {
      status: 200,
      message: 'User registered. Please verify your email.',
    };
  }

  async verifyEmail(token: string) {
    const user = await this.usersRepository.findOne({
      where: { refreshToken: token },
    });
    if (!user) {
      throw new BadRequestException('Invalid verification token');
    }

    user.isEmailVerified = true;
    await this.usersRepository.save(user);

    return { message: 'Email verified successfully' };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // if (!user.isEmailVerified) {
    //   throw new UnauthorizedException('Email not verified');
    // }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    user.refreshToken = refreshToken;
    await this.usersRepository.save(user);

    // Return only safe fields
    const safeUser = {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
      isEmailVerified: user.isEmailVerified,
    };

    return { user: safeUser, accessToken, refreshToken };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto) {
    const { refreshToken } = refreshTokenDto;

    try {
      const payload = this.jwtService.verify(refreshToken);
      const user = await this.usersRepository.findOne({
        where: { id: payload.sub, refreshToken },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const newPayload = { email: user.email, sub: user.id };
      const newAccessToken = this.jwtService.sign(newPayload, {
        expiresIn: '1h',
      });

      return { accessToken: newAccessToken };
    } catch (error) {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
