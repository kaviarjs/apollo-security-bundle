import { Bundle, EventManager, BundleAfterPrepareEvent } from "@kaviar/core";
import { Loader, ApolloBundle, IGraphQLContext } from "@kaviar/apollo-bundle";
import { SecurityService, SecurityBundle } from "@kaviar/security-bundle";

export interface ISecurityContext extends IGraphQLContext {
  userId: null | any;
}

export interface IApolloSecurityBundleConfig {
  support: {
    headers?: boolean;
    cookies?: boolean;
    websocket?: boolean;
  };
  identifiers: {
    headers?: string;
    cookies?: string;
    websocket?: string;
  };
}

export class ApolloSecurityBundle extends Bundle<IApolloSecurityBundleConfig> {
  protected defaultConfig = {
    support: {
      headers: true,
      cookies: true,
      websocket: true,
    },
    identifiers: {
      headers: "kaviar-login-token",
      cookies: "kaviar-login-token",
      websocket: "kaviar-login-token",
    },
  };

  dependencies = [SecurityBundle, ApolloBundle];

  async hook() {
    const manager = this.get<EventManager>(EventManager);

    // We do this after preparation of ApolloBunde because we are sure then we have the container already registered
    manager.addListener(
      BundleAfterPrepareEvent,
      (e: BundleAfterPrepareEvent) => {
        if (e.data.bundle instanceof ApolloBundle) {
          this.loadContextReducer();
        }
      }
    );
  }

  loadContextReducer() {
    const loader = this.get<Loader>(Loader);

    loader.load({
      contextReducers: async (context: IGraphQLContext) => {
        const { req, connection, container } = context;

        const token = this.identifyToken(req, connection);
        let userId = null;

        if (token) {
          const securityService: SecurityService = container.get(
            SecurityService
          );
          const session = await securityService.getSession(token);
          userId = session?.userId;
        }

        return {
          ...context,
          authenticationToken: token,
          userId,
        };
      },
    });
  }

  /**
   * Identifies the token from various places
   * @param req
   * @param connection
   */
  identifyToken(req, connection) {
    const { support, identifiers } = this.config;

    let token;
    if (connection) {
      if (support.websocket) {
        token =
          connection?.context?.req?.connectionParams[identifiers.websocket];
      }
    } else {
      if (support.headers) {
        token = req.headers[identifiers.headers];
      }

      if (!token && support.cookies) {
        token = req.cookies[identifiers.cookies];
      }
    }

    return token;
  }
}
