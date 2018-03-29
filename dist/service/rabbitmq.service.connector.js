"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const service_response_1 = require("./service.response");
const amqplib = require("amqplib");
class RabbitMqServiceConnector {
    constructor(options) {
        this.handler = [];
        this.options = options;
    }
    connect() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("CONNECT");
                this.connection = yield amqplib.connect(this.options);
                //result.then(() => { console.log('success') }, () => { console.log('error') })
                console.log("CONNECTTION RESULT", this.connection);
                return true;
            }
            catch (e) {
                throw e;
            }
        });
    }
    disconnect() {
        return __awaiter(this, void 0, void 0, function* () {
            return true;
        });
    }
    publish(request) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            try {
                let queue = 'tasks';
                let channel = yield this.connection.createChannel();
                let queueReady = yield channel.assertQueue(queue);
                let result = yield channel.sendToQueue(queue, new Buffer('something to do'));
                console.log("result", result);
                /*
                let
                    return ch.assertQueue(q).then(function(ok) {
                    return ch.sendToQueue(q, new Buffer('something to do'));
                    });
                }).catch(console.warn);*/
                return new service_response_1.ServiceResponse(true);
            }
            catch (e) {
                throw e;
            }
        });
    }
    checkConnection() {
        if (!this.connection) {
            throw new Error('Service is not connected!');
        }
    }
    subscribe(callback) {
        return __awaiter(this, void 0, void 0, function* () {
            this.checkConnection();
            let channel = yield this.connection.createChannel();
            //this.handler.push()
        });
    }
}
exports.RabbitMqServiceConnector = RabbitMqServiceConnector;
//# sourceMappingURL=rabbitmq.service.connector.js.map