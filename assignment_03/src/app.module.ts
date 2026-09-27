// src/app.module.ts
import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { IpBlockMiddleware } from './common/middlewares/ip-block.middleware';

@Module({})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(IpBlockMiddleware).forRoutes('*');
  }
}