import rootname from "./rootname.js";

export default `
const { spa } = components;
window.addEventListener("DOMContentLoaded", _ => spa((props, update) => {
  dispose();
  dispose = render_solid(() => components.${rootname}({
    components: props.names.map(name => components[name]),
    data: props.data,
    context: props.context,
    request: {
      ...props.request,
      url: new URL(location.href),
    },
  }), globalThis.window.document.body);
}));`;
