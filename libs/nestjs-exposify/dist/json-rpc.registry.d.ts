import { INestApplication } from '@nestjs/common';
import { JsonRpcHandler } from './json-rpc.handler';
export declare function registerJsonRpcMethods(app: INestApplication, handler: JsonRpcHandler): void;
