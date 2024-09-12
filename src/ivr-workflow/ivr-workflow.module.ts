import { Module } from '@nestjs/common';
import { IvrWorkflowService } from './ivr-workflow.service';
import { IvrWorkflowResolver } from './ivr-workflow.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Ivr, IvrSchema } from './schema/ivr.schema';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { AudioManagement, ClB_FilesSchema } from './schema/audio-management.schema';

@Module({
  imports: [MongooseModule.forFeature([
    { name: Ivr.name, schema: IvrSchema },
    { name: AudioManagement.name, schema: ClB_FilesSchema },

  ]),

  ],
  providers: [IvrWorkflowResolver, IvrWorkflowService],
})
export class IvrWorkflowModule { }
