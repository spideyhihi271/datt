"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = __importDefault(require("../middleware/auth"));
const auth_2 = __importDefault(require("./auth"));
const file_1 = __importDefault(require("./file"));
const employee_1 = __importDefault(require("./employee"));
const equip_1 = __importDefault(require("./equip"));
const monitoring_1 = __importDefault(require("./monitoring"));
const training_1 = __importDefault(require("./training"));
const user_1 = __importDefault(require("./user"));
const routes = (app) => {
    app.use("/api/auth", auth_2.default);
    app.use("/api/v1/file", [auth_1.default.authenticated], file_1.default);
    app.use("/api/v1/employee", [auth_1.default.authenticated], employee_1.default);
    app.use("/api/v1/equip", [auth_1.default.authenticated], equip_1.default);
    app.use("/api/v1/monitory", [auth_1.default.authenticated], monitoring_1.default);
    app.use("/api/v1/training", [auth_1.default.authenticated], training_1.default);
    app.use("/api/v1/user", [auth_1.default.authenticated], user_1.default);
};
exports.default = routes;
//# sourceMappingURL=index.js.map