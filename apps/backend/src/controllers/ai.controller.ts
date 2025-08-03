import { Controller, Inject, Post, Body, Res } from '@nestjs/common';
import { AiService } from '../services/ai.service';
import type { FastifyReply } from 'fastify';
import { IsString } from 'class-validator';
import { jsonrepair } from 'jsonrepair';

class BodyTypes {
  @IsString()
  prompt: string;
}

@Controller('ai')
export class AiController {
  @Inject(AiService)
  aiService = new AiService();

  @Post('basic')
  async basic(@Body() body: BodyTypes, @Res() res: FastifyReply) {
    const response = await this.aiService.query(body.prompt);
    res.send({
      success: true,
      errors: [],
      data: {
        response: response
      }
    });
  }

  @Post('languaje')
  async languaje(@Body() body: BodyTypes, @Res() res: FastifyReply) {
    const response = await this.aiService.query(`Quiero que me digas el idioma de lo que te daré ahora, quiero que respondas "spanish" o "english".\n\n\n\n${body.prompt}`);
    res.send({
      success: true,
      errors: [],
      data: {
        response: response
      }
    });
  }

  @Post('json')
  async json(@Body() body: BodyTypes, @Res() res: FastifyReply) {
    const response = await this.aiService.query(`Responde únicamente con un objeto JSON. No incluyas explicaciones ni texto adicional."\n\n\n\n${body.prompt}`);
    const repaired = jsonrepair(response);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const parsedJson = JSON.parse(repaired);
    res.send({
      success: true,
      errors: [],
      data: {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        response: parsedJson
      }
    });
  }
}
