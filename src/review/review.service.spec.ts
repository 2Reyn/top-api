import { Test, TestingModule } from '@nestjs/testing';
import { Types } from 'mongoose';
import { getModelToken } from 'nestjs-typegoose';
import { ReviewService } from './review.service';

describe('ReviewService', () => {
  let service: ReviewService;
  const exec = { exec: jest.fn() }  // jest.fn позволяет слушать функицию
  const reviewRepositoryFactory = () => ({
    find: () => exec
  })

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ReviewService,
        { useFactory: reviewRepositoryFactory, provide: getModelToken('ReviewModel') } //пытаемся получить токен ReviewModel и приспоить его фабрике
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findByProductId working', async () => {
    const id = new Types.ObjectId().toHexString()
    reviewRepositoryFactory().find().exec.mockReturnValueOnce([{ productId: id }])  //находим и возвращаем один раз нашедшиеся данные   это Mock
    const res = await service.findByProductId(id)
    expect(res[0].productId).toBe(id) //ожидаем что первый элемент массива будет id
  });
});

// npm run test
