import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SummonerModule } from './modules/summoner/summoner.module';
import { UserModule } from './modules/user/user.module';
import { MasteriesModule } from './modules/masteries/masteries.module';

@Module({
  imports: [SummonerModule, UserModule, MasteriesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
