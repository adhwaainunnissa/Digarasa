import {
  FaTachometerAlt,
  FaBolt,
  FaServer,
  FaDatabase,
  FaCog,
} from "react-icons/fa";

export default function Sidebar() {
  return (
    <div className="w-64 bg-blue-600 text-white min-h-screen p-6">
      <h2 className="text-2xl font-bold mb-10">
        ⚡ FASOP
      </h2>

      <ul className="space-y-6">
        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-400">
          <FaTachometerAlt />
          Dashboard
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-400">
          <FaBolt />
          Monitoring
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-400">
          <FaServer />
          SCADA
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-400">
          <FaDatabase />
          Database
        </li>

        <li className="flex items-center gap-3 cursor-pointer hover:text-yellow-400">
          <FaCog />
          Settings
        </li>
      </ul>
    </div>
  );
}