import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { TestModule } from './_test/test.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { FarmModule } from './farm/farm.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (cfg: ConfigService) => ({
        uri: cfg.get<string>('MONGODB_URI'),
        serverSelectionTimeoutMS: 5000,
        maxPoolSize: 10,
        autoIndex: false,
      }),
    }),
    TestModule,
    UserModule,
    ProductModule,
    FarmModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
