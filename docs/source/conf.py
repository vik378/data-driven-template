# Copyright Viktor Kravchenko and the mdd-template-factory contributors
# SPDX-License-Identifier: Apache-2.0

import logging

logger = logging.getLogger(__name__)

# -- Path setup --------------------------------------------------------------

# If extensions (or modules to document with autodoc) are in another directory,
# add these directories to sys.path here. If the directory is relative to the
# documentation root, use os.path.abspath to make it absolute, like shown here.
#
import os
import sys

sys.path.insert(0, os.path.abspath("../.."))

from setuptools.config import read_configuration
import capellambse

# -- Project information -----------------------------------------------------

config = read_configuration("../../setup.cfg")
project = "mdd_template_factory"
pypi = "mdd_template_factory"
author = config["metadata"]["author"]
copyright = "%s" % author
license = config["metadata"]["license"]
#install_requirements = config["options"]["install_requires"]
#python_requirement = config["options"]["python_requires"]

# -- General configuration ---------------------------------------------------

# Add any Sphinx extension module names here, as strings. They can be
# extensions coming with Sphinx (named 'sphinx.ext.*') or your custom
# ones.
# import sphinx_material

sys.path.append(os.path.abspath("./_ext"))

extensions = [
    "sphinx.ext.autodoc",
    "sphinx.ext.coverage",
    #"sphinx_material",
    "jinja_in_rst",
    "capellambse.sphinx",
    "sphinx.ext.autosectionlabel",
]


# -- General information about the project -----------------------------------

# The version info for the project you're documenting, acts as replacement for
# |version| and |release|, also used in various other places throughout the
# built documents.

# The full version, including alpha/beta/rc tags.
version =  "0.0.0 (planning)" # this is planning phase, hence no version  # module.__version__
rst_epilog = """
.. |Project| replace:: {project}
.. |Version| replace:: {version}
""".format(
    project=project, version=version
)

# -- Options for auto-doc ----------------------------------------------------
autoclass_content = "both"

# -- Options for HTML output -------------------------------------------------

# The theme to use for HTML and HTML Help pages.  See the documentation for
# a list of builtin themes.

# Set link name generated in the top bar.
html_title = 'Model-Derived Document Template Factory'
html_theme = 'sphinx_material'
# Material theme options (see theme.conf for more information)
html_theme_options = {

    # Set the name of the project to appear in the navigation.
    'nav_title': 'Model-Derived Document Template Factory',

    # Set you GA account ID to enable tracking
    #'google_analytics_account': 'UA-XXXXX',

    # Specify a base_url used to generate sitemap.xml. If not
    # specified, then no sitemap will be built.
    #'base_url': 'https://project.github.io/project',

    # Set the color and the accent color
    'color_primary': 'blue',
    'color_accent': 'light-blue',

    # Set the repo location to get a badge with stats
    'repo_url': 'https://github.com/vik378/mdd-template-factory/',
    'repo_name': 'mdd-template-factory',

    # Visible levels of the global TOC; -1 means unlimited
    'globaltoc_depth': 3,
    # If False, expand all TOC entries
    'globaltoc_collapse': False,
    # If True, show hidden TOC entries
    'globaltoc_includehidden': False,
}


# Add any paths that contain custom static files (such as style sheets) here,
# relative to this directory. They are copied after the builtin static files,
# so a file named "default.css" will overwrite the builtin "default.css".
html_static_path = ["_static"]


# -- Options for CapellaMBSE-Sphinx ------------------------------------------
capellambse_model = "../mdd-model/mdd.aird"  # Capella 5.2 spec. model
