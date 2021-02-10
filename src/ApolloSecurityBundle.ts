import { Bundle, EventManager, BundleAfterPrepareEvent } from "@kaviar/core";
import { Loader, ApolloBundle, IGraphQLContext } from "@kaviar/apollo-bundle";
import { SecurityService, SecurityBundle } from "@kaviar/security-bundle";

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
      headers: "kaviar-token",
      cookies: "kaviar-token",
      websocket: "kaviar-token",
    },
  };

  dependencies = [SecurityBundle, ApolloBundle];

  async prepare() {
    this.loadContextReducer();
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
          if (!session) {
            throw new Error("invalid-token");
          }
          // We check if the user still exists and is enabled
          const isEnabled = securityService.isUserEnabled(session.userId);
          if (isEnabled) {
            userId = session.userId;
          }
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
          connection.context?.req?.connectionParams[identifiers.websocket];
      }
    } else {
      if (req) {
        if (support.headers) {
          token = req.headers[identifiers.headers];
        }

        if (!token && support.cookies && req.cookies) {
          token = req.cookies[identifiers.cookies];
        }
      }
    }

    return token;
  }
}
