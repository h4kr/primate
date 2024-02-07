const script_re = /(?<=<script)>(?<code>.*?)(?=<\/script>)/gus;
const style_re = /(?<=<style)>(?<code>.*?)(?=<\/style>)/gus;
const remove = /<(?<tag>script|style)>.*?<\/\k<tag>>/gus;

export default (name, options) => async app => {
  const component = await app.path.components.join(name).text();
  const scripts = await Promise.all([...component.matchAll(script_re)]
    .map(({ groups: { code } }) => app.inline(code, "module")));
  const styles = await Promise.all([...component.matchAll(style_re)]
    .map(({ groups: { code } }) => app.inline(code, "style")));
  const assets = [...scripts, ...styles];

  const body = component.replaceAll(remove, _ => "");
  const head = assets.map(asset => asset.head).join("\n");
  const script = scripts.map(asset => asset.csp).join(" ");
  const style = styles.map(asset => asset.csp).join(" ");
  const headers = app.headers({ script, style });

  return app.respond({ body, head, headers, ...options });
};
