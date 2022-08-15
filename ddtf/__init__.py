__version__ = '0.1.0'


import yaml
import collections
from typing import Dict, List, Any
from dataclasses import dataclass, field


FRAGMENT_HANDLERS: Dict[str, Any] = collections.defaultdict(dict)


class DataSource:
    ...


class Fragment:    

    def compile(self, context=[]) -> str:
        return f"This method shall be redefined by the specializing class {self.__class__.__name__}\n"


def fragment_handler(cls):
    FRAGMENT_HANDLERS[cls.type] = cls
    return dataclass(cls)


@fragment_handler
class BasicDataTable(Fragment):
    columns: List[str]
    row_query: str
    requires: List[str]
    cells: List[str]
    type: str = "basic-data-table"




@fragment_handler
class Paragraph(Fragment):
    text: str
    type: str = "paragraph"
    requires: List[str | None] = field(default_factory=list)

    def compile(self, context=[]) -> str:
        return f"{self.text}\n"


@fragment_handler
class Heading(Fragment):
    level: int
    text: str
    contents: List[Fragment]
    type: str = "heading"
    requires: List[str | None] = field(default_factory=list)

    def compile(self, context=[]) -> str:
        return f"{'#'*self.level} {self.text}\n\n" \
               + "\n".join([fragment.compile() for fragment in self.contents])


def load_fragment(data: Dict[str, Any]):
    if data["type"] in FRAGMENT_HANDLERS:
        class_ = FRAGMENT_HANDLERS[data["type"]]
        fragment = class_(**data)
        if "contents" in data:
            fragment.contents = [load_fragment(item) for item in data["contents"]]
        return fragment
    return Paragraph(f"Unsupported type {data['type']}")


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
