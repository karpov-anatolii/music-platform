import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
const config = require('config');

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  async use(req /*: Request */, res: Response, next: NextFunction) {
    const { token } = req.cookies;
    req.userId = null;
    if (token) {
      const decoded = jwt.verify(
        token,
        config.get('secretKey'),
        function (err, decoded) {
          if (err) {
            return null; //'EXPIRED TOKEN'
          }
          return decoded; // { _id: '649c75cefed7e87ee46c2363', iat: 1688292296, exp: 1688295896 }
        },
      );
      if (decoded) req.userId = decoded._id; // request type is commented out otherwise typescript won't allow setting this
    }
    next();
  }
}
