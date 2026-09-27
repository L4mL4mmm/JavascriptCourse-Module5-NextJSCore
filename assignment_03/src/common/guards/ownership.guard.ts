// src/common/guards/ownership.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class OwnershipGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();

    // Giả lập đối tượng user đính kèm từ Authentication Guard / Passport JWT
    const authenticatedUser = request.user || { id: 'user_123' }; 
    const resourceOwnerId = request.params.id;

    if (!resourceOwnerId) {
      return true;
    }

    // Nếu ID người gửi request khác ID tài nguyên cần xóa/sửa
    if (String(authenticatedUser.id) !== String(resourceOwnerId)) {
      throw new ForbiddenException('Bạn không có quyền thao tác trên tài nguyên của người khác.');
    }

    return true;
  }
}