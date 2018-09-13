"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var Lint = require("tslint");
var ts = require("typescript");
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Rule.prototype.apply = function (sourceFile) {
        return this.applyWithWalker(new UpdateOutdatedImportsWalker(sourceFile, this.getOptions()));
    };
    Rule.metadata = {
        ruleName: 'renderer-migration',
        type: 'functionality',
        description: 'Migrate @angular/core Renderer to Renderer2',
        rationale: '',
        options: null,
        optionsDescription: 'Not configurable.',
        typescriptOnly: true
    };
    Rule.RuleFailure = 'Outdated import Renderer found.';
    return Rule;
}(Lint.Rules.AbstractRule));
exports.Rule = Rule;
var UpdateOutdatedImportsWalker = (function (_super) {
    __extends(UpdateOutdatedImportsWalker, _super);
    function UpdateOutdatedImportsWalker() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    UpdateOutdatedImportsWalker.prototype.visitImportDeclaration = function (node) {
        var _this = this;
        if (ts.isStringLiteral(node.moduleSpecifier) && node.importClause) {
            if (ts.isNamedImports(node.importClause.namedBindings)) {
                node.importClause.namedBindings.elements.forEach(function (ele) {
                    if (ts.isImportSpecifier(ele) && ele.name.getText() === 'Renderer') {
                        var specifier = ele.name;
                        var replacementStart = specifier.getStart() + 1;
                        var replacementEnd = specifier.text.length;
                        _this.addFailureAt(replacementStart, replacementEnd, Rule.RuleFailure, _this.createReplacement(replacementStart, replacementEnd, 'Renderer2'));
                    }
                });
            }
        }
    };
    UpdateOutdatedImportsWalker.prototype.visitPropertyAccessExpression = function (node) {
        if (node.parent
            && ts.isCallExpression(node.parent)
            && ts.isIdentifier(node.expression)
            && ts.isIdentifier(node.name)) {
            if (node.name.getText() === 'setElementClass') {
                var isAdd = node.parent.arguments[2].getText() === 'true';
                var argFix = this.deleteText(node.parent.arguments[2].getStart() - 1, node.parent.arguments[2].getText().length);
                if (isAdd) {
                    var methodFix = this.createReplacement(node.name.getStart() + 1, node.name.text.length, 'addClass');
                    this.addFailureAt(node.getStart(), node.getWidth(), 'Replace Renderer.setElementClass with Renderer2.addClass', [argFix, methodFix]);
                }
                else {
                    var methodFix = this.createReplacement(node.name.getStart() + 1, node.name.text.length, 'removeClass');
                    this.addFailureAt(node.getStart(), node.getWidth(), 'Replace Renderer.setElementClass with Renderer2.removeClass', [argFix, methodFix]);
                }
            }
            else if (node.name.getText() === 'setElementStyle') {
                var methodFix = this.createReplacement(node.name.getStart() + 1, node.name.text.length, 'setStyle');
                this.addFailureAt(node.getStart(), node.getWidth(), 'Replace Renderer.setElementStyle with Renderer2.setStyle', methodFix);
            }
            else if (node.name.getText() === 'setElementAttribute') {
                var methodFix = this.createReplacement(node.name.getStart() + 1, node.name.text.length, 'setAttribute');
                this.addFailureAt(node.getStart(), node.getWidth(), 'Replace Renderer.setElementAttribute with Renderer2.setAttribute', methodFix);
            }
        }
    };
    return UpdateOutdatedImportsWalker;
}(Lint.RuleWalker));
