export default function RightBanner() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#3E6FC5] px-12 py-10 text-white">

      <h1 className="mb-4 text-center text-5xl font-bold">
        Real-Time Power Monitoring
      </h1>

      <p className="max-w-lg text-center text-xl leading-8 text-gray-100">
        Monitor SCADA, RTU, servers, and databases in real time
        to ensure reliable power system operations.
      </p>

      <div className="mt-10 w-full max-w-md space-y-4">
        <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="font-semibold">Real-Time Data</h3>
            <p className="text-sm text-gray-200">
              Live monitoring from substations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="font-semibold">Secure System</h3>
            <p className="text-sm text-gray-200">
              Protected access and authentication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 rounded-xl bg-white/10 p-4">
          <span className="text-3xl">📊</span>
          <div>
            <h3 className="font-semibold">Reliable Analytics</h3>
            <p className="text-sm text-gray-200">
              Accurate monitoring and reporting.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 flex items-center gap-2">
        <div className="h-3 w-3 animate-pulse rounded-full bg-green-400"></div>
        <span className="text-sm">System Online</span>
      </div>

      <p className="mt-8 text-sm text-gray-200">
        PLN UP2B Ungaran © 2026
      </p>
    </div>
  );
}