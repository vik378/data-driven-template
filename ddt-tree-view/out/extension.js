"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
/*
export class NodeDependenciesProvider implements vscode.TreeDataProvider<Fragment> {
    constructor(private workspaceRoot: string) {}
  
    private _onDidChangeTreeData: vscode.EventEmitter<Fragment | undefined | null | void> = new vscode.EventEmitter<Fragment | undefined | null | void>();
    readonly onDidChangeTreeData: vscode.Event<Fragment | undefined | null | void> = this._onDidChangeTreeData.event;
  
    refresh(): void {
      this._onDidChangeTreeData.fire();
    }

    getTreeItem(element: Fragment): vscode.TreeItem {
      return element;
    }
  
    getFragment(element: Fragment): Fragment[]{
        return [element, element];
    }

    getChildren(element?: Fragment): Thenable<Fragment[]> {
        return Promise.resolve(this.getFragment(element));
    }
  
    /**
     * Given the path to package.json, read all its dependencies and devDependencies.
     */ /*
private getDepsInPackageJson(packageJsonPath: string): Dependency[] {
 if (this.pathExists(packageJsonPath)) {
   const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));

   const toDep = (moduleName: string, version: string): Dependency => {
     if (this.pathExists(path.join(this.workspaceRoot, 'node_modules', moduleName))) {
       return new Dependency(
         moduleName,
         version,
         vscode.TreeItemCollapsibleState.Collapsed
       );
     } else {
       return new Dependency(moduleName, version, vscode.TreeItemCollapsibleState.None);
     }
   };

   const deps = packageJson.dependencies
     ? Object.keys(packageJson.dependencies).map(dep =>
         toDep(dep, packageJson.dependencies[dep])
       )
     : [];
   const devDeps = packageJson.devDependencies
     ? Object.keys(packageJson.devDependencies).map(dep =>
         toDep(dep, packageJson.devDependencies[dep])
       )
     : [];
   return deps.concat(devDeps);
 } else {
   return [];
 }
}

private pathExists(p: string): boolean {
 try {
   fs.accessSync(p);
 } catch (err) {
   return false;
 }
 return true;
}
}

class Dependency extends vscode.TreeItem {
constructor(
 public readonly label: string,
 private version: string,
 public readonly collapsibleState: vscode.TreeItemCollapsibleState
) {
 super(label, collapsibleState);
 this.tooltip = `${this.label}-${this.version}`;
 this.description = this.version;
}

iconPath = {
 light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
 dark: path.join(__filename, '..', '..', 'resources', 'dark', 'dependency.svg')
};
}

class DataSource{

}

class Fragment extends vscode.TreeItem {
label: string = "undefined";
contents?: Fragment[] = [];
constructor(label: string, collapsibleState: vscode.TreeItemCollapsibleState){
   super(label, collapsibleState);
}
}

class Template {
dataSources: DataSource[] = [];
contents: Fragment[] = [];
}

interface Dict<T> {
[k: string]: T
}

function loadFragment<Fragment>(raw: Dict<any>){
let frag = new Fragment(raw["type"]);
if ("contents" in raw){
   let contents: Array<any> = raw["contents"];
   contents.forEach(element => {
       let subFragment = loadFragment(element);
       frag.contents?.push(subFragment);
   });
}
return frag;
}

function loadTemplate(filename: string){
const templateRaw = fs.readFileSync(filename, 'utf-8');
const template = YAML.parse(templateRaw,{
   prettyErrors:true
 });
let contentsRaw: Array<any> = template["contents"];
let contents = contentsRaw.map((item) => loadFragment(item));
console.log(contents);
return "{}";
}*/
/*export function activate(context: vscode.ExtensionContext) {
  let templateFilename = vscode.window.activeTextEditor?.document.fileName
  console.log(templateFilename);

  if ((templateFilename !== undefined) && (templateFilename.endsWith(".d2.yml"))){
    // we shall load some yml here and pass it on
    console.log("can work");
    const data = loadTemplate(templateFilename);
    const nodeDependenciesProvider = new NodeDependenciesProvider(data);
    vscode.window.registerTreeDataProvider('ddtTemplateViewer', nodeDependenciesProvider);
  } else {
    console.log("cant work");
  }
  //const rootPath =
  //  vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders.length > 0
  //	? vscode.workspace.workspaceFolders[0].uri.fsPath
  //	: undefined!;
}*/
const ddtview_1 = require("./ddtview");
function activate(context) {
    const d2TemplateViewer = new ddtview_1.DDTTreeViewProvider(context);
    vscode.window.registerTreeDataProvider('d2TemplateViewer', d2TemplateViewer);
    vscode.commands.registerCommand('d2TemplateViewer.refresh', () => d2TemplateViewer.refresh());
    console.log("hello from activation");
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map