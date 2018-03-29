"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RelationTypes;
(function (RelationTypes) {
    RelationTypes["one2one"] = "one2one";
    RelationTypes["one2n"] = "one2n";
    RelationTypes["m2n"] = "m2n";
})(RelationTypes = exports.RelationTypes || (exports.RelationTypes = {}));
var RelationKeyTypes;
(function (RelationKeyTypes) {
    RelationKeyTypes["list"] = "List";
    RelationKeyTypes["auto"] = "Auto";
})(RelationKeyTypes = exports.RelationKeyTypes || (exports.RelationKeyTypes = {}));
var LinkTypes;
(function (LinkTypes) {
    LinkTypes["deep"] = "deep";
    LinkTypes["reference"] = "reference";
    LinkTypes["auto"] = "auto"; //checks automaticly how to handle the relation
})(LinkTypes = exports.LinkTypes || (exports.LinkTypes = {}));
//# sourceMappingURL=relation.types.js.map