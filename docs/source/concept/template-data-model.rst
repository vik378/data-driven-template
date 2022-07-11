**********************************
Template Data Object Specification
**********************************

Template Data Model is the key concept within the mdd-template-factory.

Template as a data object has the following requirements:

- easy to exchange
- easy to control changes
- easy to debug
- extendable / allow for reuse of constructs
- support various ways to formalize and track changes in an expression


.. diagram:: [CDB] Template Ontology

Classes
=======

{% set pkg = model.by_uuid("eaaa9fe1-0b44-4f47-8bae-2301fe22afec") %}
{% for cls in pkg.classes %}
{% set title = ("Abstract " if cls.is_abstract else "") + "**" + cls.name + "** " %}
{{ title }}{% if cls.super %}({{ cls.super.name }}){% endif %}
-------------------------------------------------------------------------------------------------------------------------------------

{% if cls.description %}{{ cls.description }}{% else %}No description available{% endif %}

Attributes of {{ cls.name }}
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

{% for attr in cls.properties %}
- {{ attr.name }}: {{ attr.type.name }}
{% endfor %}

Class dump
^^^^^^^^^^
{{ cls }}

{% endfor %}
