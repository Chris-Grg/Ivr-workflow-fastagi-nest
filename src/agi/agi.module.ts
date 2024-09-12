import { Module } from '@nestjs/common';
import { AgiService } from './agi.service';
import { AgiController } from './agi.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Ivr, IvrSchema } from 'src/ivr-workflow/schema/ivr.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Ivr.name, schema: IvrSchema },])],
  controllers: [AgiController],
  providers: [AgiService],
})
export class AgiModule { }
