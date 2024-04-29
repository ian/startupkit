const navigation = [
  { name: "Product", href: "#" },
  { name: "Features", href: "#" },
  { name: "Marketplace", href: "#" },
  { name: "Company", href: "#" },
];

export default function Hero() {
  return (
    <div className="">
      <div className="relative px-6 isolate lg:px-8">
        <div className="max-w-2xl mx-auto">
          {/* <div className="hidden sm:mb-8 sm:flex sm:justify-center">
            <div className="relative px-3 py-1 text-sm leading-6 text-gray-600 rounded-full ring-1 ring-gray-900/10 hover:ring-gray-900/20">
              Announcing our next round of funding.{" "}
              <a href="#" className="font-semibold text-indigo-600">
                <span className="absolute inset-0" aria-hidden="true" />
                Read more <span aria-hidden="true">&rarr;</span>
              </a>
            </div>
          </div> */}
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
              Launch a SaaS startup with{" "}
              <span className="text-gold-200">StartupKit</span>
            </h1>
            <p className="mt-6 text-lg leading-8 text-gray-600">
              StartupKit is a SaaS boilerplate designed to get you launched for{" "}
              <span className="font-bold text-white underline">free</span>,
              using only free partners &amp; integrations, including
              authentication, payments, email marketing, analytics, and more.
            </p>
            <div className="mt-5">
              <span className="w-auto px-4 py-2 font-mono text-white rounded-xl bg-blue">
                ~ npx startupkit init
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
