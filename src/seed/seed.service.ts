import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class SeedService {
  
  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly productServices:ProductsService,
  ){}

  async runSeed() {
    await this.deleteTables();
    const adminUsers =  await this.insertNewUsers();
    await this.insertNewProducts(adminUsers);
    return 'SEED EXECUTED';
  }

  private async deleteTables(){
    await this.productServices.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder
      .delete()
      .where({})
      .execute()


  }


  private async insertNewUsers(){
    const seedUsers = initialData.users;
    const users:User[] = [];

    seedUsers.forEach(user => {
      users.push(this.userRepository.create(user))
    })

    const dbUsers = await this.userRepository.save(seedUsers);
    return dbUsers[0];
  }
  private async insertNewProducts(user:User){
    await this.productServices.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];
    products.forEach(product => {
      insertPromises.push(this.productServices.create(product,user));
    })
    await Promise.all(insertPromises);
    return true
  }
  
}
