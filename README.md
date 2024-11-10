<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="120" alt="Nest Logo" /></a>
</p>



## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Ejecutar en Desarrollo

1. Clonar el repositorio
```bash
$ git clone https://github.com/Duvan2662/Backend-para-un-Ecommerce.git
```

2. Ejecutar 
```bash
$ npm install
```

3. Tener Nest CLI instalado
```bash
$ npm i -g @nestjs/cli
```

4. Clonar el archivo ```.env.template``` y renombrar la copia a ```.env``` 

5. LLenar las variables de entorno definidad en el ```.env```

6. Levantar la base de datos (Se debe tener corriendo el Docker desktop)
```bash
$ docker-compose up -d
```

7. Poner a correr la API en modo desarrollador  
```bash
$ npm run start:dev
```

8. Reconstruir la base de datos con la semilla si no se tienen ningun Producto usando Postman realizar una peticion GET con el siguiente endpoint

```bash
$ http://localhost:3000/api/seed
```



## Stack usado
* PostgresSQL
* Nest
* Docker




