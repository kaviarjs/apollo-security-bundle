This is used to detect the userId based on the authentication token and inject it inside the GraphQL's context.

## Install

```bash
npm i -S @kaviar/apollo-bundle @kaviar/apollo-security-bundle
```

```typescript
import { ApolloSecurityBundle } from "@kaviar/apollo-security-bundle";

kernel.addBundle(new ApolloSecurityBundle());
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
    headers?: string, // Has priority over cookies
    cookies?: string, // If no header is present it will read from here
    // For websocket you have to send the connection params in order to work
    websocket?: string,
  };
}
```

`IGraphQLContext` is properly extended by this package:

```js
import { IGraphQLContext } from "@kaviar/graphql-bundle";

load({
  resolvers: {
    Query: {
      findMyPosts(_, args, context: IGraphQLContext) {
        // Context should have authenticationToken and userId
        if (!context.userId) {
          // You can throw an error.
        }
      },
    },
  },
});
```