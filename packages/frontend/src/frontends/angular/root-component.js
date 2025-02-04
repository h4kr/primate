import { stringify } from "rcompat/object";
import { Component as as_component, reflectComponentType } from "@angular/core";
import rootname from "./rootname.js";

const double_to_single = string => string.replaceAll("\"", "'");

const root_component = ({ template, imports }) => as_component({
  selector: rootname,
  imports,
  template,
  standalone: true,
})(class {});

export default async (real_root, props) => {
  const { selector } = await reflectComponentType(real_root);
  const attributes = Object.entries(props)
    .map(([key, value]) => `[${key}]="${double_to_single(stringify(value))}"`)
    .join(" ");

  return root_component({
    imports: [real_root],
    template: `<${selector} ${attributes}></${selector}>`,
  });
};
