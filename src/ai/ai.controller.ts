import { Controller, Post } from '@nestjs/common';
import { AiService, OreusChatResponse } from './ai.service';

@Controller('test')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post()
  testApi(): Promise<OreusChatResponse> {
    return this.aiService.getChatCompletion();
  }
}
