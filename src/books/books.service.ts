import { Injectable, NotFoundException } from '@nestjs/common';
import { AuthorsService } from '../authors/authors.service';
import { PublishersService } from '../publishers/publishers.service';
import { GenresService } from '../genres/genres.service';

interface Book {
  id: number;
  title: string;
  authorId: number;
  publisherId: number;
  genreIds: number[];
}

@Injectable()
export class BooksService {
  private books: Book[] = [
    { id: 1, title: 'Pride and Prejudice', authorId: 1, publisherId: 1, genreIds: [1, 2, 3] },
    { id: 2, title: 'Oliver Twist', authorId: 2, publisherId: 2, genreIds: [1, 2, 5] },
    { id: 3, title: 'The Adventures of Tom Sawyer', authorId: 3, publisherId: 3, genreIds: [1, 4] },
  ];

  constructor(
    private readonly authorsService: AuthorsService,
    private readonly publishersService: PublishersService,
    private readonly genresService: GenresService,
  ) {}

  private enrich(book: Book, includeAuthor: boolean) {
    const publisher = this.publishersService.findOne(book.publisherId);
    const genres = this.genresService.findMany(book.genreIds);
    const result: Record<string, unknown> = {
      id: book.id,
      title: book.title,
      publisher,
      genres,
    };
    if (includeAuthor) {
      result.author = this.authorsService.findOne(book.authorId);
    } else {
      result.authorId = book.authorId;
    }
    return result;
  }

  findAll(includeAuthor = false) {
    return this.books.map((book) => this.enrich(book, includeAuthor));
  }

  findOne(id: number, includeAuthor = false) {
    const book = this.books.find((b) => b.id === id);
    if (!book) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    return this.enrich(book, includeAuthor);
  }

  create(data: { title: string; authorId: number; publisherId: number; genreIds: number[] }) {
    // Validate references exist
    this.authorsService.findOne(data.authorId);
    this.publishersService.findOne(data.publisherId);
    this.genresService.findMany(data.genreIds);

    const newBook: Book = {
      id: this.books[this.books.length - 1].id + 1,
      ...data,
    };
    this.books.push(newBook);
    return this.enrich(newBook, false);
  }

  update(id: number, data: { title?: string; authorId?: number; publisherId?: number; genreIds?: number[] }) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    if (data.authorId) this.authorsService.findOne(data.authorId);
    if (data.publisherId) this.publishersService.findOne(data.publisherId);
    if (data.genreIds) this.genresService.findMany(data.genreIds);

    this.books[index] = { ...this.books[index], ...data };
    return this.enrich(this.books[index], false);
  }

  delete(id: number) {
    const index = this.books.findIndex((b) => b.id === id);
    if (index === -1) {
      throw new NotFoundException(`Book with ID ${id} not found`);
    }
    this.books.splice(index, 1);
    return { deleted: true };
  }
}
