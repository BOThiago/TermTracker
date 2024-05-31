import { TrackerController } from './tracker.controller';
import { TrackerService } from './tracker.service';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  controllers: [TrackerController],
  providers: [TrackerService],
})
export class TrackerModule {}
