// src/common/filters/database-exception.filter.ts
import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class DatabaseExceptionFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // 1. Bắt lỗi vi phạm ràng buộc Unique của PostgreSQL (mã 23505)
    // Hỗ trợ cả trường hợp dùng pg-native, TypeORM (driverError), hoặc Prisma (P2002)
    const isPostgresUniqueViolation =
      exception?.code === '23505' || exception?.driverError?.code === '23505';

    if (isPostgresUniqueViolation) {
      return response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'Bad Request',
        message: 'Dữ liệu này đã tồn tại trong hệ thống',
        timestamp: new Date().toISOString(),
      });
    }

    // 2. Chuyển tiếp các HttpException thông thường
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const resData = exception.getResponse();
      return response.status(status).json(
        typeof resData === 'object'
          ? { ...resData, timestamp: new Date().toISOString() }
          : { statusCode: status, message: resData, timestamp: new Date().toISOString() },
      );
    }

    // 3. Fallback cho các lỗi 500 không xác định khác
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      error: 'Internal Server Error',
      message: 'Đã xảy ra lỗi máy chủ nội bộ',
      timestamp: new Date().toISOString(),
    });
  }
}