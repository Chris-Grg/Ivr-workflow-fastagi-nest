import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { workflowOptionTypeEnum } from '../enum/workflow-option-type.enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Children, Option } from './createIvrWorkflow.input';



@ObjectType('IvrCRUDResponseOutput') // ObjectType for Output

export class IvrCRUDResponse {
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
