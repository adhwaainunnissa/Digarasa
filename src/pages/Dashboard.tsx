import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Card from "../components/Card";

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />

      <div className="flex-1">
        <Navbar />

        <div className="p-8">
          <h1 className="text-3xl font-bold mb-8">
            Dashboard Monitoring
          </h1>

          <div className="grid grid-cols-4 gap-6">
            <Card title="Voltage" value="220 V" color="bg-blue-500" />
            <Card title="Current" value="16 A" color="bg-green-500" />
            <Card title="Frequency" value="50 Hz" color="bg-yellow-500" />
            <Card title="Status" value="Normal" color="bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
}