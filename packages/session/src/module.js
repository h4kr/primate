import crypto from "runtime-compat/crypto";
import {is} from "runtime-compat/dyndef";

const cookie = (name, value, {path, secure, httpOnly, sameSite}) =>
  `${name}=${value};${httpOnly};Path=${path};${secure};SameSite=${sameSite}`;

// gets a cookie id and returns it if exists, otherwise generates a new one
const in_memory_session_manager = () => {
  const store = new Map();
  return id => ({
    id,
    get exists() {
      return store.has(this.id);
    },
    get() {
      return store.get(this.id) ?? {};
    },
    set(key, value) {
      if (this.exists) {
        store.set(this.id, {...this.get(), [key]: value});
      } else {
        throw new Error("cannot call set on an uninitialized session");
      }
    },
    async create(data = {}) {
      /* dynamic to prevent multiple calls to create */
      if (!this.exists) {
        this.id = crypto.randomUUID();
        store.set(this.id, data);
      }
    },
      /* dynamic to prevent multiple calls to destroy */
    destroy() {
      if (this.exists) {
        store.delete(this.id);
      }
    },
  });
};

export default ({
  name = "sessionId",
  sameSite = "Strict",
  httpOnly = true,
  path = "/",
  manager = in_memory_session_manager(),
  implicit = false,
} = {}) => {
  is(name).string();
  is(sameSite).string();
  is(httpOnly).boolean();
  is(path).string();
  is(manager).function();
  const options = {
    sameSite,
    path,
    httpOnly: httpOnly ? ";HttpOnly" : "",
  };

  return {
    name: "primate:session",
    init(app, next) {
      options.secure = app.secure ? ";Secure" : "";
      return next(app);
    },
    async handle(request, next) {
      const id = request.cookies.get(name);
      const session = manager(id);
      is(session.create).function();
      is(session.destroy).function();

      const response = await next({...request, session});

      implicit && await session.create();

      // only send the cookie if different than the received one
      if (session.id !== id && session.id !== undefined) {
        response.headers.set("Set-Cookie", cookie(name, session.id, options));
      }

      return response;
    },
  };
};
