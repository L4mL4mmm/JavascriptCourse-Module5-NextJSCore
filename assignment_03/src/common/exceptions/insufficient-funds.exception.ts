// src/common/exceptions/insufficient-funds.exception.ts
import { HttpException, HttpStatus } from '@nestjs/common';

export class InsufficientFundsException extends HttpException {
  constructor() {
    super(
      {
        statusCode: HttpStatus.BAD_REQUEST,
        error: 'INSUFFICIENT_FUNDS',
        message: 'Số dư tài khoản không đủ để thực hiện giao dịch',
      },
      HttpStatus.BAD_REQUEST,
    );
  }
}