from typing import Dict, Any, List
import collections
from dataclasses import dataclass, field

FRAGMENT_HANDLERS: Dict[str, Any] = collections.defaultdict(dict)


class Fragment:
    def compile(self, head_only=False) -> str:
        return f"(!) Fragment handling class __{self.__class__.__name__}__ needs to redefine `compile` method\n\n"

    def render(self, data=Dict[str, Any], context=Any) -> str:
        return f"(!) Fragment handling class __{self.__class__.__name__}__ needs to redefine `render` method\n\n"


def fragment_handler(cls):
    FRAGMENT_HANDLERS[cls.type] = cls
    return dataclass(cls)


def load_fragment(data: Dict[str, Any]):
    if data["type"] in FRAGMENT_HANDLERS:
        class_ = FRAGMENT_HANDLERS[data["type"]]
        fragment = class_(**data)
        if "contents" in data:
            fragment.contents = [load_fragment(item) for item in data["contents"]]
        return fragment
    return Paragraph(text=f"Unsupported fragment type {data['type']}")


@fragment_handler
class BasicDataTable(Fragment):
    columns: List[str]
    row_query: str
    requires: List[str]
    cells: List[str]
    type: str = "basic-data-table"


@fragment_handler
class JinjaQuery(Fragment):
    defines: str
    expression: str
    requires: List[str | None] = field(default_factory=list)
    type: str = "jinja-query"


@fragment_handler
class UnorderedList(Fragment):
    item_query: str
    item_text: str
    requires: List[str | None] = field(default_factory=list)
    type: str = "unordered-list"


@fragment_handler
class Paragraph(Fragment):
    text: str
    type: str = "paragraph"
    requires: List[str | None] = field(default_factory=list)


@fragment_handler
class Heading(Fragment):
    level: int
    text: str
    contents: List[Fragment]
    type: str = "heading"
    requires: List[str | None] = field(default_factory=list)
