
import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { validate as isUUID } from "uuid";
import { title } from 'process';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductsService {

  private readonly logger = new Logger('ProductsService')

  constructor(
    @InjectRepository(Product)
    private readonly productRepository:Repository<Product>,

    @InjectRepository(ProductImage)
    private readonly productImageRepository:Repository<ProductImage>,

  ){}

  async create(createProductDto: CreateProductDto) {
    try {
      const {images = [], ...productDetails} = createProductDto;

      const product = this.productRepository.create({
        ...productDetails,
        images: images.map(image => this.productImageRepository.create({url:image}))
      });
      await this.productRepository.save(product);
      return {...product,images:images};
      
    } catch (error) {
      this.handleExecptions(error);
    }

  }

  async findAll(paginationDto:PaginationDto) {
    const {limit = 10 ,offset = 0} = paginationDto;
    return await this.productRepository.find({
      take:limit,
      skip:offset
    });
  }

  async findOne(busqueda: string) {

    let product:Product;
    // const product:Product = await this.productRepository.findOneBy({id: busqueda});
    if (isUUID(busqueda)) {
      product = await this.productRepository.findOneBy({id: busqueda});
    }else{
      const queryBuilder = this.productRepository.createQueryBuilder();
      product = await queryBuilder.where(`UPPER(title) =:title or slug=:slug`,{
        title:busqueda.toUpperCase(),
        slug:busqueda.toLowerCase(),
      }).getOne();
    }

    if (!product) {
      throw new NotFoundException(`Product with id, "${busqueda}" not found`);
    }

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.preload({
      id:id,
      ...updateProductDto,
      images:[]
    })

    if (!product) {
      throw new NotFoundException(`Producto with id: ${id} not found`)
    }

    try {
      await this.productRepository.save(product)
      return product
    } catch (error) {
      this.handleExecptions(error);
    }

  }

  async remove(id: string) {
    const {affected} = await this.productRepository.delete({id:id});
    if (affected === 0) {
      throw new BadRequestException(`Pokemon with id "${id}" not found`);
    }
    return;
  }


  private handleExecptions(error: any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail)
    }
    this.logger.error(error)
    throw new InternalServerErrorException('Error desconocido mirar la consola')
  }
}


