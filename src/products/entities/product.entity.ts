import { BeforeInsert, BeforeUpdate, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductImage } from "./product-image.entity";
import { User } from "src/auth/entities/user.entity";
import { ApiProperty } from "@nestjs/swagger";

@Entity({name:'products'})
export class Product {

    @ApiProperty({
        example:'3c18b042-2677-44d7-8377-6e9beacd9366',
        description:'Product ID',
        uniqueItems: true
    })
    @PrimaryGeneratedColumn('uuid')
    id:string;

    @ApiProperty({
        example:'Kids Checkered Tee',
        description:'Product Title',
        uniqueItems: true
    })
    @Column('text',{
        unique: true,
    })
    title: string;

    @ApiProperty({
        example:0,
        description:'Product Price',
    })
    @Column('float',{
        default:0
    })
    price: number;

    @ApiProperty({
        example:'The checkered tee is made from long grain, GMO free Peruvian cotton. Peru is the only country in the world where cotton is picked by hand on a large scale. The 4,500-year-old tradition prevents damage to the fiber during the picking process and removes the need to use chemicals to open the cotton plants before harvest. This environmentally friendly process results in cotton that is soft, strong, and lustrous – and the tee will get even softer with every wash.',
        description:'Product Description',
        default: null
    })
    @Column({
        type:'text',
        nullable: true
    })
    description:string;

    @ApiProperty({
        example:'kids_checkered_tee',
        description:'Product Slug - for SEO',
        uniqueItems:true
    })
    @Column('text',{
        unique:true
    })
    slug:string;

    @ApiProperty({
        example:10,
        description:'Product Stock',
        default:0
    })
    @Column('int',{
        default:0
    })
    stock:number;

    @ApiProperty({
        example:['S','M','L','XS','XM','XL'],
        description:'Product Sizes',
    })
    @Column('text',{
        array:true
    })
    sizes: string[];

    @ApiProperty({
        example:'Women',
        description:'Product Gender',
    })
    @Column('text')
    gender:string;

    @ApiProperty({
        example:['shirt'],
        description:'Product Tags',
        default:null
    })
    @Column({
        type:'text',
        array:true,
        default:[]
    })
    tags: string[]


    //Images
    @ApiProperty({
        example:["100042307_0_2000.jpg","100042307_alt_2000.jpg"],
        description:'Product Images',
        default:null
    })
    @OneToMany(
        () => ProductImage,
        (productImage) => productImage.product,
        {cascade:true, eager:true}
    )
    images?:ProductImage[];


    @ManyToOne(
        () => User,
        (user) => user.product,
        {eager:true} 
    )
    user:User;


    @BeforeInsert()
    checkSlugInsert(){
        if (!this.slug) {
            this.slug = this.title.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
        }
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
    }

    @BeforeUpdate()
    checkslugUpdate(){
        this.slug = this.slug.toLowerCase().replaceAll(' ', '_').replaceAll("'",'');
    }

}
