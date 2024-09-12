import { Test, TestingModule } from '@nestjs/testing';
import { AgiController } from './agi.controller';
import { AgiService } from './agi.service';

describe('AgiController', () => {
  let controller: AgiController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AgiController],
      providers: [AgiService],
    }).compile();

    controller = module.get<AgiController>(AgiController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
