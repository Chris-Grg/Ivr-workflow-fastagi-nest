
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { workflowOptionTypeEnum } from '../enum/workflow-option-type.enum';
import { ExtensionOptions, IvrOptions, QueueOptions } from './options.schema';
import { Children } from '../dto/createIvrWorkflow.input';

export type IvrDocument = HydratedDocument<Ivr>;

@Schema({ timestamps: true })
export class Ivr {
    @Prop()
    level: number;

    @Prop()
    name: string;

    @Prop({ enum: workflowOptionTypeEnum })
    type: workflowOptionTypeEnum;

    @Prop({ type: Object })
    options: IvrOptions | QueueOptions | ExtensionOptions;

    @Prop()
    children?: Children[]

}

export const IvrSchema = SchemaFactory.createForClass(Ivr);
