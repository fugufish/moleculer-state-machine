import { ServiceSchema } from "moleculer";

declare module "moleculer-state-machine" {
    const schema: ServiceSchema;
    export = schema;
}
