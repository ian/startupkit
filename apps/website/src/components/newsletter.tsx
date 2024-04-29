export default function Newsletter({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="relative px-6 overflow-hidden bg-gray-900 isolate sm:rounded-3xl">
          <p className="max-w-xl mx-auto mt-2 text-lg leading-8 text-center text-gray-300">
            Reprehenderit ad esse et non officia in nulla. Id proident tempor
            incididunt nostrud nulla et culpa.
          </p>
          <form className="flex max-w-md mx-auto mt-2 gap-x-2">
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="min-w-0 flex-auto rounded-md border-0 bg-blue px-3.5 py-2 text-black shadow-sm focus:outline-none sm:text-sm sm:leading-6"
              placeholder="Enter your email"
            />
            <button
              type="submit"
              className="flex-none rounded-md bg-blue px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
