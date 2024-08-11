type Params = {};

export async function GET(request: Request, context: { params: Params }) {
  console.log("Auth", context, request.body);
}
