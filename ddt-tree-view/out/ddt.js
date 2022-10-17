"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadTemplate = exports.FragmentContainer = exports.Fragment = void 0;
const vscode = require("vscode");
const path = require("path");
const FRAG_CONTAINER_TYPES = ["heading"];
const BASE_PATH = path.join(__filename, '..', '..', 'resources');
class Fragment extends vscode.TreeItem {
    constructor(rawDict) {
        let label = rawDict["type"];
        super(label);
        this.label = "undefined";
        this.collapsibleState = vscode.TreeItemCollapsibleState.None;
        this.label = label;
    }
}
exports.Fragment = Fragment;
class FragmentContainer extends Fragment {
    constructor() {
        super(...arguments);
        this.contents = [];
    }
}
exports.FragmentContainer = FragmentContainer;
class Heading extends FragmentContainer {
    constructor(rawDict) {
        let label = rawDict["text"];
        super(label);
        this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
        this.iconPath = {
            "light": path.join(BASE_PATH, 'light', 'heading.svg'),
            "dark": path.join(BASE_PATH, 'dark', 'heading.svg'),
        };
        this.label = label;
    }
}
class Paragraph extends Fragment {
    constructor(rawDict) {
        let label = rawDict["text"].substring(0, 32) + "...";
        super(label);
        this.iconPath = {
            "light": path.join(BASE_PATH, 'light', 'paragraph.svg'),
            "dark": path.join(BASE_PATH, 'dark', 'paragraph.svg'),
        };
        this.label = label;
    }
}
class UnorderedList extends Fragment {
    constructor(rawDict) {
        let itemQuery = "list of " + rawDict["item_query"];
        let label = (itemQuery.length > 32) ? itemQuery.substring(0, 32) + "..." : itemQuery;
        super(label);
        this.iconPath = {
            "light": path.join(BASE_PATH, 'light', 'list-ul.svg'),
            "dark": path.join(BASE_PATH, 'dark', 'list-ul.svg'),
        };
        this.label = label;
    }
}
class BasicDataTable extends Fragment {
    constructor(rawDict) {
        let itemQuery = "list of " + rawDict["row_query"];
        let label = (itemQuery.length > 32) ? itemQuery.substring(0, 32) + "..." : itemQuery;
        super(label);
        this.iconPath = {
            "light": path.join(BASE_PATH, 'light', 'table.svg'),
            "dark": path.join(BASE_PATH, 'dark', 'table.svg'),
        };
        this.label = label;
    }
}
class JinjaQuery extends Fragment {
    constructor(rawDict) {
        let label = rawDict["defines"];
        super(label);
        this.iconPath = {
            "light": path.join(BASE_PATH, 'light', 'subscript.svg'),
            "dark": path.join(BASE_PATH, 'dark', 'subscript.svg'),
        };
        this.label = label;
    }
}
const FRAGMENT_TYPES = new Map();
FRAGMENT_TYPES.set("heading", Heading);
FRAGMENT_TYPES.set("paragraph", Paragraph);
FRAGMENT_TYPES.set("basic-data-table", BasicDataTable);
FRAGMENT_TYPES.set("jinja-query", JinjaQuery);
FRAGMENT_TYPES.set("unordered-list", UnorderedList);
function loadFragment(raw) {
    let rawFragType = raw["type"];
    let fragClass = FRAGMENT_TYPES.get(rawFragType) ? FRAGMENT_TYPES.get(rawFragType) : Fragment;
    let frag = new fragClass(raw);
    if (FRAG_CONTAINER_TYPES.includes(rawFragType)) {
        if ("contents" in raw) {
            let rawContents = raw["contents"];
            let subFrags = rawContents.map(loadFragment);
            frag.contents = subFrags;
        }
    }
    return frag;
}
function loadTemplate(tree) {
    let template;
    let contentsRaw = tree["contents"];
    let contents = contentsRaw.map((item) => loadFragment(item));
    return contents;
}
exports.loadTemplate = loadTemplate;
//# sourceMappingURL=ddt.js.map