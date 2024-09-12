import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { IvrWorkflowService } from './ivr-workflow.service';
import { IvrDocument } from './schema/ivr.schema';
import { CreateIvrWorkflowInput } from './dto/createIvrWorkflow.input';
import { BadRequestException } from '@nestjs/common';
import { GetAllIvrOutput } from './dto/getAll.output';
import { EditIvrWorkflowInput } from './dto/editWorkflow.input';
import { IvrCRUDResponse } from './dto/ivrResponse.output';


@Resolver()
export class IvrWorkflowResolver {
  constructor(private readonly ivrWorkflowService: IvrWorkflowService) { }
  @Query(() => String)
  async helloWorld() {
    return 'Welcome to IvrWorkflow Service';
  }
  @Mutation(() => IvrCRUDResponse)
  async createWorkflow(@Args('input') input: CreateIvrWorkflowInput) {
    try {
      return await this.ivrWorkflowService.createIvrNode(input)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  @Mutation(() => String)
  async deleteEntireWorkflow(@Args('confirmation') confirmation: boolean) {
    try {
      return await this.ivrWorkflowService.deleteAll(confirmation)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  @Mutation(() => IvrCRUDResponse)
  async editWorkflow(
    @Args('updateData') updateData: EditIvrWorkflowInput
  ): Promise<IvrDocument> {
    try {
      return await this.ivrWorkflowService.editWorkflow(updateData.currentName, updateData)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }
  @Mutation(() => String)
  async deleteWorkflowNode(@Args('name') name: string) {
    try {
      return await this.ivrWorkflowService.deleteWorkflowNode(name)
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

  @Query(() => [GetAllIvrOutput])
  async getAllIvr() {
    try {
      return await this.ivrWorkflowService.getAllIvr()
    } catch (error) {
      throw new BadRequestException(error.message)
    }
  }

}
