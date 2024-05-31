import { TrackerModule } from './tracker/tracker.module';
import { TrackerController } from './tracker/tracker.controller';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrackerService } from './tracker/tracker.service';

@Module({
  imports: [TrackerModule],
  controllers: [TrackerController, AppController],
  providers: [AppService, TrackerService],
})
export class AppModule {}
