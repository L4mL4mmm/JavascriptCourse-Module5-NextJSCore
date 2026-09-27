// src/common/middlewares/ip-block.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class IpBlockMiddleware implements NestMiddleware {
  // Danh sách IP bị chặn (ví dụ ::1, 127.0.0.1)
  private readonly blacklist: string[] = ['::1', '127.0.0.1', '192.168.1.100'];

  use(req: Request, res: Response, next: NextFunction): void {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || '';

    // Chuẩn hóa địa chỉ IP dạng IPv6 ánh xạ IPv4 (::ffff:127.0.0.1 -> 127.0.0.1)
    const normalizedIp = clientIp.replace(/^.*:/, '');

    const isBlocked = this.blacklist.some(
      (blockedIp) => clientIp === blockedIp || normalizedIp === blockedIp,
    );

    if (isBlocked) {
      res.status(403).json({
        statusCode: 403,
        error: 'Forbidden',
        message: 'Địa chỉ IP của bạn đã bị chặn truy cập vào hệ thống.',
      });
      return;
    }

    next();
  }
}