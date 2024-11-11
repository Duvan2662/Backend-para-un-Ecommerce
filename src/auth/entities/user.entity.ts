import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";


@Entity('users')
export class User {

    @PrimaryGeneratedColumn('uuid')
    id:string;

    @Column({
        type:'text',
        unique: true
    })
    email:string;

    @Column({
        type:'text'
    })
    password:string;

    @Column({
        type:'text',
    })
    fullname: string;

    @Column({
        type:'bool',
        unique:true
    })
    isActive:boolean;

    @Column({
        type:'text',
        array:true,
        default:['user']
    })
    roles:string[];

}
