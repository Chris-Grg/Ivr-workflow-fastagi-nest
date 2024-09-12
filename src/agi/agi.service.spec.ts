import { Test, TestingModule } from '@nestjs/testing';
import { AgiService } from './agi.service';

describe('AgiService', () => {
  let service: AgiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AgiService],
    }).compile();

    service = module.get<AgiService>(AgiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
