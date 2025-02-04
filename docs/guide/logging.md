# Logging

Primate has three log levels, `Error`, `Warn` and `Info`. As a general rule,
an `Error` causes severe disruptions to the application (and leads to bailout
during startup), `Warn` indicates degraded functionality in an otherwise
nominal system, and `Info` serves to give more information. In terms of
actionability, `Error` logs **must** be addressed, `Warn` logs **should** be
checked, and `Info` logs **may** be ignored.

## Configuring

By default, the error level is to set `Warn`, which logs all errors and
warnings. You can change this in your configuration.

```js primate.config.js
import { Logger } from "primate";

export default {
  logger: {
    // show all logs
    level: Logger.Info,
  },
};
```

Primate logs are implemented as JavaScript errors and thus carry a stack. If
you want the stack trace to be output in addition to Primate's own logging (in
the case of `Error` or `Warn` logs), set `trace` to `true`.

```js primate.config.js
import { Logger } from "primate";

export default {
  logger: {
    // show all logs
    level: Logger.Info,
    // show stack traces for errors and warnings
    trace: true,
  },
};
```

When Primate shows errors or warnings, it will include a short reason and a
quickfix, as well as link to the website for a longer explanation and fix.

```text
?? primate/store empty store directory
++ populate /home/user/app/stores with stores
   -> https://primatejs.com/reference/errors/primate/store#empty-store-directory
```

## Error

Marked by two red exclamation marks, `!!`.

An error means a severe disruption to the application and must be addressed.
Errors which occur during runtime indicate a severe mismatch between two parts
of an application (for example, trying to use the `view` handler with a file
extension that hasn't been registered by an module).

Errors occuring during startup are bailouts.

### Bailout

Errors occuring during startup result in a bailout and must be addressed before
a restart is possible.

Bailouts are almost always the result of a misconfiguration that would
introduce ambiguity into how Primate operates.

## Warn

Marked by two yellow question marks, `??`.

A warning means degraded functionality, but an otherwise functional
application, and should be checked. Warnings usually indicate having configured
a certain feature (like loading a module) but not using it.

## Info

Marked by two green minuses, `--`.

Info logs serve to provide more insight into the internal workings of Primate
and can be usually ignored.

### Possibly intentional

Some info logs are indicated as possibly intentional. This is due to Primate
not knowing if this is due to a client misconfiguration (for example, using
a client that sends alphanumeric strings where numeric strings are expected) or
due to actual client manipulation.

## Fix

Marked by two blue pluses, `++`.

In the cases of known `Warn` and `Error` logs, Primate will suggest a quickfix
which may help addressing the problem, in addition to supplying a link to the
error on the website.

## Error list

### Cannot Parse Body

Level [`Warn`][warn] | [`Possibly Intentional`][possibly-intentional]

Cannot parse the request body due to the a mismatch between the used
`Content-Type` and the actual body, for example as follows.

```http caption=request with invalid JSON body
POST /user
Content-Type: application/json

~
```

This could be due to the client using the wrong content type or sending, as in
the given example, invalid body with its request, or intentional
client-side activity.

*If deemed unintentional, use a different content type or fix the body.*

### Double Module

Level [`Error`][error] | [`Bailout`][bailout]

Two modules are using the same name in `primate.config.is`. A module's `name`
property is its unique identifier and must not be repeated.

*Load the module only once.*

### Double Path Parameter

Level [`Error`][error] | [`Bailout`][bailout]

The same parameter is used twice in one route, as in 
`routes/{userId}/{userId}.js`. Path parameters are mapped to `request.query`
and using the same name twice (with or without a type) creates ambiguity.

*Disambiguate path parameters in route names.*

### Double Route

Level [`Error`][error] | [`Bailout`][bailout]

The same route is used twice, as in `routes/user.js` and
`routes/user/index.js` or `routes/post/{foo}.js` and `/routes/post/{bar}.js`,
creating mapping ambiguity. Routes must be unique, and while you can mix styles
in your application (like `routes/user.js` and `routes/comment/index.js`), you
must not use the same style for the same route.

*Disambiguate the routes by consolidating them into one file of the path-style
of your choosing.*

### Empty Route File

Level [`Warn`][warn]

An empty route file exists, that is a route file without or with an empty 
default export.

*Add routes to the file or remove it.*

## Empty Directory

Level [`Warn`][warn]

One of the default directories is empty.

Primate is an opt-in framework, that is most of its aspects, like *routes* or
*types* are only active when their directories exist. Such an empty directory
could mean you intended to use something but haven't. It's best to either
populate the directory with files or remove it completely.

*Populate directory or remove it.*

### Error In Config File

Level [`Error`][error] | [`Bailout`][bailout]

JavaScript error encountered when importing `primate.config.js`.

*Check and address errors in the config file by running it directly.*

### Module Has No Hooks

Level [`Warn`][warn]

Module loaded without hooks.

*If this is a ad-hoc module, add hooks to it to make effective. If a
third-party module, contact the maintainer.*

### Modules Must Have Names

Level [`Error`][error] | [`Bailout`][bailout]

Module loaded without a `name` property. Without this property Primate cannot
detect if a module has been loaded more than once.

*If this is a ad-hoc module, add a `name` property to it to make it unique. If
a third-party module, contact its maintainer.*

### Empty Config File

Level [`Warn`][warn]

`primate.config.js` loaded without or with an empty default export, a no-op.

*Add configuration options to the file or remove it.*

### Invalid Path Parameter

Level [`Error`][error] | [`Bailout`][bailout]

Invalid characters in a path parameter. Path parameters are limited to
alphanumeric characters.

*Use only Latin letters and decimal digits in path parameters, that is
lowercase and uppercase A to Z as well as 0 to 9.*

### Invalid Route Name

Level [`Error`][error] | [`Bailout`][bailout]

Dots in route names (excluding `.js`). Dots are used for files, which would
create amgibuity between route and static files.

*Do not use dots in route names.*

### Invalid Type

Level [`Error`][error] | [`Bailout`][bailout]

A type file has a default export which is not a function.

*Use only functions for the default export of type files.*

### Invalid Type Name

Level [`Error`][error] | [`Bailout`][bailout]

Invalid characters in the filename of a type.

*Use only Latin letters and decimal digits in type filenames, that is
lowercase and uppercase A to Z as well as 0 to 9.*

### Mismatched Path

Level [`Info`][info] | [`Possibly Intentional`][possibly-intentional]

Type mismatch in path parameters, precluding the route from executing.

*If deemed unintentional, fix the type or the caller.*

### Mismatched Type

Level [`Info`][info] | [`Possibly Intentional`][possibly-intentional]

Type mismatch during the execution of a route function, stopping the route.
The mismatch happened in a `body`, `query`, `cookies` or `headers` field.

*If deemed unintentional, fix the type or the caller.*

### No File For Path

Level [`Info`][info] | [`Possibly Intentional`][possibly-intentional]

No file for the given path, as in `/favicon.ico` when the `static` directory
does not contain a `favicon.ico` file.

*If deemed unintentional, create a file in your static directory.*

### No Handler For Extension

Level [`Error`][error]

No appropriate handler for the given extension using the
[`view`](/guide/responses#view) handler.

*Add a handler module for files of the given extension or change this route.*

### No Route To Path

Level [`Info`][info] | [`Possibly Intentional`][possibly-intentional]

Cannot map the given path to a route, as in `GET /user.js` when `route/user.js`
does not exist or have a `get` property function.

*If deemed unintentional, create an appropriate route function.*

### Reserved Type Name

Level [`Error`][error] | [`Bailout`][bailout]

Reserved type name used. Reserved types are: `get`, `raw`.

*Do not use any reserved name in type filenames.*

[error]: /guide/logging#error
[bailout]: /guide/logging#bailout
[warn]: /guide/logging#warn
[info]: /guide/logging#info
[possibly-intentional]: /guide/logging#possibly-intentional
