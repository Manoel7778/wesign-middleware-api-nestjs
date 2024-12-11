import { Module } from '@nestjs/common';
import { WesignService } from './wesign.service';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { WesignController } from './wesign.controller';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true, // Torna as variáveis disponíveis globalmente
  }),HttpModule],
  providers: [WesignService],
  controllers:[WesignController],
  exports: [WesignService],
})
export class WesignModule {}