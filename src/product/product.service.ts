import { Injectable } from '@nestjs/common';
import { InjectModel } from 'nestjs-typegoose';
import { ReviewModel } from 'src/review/review.model';
import { ModelType } from 'typegoose';
import { CreateProductDto } from './dto/create-product.dto';
import { FindProductDto } from './dto/find.product.dto';
import { ProductModel } from './product.model';

@Injectable()
export class ProductService {
	constructor(@InjectModel(ProductModel) private readonly productModel: ModelType<ProductModel>) {
	}

	async create(dto: CreateProductDto) {
		return this.productModel.create(dto)
	}

	async findById(id: string) {
		return this.productModel.findById(id).exec();
	}

	async deleteById(id: string) {
		return this.productModel.findByIdAndDelete(id).exec();
	}

	async updateById(id: string, dto: CreateProductDto) {
		return this.productModel.findByIdAndUpdate(id, dto, { new: true }).exec()
	}

	async findWithReviews(dto: FindProductDto) { //агрегация MongoDB для поиска
		return this.productModel.aggregate([
			{
				$match: {
					categories: dto.category
				}
			},
			{
				$sort: {
					_id: 1
				}
			},
			{
				$limit: dto.limit
			},
			{
				$lookup: {
					from: 'Review',
					localField: "_id",
					foreignField: "_id",
					as: 'reviews' // как что вытащить
				}
			},
			{
				$addFields: {
					reviewCount: { $size: '$reviews' },
					reviewAvg: { $avg: '$reviews.rating' },
					// reviews: {         НЕОБХОДИМО ИМЕТЬ MONGODB 4.4 И ВЫШЕ
					// $function {
					// 	body: `function(reviews) {
					// 		reviews.sort((a, b) => new Date(b.createdAt) - new Date (a.createdAt))
					// 		return reviews;
					// 	}`,
					// 	args: ['$reviews'],
					// 	lang: 'js'
					// }
					// }
				}
			}
		]).exec() as unknown as (ReviewModel & { review: ReviewModel[], reviewCount: number, reviewAvg: number })[];
	}
}
