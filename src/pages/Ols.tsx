import { useEffect, useState } from "react";
import api from "../api/axios";
import { 
    Zap,
    Settings,
    Activity,
    RefreshCw,
    Info
} from "lucide-react";
import OlsStatus from "../components/ols/OlsStatus";
import OlsConfig from "../components/ols/OlsConfig";
import OlsHistory from "../components/ols/OlsHistory";

type Tab = "status" | "config" | "history";

export default function Ols() {
    const [activeTab, setActiveTab] = useState<Tab>("status");
    const [loading, setLoading] = useState(false);
    const [statusData, setStatusData] = useState([]);
    const [configData, setConfigData] = useState([]);
    
    // We only load status and config here, history is managed inside OlsHistory component with pagination
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        try {
            const [statusRes, configRes] = await Promise.all([
                api.get("/ols/status"),
                api.get("/ols/config")
            ]);
            setStatusData(statusRes.data.data || []);
            setConfigData(configRes.data.data || []);
        } catch (error) {
            console.error("Gagal memuat data OLS:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex h-screen w-full flex-col bg-slate-50 overflow-hidden">
            {/* Header */}
            <header className="shrink-0 border-b border-slate-200 bg-white px-8 py-6">
                <div className="mx-auto flex max-w-7xl items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-orange-50 text-orange-600 shadow-sm border border-orange-100">
                            <Zap className="h-6 w-6" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">OLS Monitoring</h1>
                            <p className="mt-1 text-sm font-medium text-slate-500">Pemantauan dan konfigurasi Over Load Shedding</p>
                        </div>
                    </div>
                    <button 
                        onClick={loadData}
                        className="flex items-center gap-2 rounded-md bg-white border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
                        disabled={loading}
                    >
                        <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
                        Refresh Data
                    </button>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 overflow-hidden flex flex-col mx-auto w-full max-w-7xl p-8">
                
                {/* Tabs */}
                <div className="flex gap-4 border-b border-slate-200 mb-6 shrink-0">
                    {[
                        { id: "status", label: "Status (Real-time)", icon: Activity },
                        { id: "config", label: "Konfigurasi", icon: Settings },
                        { id: "history", label: "Riwayat", icon: Info },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as Tab)}
                            className={`flex items-center gap-2 border-b-2 px-4 py-3 text-sm font-semibold transition-colors ${
                                activeTab === tab.id
                                    ? "border-blue-600 text-blue-700 bg-blue-50/50 rounded-t-lg"
                                    : "border-transparent text-slate-500 hover:border-slate-300 hover:text-slate-800"
                            }`}
                        >
                            <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-blue-600" : ""}`} />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="flex-1 overflow-hidden bg-white border border-slate-200 rounded-xl shadow-sm">
                    {loading && activeTab !== "history" ? (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-2">
                            <RefreshCw className="h-6 w-6 animate-spin text-blue-500" />
                            <span className="text-sm font-medium">Memuat data...</span>
                        </div>
                    ) : (
                        <div className="h-full overflow-hidden flex flex-col">
                            {activeTab === "status" && <OlsStatus data={statusData} />}
                            {activeTab === "config" && <OlsConfig data={configData} />}
                            {activeTab === "history" && <OlsHistory />}
                        </div>
                    )}
                </div>

            </main>
        </div>
    );
}
