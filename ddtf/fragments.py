from typing import Dict, Any, List
import collections
from dataclasses import dataclass, field

FRAGMENT_HANDLERS: Dict[str, Any] = collections.defaultdict(dict)


class Fragment:
    def compile(self, context=[]) -> str:
        return f"(!) Fragment handling class __{self.__class__.__name__}__ needs to redefine `compile` method\n"


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
