import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import LocalFilesService from 'src/localfiles/localFiles.service';
import LocalFile from './localFile.entity';
import LocalFilesController from './localFiles.controller';

@Module({
  providers: [LocalFilesService],
  imports: [TypeOrmModule.forFeature([LocalFile])],
  controllers: [
	LocalFilesController,
],
})
export class LocalFileModule {}