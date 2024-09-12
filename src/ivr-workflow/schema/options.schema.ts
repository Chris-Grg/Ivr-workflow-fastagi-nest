import { createUnionType, Field, ObjectType } from "@nestjs/graphql";
import { Prop } from "@nestjs/mongoose";

@ObjectType()
export class IvrOptions {
    @Prop()
    @Field()
    audio: string;

    @Prop()
    @Field()
    waitTime: number;
}

@ObjectType()
export class QueueOptions {
    @Prop()
    @Field()
    queueName: string;
}

@ObjectType()
export class ExtensionOptions {
    @Prop()
    @Field()
    extensionNumber: string;
}
