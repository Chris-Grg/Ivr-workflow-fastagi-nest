import { Logger, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AgiModule } from './agi/agi.module';
import { IvrWorkflowModule } from './ivr-workflow/ivr-workflow.module';
import { MongooseModule } from '@nestjs/mongoose';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import mongoose from 'mongoose';

@Module({
  imports: [AgiModule, IvrWorkflowModule,
    MongooseModule.forRoot("mongodb+srv://chrisgrgwft:VXkbgAbQkNM7nDC7@cluster0.4leyo.mongodb.net/ivr-test"),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      subscriptions: {
        'graphql-ws': true,
      },
      context: ({ req }) => {
        return req;
      },

      playground: true,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor() { console.log(process.env.DB_CONNECTION) }
}
