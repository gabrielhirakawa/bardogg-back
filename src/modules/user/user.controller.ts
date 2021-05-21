import { Controller, Body, Post, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(public service: UserService) {}

  @Post()
  async postUser(@Body() body) {
    return await this.service.createUser(body);
  }

  @Get(':id')
  async getUser(@Param() param) {
    return await this.service.getUserById(param.id);
  }
}
