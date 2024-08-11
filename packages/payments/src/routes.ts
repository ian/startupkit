import { handler as checkoutHandler } from "./routes/checkout";
import { handler as portalHandler } from "./routes/portal";
import { handler as webhookHandler } from "./routes/webhook";

// TODO: make this dynamic
const PREFIX = "/payments";

// Define a generic handler for all methods
async function handleRequest(request: Request, method: string) {
  const url = new URL(request.url);
  const path = url.pathname.replace(PREFIX, "");

  console.log("Auth", method, path);

  switch (path) {
    case "/checkout":
      return checkoutHandler(request);
    case "/portal":
      return portalHandler(request);
    case "/webhook":
      return webhookHandler(request);
    default:
      return new Response("Not found", { status: 404 });
  }
}

// Export individual methods using the generic handler
export async function GET(request: Request) {
  return handleRequest(request, "GET");
}

export async function POST(request: Request) {
  return handleRequest(request, "POST");
}

export async function PUT(request: Request) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request: Request) {
  return handleRequest(request, "DELETE");
}

export async function PATCH(request: Request) {
  return handleRequest(request, "PATCH");
}

export async function OPTIONS(request: Request) {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS", // Specify allowed methods
    },
  });
}
