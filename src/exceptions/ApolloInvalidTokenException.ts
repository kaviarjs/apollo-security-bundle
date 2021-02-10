import { Exception } from "@kaviar/core";

export class ApolloInvalidTokenException extends Exception<{ token: string }> {}
