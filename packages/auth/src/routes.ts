import { NextRequest } from "next/server";
import { handler as callbackHandler } from "./routes/callback";
import { handler as loginHandler } from "./routes/login";

// TODO: make this dynamic
const PREFIX = "/api/auth";

// Define a generic handler for all methods
async function handleRequest(request: NextRequest, method: string) {
  const url = new URL(request.url);
  const path = url.pathname.replace(PREFIX, "");

  console.log("Auth", method, path);

  switch (path) {
    case "/callback":
      return callbackHandler(request);
    case "/login":
      return loginHandler(request);
    default:
      return new Response("Not found", { status: 404 });
  }
}

// Export individual methods using the generic handler
export async function GET(request: NextRequest) {
  return handleRequest(request, "GET");
}

export async function POST(request: NextRequest) {
  return handleRequest(request, "POST");
}

export async function PUT(request: NextRequest) {
  return handleRequest(request, "PUT");
}

export async function DELETE(request: NextRequest) {
  return handleRequest(request, "DELETE");
}

export async function PATCH(request: NextRequest) {
  return handleRequest(request, "PATCH");
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      Allow: "GET, POST, OPTIONS", // Specify allowed methods
    },
  });
}
