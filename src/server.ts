import { Server, ServerCredentials } from 'grpc';

import { Greeter, GreeterService } from './services/Greeter';
import { Health, HealthService, healthStatus, ServingStatus } from './services/Health';
import { logger } from './utils';

// https://github.com/grpc/grpc/issues/6976
// https://pm2.io/doc/en/runtime/guide/load-balancing/#cluster-environment-variable
let port: number = 50051;
if (process.env.NODE_APP_INSTANCE) {
  port = port + Number(process.env.NODE_APP_INSTANCE);
}

// Do not use @grpc/proto-loader
const server: Server = new Server();
server.addService(GreeterService, new Greeter());
server.addService(HealthService, new Health());
server.bind(`0.0.0.0:${port}`, ServerCredentials.createInsecure());
server.start();

logger.info(`gRPC:Server`, new Date().toDateString());

// Change service health status
healthStatus.set('helloworld.Greeter', ServingStatus.NOT_SERVING);
