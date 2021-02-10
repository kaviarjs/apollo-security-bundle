import { Exception } from "@kaviar/core";

export class ApolloInvalidTokenException extends Exception<{ token: string }> {
  getMessage() {
    return "Invalid token";
  }
}
