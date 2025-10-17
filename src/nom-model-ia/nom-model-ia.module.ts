import { Module } from '@nestjs/common';
import { NomModelIaController } from './nom-model-ia.controller';
import { NomModelIaService } from './nom-model-ia.service';

@Module({
  controllers: [NomModelIaController],
  providers: [NomModelIaService],
  exports: [NomModelIaService],
})
export class NomModelIaModule {}
