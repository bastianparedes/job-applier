/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Injectable } from '@nestjs/common';
import { generateText } from 'ai';
import { google } from '@ai-sdk/google';
@Injectable()
export class AiService {
  async query(prompt: string) {
    const response = await generateText({
      model: google('models/gemini-1.5-flash-latest'),
      prompt,
      temperature: 0,
      maxRetries: 3
    });
    return response.text.trim();
  }
}
