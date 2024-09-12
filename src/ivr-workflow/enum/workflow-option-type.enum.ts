import { registerEnumType } from "@nestjs/graphql";

export enum workflowOptionTypeEnum {
    QUEUE = 'queue',
    IVR = 'ivr',
    EXTENSION = 'extension'
}

registerEnumType(workflowOptionTypeEnum, {
    name: 'workflowOptionTypeEnum',
});