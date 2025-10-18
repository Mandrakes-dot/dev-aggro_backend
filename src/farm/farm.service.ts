import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FarmRepository } from './farm.repository';
import { FarmMapper } from './farm.mapper';
import { CreateFarmDto } from './dto/request/create-farm.dto';
import { GetFarmDto } from './dto/response/get-product.dto';
import { Types } from 'mongoose';
import { MemoryStoredFile } from 'nestjs-form-data';
import { MinioFile } from '../minio/minio-file.schema';
import { ProductService } from '../product/product.service';

@Injectable()
export class FarmService {
  constructor(
    private readonly farmRepository: FarmRepository,
    private readonly farmMapper: FarmMapper,
    private readonly productService: ProductService,
  ) {}

  async createFarm(createProductDto: CreateFarmDto): Promise<GetFarmDto> {
    const farmId = new Types.ObjectId();

    const incoming = createProductDto.pictures ?? [];
    const files: MemoryStoredFile[] = Array.isArray(incoming)
      ? incoming
      : [incoming];

    const pictures: MinioFile[] = [];
    if (files.length > 0) {
      pictures.push(
        ...(await this.productService.uploadAttachments(files, farmId)),
      );
      if (pictures.length < files.length)
        throw new InternalServerErrorException('Error during file upload');
    }

    const product = await this.farmRepository.createFarm(
      createProductDto,
      pictures,
    );
    return this.farmMapper.toGetFarmDto(product);
  }
}
