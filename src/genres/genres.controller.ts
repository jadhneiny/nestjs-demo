import { Body, Controller, Delete, Get, Param, Patch, Post } from '@nestjs/common';
import { GenresService } from './genres.service';

@Controller('genres')
export class GenresController {
  constructor(private readonly genresService: GenresService) {}

  @Get()
  findAll() {
    return { genres: this.genresService.findAll() };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.genresService.findOne(+id);
  }

  @Post()
  create(@Body() genre: { name: string }) {
    return this.genresService.create(genre);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() genre: { name?: string }) {
    return this.genresService.update(+id, genre);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.genresService.delete(+id);
  }
}
