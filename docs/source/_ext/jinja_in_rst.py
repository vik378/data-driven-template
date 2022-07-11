# idea for extension taken from:
# https://ericholscher.com/blog/2016/jul/25/integrating-jinja-rst-sphinx/

import capellambse
import os


def rstjinja(app, docname, source):
    """Render our pages as a jinja template for fancy templating goodness."""
    # Make sure we're outputting HTML
    if app.builder.format != "html":
        return
    src = source[0]
    model = capellambse.MelodyModel("mdd-model/mdd.aird")
    rendered = app.builder.templates.render_string(
        src, {"model":model}
    )
    source[0] = rendered


def setup(app):
    app.connect("source-read", rstjinja)