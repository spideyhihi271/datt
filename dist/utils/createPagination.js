"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createPagination(data, total, defaultLimit, params) {
    const result = {
        data,
        pagination: {
            page: params.page ? parseInt(params.page) : 1,
            total,
            limit: params.limit ? params.limit : defaultLimit,
        },
    };
    return result;
}
exports.default = createPagination;
//# sourceMappingURL=createPagination.js.map