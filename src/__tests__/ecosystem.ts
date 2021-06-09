import { ApolloBundle } from "@kaviar/apollo-bundle";
import { Kernel } from "@kaviar/core";
import { SecurityBundle } from "@kaviar/security-bundle";
import { ApolloSecurityBundle } from "../ApolloSecurityBundle";

export function createKernel() {
  return new Kernel({
    bundles: [
      new ApolloBundle({
        port: 5000,
      }),
      new ApolloSecurityBundle(),
      new SecurityBundle(),
    ],
  });
}
