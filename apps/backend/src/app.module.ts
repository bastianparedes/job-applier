import { Module } from '@nestjs/common';
import { HealthController } from './controllers/health.controller';
import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    })
  ],
  controllers: [HealthController, AiController],
  providers: [AiService]
})
export class AppModule {}
