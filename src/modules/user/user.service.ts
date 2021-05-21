import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { getUserBySocialId, insertUser } from 'src/database/mongo';

@Injectable()
export class UserService {
  async createUser(body) {
    const { id, imageUrl, email, name, typeAuth } = body;

    const userExists = await getUserBySocialId(id).catch((e) => {
      throw new HttpException('Database error', HttpStatus.BAD_GATEWAY);
    });

    if (!userExists) {
      await insertUser({
        socialId: id,
        imageUrl,
        email,
        name,
        typeAuth,
      }).catch((e) => {
        throw new HttpException('Database error', HttpStatus.BAD_GATEWAY);
      });
    }

    return {
      statusCode: userExists ? '100' : '101',
      message: userExists ? 'Ok' : 'User created',
    };
  }

  async getUserById(id) {
    const userExists = await getUserBySocialId(id).catch((e) => {
      throw new HttpException('Database error', HttpStatus.BAD_GATEWAY);
    });

    if (!userExists) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return userExists;
  }
}
