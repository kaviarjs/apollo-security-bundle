<h1 align="center">KAVIAR APOLLO SECURITY BUNDLE</h1>

<p align="center">
  <a href="https://travis-ci.org/kaviarjs/apollo-bundle">
    <img src="https://api.travis-ci.org/kaviarjs/apollo-bundle.svg?branch=master" />
  </a>
  <a href="https://coveralls.io/github/kaviarjs/apollo-bundle?branch=master">
    <img src="https://coveralls.io/repos/github/kaviarjs/apollo-bundle/badge.svg?branch=master" />
  </a>
</p>

<br />
<br />

This bundle is to inject into the context the token read from the request and decoded via the SecurityBundle.

## Installation

```bash
npm i -S @kaviar/apollo-bundle @kaviar/apollo-security-bundle
```

```typescript
import { ApolloSecurityBundle } from "@kaviar/apollo-security-bundle";

kernel.addBundle(
  new ApolloSecurityBundle({
    // options go here
  })
);
```

Options:

```js
export interface IApolloSecurityBundleConfig {
  // All true by default
  support: {
    headers?: boolean,
    cookies?: boolean,
    websocket?: boolean,
  };
  // kaviar-login-token is the default for all
  identifiers: {
    headers?: string,
    cookies?: string,
    // For websocket you have to send the connection params in order to work
    websocket?: string,
  };
}
```

Usage:

```js
import { ISecurityContext } from "@kaviar/apollo-security-bundle";

load({
  resolvers: {
    Query: {
      findMyPosts(_, args, context: ISecurityContext) {
        if (!context.userId) {
          // You can throw an error.
        }
      },
    },
  },
});
```
