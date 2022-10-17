"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DDTTreeViewProvider = void 0;
const vscode = require("vscode");
const ddt = require("./ddt");
const YAML = require("yaml");
class DDTTreeViewProvider {
    constructor(context) {
        this.context = context;
        this.tree = [];
        this.text = "";
        this.rawTree = {};
        this.editor = undefined;
        this.errorPaths = [];
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        vscode.window.onDidChangeActiveTextEditor(() => this.onActiveEditorChanged());
        vscode.workspace.onDidSaveTextDocument(() => this.onDocumentSaved());
        //vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));
        this.onActiveEditorChanged();
    }
    refresh(parent) {
        this.parseTree();
        if (parent) {
            this._onDidChangeTreeData.fire(parent);
        }
        else {
            this._onDidChangeTreeData.fire();
        }
    }
    updateErrorPath() {
        this.errorPaths = [];
        let diagnostics = vscode.languages.getDiagnostics();
        for (let i = 0; i < diagnostics.length; i++) {
            if ((vscode.window.activeTextEditor) && (diagnostics[i][0]["fsPath"] ===
                vscode.window.activeTextEditor.document.fileName)) {
                let error = diagnostics[i][1];
                // this.errorPaths = error.map(
                //   (x: any) =>
                //     YAMLParseError. .getLocation(
                //       vscode.window.activeTextEditor.document.getText(),
                //       this.editor.document.offsetAt(x["range"]["end"])
                //     ).path
                // );
            }
        }
    }
    highlightYAMLError(error) {
        let editor = vscode.window.activeTextEditor;
        if (this.editor && this.editor.document) {
            const range = new vscode.Range(this.editor.document.positionAt(error.pos[0]), this.editor.document.positionAt(error.pos[1]));
            this.editor.selection = new vscode.Selection(range.start, range.end);
            // Center the method in the document
            this.editor.revealRange(range);
        }
    }
    parseTree() {
        this.text = "";
        this.rawTree = {};
        this.tree = [];
        this.editor = vscode.window.activeTextEditor;
        if (this.editor && this.editor.document) {
            let document = this.editor.document;
            if (document.fileName.endsWith("d2.yml")) {
                this.text = this.editor.document.getText();
                try {
                    this.rawTree = YAML.parse(this.text, {
                        prettyErrors: true
                    });
                }
                catch (error) {
                    if (error instanceof YAML.YAMLParseError) {
                        this.highlightYAMLError(error);
                        console.log(error.pos);
                    }
                    else {
                        console.log(error);
                    }
                }
                let tree = ddt.loadTemplate(this.rawTree);
                this.tree = tree;
            }
        }
    }
    onDocumentSaved() {
        this.refresh();
    }
    getChildren(element) {
        if ((element !== undefined) && (element.contents !== undefined)) {
            return element.contents;
        }
        return this.tree;
    }
    getTreeItem(element) {
        return element;
    }
    onActiveEditorChanged() {
        console.log("editor change handling started");
        if (vscode.window.activeTextEditor) {
            console.log("enabled");
            let document = vscode.window.activeTextEditor.document;
            if (document.fileName.endsWith("d2.yml")) {
                this.refresh();
            }
            else {
                console.log("disabled - not our filetype");
                this.tree = [];
                this.refresh();
            }
        }
        else {
            console.log("disabled");
            this.tree = [];
            this.refresh();
        }
    }
}
exports.DDTTreeViewProvider = DDTTreeViewProvider;
//# sourceMappingURL=ddtview.js.map