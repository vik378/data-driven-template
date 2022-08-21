__version__ = '0.1.0'


import yaml
from typing import Dict, List, Any

from ddtf.fragments import load_fragment, Fragment
from ddtf.sources import load_data_source, DataSource


class D2Template:
    sources: Dict[str, DataSource]
    data: Dict[str, Any]
    contents: List[Fragment]
    raw: Dict[str, Any]

    def __init__(self, filename):
        self.sources = dict()
        self.data = dict()
        self.contents = list()
        with open(filename, "r") as stream:
            self.raw =  yaml.safe_load(stream)
            for item in self.raw["contents"]:
                fragment = load_fragment(item)
                self.contents.append(fragment)
            for name, params in self.raw["data-sources"].items():
                self.sources[name] = load_data_source(params)
    
    def compile(self):
        out = ""
        for fragment in self.contents:
            out += fragment.compile()
        return out

    def load_data(self):
        self.data =  dict()
        for name, src in self.sources.items():
            self.data[name] = src.load()

    def render(self, reload=True) -> str:
        if reload or len(self.data) == 0:
            self.load_data()
        out = ""
        context = ""
        for fragment in self.contents:
            out += fragment.render(self.data, context)
        return out