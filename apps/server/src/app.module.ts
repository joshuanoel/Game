import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { GameModule } from './modules/game/game.module';
import { PlayerGateway } from './gateways/player.gateway';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, 'apps', 'client'),
    }),
    GameModule,
  ],
  controllers: [],
  providers: [PlayerGateway],
})
export class AppModule {}
