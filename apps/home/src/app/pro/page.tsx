import Link from "next/link";

// Mock auth for development - replace with actual auth when integrated
async function getSession() {
  return {
    user: { email: "user@example.com", plan: "starter" },
    session: null,
  };
}

interface ToolUsage {
  tool: string;
  count: number;
  creditsUsed: number;
  lastUsed: string;
}

interface CreditBalance {
  balance: number;
  used: number;
  total: number;
}

async function getCreditsBalance(): Promise<CreditBalance | null> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_PRO_API_URL || "https://pro.startupkit.com/api";
    const response = await fetch(`${baseUrl}/credits/balance`, {
      headers: {
        Authorization: `Bearer ${process.env.PRO_API_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Ignore errors
  }
  return null;
}

async function getUsageHistory(): Promise<ToolUsage[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_PRO_API_URL || "https://pro.startupkit.com/api";
    const response = await fetch(`${baseUrl}/credits/history`, {
      headers: {
        Authorization: `Bearer ${process.env.PRO_API_KEY}`,
      },
      next: { revalidate: 0 },
    });
    if (response.ok) {
      return await response.json();
    }
  } catch {
    // Ignore errors
  }
  return [];
}

export default async function ProDashboard() {
  const { user } = await getSession();
  const balance = await getCreditsBalance();
  const usage = await getUsageHistory();

  const tools = [
    {
      name: "Trends",
      slug: "trends",
      description: "Google Trends data",
      icon: "📈",
      creditCost: 2,
    },
    {
      name: "SEO",
      slug: "seo",
      description: "Domain SEO analytics",
      icon: "🔍",
      creditCost: 5,
    },
    {
      name: "Keywords",
      slug: "keywords",
      description: "Keyword research",
      icon: "🔑",
      creditCost: 3,
    },
    {
      name: "Domains",
      slug: "domains",
      description: "Domain availability",
      icon: "🌐",
      creditCost: 1,
    },
    {
      name: "Apps",
      slug: "apps",
      description: "Mobile app research",
      icon: "📱",
      creditCost: 3,
    },
    {
      name: "Research",
      slug: "research",
      description: "Full market research",
      icon: "📊",
      creditCost: "varies",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user?.email}</h1>
        <p className="mt-2 text-zinc-400">
          Your AI-powered research toolkit for entrepreneurs
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm text-zinc-400">Available Credits</div>
          <div className="mt-2 text-4xl font-bold">
            {balance?.balance?.toLocaleString() ?? "—"}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            of {balance?.total?.toLocaleString() ?? "—"} total
          </div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm text-zinc-400">Used This Month</div>
          <div className="mt-2 text-4xl font-bold">
            {balance?.used?.toLocaleString() ?? "—"}
          </div>
          <div className="mt-1 text-sm text-zinc-500">credits consumed</div>
        </div>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <div className="text-sm text-zinc-400">Plan</div>
          <div className="mt-2 text-4xl font-bold capitalize">
            {user?.plan ?? "starter"}
          </div>
          <div className="mt-1 text-sm text-zinc-500">
            <Link
              href="/pro/settings"
              className="text-cyan-400 hover:underline"
            >
              Upgrade →
            </Link>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-semibold">Research Tools</h2>
        <p className="mt-1 text-zinc-400">
          Use these tools via CLI:{" "}
          <code className="rounded bg-zinc-800 px-2 py-1 text-sm">
            startupkit-pro trends "AI tools"
          </code>
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {tools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/pro/tools/${tool.slug}`}
              className="group rounded-lg border border-zinc-800 bg-zinc-900 p-4 transition-colors hover:border-zinc-700"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{tool.icon}</span>
                <div>
                  <div className="font-semibold group-hover:text-cyan-400">
                    {tool.name}
                  </div>
                  <div className="text-sm text-zinc-400">
                    {tool.description}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs text-zinc-500">
                {typeof tool.creditCost === "number"
                  ? `${tool.creditCost} credits`
                  : tool.creditCost}
              </div>
            </Link>
          ))}
        </div>
      </div>

      {usage.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold">Recent Usage</h2>
          <div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
            <table className="w-full">
              <thead className="bg-zinc-900">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                    Tool
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                    Requests
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                    Credits Used
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
                    Last Used
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {usage.slice(0, 5).map((entry) => (
                  <tr key={entry.tool}>
                    <td className="px-4 py-3 font-medium">{entry.tool}</td>
                    <td className="px-4 py-3 text-zinc-400">{entry.count}</td>
                    <td className="px-4 py-3 text-zinc-400">
                      {entry.creditsUsed}
                    </td>
                    <td className="px-4 py-3 text-zinc-400">
                      {new Date(entry.lastUsed).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
