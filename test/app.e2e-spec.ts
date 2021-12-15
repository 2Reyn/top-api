import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { Types, disconnect } from 'mongoose';
import { CreateReviewDto } from '../src/review/dto/create-review.dto';
import { REVIEW_NOT_FOUND } from '../src/review/review.constans';
import { AuthDto } from 'src/auth/dto/auth.dto';

const productId = new Types.ObjectId().toHexString();

const loginDto: AuthDto = {
  login: 'afaffaaf@gmail.com',
  password: '12345678'
}

const testDto: CreateReviewDto = {
  name: 'Text',
  title: 'Title',
  description: 'Description',
  rating: 5,
  productId: productId
}

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let createdId: string;
  let token: string;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    const { body } = await request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
    token = body.access_token
  });

  it('/review/create (POST) -success', async () => {  // так как было использавоно then (async)
    return request(app.getHttpServer())
      .post('/review/create')
      .send(testDto)
      .expect(201)
      .then(({ body }: request.Response) => {
        createdId = body._id;
        expect(createdId).toBeDefined() //функция проверки    ожидаем, что было задано значение
      })
  });

  it('/review/create (POST) -fail', () => {
    return request(app.getHttpServer())
      .post('/review/create')
      .send({ ...testDto, rating: 0 }) //мы не можем задать рейтинг 0, так как указали в review.dto, что минимальное значение равно 1
      .expect(400)
      .then(({ body }: request.Response) => {
        console.log(body);
      });
  });

  it('/review/byProduct/:productId (GET) -success', async () => {  // так как было использавоно then (async)
    return request(app.getHttpServer())
      .get('/review/byProduct/' + productId)
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(1);
      });
  });

  it('/review/byProduct/:productId (GET) -fail', async () => {  // так как было использавоно then (async)
    return request(app.getHttpServer())
      .get('/review/byProduct/' + new Types.ObjectId().toHexString())
      .expect(200)
      .then(({ body }: request.Response) => {
        expect(body.length).toBe(0);
      });
  });


  it('/review/:id (DELETE) -success', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer' + token)
      .expect(200)
  });

  it('/review/:id (DELETE) -fail', () => {
    return request(app.getHttpServer())
      .delete('/review/' + createdId)
      .set('Authorization', 'Bearer' + token)
      .expect(404, {
        statusCode: 404,
        message: REVIEW_NOT_FOUND
      })
  });

  afterAll(() => {
    disconnect()
  })
});

// npm run test:e2e
