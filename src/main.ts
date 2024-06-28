import { createServer } from "node:http";
import { createYoga } from "graphql-yoga";
import { schema } from "./schema";
import { createContext } from "./context";

function main() {
  const yoga = createYoga({
    cors: {
      origin: ["http://localhost:4000", "http://localhost:3000"],
      allowedHeaders: ["X-Custom-Header", "Content-Type"],
      methods: ["POST", "GET"],
    },
    schema,
    context: createContext,
  });
  const server = createServer(yoga);
  server.listen(4000, () => {
    console.info("Server is running on http://localhost:4000/graphql");
  });
}

main();
