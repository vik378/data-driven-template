import * as vscode from 'vscode';
import { threadId } from 'worker_threads';
import { YAMLError, YAMLParseError } from 'yaml';
import * as ddt from './ddt';
import * as YAML from 'yaml';


export class DDTTreeViewProvider implements vscode.TreeDataProvider<ddt.Fragment>{
    private tree: ddt.Fragment[] = [];
    private text: string = "";
    private rawTree: any = {};
    private editor: vscode.TextEditor | undefined = undefined;
    private errorPaths: (string | number)[][] = [];
    

    private _onDidChangeTreeData: vscode.EventEmitter<ddt.Fragment | undefined | null | void> = new vscode.EventEmitter<ddt.Fragment | undefined | null | void>();
	readonly onDidChangeTreeData: vscode.Event<ddt.Fragment | undefined | null | void> = this._onDidChangeTreeData.event;
  

    refresh(parent?: ddt.Fragment): void {
        this.parseTree();
        if (parent) {
          this._onDidChangeTreeData.fire(parent);
        } else {
          this._onDidChangeTreeData.fire();
        }
    }

    private updateErrorPath() {
        this.errorPaths = [];
    
        let diagnostics = vscode.languages.getDiagnostics();
        for (let i = 0; i < diagnostics.length; i++) {
          if ((vscode.window.activeTextEditor)&&(
            diagnostics[i][0]["fsPath"] ===
            vscode.window.activeTextEditor.document.fileName
          )) {
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

    private highlightYAMLError(error: YAML.YAMLParseError): void{
      let editor = vscode.window.activeTextEditor;
      if (this.editor && this.editor.document) {
        const range = new vscode.Range(
          this.editor.document.positionAt(error.pos[0]),
          this.editor.document.positionAt(error.pos[1])
        );
        this.editor.selection = new vscode.Selection(range.start, range.end);

        // Center the method in the document
        this.editor.revealRange(range);
      }
    }

    private parseTree(): void {
      this.text = "";
      this.rawTree = {};
      this.tree = [];
      this.editor = vscode.window.activeTextEditor;
      if (this.editor && this.editor.document) {
        let document = this.editor.document;
        if (document.fileName.endsWith("d2.yml")){
          this.text = this.editor.document.getText();
          try {
            this.rawTree = YAML.parse(this.text,{
            prettyErrors:true
            });
          } catch (error) {
            if (error instanceof YAML.YAMLParseError){
              this.highlightYAMLError(error);
              console.log(error.pos);
            } else {
              console.log(error);
            }
          }
          let tree = ddt.loadTemplate(this.rawTree);
          this.tree = tree;
        }
      }
    }

    private onDocumentSaved(): void {
        this.refresh();
    }

    getChildren(element: ddt.Fragment): ddt.Fragment[] {
        if ((element !== undefined) && (element.contents !== undefined)){
            return element.contents;
        }
        return this.tree;
    }

    getTreeItem(element: ddt.Fragment): ddt.Fragment {
        return element;
    }

    private onActiveEditorChanged(): void {
        console.log("editor change handling started");
        if (vscode.window.activeTextEditor) {
            console.log("enabled");
            let document = vscode.window.activeTextEditor.document;
            if (document.fileName.endsWith("d2.yml")){
                this.refresh();
            }else{
                console.log("disabled - not our filetype");
                this.tree = [];
                this.refresh();
            }
        } else {
          console.log("disabled");
          this.tree = [];
          this.refresh();
        }
      }

    constructor(private context: vscode.ExtensionContext) {
        vscode.window.onDidChangeActiveTextEditor(() =>
          this.onActiveEditorChanged()
        );
        vscode.workspace.onDidSaveTextDocument(() => this.onDocumentSaved());
        //vscode.workspace.onDidChangeTextDocument(e => this.onDocumentChanged(e));
        this.onActiveEditorChanged();
    }
}
