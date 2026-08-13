import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { UserRole } from '../../generated/prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { UsersService } from './users.service';

@ApiTags('Users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOperation({
    summary: 'ADMIN tạo người dùng',
  })
  @ApiCreatedResponse({
    type: UserResponseDto,
  })
  @ApiConflictResponse({
    description: 'Email đã được sử dụng.',
  })
  @ApiUnauthorizedResponse({
    description: 'Chưa đăng nhập hoặc token không hợp lệ.',
  })
  @ApiForbiddenResponse({
    description: 'Không có quyền ADMIN.',
  })
  create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @ApiOperation({
    summary: 'ADMIN lấy danh sách người dùng',
  })
  @ApiOkResponse({
    type: UserResponseDto,
    isArray: true,
  })
  findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'ADMIN lấy thông tin một người dùng',
  })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng.',
  })
  findOne(
    @Param('id', new ParseUUIDPipe()) id: string,
  ): Promise<UserResponseDto> {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'ADMIN cập nhật người dùng',
  })
  @ApiOkResponse({
    type: UserResponseDto,
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng.',
  })
  @ApiConflictResponse({
    description: 'Email đã được sử dụng.',
  })
  update(
    @Param('id', new ParseUUIDPipe()) id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'ADMIN xóa người dùng',
  })
  @ApiNoContentResponse({
    description: 'Đã xóa người dùng.',
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy người dùng.',
  })
  remove(@Param('id', new ParseUUIDPipe()) id: string): Promise<void> {
    return this.usersService.remove(id);
  }
}
