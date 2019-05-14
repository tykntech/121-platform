import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './program.entity';
import { UserEntity } from '../user/user.entity';
import { ProgramService } from './program.service';
import { AuthMiddleware } from '../user/auth.middleware';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProgramEntity, UserEntity]), UserModule],
  providers: [ProgramService],
  controllers: [
    ProgramController
  ]
})
export class ProgramModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .forRoutes(
        {path: 'programs/feed', method: RequestMethod.GET},
        {path: 'programs', method: RequestMethod.POST},
        {path: 'programs/:slug', method: RequestMethod.DELETE},
        {path: 'programs/:slug', method: RequestMethod.PUT});
  }
}