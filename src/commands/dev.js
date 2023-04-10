import register from "../register.js";
import compile from "../compile.js";
import publish from "../publish.js";
import route from "../route.js";
import serve from "../serve.js";

export default async env => {
  // register handlers
  await register(env);
  // compile server-side code
  await compile(env);
  // publish client-side code
  await publish(env);
  // serve
  serve({router: await route(env), ...env});
};
