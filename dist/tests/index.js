"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
const micro_service_decorator_1 = require("../service/micro.service.decorator");
const service_1 = require("../service/service");
const command_decorator_1 = require("../command/command.decorator");
const rabbitmq_service_connector_1 = require("../service/rabbitmq.service.connector");
let TestService = class TestService extends service_1.Service {
    constructor() {
        super();
    }
    myServiceCommand(test) {
        return test;
    }
};
__decorate([
    command_decorator_1.Command,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TestService.prototype, "myServiceCommand", null);
TestService = __decorate([
    micro_service_decorator_1.MicroService({
        connector: new rabbitmq_service_connector_1.RabbitMqServiceConnector({
            protocol: 'amqp',
            hostname: 'localhost',
            port: 5672,
            username: 'guest',
            password: 'guest'
            //vhost : '/'
        })
    }),
    __metadata("design:paramtypes", [])
], TestService);
let test = new TestService();
test.start();
//# sourceMappingURL=index.js.map