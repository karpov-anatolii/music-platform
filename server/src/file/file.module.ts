import { Module } from '@nestjs/common';

import { FileService } from './file.service';

@Module({
  // importing MulterModule and use memory storage to use the buffer within the pipe

  providers: [FileService], //регистрация сервиса в модуле, чтобы можно было работать с ним
})
export class FileModule {}
// @Module({
//   // importing MulterModule and use memory storage to use the buffer within the pipe
//   imports: [MulterModule.register({
//     storage: memoryStorage()
//   })],
//   controllers: [AppController],
//   providers: [AppService],
// })
