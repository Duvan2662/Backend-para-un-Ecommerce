import { BadRequestException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

import { Repository } from 'typeorm';
import * as bcrypt from "bcrypt";

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository:Repository<User>,
    private readonly jwtServices:JwtService,
  ){}


  async create(createUserDto: CreateUserDto) {
    try {

      const {password, ...userData} = createUserDto;

      
      const user = this.userRepository.create({
        ...userData,
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save(user);
      delete user.password;
      return {
        ...user,
        token: this.getJwtToken({id:user.id})
      };

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async login(loginUserDto:LoginUserDto){
    try {
      const {password, email} = loginUserDto;
      const user = await this.userRepository.findOne({
        where:{email},
        select:{email:true, password:true, id: true}
      })
      if (!user) {
        throw new UnauthorizedException('Credentials are not valid (email)');
      }
      if (!bcrypt.compareSync(password, user.password)) {
        throw new UnauthorizedException('Credentials are not valid (password)');
        
      }
      return {
        ...user,
        token: this.getJwtToken({id:user.id})
      };

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  async checkAuthStatus(user:User){
    try {
      const {email} = user
      const userData = await this.userRepository.findOne({
        where:{email},
        select:{email:true, password:true, id: true, fullName:true}
      })
      return{
        ...userData,
        token: this.getJwtToken({id:userData.id})
      }


    } catch (error) {
      this.handleDBErrors(error);
      
    }
    
  }


  private handleDBErrors(error:any) {
    if (error.code === '23505') {
      throw new BadRequestException(error.detail);
    }
    console.log(error);
    throw new InternalServerErrorException('Please check server logs')
    
  }
  private getJwtToken(payload:JwtPayload){
    const token = this.jwtServices.sign(payload);
    return token
  }

  
}
