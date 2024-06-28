import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { createContext } from "./context";

const port = process.env.PORT || 4000;
const origin = [
  "http://localhost:4000",
  process.env.FE_URL || "http://localhost:3000",
];
function main() {
  const yoga = createYoga({
    cors: {
      origin: origin,
    },
    schema,
    context: createContext,
  });
  const server = createServer(yoga);
  server.listen(port, () => {
    console.info(`Server is running on http://localhost:${port}/graphql`);
  });
}

main();
