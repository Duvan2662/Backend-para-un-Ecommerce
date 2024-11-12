import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategy } from './strategis/jwt.strategy';

@Module({
  controllers: [AuthController],
  providers: [AuthService,JwtStrategy],
  imports:[
    TypeOrmModule.forFeature([
      User
    ]),
    PassportModule.register({defaultStrategy:'jwt'}),

    JwtModule.registerAsync({
      imports:[ConfigModule],
      inject:[ConfigService],
      useFactory:(configServices:ConfigService ) => {
        return{
          secret:configServices.get('JWT_SECRET'),
          signOptions:{
          expiresIn:'2h'
        }
      }
    }
    }),
    ConfigModule
    // JwtModule.register({
    //   secret:process.env.JWT_SECRET,
    //   signOptions:{
    //     expiresIn:'2h'
    //   }
    // })

  ]
})
export class AuthModule {}
