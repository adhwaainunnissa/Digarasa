import dashboard from "../assets/dashboard.png";

export default function RightBanner() {
  return (
    <div className="flex flex-col items-center justify-center bg-[#3E6FC5] text-white h-full px-12 py-10">

      <h1 className="text-5xl font-bold text-center mb-4">
        Real-Time Power Monitoring
      </h1>

      <p className="text-center text-xl text-gray-100 leading-8 max-w-lg">
        Monitor SCADA, RTU, servers, and databases in real time
        to ensure reliable power system operations.
      </p>

      <div className="mt-10 space-y-4 w-full max-w-md">

        <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
          <span className="text-3xl">⚡</span>
          <div>
            <h3 className="font-semibold">Real-Time Data</h3>
            <p className="text-sm text-gray-200">
              Live monitoring from substations.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
          <span className="text-3xl">🔒</span>
          <div>
            <h3 className="font-semibold">Secure System</h3>
            <p className="text-sm text-gray-200">
              Protected access and authentication.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-white/10 rounded-xl p-4">
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
        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
        <span className="text-sm">System Online</span>
      </div>

      <p className="mt-8 text-sm text-gray-200">
        PLN UP2B Ungaran © 2026
      </p>

    </div>
  );
}