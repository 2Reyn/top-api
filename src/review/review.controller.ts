import { Body, Controller, Delete, Get, HttpException, HttpStatus, Param, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateReviewDto } from './dto/create-review.dto';
import { REVIEW_NOT_FOUND } from './review.constans';
import { ReviewService } from './review.service';
import { JWTAuthGuard } from '../auth/guards/jwt.guard';
import { UserEmail } from '../decorators/user-email.decorator';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';

@Controller('review')
export class ReviewController {
	constructor(private readonly reviewservice: ReviewService) { }

	@UsePipes(new ValidationPipe()) // импортим пайп, теперь данные будут проходить проверку по параметра которые были заданы в review.dto
	@Post('create')
	async create(@Body() dto: CreateReviewDto) {
		return this.reviewservice.create(dto)
	}

	@UseGuards(JWTAuthGuard)
	@Delete(':id')
	async delete(@Param('id', IdValidationPipe) id: string) {
		const deletedDoc = await this.reviewservice.delete(id);
		if (!deletedDoc) {
			throw new HttpException(REVIEW_NOT_FOUND, HttpStatus.NOT_FOUND)
		}
	}
	@UseGuards(JWTAuthGuard)
	@Get('byProduct/:productId')
	async getByProduct(@Param('productId', IdValidationPipe) productId: string, @UserEmail() email: string) {
		console.log(email)
		return this.reviewservice.findByProductId(productId);
	}
}
