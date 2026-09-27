
// src/modules/posts/posts.controller.ts
import { Controller, Delete, Param, UseGuards } from '@nestjs/common';
import { OwnershipGuard } from '../../common/guards/ownership.guard';

@Controller('posts')
export class PostsController {
  @Delete(':id')
  @UseGuards(OwnershipGuard)
  deletePost(@Param('id') id: string) {
    return {
      message: `Đã xóa bài viết có ID: ${id}`,
    };
  }
}