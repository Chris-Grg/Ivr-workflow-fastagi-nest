import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { workflowOptionTypeEnum } from '../enum/workflow-option-type.enum';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { DTMF } from '../enum/dtmf.enum';


@ObjectType('OriginOutput') // ObjectType for Output
@InputType('OriginInput')    // InputType for Input

export class Children {
  @Field(() => DTMF, { nullable: true })
  key: DTMF;

  @Field({ nullable: true })
  destination: string;
}

@ObjectType('OptionOutput') // ObjectType for Output
@InputType('OptionInput')    // InputType for Input

export class Option {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  audio?: string
  @Field({ nullable: true })
  @IsNumber()
  @IsOptional()
  waitTime?: number
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  queueName?: string
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  extensionNumber?: string
}

@ObjectType('ParentOutput') // ObjectType for Output
@InputType('ParentInput')    // InputType for Input

export class ParentData {
  @Field(() => DTMF)
  key: DTMF;

  @Field()
  parentName: string;
}

@ObjectType('CreateIvrWorkflowOutput') // ObjectType for Output
@InputType('CreateIvrWorkflowInput')    // InputType for Input

export class CreateIvrWorkflowInput {
  @Field()
  @IsNumber()
  level: number;

  @Field()
  @IsString()
  name: string;

  @Field(() => workflowOptionTypeEnum)
  @IsString()
  type: workflowOptionTypeEnum;

  @Field(() => Option)
  @IsOptional()
  options: Option

  @Field(() => Children, { nullable: true })
  @IsOptional()
  children?: Children;

  @Field(() => ParentData, { nullable: true })
  @IsOptional()
  parent?: ParentData;
}
