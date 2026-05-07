import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { UserEntity } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { paginate, PaginationQuery } from 'src/common/pagination';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async createUser(user: CreateUserDto | UserEntity): Promise<UserEntity> {
    const entity = this.userRepository.create({
      firstName: user.firstName ?? null,
      lastName: user.lastName ?? null,
      username: user.username ?? null,
      email: user.email ?? null,
      phoneNumber: user.phoneNumber ?? null,
      password: user.password,
      status: user.status,
    });
    return this.userRepository.save(entity);
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findById(id: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        id,
      },
    });
  }

  async findByUsername(username: string): Promise<UserEntity | null> {
    return this.userRepository.findOne({
      where: {
        username,
      },
    });
  }

  async findAll(query: PaginationQuery) {
    return paginate(this.userRepository, query, {
      defaultOrderBy: 'createdAt',
      allowedOrderBy: ['createdAt', 'updatedAt', 'firstName', 'lastName'],
      message: 'Get users successfully',
      transform: user =>
        Object.fromEntries(
          Object.entries(user).filter(([key]) => key !== 'password'),
        ),
    });
  }
}
