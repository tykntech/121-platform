import { ProofModule } from './../../sovrin/proof/proof.module';
import { SchemaModule } from './../../sovrin/schema/schema.module';
import { CredentialModule } from './../../sovrin/credential/credential.module';
import { ConnectionEntity } from './../../sovrin/create-connection/connection.entity';
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
  forwardRef,
} from '@nestjs/common';
import { ProgramController } from './program.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProgramEntity } from './program.entity';
import { UserEntity } from '../../user/user.entity';
import { ProgramService } from './program.service';
import { AuthMiddlewareAW } from '../../user/auth.middlewareAW';
import { AuthMiddlewareAdmin } from '../../user/auth.middlewareAdmin';
import { UserModule } from '../../user/user.module';
import { CustomCriterium } from './custom-criterium.entity';
import { AuthMiddlewarePM } from '../../user/auth.middlewarePM';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProgramEntity,
      UserEntity,
      CustomCriterium,
      ConnectionEntity,
    ]),
    forwardRef(() => CredentialModule),
    UserModule,
    SchemaModule,
    forwardRef(() => ProofModule),
  ],
  providers: [ProgramService],
  controllers: [ProgramController],
  exports: [ProgramService]
})
export class ProgramModule implements NestModule {
  public configure(consumer: MiddlewareConsumer): void {
    // consumer
    //   .apply(AuthMiddlewareAdmin)
    //   .forRoutes(
    //   );
    consumer
      .apply(AuthMiddlewarePM)
      .forRoutes(
        { path: 'programs', method: RequestMethod.GET },
        { path: 'programs', method: RequestMethod.POST },
        { path: 'programs/:id', method: RequestMethod.PUT },
        { path: 'programs/:id', method: RequestMethod.DELETE },
        { path: 'programs/publish/:id', method: RequestMethod.POST },
        { path: 'programs/unpublish/:id', method: RequestMethod.POST },
      );
    consumer
      .apply(AuthMiddlewareAW)
      .forRoutes({ path: 'programs/:id', method: RequestMethod.GET });
  }
}
