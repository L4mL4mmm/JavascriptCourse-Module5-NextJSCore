// src/modules/account/account.controller.ts
import { Controller, Post, Body } from '@nestjs/common';
import { InsufficientFundsException } from '../../common/exceptions/insufficient-funds.exception';

@Controller('accounts')
export class AccountController {
  @Post('transfer')
  transfer(@Body() body: { currentBalance: number; amount: number }) {
    if (body.currentBalance < body.amount) {
      throw new InsufficientFundsException();
    }

    return {
      message: 'Chuyển tiền thành công',
      remainingBalance: body.currentBalance - body.amount,
    };
  }
}