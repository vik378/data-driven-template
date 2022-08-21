import ddtf.fragments as ddtf
from typing import Dict, Any
import jinja2


JINJA_ENV = jinja2.Environment()

ERROR_SPAN = "<span style='color:red'>There is a {} ({}) in the below fragment:</span>\n\n" \
             "```\n{}" \
             "```\n\n"

CONTEXT_MODIFIERS = ["jinja-query"]


def compile_basic_data_table(obj: ddtf.BasicDataTable, head_only=False) -> str:
    return " | ".join(obj.columns) + "\n"\
             + "|".join(["-"*len(col) for col in obj.columns]) + "\n" \
             + f"{{% for row in {obj.row_query} %}}" \
             + " | ".join(obj.cells) + "\n"\
             + "{% endfor %}" \
             + "\n\n"


def compile_jinja_query(obj: ddtf.JinjaQuery, head_only=False) -> str:
    return f"{obj.expression}\n"


def compile_paragraph(obj:ddtf.Paragraph, head_only=False) -> str:
    return f"{obj.text}\n" 


def compile_heading(obj: ddtf.Heading, head_only=False) -> str:
    head = f"{'#'*obj.level} {obj.text}\n\n"
    if head_only:
        return head
    return  head + "\n".join([fragment.compile() for fragment in obj.contents])
    

def compile_unordered_list(obj: ddtf.UnorderedList, head_only=False):
    return f"{{% for item in {obj.item_query} %}}\n" \
         + f"- {obj.item_text}\n" \
         + "{% endfor %}\n\n"


def render_leaf(obj:ddtf.Fragment, data: Dict[str, Any], context) -> str:
    template = context + obj.compile(head_only=True)
    try:
        return JINJA_ENV.from_string(template).render(**data)
    except Exception as e:
        return ERROR_SPAN.format(e.__class__.__name__, e, template)


def render_composite(obj: ddtf.Fragment, data: Dict[str, Any], context:Any="") -> str:
    head = render_leaf(obj, data, context)
    _context = "" + context
    elements = []
    for elt in obj.contents:
        if elt.type in CONTEXT_MODIFIERS:
            #elt.render(data, context=_context)  # should validate though
            _context += elt.compile()
        else:
            elements.append(elt.render(data, context=_context))
    return "\n".join([head] + elements) + "\n\n"


def configure_markdown_target():
    ddtf.BasicDataTable.compile = compile_basic_data_table
    ddtf.JinjaQuery.compile = compile_jinja_query
    ddtf.Paragraph.compile = compile_paragraph
    ddtf.Heading.compile = compile_heading
    ddtf.UnorderedList.compile = compile_unordered_list

    for cls in [ddtf.BasicDataTable, ddtf.Paragraph, ddtf.UnorderedList, ddtf.JinjaQuery]:
        cls.render = render_leaf

    for cls in [ddtf.Heading]:
        cls.render = render_composite
