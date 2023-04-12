const filter = (key, array) => array?.flatMap(m => m[key] ?? []) ?? [];

export default async app =>
  [...filter("register", app.modules), _ => _].reduceRight((acc, handler) =>
    input => handler(input, acc))(app);
