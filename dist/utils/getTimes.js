"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentTime = void 0;
const getCurrentTime = () => {
    const now = new Date();
    const date = now.getDate();
    const times = now.getTime();
    const result = (date + times).toString();
    return result;
};
exports.getCurrentTime = getCurrentTime;
//# sourceMappingURL=getTimes.js.map