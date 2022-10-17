import * as vscode from 'vscode';
import * as path from 'path';


const FRAG_CONTAINER_TYPES = ["heading"];
const BASE_PATH = path.join(__filename, '..', '..', 'resources');


export class Fragment extends vscode.TreeItem{
    label: string = "undefined";
    contents?: Fragment[];
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.None;
    constructor(
        rawDict: any, 
    ){
        let label: string = rawDict["type"];
		super(label);
        this.label = label;
	}
}

export class FragmentContainer extends Fragment {
    contents: (Fragment | FragmentContainer)[] = [];
}

class Heading extends FragmentContainer{
    collapsibleState: vscode.TreeItemCollapsibleState = vscode.TreeItemCollapsibleState.Expanded;
    iconPath = {
        "light": path.join(BASE_PATH, 'light', 'heading.svg'),
        "dark": path.join(BASE_PATH, 'dark', 'heading.svg'),
    };
    constructor(
        rawDict: any, 
    ){
        let label: string = rawDict["text"];
		super(label);
        this.label = label;
	}
}

class Paragraph extends Fragment {
    iconPath = {
        "light": path.join(BASE_PATH, 'light', 'paragraph.svg'),
        "dark": path.join(BASE_PATH, 'dark', 'paragraph.svg'),
    };
    constructor(
        rawDict: any, 
    ){
        let label: string = rawDict["text"].substring(0, 32) + "...";
		super(label);
        this.label = label;
	}
    
}

class UnorderedList extends Fragment {
    iconPath = {
        "light": path.join(BASE_PATH, 'light', 'list-ul.svg'),
        "dark": path.join(BASE_PATH, 'dark', 'list-ul.svg'),
    };
    constructor(
        rawDict: any, 
    ){
        let itemQuery = "list of " + rawDict["item_query"];
        let label: string = (itemQuery.length > 32)?itemQuery.substring(0, 32) + "..." : itemQuery;
		super(label);
        this.label = label;
	}
}

class BasicDataTable extends Fragment {
    iconPath = {
        "light": path.join(BASE_PATH, 'light', 'table.svg'),
        "dark": path.join(BASE_PATH, 'dark', 'table.svg'),
    };
    constructor(
        rawDict: any, 
    ){
        let itemQuery = "list of " + rawDict["row_query"];
        let label: string = (itemQuery.length > 32)?itemQuery.substring(0, 32) + "..." : itemQuery;
		super(label);
        this.label = label;
	}
}

class JinjaQuery extends Fragment {
    iconPath = {
        "light": path.join(BASE_PATH, 'light', 'subscript.svg'),
        "dark": path.join(BASE_PATH, 'dark', 'subscript.svg'),
    };
    constructor(
        rawDict: any, 
    ){
        let label: string = rawDict["defines"];
		super(label);
        this.label = label;
	}
}


const FRAGMENT_TYPES = new Map();
FRAGMENT_TYPES.set("heading", Heading);
FRAGMENT_TYPES.set("paragraph", Paragraph);
FRAGMENT_TYPES.set("basic-data-table", BasicDataTable);
FRAGMENT_TYPES.set("jinja-query", JinjaQuery);
FRAGMENT_TYPES.set("unordered-list", UnorderedList);


function loadFragment (raw: any): (Fragment){
	let rawFragType: string = raw["type"];
    let fragClass = FRAGMENT_TYPES.get(rawFragType)? FRAGMENT_TYPES.get(rawFragType): Fragment;
    let frag = new fragClass(raw);
    if (FRAG_CONTAINER_TYPES.includes(rawFragType)){
        if ("contents" in raw){
            let rawContents: Array<any> = raw["contents"];
            let subFrags = rawContents.map(loadFragment);
            frag.contents = subFrags;
        }
    }
    return frag;
}


export function loadTemplate(tree: any): (Fragment)[]{
    let template;
    
    let contentsRaw: Array<any> = tree["contents"];
    let contents = contentsRaw.map((item) => loadFragment(item));
    return contents;
}