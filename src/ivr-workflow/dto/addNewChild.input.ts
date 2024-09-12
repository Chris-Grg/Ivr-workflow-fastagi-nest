import { InputType, Field } from '@nestjs/graphql';
import { DTMF } from '../enum/dtmf.enum';



@InputType('NewChildInput')
export class AddNewChildInput {

    @Field()
    parentName: string;
    @Field()
    key: DTMF;
    @Field()
    destination: string;

}


