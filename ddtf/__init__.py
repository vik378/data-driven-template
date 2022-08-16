__version__ = '0.1.0'


import yaml
from typing import Dict, List, Any

from ddtf.fragments import FRAGMENT_HANDLERS, Fragment, Paragraph

class DataSource:
    ...


def load_fragment(data: Dict[str, Any]):
    if data["type"] in FRAGMENT_HANDLERS:
        class_ = FRAGMENT_HANDLERS[data["type"]]
        fragment = class_(**data)
        if "contents" in data:
            fragment.contents = [load_fragment(item) for item in data["contents"]]
        return fragment
    return Paragraph(text=f"Unsupported fragment type {data['type']}")


class D2Template:
    sources: Dict[str, DataSource]
    contents: List[Fragment]
    raw: Dict[Any, Any]

    def __init__(self, filename):
        with open(filename, "r") as stream:
            self.raw =  yaml.safe_load(stream)
            self.contents = []
            for item in self.raw["contents"]:
                fragment = load_fragment(item)
                self.contents.append(fragment)
    
    def compile(self):
        out = ""
        for fragment in self.contents:
            out += fragment.compile()
        return out