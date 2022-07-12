**********************************
Template Data Object Specification
**********************************

Intro
=====

This page defines requirements for Template as a data object and then also outlines a possible solution to meet those.

Requirements
============

Here is a summary of stakeholder needs towards the Template data object that we identified so far:

.. raw:: html

    <table>
    <tr><th>ID/Version</th><th>Requirement</th><th>Rationale</th></tr>
    {% set req_mod = model.by_uuid("934171a8-bcd4-4929-aa6c-1940927d4a7f") %}
    {% for req in req_mod.requirements %}
    <tr>
      <td> {{req.identifier}} </td>
      <td> {{req.text}} </td>
      <td> {{req.attributes["Rationale"]}} </td>
    </tr>
    {% endfor %}
    </table>

The template shall 

Lets first have a look at the challenge itslelf: to deliver best-in-class templating experience for engineering deliverables we need 
Template Data Model is the key concept within the mdd-template-factory.

Template as a data object has the following requirements:

- easy to exchange
- easy to control changes
- easy to debug
- extendable / allow for reuse of constructs
- support various ways to formalize and track changes in an expression


.. diagram:: [CDB] Template Ontology

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

Classes
=======

{% set pkg = model.by_uuid("eaaa9fe1-0b44-4f47-8bae-2301fe22afec") %}
{% for cls in pkg.classes %}
{% set title = ("Abstract " if cls.is_abstract else "") + "**" + cls.name + "** " %}
.. _{{ cls.uuid }}:
{{ title }}{% if cls.super %}({{ cls.super.name }}){% endif %}
-------------------------------------------------------------------------------------------------------------------------------------

{% if cls.description %}{{ cls.description }}{% else %}No description available{% endif %}

Attributes of {{ cls.name }}
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

{% for attr in cls.properties %}
{{ describe_attribute(attr, pkg) }}
{% endfor %}

Class dump
^^^^^^^^^^
{{ cls }}

{% endfor %}
