import { Field, InputType, PartialType } from '@nestjs/graphql';
import { Children, CreateIvrWorkflowInput, Option, ParentData } from './createIvrWorkflow.input'; // Adjust the path as needed
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { workflowOptionTypeEnum } from '../enum/workflow-option-type.enum';

@InputType()
export class EditIvrWorkflowInput extends PartialType(CreateIvrWorkflowInput) {
    @Field()
    @IsString()
    currentName: string;

    @Field({ nullable: true })
    @IsNumber()
    @IsOptional()
    level?: number;

    @Field({ nullable: true })
    @IsString()
    @IsOptional()
    name?: string;

    @Field(() => workflowOptionTypeEnum, { nullable: true })
    @IsOptional()
    type?: workflowOptionTypeEnum;

    @Field({ nullable: true })
    @IsOptional()
    options?: Option

    @Field(() => Children, { nullable: true })
    @IsOptional()
    children?: Children;

    @Field({ nullable: true })
    @IsOptional()
    parent?: ParentData;

}
