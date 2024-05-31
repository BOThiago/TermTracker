import { Controller, Get, Param } from '@nestjs/common';
import { TrackerService } from './tracker.service';

@Controller('tracker')
export class TrackerController {
  constructor(private readonly trackerService: TrackerService) {}

  @Get(':terms')
  async getWords(@Param('terms') terms: string): Promise<string[]> {
    return await this.trackerService.trackWords(terms);
  }
}
