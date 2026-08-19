import { Injectable, UnauthorizedException } from '@nestjs/common';
import { createHmac } from 'crypto';
import { UsersService } from '../users/users.service';

type TokenPayload = {
  sub: string;
  email: string;
  iat: number;
  exp: number;
};

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await this.usersService.validatePassword(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      accessToken: this.signToken({
        sub: user.id,
        email: user.email,
        iat: this.nowInSeconds(),
        exp: this.nowInSeconds() + 60 * 60 * 24,
      }),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    };
  }

  verifyToken(token: string): TokenPayload {
    const [encodedHeader, encodedPayload, signature] = token.split('.');

    if (!encodedHeader || !encodedPayload || !signature) {
      throw new UnauthorizedException('Invalid token');
    }

    const expectedSignature = this.createSignature(
      encodedHeader,
      encodedPayload,
    );

    if (signature !== expectedSignature) {
      throw new UnauthorizedException('Invalid token');
    }

    const payload = JSON.parse(
      this.base64UrlDecode(encodedPayload),
    ) as TokenPayload;

    if (payload.exp < this.nowInSeconds()) {
      throw new UnauthorizedException('Expired token');
    }

    return payload;
  }

  private signToken(payload: TokenPayload): string {
    const encodedHeader = this.base64UrlEncode(
      JSON.stringify({ alg: 'HS256', typ: 'JWT' }),
    );
    const encodedPayload = this.base64UrlEncode(JSON.stringify(payload));
    const signature = this.createSignature(encodedHeader, encodedPayload);

    return `${encodedHeader}.${encodedPayload}.${signature}`;
  }

  private createSignature(
    encodedHeader: string,
    encodedPayload: string,
  ): string {
    return createHmac('sha256', this.jwtSecret())
      .update(`${encodedHeader}.${encodedPayload}`)
      .digest('base64url');
  }

  private base64UrlEncode(value: string): string {
    return Buffer.from(value).toString('base64url');
  }

  private base64UrlDecode(value: string): string {
    return Buffer.from(value, 'base64url').toString('utf8');
  }

  private jwtSecret(): string {
    return process.env.JWT_SECRET ?? 'development-secret';
  }

  private nowInSeconds(): number {
    return Math.floor(Date.now() / 1000);
  }
}
