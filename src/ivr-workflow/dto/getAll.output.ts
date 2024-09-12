import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { workflowOptionTypeEnum } from '../enum/workflow-option-type.enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DTMF } from '../enum/dtmf.enum';
import { Children, Option } from './createIvrWorkflow.input';



@ObjectType('GetAllIvr') // ObjectType for Output

export class GetAllIvrOutput {
    @Field()
    @IsNumber()
    level: number;

    @Field()
    @IsString()
    name: string;

    @Field(() => workflowOptionTypeEnum)
    type: workflowOptionTypeEnum;

    @Field()
    options: Option

    @Field(() => [Children], { nullable: true })
    @IsOptional()
    children?: Children[];
}
