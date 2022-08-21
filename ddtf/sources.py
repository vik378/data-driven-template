import yaml
from typing import Dict, Any, List
import collections
from collections import namedtuple
from dataclasses import dataclass, field

DATA_SOURCE_HANDLERS: Dict[str, Any] = collections.defaultdict(dict)


def data_source_handler(cls):
    DATA_SOURCE_HANDLERS[cls.type] = cls
    return dataclass(cls)


class DataSource:
    ...

    def load(self):
        ...


def load_data_source(data: Dict[str, Any]):
    if data["type"] in DATA_SOURCE_HANDLERS:
        class_ = DATA_SOURCE_HANDLERS[data["type"]]
        data_source = class_(**data)
        return data_source
    raise Exception(f"Unsupported data source type {data['type']}")


@data_source_handler
class LocalYamlFile(DataSource):
    path: str
    type: str = "local-yml-file"

    def load(self):
        with open(self.path) as f:
            data = yaml.safe_load(f)
            out = namedtuple('Struct', data.keys())(*data.values())
        return out

