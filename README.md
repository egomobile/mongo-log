[![npm](https://img.shields.io/npm/v/@egomobile/mongo-log.svg)](https://www.npmjs.com/package/@egomobile/mongo-log)
[![last build](https://img.shields.io/github/workflow/status/egomobile/mongo-log/Publish)](https://github.com/egomobile/mongo-log/actions?query=workflow%3APublish)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square)](https://github.com/egomobile/mongo-log/pulls)

# @egomobile/mongo-log

> A middleware for [js-log](https://github.com/egomobile/js-log), which writes logs to a Mongo database, using [node-mongo](https://github.com/egomobile/node-mongo).

## Install

Execute the following command from your project folder, where your `package.json` file is stored:

```bash
npm install --save @egomobile/mongo-log
```

The following modules are defined in [peerDependencies](https://nodejs.org/uk/blog/npm/peer-dependencies/) and have to be installed manually:

- [@egomobile/mongo](https://github.com/egomobile/node-mongo)

## Usage

```typescript
import log, { useMongoLogger } from "@egomobile/mongo-log";

// run this, if you do not want to use console.log
// log.reset();

// add middleware
log.use(useMongoLogger());

log("foo"); // default: debug
log.debug("foo"); // debug
log.error("foo"); // error
log.warn("foo"); // warning
log.info("foo"); // information
log.trace("foo"); // trace
```

## Documentation

The API documentation can be found [here](https://egomobile.github.io/mongo-log/).
