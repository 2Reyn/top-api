import { Body, Controller, Delete, Get, HttpCode, NotFoundException, Param, Patch, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { FindProductDto } from 'src/product/dto/find.product.dto';
import { TopPageModel } from './top-page.model';
import { FindTopPageDto } from './dto/find-top-page.dto';
import { TopPageService } from './top-page.service';
import { CreateTopPageDto } from './dto/create-top-page.dto';
import { IdValidationPipe } from 'src/pipes/ad-validation.pipe';
import { NOT_FOUND_TOP_PAGE_ERROR } from './top-page.constants';
import { JWTAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('top-page')
export class TopPageController {
	constructor(private readonly topPageService: TopPageService) {
	}

	@UseGuards(JWTAuthGuard)
	@Post('create')
	async create(@Body() dto: CreateTopPageDto) {
		return this.topPageService.create(dto)
	}

	@UseGuards(JWTAuthGuard)
	@Get(':id')
	async get(@Param('id', IdValidationPipe) id: string) {
		const page = await this.topPageService.findById(id)
		if (!page) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR)
		}
		return page
	}

	@UseGuards(JWTAuthGuard)
	@Delete(':id')
	async delete(@Param('id') id: string) {
		const deletedPage = await this.topPageService.findById(id)
		if (!deletedPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR)
		}
	}

	@UseGuards(JWTAuthGuard)
	@Patch(':id') //изменить что-то
	async patch(@Param('id') id: string, @Body() dto: TopPageModel) {
		const updatedPage = await this.topPageService.updateById(id, dto)
		if (!updatedPage) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR)
		}
	}

	@Get(':byAlias/:alias')
	async getByAlias(@Param('id') alias: string) {
		const page = await this.topPageService.findByAlias(alias)
		if (!page) {
			throw new NotFoundException(NOT_FOUND_TOP_PAGE_ERROR)
		}

		return page
	}

	@UsePipes(new ValidationPipe())
	@HttpCode(200)
	@Post('find')
	async find(@Body() dto: FindTopPageDto) {
		return this.topPageService.findByCategory(dto.firstCategory)
	}
}
