"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Gender = exports.StatusFile = exports.Role = exports.TrapType = exports.TypeFile = void 0;
var TypeFile;
(function (TypeFile) {
    TypeFile["HR"] = "hr";
    TypeFile["Training"] = "training";
    TypeFile["Equipment"] = "equipment";
    TypeFile["Monitory"] = "monitory";
})(TypeFile || (exports.TypeFile = TypeFile = {}));
var TrapType;
(function (TrapType) {
    TrapType["mouseTrap"] = "mouseTrap";
    TrapType["insectTrap"] = "insectTrap";
})(TrapType || (exports.TrapType = TrapType = {}));
var Role;
(function (Role) {
    Role["Manager"] = "manager";
    Role["Censor"] = "censor";
    Role["Staff"] = "staff";
})(Role || (exports.Role = Role = {}));
var StatusFile;
(function (StatusFile) {
    StatusFile["pending"] = "pending";
    StatusFile["reject"] = "reject";
    StatusFile["passCensor"] = "passCensor";
    StatusFile["passManager"] = "passManager";
})(StatusFile || (exports.StatusFile = StatusFile = {}));
var Gender;
(function (Gender) {
    Gender["Male"] = "male";
    Gender["Female"] = "female";
})(Gender || (exports.Gender = Gender = {}));
//# sourceMappingURL=Enum.js.map