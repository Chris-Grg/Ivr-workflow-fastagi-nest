import { Controller } from '@nestjs/common';
import { AgiService } from './agi.service';

@Controller('agi')
export class AgiController {
  constructor(private readonly agiService: AgiService) {}
}
