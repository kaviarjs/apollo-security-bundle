import "@kaviar/graphql-bundle";

declare module "@kaviar/graphql-bundle" {
  export interface IGraphQLContext {
    /**
     * The userId retrieved from the request. Also verified if the session is valid.
     */
    userId: any;
    /**
     * The token retrieved from either HTTP Cookies, HTTP Headers, or WebSocket parameter
     */
    authenticationToken: string;
  }
}
