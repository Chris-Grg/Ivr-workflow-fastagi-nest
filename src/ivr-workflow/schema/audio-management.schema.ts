import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ClB_FilesDocument = HydratedDocument<AudioManagement>; //deals with document related to User

@Schema({ timestamps: true })
export class AudioManagement {
  @Prop() //properties
  name: string;
  @Prop()
  fileSize: string;
  @Prop()
  date: Date;
  @Prop()
  duration: string;
  @Prop()
  hash: string;
  @Prop()
  path: string;
}

export const ClB_FilesSchema = SchemaFactory.createForClass(AudioManagement);
//supports the creation of schemas for database model
