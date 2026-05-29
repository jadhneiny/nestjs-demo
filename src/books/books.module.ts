import { Module } from '@nestjs/common';
import { BooksService } from './books.service';
import { BooksController } from './books.controller';
import { AuthorsModule } from 'src/authors/authors.module';
import { PublishersModule } from 'src/publishers/publishers.module';
import { GenresModule } from 'src/genres/genres.module';

@Module({
  providers: [BooksService],
  controllers: [BooksController],
  imports: [AuthorsModule, PublishersModule, GenresModule],
})
export class BooksModule {}
