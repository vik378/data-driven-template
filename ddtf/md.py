import ddtf.fragments as ddtf


def compile_basic_data_table(obj: ddtf.BasicDataTable) -> str:
    return " | ".join(obj.columns) + "\n"\
             + "|".join(["-"*len(col) for col in obj.columns]) + "\n" \
             + f"{{% for row in {obj.row_query} %}}\n" \
             + " | ".join(obj.cells) + "\n"\
             + "{% endfor %}" \
             + "\n\n"


def compile_jinja_query(obj: ddtf.JinjaQuery) -> str:
    return f"{{% set {obj.defines} = {obj.expression} %}}\n"


def compile_paragraph(obj:ddtf.Paragraph) -> str:
    return f"{obj.text}\n"   


def compile_heading(obj: ddtf.Heading) -> str:
    return f"{'#'*obj.level} {obj.text}\n\n" \
               + "\n".join([fragment.compile() for fragment in obj.contents])


def compile_unordered_list(obj: ddtf.UnorderedList):
    return f"{{% for item in {obj.item_query} %}}\n" \
         + f"- {obj.item_text}\n" \
         + "{% endfor %}\n\n"


def configure_md_compiler():
    ddtf.BasicDataTable.compile = compile_basic_data_table
    ddtf.JinjaQuery.compile = compile_jinja_query
    ddtf.Paragraph.compile = compile_paragraph
    ddtf.Heading.compile = compile_heading
    ddtf.UnorderedList.compile = compile_unordered_list
