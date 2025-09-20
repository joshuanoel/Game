import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { NetworkModule } from './modules/network/network.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    NetworkModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
