import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { BooksService } from './books.service';

@Controller('books')
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Get()
  findAll(@Query('includeAuthor') includeAuthor?: string) {
    return { books: this.booksService.findAll(includeAuthor === 'true') };
  }

  @Get(':id')
  findOne(@Param('id') id: string, @Query('includeAuthor') includeAuthor?: string) {
    return this.booksService.findOne(+id, includeAuthor === 'true');
  }

  @Post()
  create(
    @Body()
    book: {
      title: string;
      authorId: number;
      publisherId: number;
      genreIds: number[];
    },
  ) {
    return this.booksService.create(book);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body()
    book: {
      title?: string;
      authorId?: number;
      publisherId?: number;
      genreIds?: number[];
    },
  ) {
    return this.booksService.update(+id, book);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.booksService.delete(+id);
  }
}
