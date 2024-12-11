import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WesignModule } from './wesign/wesign.module';

@Module({
  imports: [WesignModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
