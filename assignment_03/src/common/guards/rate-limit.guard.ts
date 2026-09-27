// src/common/guards/rate-limit.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

interface ClientRateRecord {
  count: number;
  resetTime: number;
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly rateLimitMap = new Map<string, ClientRateRecord>();
  private readonly LIMIT = 10;
  private readonly WINDOW_MS = 60 * 1000; // 1 phút

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const clientIp = req.ip || req.socket.remoteAddress || 'unknown-ip';
    const now = Date.now();

    const record = this.rateLimitMap.get(clientIp);

    if (!record || now > record.resetTime) {
      // Khởi tạo window mới
      this.rateLimitMap.set(clientIp, {
        count: 1,
        resetTime: now + this.WINDOW_MS,
      });
      return true;
    }

    if (record.count >= this.LIMIT) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          error: 'Too Many Requests',
          message: `Vượt quá giới hạn ${this.LIMIT} request/phút. Vui lòng thử lại sau.`,
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    record.count++;
    return true;
  }
}