import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Option } from 'src/ivr-workflow/dto/createIvrWorkflow.input';
import { Ivr, IvrDocument } from 'src/ivr-workflow/schema/ivr.schema';
import { IvrOptions, QueueOptions } from 'src/ivr-workflow/schema/options.schema';
import { EventEmitter } from 'stream';

// Import AGIServer using require
const AGIServer = require('asteriskagi');

@Injectable()
export class AgiService implements OnModuleInit, OnModuleDestroy {
    private agi: EventEmitter;
    private currentNode: any;
    private input: string

    constructor(
        @InjectModel(Ivr.name) private readonly ivrModel: Model<Ivr>,

    ) {
        // Initialize AGIServer
        this.agi = new AGIServer({
            port: 4573,
            // host: '0.0.0.0'
        });
    }
    onModuleInit() {
        this.agi.on('ready', (port) => {
            console.log(`AGIServer is listening on port ${port}`);
        });

        this.agi.on('call', async (call) => {
            const {
                remoteServer,
                uniqueid,
                context,
                extension,
                priority,
                calleridname,
                callerid,
                channel,
            } = call;

            console.log(`Incoming call from ${calleridname} (${callerid}) on channel ${channel}`);

            call.on('hangup', () => {
                console.log(`Hangup: ${remoteServer}/${channel}`);
            });

            call.on('error', (err) => {
                console.error(`ERROR: ${remoteServer}/${channel}: ${err}`);
            });

            try {
                await call.Answer();
                await call.SayAlpha('cg');

                const rootNode = await this.ivrModel.findOne({ level: 1 })
                this.input = await this.typeBasedSwitch(rootNode.type, rootNode.options, call)
                this.currentNode = rootNode

                while (this.currentNode.children?.length > 0) {
                    if (this.input !== null) {
                        const children = this.currentNode.children
                        await this.branchHandler(children, call, this.input)
                    }
                }

            } catch (err) {
                console.error(`Call handling error: ${err}`);
            }
            await call.Hangup()
        });
    }


    private async typeBasedSwitch(type: string, options: Option, call) {
        switch (type) {
            case 'ivr':
                return await this.ivrConfig(call, options)
            case 'queue':
                await this.queueConfig(call, options)
                return null

            case 'extension':
                try {
                    await call.Dial(`PJSIP/${options.extensionNumber}`)
                } catch (error) {

                }
                return null

            default:
                return null
        }
    }
    private async queueConfig(call, options: Option) {
        try {
            await call.Dial(`PJSIP/${options.queueName}`)
        } catch (error) {
            console.error(error)
        }
    }

    private async ivrConfig(call, options: Option): Promise<string> {
        try {
            this.input = await this.getDtmf(call, options.audio, options?.waitTime)
            return this.input
        } catch (error) {
            console.error(error)
        }

    }
    private async getDtmf(call, sound: string, timeout = 10): Promise<string> {
        await call.Read(`DIGIT,${sound},[1,[,[,[${timeout}],]`)
        const result = await call.send("GET VARIABLE DIGIT")
        return result
    }
    private async branchHandler(child, call, input) {
        const dtmfChild = child.find((c) => c.key === input)
        if (!dtmfChild) {
            call.Hangup()
            console.error('Invalid input')
        }
        const result = await this.ivrModel.findOne({ _id: dtmfChild.destination })
        if (result) {
            this.currentNode = result
            await this.typeBasedSwitch(result.type, result.options, call)
        }
        else {
            await call.Hangup()
            console.error("No Node found")
        }
    }


    onModuleDestroy() { }
}