import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateIvrWorkflowInput, Option } from './dto/createIvrWorkflow.input';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { AddNewChildInput } from './dto/addNewChild.input';
import { Ivr, IvrDocument } from './schema/ivr.schema';
import { workflowOptionTypeEnum } from './enum/workflow-option-type.enum';

@Injectable()
export class IvrWorkflowService {
  constructor(
    @InjectModel(Ivr.name) private readonly ivrModel: Model<Ivr>,
  ) { }
  async createIvrNode(
    createIvrWorkflowInput: CreateIvrWorkflowInput
  ): Promise<IvrDocument> {
    //check for duplicate names
    const duplicateName = await this.ivrModel.findOne({ name: createIvrWorkflowInput.name })
    if (duplicateName) { throw new BadRequestException('Duplicate name') }
    const rootNode = await this.ivrModel.findOne({ level: 1 })

    //check for root node
    if (rootNode && createIvrWorkflowInput.level === 1) {
      throw new BadRequestException('There can only be one root node, Root node already already exists')
    }

    //check for invalid data
    if (createIvrWorkflowInput.level === 1 && createIvrWorkflowInput.parent) {
      throw new BadRequestException('Parent array cannot be in root node')
    }
    if (createIvrWorkflowInput.level !== 1 && !createIvrWorkflowInput.parent) {
      throw new BadRequestException('Parent is required in non-root node')
    }
    const check = await this.typeBasedInputCheck(createIvrWorkflowInput.type, createIvrWorkflowInput.options)
    if (check.status === "error") {
      throw new BadRequestException(check.message)
    }
    const dbData = this.typeBasedDbData(createIvrWorkflowInput)
    const doc = new this.ivrModel(dbData)
    // check for parent
    if (createIvrWorkflowInput?.parent) {
      await this.addNewChild({
        parentName: createIvrWorkflowInput.parent.parentName,
        key: createIvrWorkflowInput.parent.key,
        destination: doc._id.toString()
      })
    }
    const createResponse = await doc.save()
    return createResponse
  }
  async deleteWorkflowNode(name: string): Promise<string> {
    const result = await this.ivrModel.findOne({ name: name })
    if (!result) throw new BadRequestException('Workflow node not found')
    await this.ivrModel.deleteOne({ _id: result._id })
    //delete from parent
    await this.ivrModel.updateOne(
      { "children.destination": result._id },
      {
        $pull: {
          children: { destination: result._id }
        }
      }
    );
    await this.ivrModel.findOne({ children: { destination: name } })
    return `${name} deleted`
  }
  async editWorkflow(name: string, updateData: Partial<CreateIvrWorkflowInput>): Promise<IvrDocument> {
    const data = await this.ivrModel.findOne({ name: name })
    if (data) {
      if (data?.type) {
        const check = await this.typeBasedInputCheck(updateData.type, updateData.options)
        if (check.status === "error") {
          throw new BadRequestException(check.message)
        }
      }
      return await this.ivrModel.findByIdAndUpdate(data._id, updateData, { new: true })
    }
    else {
      throw new BadRequestException('Workflow node not found')
    }

  }
  async deleteAll(confirm: boolean): Promise<string> {
    if (confirm) {
      await this.ivrModel.deleteMany()
      return 'All workflow nodes deleted'
    }
    else if (confirm === false) {
      return 'Deletion cancelled'
    }
    else {
      throw new BadRequestException('Invalid confirmation')
    }
  }

  async getAllIvr(): Promise<IvrDocument[]> {
    return await this.ivrModel.find()
  }

  private async addNewChild(input: AddNewChildInput): Promise<any> {
    const parentIvr = await this.ivrModel.findOne({ name: input.parentName })
    if (!parentIvr) throw new BadRequestException('Parent IVR not found')
    const duplicateData = parentIvr.children.find(child => child.key === input.key)
    if (duplicateData) throw new Error('Key already exists')
    parentIvr.children.push({ key: input.key, destination: input.destination, })
    await parentIvr.save()
  }

  private async typeBasedInputCheck(type: workflowOptionTypeEnum, options: Option): Promise<{ status: string, message: string }> {
    if (type === 'ivr') {
      if (!options?.audio) {
        return { status: "error", message: 'audio input is required' }
      }
      else return { status: "success", message: "" }
    }
    else if (type === 'queue') {
      if (!options?.queueName) {
        return { status: "error", message: 'queue name is required' }
      }
      else return { status: "success", message: "" }

    }
    else if (type === 'extension') {
      if (!options?.extensionNumber) {
        return { status: "error", message: "extension number is required" }
      }
      else return { status: "success", message: "" }
    }
    return { status: "error", message: "Invalid Input Type" }
  }
  private typeBasedDbData(input: CreateIvrWorkflowInput): CreateIvrWorkflowInput {
    const { type } = input
    switch (type) {
      case 'ivr':
        return {
          ...input,
          options: {
            audio: input.options.audio,
            ...(input.options?.waitTime && { waitTime: input.options?.waitTime })
          }
        }
      case 'queue':
        return {
          ...input, options: {
            queueName: input.options.queueName
          }
        }
      case 'extension':
        return {
          ...input,
          options: {
            extensionNumber: input.options.extensionNumber
          }
        }
    }
  }


}
