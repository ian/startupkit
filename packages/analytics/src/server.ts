import RudderAnalytics from "@rudderstack/rudder-sdk-node";

const { RUDDERSTACK_WRITE_KEY, RUDDERSTACK_DATA_PLANE } = process.env;

if (!RUDDERSTACK_WRITE_KEY || !RUDDERSTACK_DATA_PLANE) {
  throw new Error(
    "Missing Rudderstack env vars, please set RUDDERSTACK_WRITE_KEY and RUDDERSTACK_DATA_PLANE",
  );
}

export const client = new RudderAnalytics(RUDDERSTACK_WRITE_KEY, {
  dataPlaneUrl: RUDDERSTACK_DATA_PLANE,
});
