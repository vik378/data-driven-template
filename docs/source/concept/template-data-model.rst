**********************************
Template Data Object Specification
**********************************

Intro
=====

This page defines requirements for Template as a data object and then also outlines a possible solution to meet those.

This is a model-enchanced document. Changes to the documentation model `docs/mdd-model` have effect on the contents of this page.

Requirements
============

Here is a summary of stakeholder needs towards the Template data object that we identified so far:

.. raw:: html

    <table>
    <tr><th>ID/Version</th><th>Requirement</th><th>Rationale</th></tr>
    {% set req_mod = model.by_uuid("934171a8-bcd4-4929-aa6c-1940927d4a7f") %}
    {% for req in req_mod.requirements %}
    <tr>
      <td> {{req.identifier}}/{{req.attributes["Version"]}} </td>
      <td> {{req.text}} </td>
      <td> {{req.attributes["Rationale"]}} </td>
    </tr>
    {% endfor %}
    </table>


Conceptual ontology of a Template
=================================

.. diagram:: [CDB] Template Ontology


The figure above provides an overview of the Template ontology (conceptual). The final technical implementation may differ.


Classes
=======

{% macro describe_attribute(attr, pkg) %}
{%     set prefix = "- " + attr.name + ":" %}
{%     set is_list = attr.min_card.value == 0 and attr.max_card.value | string == "inf" %}
{%     set is_single = attr.min_card.value == 1 and attr.max_card.value == 1 %}
{%     set is_fixed = attr.min_card.value == attr.max_card.value %}
{%     set type_link = "`%s <%s_>`_" | format(attr.type.name, attr.type.uuid) if attr.type in pkg.classes else attr.type.name %}
{%     if is_list and attr.is_ordered %}
{{         prefix }} an ordered list of {{type_link}} class
{%     elif is_list %}
{{         prefix }} one or many instances of {{type_link}} class
{%     elif is_single %}
{{         prefix }} value of type {{type_link}}
{%     elif is_fixed %}
{{         prefix }} {{ attr.min_card.value }} values of type {{type_link}}
{%     else %}
{{         prefix }} {{ attr.min_card.value }} to {{ attr.max_card.value }} values of type {{type_link}}
{% endif %}
{% endmacro %}

{% set pkg = model.by_uuid("eaaa9fe1-0b44-4f47-8bae-2301fe22afec") %}
{% for cls in pkg.classes %}
{% set title = ("Abstract " if cls.is_abstract else "") + "**" + cls.name + "** " %}
.. _{{ cls.uuid }}:
{{ title }}{% if cls.super %}({{ cls.super.name }}){% endif %}
-------------------------------------------------------------------------------------------------------------------------------------

.. raw:: html

    {% if cls.description %}{{ cls.description }}{% else %}No description available{% endif %}

Attributes of {{ cls.name }}
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

{% for attr in cls.properties %}
{{ describe_attribute(attr, pkg) }}
{% endfor %}

{% endfor %}
