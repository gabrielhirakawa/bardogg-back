import { Module } from '@nestjs/common';
import { MasteriesController } from './masteries.controller';
import { MasteriesService } from './masteries.service';

@Module({
  controllers: [MasteriesController],
  providers: [MasteriesService]
})
export class MasteriesModule {}
