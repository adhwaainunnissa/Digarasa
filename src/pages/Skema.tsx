import { useEffect, useMemo, useState } from "react";
import api from "../api/axios";

interface SkemaData {
  id_skema: number;
  skema: string;
  id_ss: number | null;
  subsistem: string | null;
  aktif: number | null;
}

interface Subsistem {
  id_ss: number;
  subsistem: string;
}

interface DeviceProsis {
  no: number;
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
}

interface SkemaMT {
  no: number;
  id_skema: number;
  skema: string | null;
  id_ss: number | null;
  subsistem: string | null;
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
}

interface SkemaRele {
  no: number;
  id_skema: number;
  skema: string | null;
  id_ss: number | null;
  subsistem: string | null;
  tag_name: string | null;
  gi: string | null;
  jenis: string | null;
  keterangan: string | null;
  merek: string | null;
  tipe: string | null;
}

interface SkemaRTAC {
  Tag_Name: string | null;
  Gardu_Induk: string | null;
  Bay_Target: string | null;
  Skema: string | null;
  Tahap: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

type DetailTab = "info" | "mt" | "rele" | "rtac";
type DetailMode = "add" | "edit" | null;
type DeviceMode = "mt" | "rele";

function Skema() {
  const [data, setData] = useState<SkemaData[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  const [subsistem, setSubsistem] = useState<Subsistem[]>([]);
  const [subsistemLoading, setSubsistemLoading] = useState(false);
  const [subsistemSearch, setSubsistemSearch] = useState("");
  const [showSubsistemDropdown, setShowSubsistemDropdown] = useState(false);

  const [selectedSkema, setSelectedSkema] = useState<SkemaData | null>(null);
  const [activeTab, setActiveTab] = useState<DetailTab>("info");
  const [detailLoading, setDetailLoading] = useState(false);
  const [skemaMT, setSkemaMT] = useState<SkemaMT[]>([]);
  const [skemaRele, setSkemaRele] = useState<SkemaRele[]>([]);
  const [skemaRTAC, setSkemaRTAC] = useState<SkemaRTAC[]>([]);

  const [devices, setDevices] = useState<DeviceProsis[]>([]);
  const [devicesLoading, setDevicesLoading] = useState(false);
  const [deviceSearch, setDeviceSearch] = useState("");
  const [showDeviceDropdown, setShowDeviceDropdown] = useState(false);
  const [deviceMode, setDeviceMode] = useState<DeviceMode>("mt");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [namaSkema, setNamaSkema] = useState("");
  const [selectedSubsistem, setSelectedSubsistem] = useState<number | "">("");
  const [aktif, setAktif] = useState<number | "">("");

  const [detailForm, setDetailForm] = useState<DetailMode>(null);
  const [detailSaving, setDetailSaving] = useState(false);
  const [editingMTNo, setEditingMTNo] = useState<number | null>(null);
  const [editingReleNo, setEditingReleNo] = useState<number | null>(null);
  const [editingRTACTag, setEditingRTACTag] = useState<string | null>(null);
  const [detailDeviceNo, setDetailDeviceNo] = useState<number | "">("");
  const [detailJenis, setDetailJenis] = useState("");
  const [rtacForm, setRtacForm] = useState({
    Tag_Name: "",
    Gardu_Induk: "",
    Bay_Target: "",
    Skema: "",
    Tahap: "",
  });

  const [saving, setSaving] = useState(false);

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);
  const isAdmin = user?.role === "admin";

  const selectedDevice = useMemo(
    () => devices.find((item) => item.no === detailDeviceNo) || null,
    [devices, detailDeviceNo]
  );

  const filteredDevices = useMemo(() => {
    const keyword = deviceSearch.trim().toLowerCase();
    if (!keyword) return devices.slice(0, 50);
    return devices
      .filter((item) =>
        [
          item.no,
          item.tag_name,
          item.gi,
          item.jenis,
          item.keterangan,
          item.merek,
          item.tipe,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword)
      )
      .slice(0, 50);
  }, [devices, deviceSearch]);

  const loadSkema = async (page = 1, searchValue = search) => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/skema", {
        params: { page, limit: 20, search: searchValue },
      });
      setData(response.data.data || []);
      setPagination(response.data.pagination || null);
    } catch (err: any) {
      console.error("Gagal mengambil data SKEMA:", err);
      setError(err?.response?.data?.message || "Gagal mengambil data SKEMA.");
    } finally {
      setLoading(false);
    }
  };

  const loadSubsistem = async (searchValue = "") => {
    try {
      setSubsistemLoading(true);
      const response = await api.get("/skema/subsistem", {
        params: { search: searchValue },
      });
      setSubsistem(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil subsistem:", err);
    } finally {
      setSubsistemLoading(false);
    }
  };

  const loadDevices = async () => {
    try {
      setDevicesLoading(true);
      const response = await api.get("/skema/devices");
      setDevices(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil DEVICE_PROSIS:", err);
    } finally {
      setDevicesLoading(false);
    }
  };

  const loadMT = async (idSkema: number) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/${idSkema}/mt`);
      setSkemaMT(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail MT:", err);
      setSkemaMT([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadRele = async (idSkema: number) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/${idSkema}/rele`);
      setSkemaRele(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail RELE:", err);
      setSkemaRele([]);
    } finally {
      setDetailLoading(false);
    }
  };

  const loadRTAC = async (skemaName: string) => {
    try {
      setDetailLoading(true);
      const response = await api.get(`/skema/rtac/${encodeURIComponent(skemaName)}`);
      setSkemaRTAC(response.data || []);
    } catch (err) {
      console.error("Gagal mengambil detail RTAC:", err);
      setSkemaRTAC([]);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    loadSkema();
    loadSubsistem();
    loadDevices();
  }, []);

  const handleSelectSkema = (item: SkemaData) => {
    setSelectedSkema(item);
    setActiveTab("info");
    setSkemaMT([]);
    setSkemaRele([]);
    setSkemaRTAC([]);
  };

  const handleTabChange = async (tab: DetailTab) => {
    if (!selectedSkema) return;
    setActiveTab(tab);
    if (tab === "mt") await loadMT(selectedSkema.id_skema);
    if (tab === "rele") await loadRele(selectedSkema.id_skema);
    if (tab === "rtac") await loadRTAC(selectedSkema.skema);
  };

  const handleSearch = () => loadSkema(1, search);
  const handleResetSearch = () => {
    setSearch("");
    loadSkema(1, "");
  };

  const resetSkemaForm = () => {
    setEditingId(null);
    setNamaSkema("");
    setSelectedSubsistem("");
    setAktif("");
    setSubsistemSearch("");
    setShowSubsistemDropdown(false);
  };

  const openAddForm = () => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk menambah skema.");
    resetSkemaForm();
    setShowForm(true);
  };

  const openEditForm = (item: SkemaData) => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk mengedit skema.");
    setEditingId(item.id_skema);
    setNamaSkema(item.skema || "");
    setSelectedSubsistem(item.id_ss ?? "");
    setAktif(item.aktif ?? "");
    setSubsistemSearch(item.subsistem || "");
    setShowSubsistemDropdown(false);
    setShowForm(true);
  };

  const closeForm = () => {
    if (!saving) setShowForm(false);
  };

  const selectSubsistem = (item: Subsistem) => {
    setSelectedSubsistem(item.id_ss);
    setSubsistemSearch(item.subsistem);
    setShowSubsistemDropdown(false);
  };

  const handleSubsistemSearch = (value: string) => {
    setSubsistemSearch(value);
    setSelectedSubsistem("");
    setShowSubsistemDropdown(true);
    loadSubsistem(value);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin) return alert("Anda tidak memiliki izin.");
    if (!namaSkema.trim()) return alert("Nama skema wajib diisi.");

    try {
      setSaving(true);
      const payload = {
        skema: namaSkema.trim(),
        id_ss: selectedSubsistem === "" ? null : selectedSubsistem,
        aktif: aktif === "" ? null : aktif,
      };
      if (editingId === null) {
        await api.post("/skema", payload);
        alert("Skema berhasil ditambahkan.");
      } else {
        await api.put(`/skema/${editingId}`, payload);
        alert("Skema berhasil diperbarui.");
      }
      setShowForm(false);
      await loadSkema(pagination?.page || 1, search);
      setSelectedSkema(null);
    } catch (err: any) {
      console.error("Gagal menyimpan SKEMA:", err);
      alert(err?.response?.data?.message || "Gagal menyimpan SKEMA.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item: SkemaData) => {
    if (!isAdmin) return alert("Anda tidak memiliki izin untuk menghapus skema.");
    if (!window.confirm(`Yakin ingin menghapus skema "${item.skema}"?`)) return;
    try {
      await api.delete(`/skema/${item.id_skema}`);
      alert("Skema berhasil dihapus.");
      if (selectedSkema?.id_skema === item.id_skema) setSelectedSkema(null);
      await loadSkema(pagination?.page || 1, search);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus skema.");
    }
  };

  const openMTForm = (item?: SkemaMT) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDeviceMode("mt");
    setDetailForm(item ? "edit" : "add");
    setEditingMTNo(item?.no ?? null);
    setDetailDeviceNo(item?.no ?? "");
    setDetailJenis(item?.jenis ?? "");
    setDeviceSearch(item?.tag_name || item?.gi || item?.keterangan || "");
    setShowDeviceDropdown(false);
  };

  const openReleForm = (item?: SkemaRele) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDeviceMode("rele");
    setDetailForm(item ? "edit" : "add");
    setEditingReleNo(item?.no ?? null);
    setDetailDeviceNo(item?.no ?? "");
    setDetailJenis(item?.jenis ?? "");
    setDeviceSearch(item?.tag_name || item?.gi || item?.keterangan || "");
    setShowDeviceDropdown(false);
  };

  const openRTACForm = (item?: SkemaRTAC) => {
    if (!isAdmin || !selectedSkema) return alert("Anda tidak memiliki izin.");
    setDetailForm(item ? "edit" : "add");
    setEditingRTACTag(item?.Tag_Name ?? null);
    setRtacForm({
      Tag_Name: item?.Tag_Name || "",
      Gardu_Induk: item?.Gardu_Induk || "",
      Bay_Target: item?.Bay_Target || "",
      Skema: selectedSkema.skema,
      Tahap: item?.Tahap || "",
    });
  };

  const closeDetailForm = () => {
    if (detailSaving) return;
    setDetailForm(null);
    setEditingMTNo(null);
    setEditingReleNo(null);
    setEditingRTACTag(null);
    setDetailDeviceNo("");
    setDetailJenis("");
    setDeviceSearch("");
    setRtacForm({ Tag_Name: "", Gardu_Induk: "", Bay_Target: "", Skema: "", Tahap: "" });
  };

  const selectDevice = (item: DeviceProsis) => {
    setDetailDeviceNo(item.no);
    setDeviceSearch(item.tag_name || item.keterangan || `${item.no}`);
    setDetailJenis(deviceMode === "mt" ? item.jenis || "" : "");
    setShowDeviceDropdown(false);
  };

  const submitDetailForm = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!isAdmin || !selectedSkema || !detailForm) return;

    try {
      setDetailSaving(true);

      if (deviceMode === "mt" || deviceMode === "rele") {
        if (detailDeviceNo === "") return alert("Perangkat wajib dipilih.");
        const payload: Record<string, unknown> = { no: detailDeviceNo };
        if (deviceMode === "mt") payload.jenis = detailJenis.trim() || null;

        const base = `/skema/${selectedSkema.id_skema}/${deviceMode}`;
        if (detailForm === "add") {
          await api.post(base, payload);
          alert(`${deviceMode.toUpperCase()} berhasil ditambahkan.`);
        } else {
          const oldNo = deviceMode === "mt" ? editingMTNo : editingReleNo;
          if (oldNo === null) throw new Error("ID detail tidak ditemukan.");
          await api.put(`${base}/${oldNo}`, payload);
          alert(`${deviceMode.toUpperCase()} berhasil diperbarui.`);
        }

        closeDetailForm();
        if (deviceMode === "mt") await loadMT(selectedSkema.id_skema);
        else await loadRele(selectedSkema.id_skema);
        return;
      }

      if (!rtacForm.Tag_Name.trim() || !rtacForm.Gardu_Induk.trim() || !rtacForm.Bay_Target.trim() || !rtacForm.Tahap.trim()) {
        return alert("Tag Name, Gardu Induk, Bay Target, dan Tahap wajib diisi.");
      }

      const payload = {
        Tag_Name: rtacForm.Tag_Name.trim(),
        Gardu_Induk: rtacForm.Gardu_Induk.trim(),
        Bay_Target: rtacForm.Bay_Target.trim(),
        Skema: selectedSkema.skema,
        Tahap: rtacForm.Tahap.trim(),
      };

      if (detailForm === "add") {
        await api.post("/skema/rtac", payload);
        alert("RTAC berhasil ditambahkan.");
      } else {
        if (!editingRTACTag) throw new Error("Tag Name lama tidak ditemukan.");
        await api.put(`/skema/rtac/${encodeURIComponent(editingRTACTag)}`, payload);
        alert("RTAC berhasil diperbarui.");
      }

      closeDetailForm();
      await loadRTAC(selectedSkema.skema);
    } catch (err: any) {
      console.error("Gagal menyimpan detail SKEMA:", err);
      alert(err?.response?.data?.message || err?.message || "Gagal menyimpan detail.");
    } finally {
      setDetailSaving(false);
    }
  };

  const deleteMT = async (item: SkemaMT) => {
    if (!selectedSkema || !isAdmin) return;
    if (!window.confirm(`Hapus MT No ${item.no} - ${item.gi || "GI tidak diketahui"}?`)) return;
    try {
      await api.delete(`/skema/${selectedSkema.id_skema}/mt/${item.no}`);
      await loadMT(selectedSkema.id_skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus MT.");
    }
  };

  const deleteRele = async (item: SkemaRele) => {
    if (!selectedSkema || !isAdmin) return;
    if (!window.confirm(`Hapus RELE No ${item.no} - ${item.gi || "GI tidak diketahui"}?`)) return;
    try {
      await api.delete(`/skema/${selectedSkema.id_skema}/rele/${item.no}`);
      await loadRele(selectedSkema.id_skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus RELE.");
    }
  };

  const deleteRTAC = async (item: SkemaRTAC) => {
    if (!isAdmin || !selectedSkema || !item.Tag_Name) return;
    if (!window.confirm(`Hapus RTAC "${item.Tag_Name}"?`)) return;
    try {
      await api.delete(`/skema/rtac/${encodeURIComponent(item.Tag_Name)}`);
      await loadRTAC(selectedSkema.skema);
    } catch (err: any) {
      alert(err?.response?.data?.message || "Gagal menghapus RTAC.");
    }
  };

  const getStatusLabel = (value: number | null) => {
    if (value === 1) return "Aktif";
    if (value === 0) return "Tidak Aktif";
    return "Belum Ditentukan";
  };

  const getStatusStyle = (value: number | null) => {
    if (value === 1) return "bg-green-100 text-green-700";
    if (value === 0) return "bg-red-100 text-red-700";
    return "bg-gray-100 text-gray-600";
  };

  const pageNumbers = useMemo(() => {
    if (!pagination) return [];
    const totalPages = pagination.totalPages;
    const currentPage = pagination.page;
    const maxVisible = 7;
    if (totalPages <= maxVisible) return Array.from({ length: totalPages }, (_, i) => i + 1);
    let start = Math.max(1, currentPage - 3);
    let end = Math.min(totalPages, currentPage + 3);
    if (currentPage <= 3) {
      start = 1;
      end = 7;
    }
    if (currentPage >= totalPages - 2) {
      start = totalPages - 6;
      end = totalPages;
    }
    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  }, [pagination]);

  return (
    <div className="min-h-full bg-gray-50 p-6 md:p-8">
      <style>{`
        @keyframes fadeInDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .fasop-fade-down { animation: fadeInDown 0.45s ease-out both; }
        .fasop-fade-up { animation: fadeInUp 0.5s ease-out both; }
        .fasop-row { transition: background-color 0.2s ease, transform 0.2s ease, box-shadow 0.2s ease; }
        .fasop-row:hover { transform: translateY(-1px); box-shadow: inset 3px 0 0 rgb(37 99 235 / 0.7); }
        @media (prefers-reduced-motion: reduce) { .fasop-fade-down, .fasop-fade-up, .fasop-row { animation: none !important; transition: none !important; } }
      `}</style>

      <div className="fasop-fade-down mb-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Data SKEMA</h1>
          <p className="mt-1 text-sm text-gray-500">Kelola skema, subsistem, MT, RELE, dan RTAC.</p>
        </div>
        {isAdmin && (
          <button onClick={openAddForm} className="rounded-lg bg-blue-700 px-5 py-3 font-semibold text-white hover:bg-blue-800">
            + Tambah Skema
          </button>
        )}
      </div>

      {error && <div className="mb-5 rounded-lg bg-red-100 p-4 text-sm text-red-700">{error}</div>}

      <div className="mb-6 flex flex-col gap-3 md:flex-row">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="Cari ID, nama skema, atau subsistem..."
          className="w-full max-w-xl rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
        />
        <button onClick={handleSearch} className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Cari</button>
        <button onClick={handleResetSearch} className="rounded-lg border bg-white px-5 py-3 font-semibold text-gray-700 hover:bg-gray-50">Reset</button>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1.6fr_1fr]">
        <div className="min-w-0">
          <div className="overflow-hidden rounded-xl bg-white shadow-sm">
            <div className="border-b p-5">
              <h2 className="text-lg font-bold text-gray-800">Daftar Skema</h2>
              <p className="mt-1 text-sm text-gray-500">Pilih skema untuk melihat detail.</p>
            </div>

            {loading ? (
              <div className="p-10 text-center text-gray-500">Memuat data SKEMA...</div>
            ) : data.length === 0 ? (
              <div className="p-10 text-center text-gray-500">Tidak ada data SKEMA.</div>
            ) : (
              <div className="w-full overflow-x-auto">
                <table className="w-full table-fixed">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="w-[7%] border-b px-3 py-3 text-left text-xs font-semibold text-gray-600">ID</th>
                      <th className="w-[42%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Skema</th>
                      <th className="w-[21%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Subsistem</th>
                      <th className="w-[14%] border-b px-4 py-3 text-left text-xs font-semibold text-gray-600">Status</th>
                      {isAdmin && <th className="w-[16%] border-b px-3 py-3 text-center text-xs font-semibold text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((item) => (
                      <tr
                        key={item.id_skema}
                        onClick={() => handleSelectSkema(item)}
                        className={`fasop-row cursor-pointer hover:bg-blue-50 ${selectedSkema?.id_skema === item.id_skema ? "bg-blue-50" : ""}`}
                      >
                        <td className="border-b px-3 py-4 text-sm font-medium text-gray-500">{item.id_skema}</td>
                        <td className="border-b px-4 py-4"><p className="font-medium leading-6 text-gray-800">{item.skema}</p></td>
                        <td className="border-b px-4 py-4">
                          {item.subsistem ? <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">{item.subsistem}</span> : <span className="text-sm text-gray-400">-</span>}
                        </td>
                        <td className="border-b px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(item.aktif)}`}>{getStatusLabel(item.aktif)}</span></td>
                        {isAdmin && (
                          <td className="border-b px-3 py-5" onClick={(e) => e.stopPropagation()}>
                            <div className="flex justify-center gap-2">
                              <button onClick={() => openEditForm(item)} className="rounded-lg bg-yellow-50 px-3 py-2 text-xs font-semibold text-yellow-700 hover:bg-yellow-100">Edit</button>
                              <button onClick={() => handleDelete(item)} className="rounded-lg bg-red-50 px-3 py-2 text-xs font-semibold text-red-700 hover:bg-red-100">Hapus</button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {pagination && (
            <div className="mt-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <p className="text-sm text-gray-500">Menampilkan {data.length} dari {pagination.total} skema</p>
              <div className="flex items-center gap-1">
                <button disabled={pagination.page <= 1} onClick={() => loadSkema(pagination.page - 1, search)} className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40">←</button>
                {pageNumbers.map((page) => (
                  <button key={page} onClick={() => loadSkema(page, search)} className={`rounded-lg border px-3 py-2 text-sm ${pagination.page === page ? "border-blue-600 bg-blue-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}>{page}</button>
                ))}
                <button disabled={pagination.page >= pagination.totalPages} onClick={() => loadSkema(pagination.page + 1, search)} className="rounded-lg border bg-white px-3 py-2 text-sm disabled:opacity-40">→</button>
              </div>
            </div>
          )}
        </div>

        <div className="min-w-0">
          <div className="rounded-xl bg-white shadow-sm">
            {!selectedSkema ? (
              <div className="p-10 text-center">
                <div className="mb-3 text-5xl">📌</div>
                <h3 className="font-semibold text-gray-700">Pilih Skema</h3>
                <p className="mt-1 text-sm text-gray-500">Pilih salah satu skema untuk melihat informasi detail.</p>
              </div>
            ) : (
              <>
                <div className="border-b p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">ID Skema</p>
                      <p className="mt-1 text-2xl font-bold text-gray-800">{selectedSkema.id_skema}</p>
                    </div>
                    <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusStyle(selectedSkema.aktif)}`}>{getStatusLabel(selectedSkema.aktif)}</span>
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-gray-800">{selectedSkema.skema}</h2>
                  <p className="mt-1 text-sm text-gray-500">Subsistem: {selectedSkema.subsistem || "-"}</p>
                </div>

                <div className="border-b px-4">
                  <div className="flex gap-1 overflow-x-auto">
                    {[
                      ["info", "Informasi"],
                      ["mt", "MT"],
                      ["rele", "RELE"],
                      ["rtac", "RTAC"],
                    ].map(([id, label]) => (
                      <button key={id} onClick={() => handleTabChange(id as DetailTab)} className={`border-b-2 px-4 py-3 text-sm font-semibold ${activeTab === id ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-5">
                  {activeTab === "info" && (
                    <div className="space-y-4">
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Nama Skema</p><p className="mt-1 font-medium text-gray-800">{selectedSkema.skema}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Subsistem</p><p className="mt-1 font-medium text-gray-800">{selectedSkema.subsistem || "-"}</p></div>
                      <div><p className="text-xs font-semibold uppercase text-gray-400">Status</p><p className="mt-1 font-medium text-gray-800">{getStatusLabel(selectedSkema.aktif)}</p></div>
                    </div>
                  )}

                  {activeTab === "mt" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <div><h3 className="font-bold text-gray-800">Detail MT</h3><p className="text-xs text-gray-500">Perangkat ditampilkan lengkap dari DEVICE_PROSIS.</p></div>
                        {isAdmin && <button onClick={() => openMTForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah MT</button>}
                      </div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail MT...</p> : skemaMT.length === 0 ? <p className="text-sm text-gray-500">Belum ada detail MT untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[900px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">No</th><th className="border-b p-3 text-left text-xs">GI</th><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Jenis</th><th className="border-b p-3 text-left text-xs">Keterangan</th><th className="border-b p-3 text-left text-xs">Merek</th><th className="border-b p-3 text-left text-xs">Tipe</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaMT.map((item) => <tr key={item.no} className="hover:bg-gray-50"><td className="border-b p-3 text-sm">{item.no}</td><td className="border-b p-3 text-sm">{item.gi || "-"}</td><td className="border-b p-3 text-sm break-all">{item.tag_name || "-"}</td><td className="border-b p-3 text-sm">{item.jenis || "-"}</td><td className="border-b p-3 text-sm">{item.keterangan || "-"}</td><td className="border-b p-3 text-sm">{item.merek || "-"}</td><td className="border-b p-3 text-sm">{item.tipe || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openMTForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteMT(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "rele" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-gray-800">Detail RELE</h3><p className="text-xs text-gray-500">Informasi perangkat diperkaya dari DEVICE_PROSIS.</p></div>{isAdmin && <button onClick={() => openReleForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah RELE</button>}</div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail RELE...</p> : skemaRele.length === 0 ? <p className="text-sm text-gray-500">Belum ada detail RELE untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[900px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">No</th><th className="border-b p-3 text-left text-xs">GI</th><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Jenis</th><th className="border-b p-3 text-left text-xs">Keterangan</th><th className="border-b p-3 text-left text-xs">Merek</th><th className="border-b p-3 text-left text-xs">Tipe</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaRele.map((item) => <tr key={item.no} className="hover:bg-gray-50"><td className="border-b p-3 text-sm">{item.no}</td><td className="border-b p-3 text-sm">{item.gi || "-"}</td><td className="border-b p-3 text-sm break-all">{item.tag_name || "-"}</td><td className="border-b p-3 text-sm">{item.jenis || "-"}</td><td className="border-b p-3 text-sm">{item.keterangan || "-"}</td><td className="border-b p-3 text-sm">{item.merek || "-"}</td><td className="border-b p-3 text-sm">{item.tipe || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openReleForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteRele(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === "rtac" && (
                    <div>
                      <div className="mb-4 flex items-center justify-between gap-3"><div><h3 className="font-bold text-gray-800">Detail RTAC</h3><p className="text-xs text-gray-500">Data RTAC terhubung ke nama skema.</p></div>{isAdmin && <button onClick={() => openRTACForm()} className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">+ Tambah RTAC</button>}</div>
                      {detailLoading ? <p className="text-sm text-gray-500">Memuat detail RTAC...</p> : skemaRTAC.length === 0 ? <p className="text-sm text-gray-500">Belum ada data RTAC untuk skema ini.</p> : (
                        <div className="overflow-x-auto">
                          <table className="min-w-[850px] w-full">
                            <thead><tr className="bg-gray-50"><th className="border-b p-3 text-left text-xs">Tag Name</th><th className="border-b p-3 text-left text-xs">Gardu Induk</th><th className="border-b p-3 text-left text-xs">Bay Target</th><th className="border-b p-3 text-left text-xs">Skema</th><th className="border-b p-3 text-left text-xs">Tahap</th>{isAdmin && <th className="border-b p-3 text-center text-xs">Aksi</th>}</tr></thead>
                            <tbody>{skemaRTAC.map((item, index) => <tr key={`${item.Tag_Name}-${index}`} className="hover:bg-gray-50"><td className="border-b p-3 text-sm break-all">{item.Tag_Name || "-"}</td><td className="border-b p-3 text-sm">{item.Gardu_Induk || "-"}</td><td className="border-b p-3 text-sm">{item.Bay_Target || "-"}</td><td className="border-b p-3 text-sm">{item.Skema || "-"}</td><td className="border-b p-3 text-sm">{item.Tahap || "-"}</td>{isAdmin && <td className="border-b p-3 text-center"><div className="flex justify-center gap-2"><button onClick={() => openRTACForm(item)} className="rounded bg-yellow-50 px-3 py-1 text-xs text-yellow-700">Edit</button><button onClick={() => deleteRTAC(item)} className="rounded bg-red-50 px-3 py-1 text-xs text-red-700">Hapus</button></div></td>}</tr>)}</tbody>
                          </table>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">{editingId === null ? "Tambah Skema" : "Edit Skema"}</h2><p className="mt-1 text-sm text-gray-500">Informasi utama skema.</p></div><button type="button" onClick={closeForm} className="text-2xl text-gray-400">×</button></div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div><label className="mb-2 block text-sm font-semibold text-gray-700">Nama Skema</label><input type="text" value={namaSkema} onChange={(e) => setNamaSkema(e.target.value)} placeholder="Contoh: OLS SUTT WONOSARI - PEDAN 1,2" className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" required /></div>
              <div className="relative"><label className="mb-2 block text-sm font-semibold text-gray-700">Subsistem</label><input type="text" value={subsistemSearch} onChange={(e) => handleSubsistemSearch(e.target.value)} onFocus={() => { setShowSubsistemDropdown(true); if (subsistem.length === 0) loadSubsistem(); }} placeholder="Cari dan pilih subsistem..." className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500" />{showSubsistemDropdown && <div className="absolute left-0 right-0 top-full z-[60] mt-1 max-h-56 overflow-y-auto rounded-lg border bg-white shadow-xl">{subsistemLoading ? <div className="p-4 text-sm text-gray-500">Memuat subsistem...</div> : subsistem.length === 0 ? <div className="p-4 text-sm text-gray-500">Subsistem tidak ditemukan.</div> : subsistem.map((item) => <button type="button" key={item.id_ss} onClick={() => selectSubsistem(item)} className="block w-full border-b px-4 py-3 text-left hover:bg-blue-50"><p className="font-medium text-gray-800">{item.subsistem}</p></button>)}</div>}</div>
              <div><label className="mb-2 block text-sm font-semibold text-gray-700">Status</label><select value={aktif} onChange={(e) => setAktif(e.target.value === "" ? "" : Number(e.target.value))} className="w-full rounded-lg border border-gray-300 px-4 py-3"><option value="">Belum Ditentukan</option><option value="1">Aktif</option><option value="0">Tidak Aktif</option></select></div>
              <div className="flex gap-3 pt-2"><button type="button" onClick={closeForm} disabled={saving} className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-600">Batal</button><button type="submit" disabled={saving} className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{saving ? "Menyimpan..." : editingId === null ? "Simpan" : "Simpan Perubahan"}</button></div>
            </form>
          </div>
        </div>
      )}

      {detailForm && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mb-6 flex items-center justify-between"><div><h2 className="text-xl font-bold text-gray-800">{detailForm === "add" ? "Tambah" : "Edit"} {deviceMode === "mt" ? "MT" : deviceMode === "rele" ? "RELE" : "RTAC"}</h2><p className="mt-1 text-sm text-gray-500">Skema: {selectedSkema?.skema}</p></div><button type="button" onClick={closeDetailForm} className="text-2xl text-gray-400">×</button></div>

            <form onSubmit={submitDetailForm} className="space-y-5">
              {deviceMode !== "mt" && deviceMode !== "rele" ? (
                <>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Tag Name</label><input value={rtacForm.Tag_Name} onChange={(e) => setRtacForm((v) => ({ ...v, Tag_Name: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2"><div><label className="mb-2 block text-sm font-semibold text-gray-700">Gardu Induk</label><input value={rtacForm.Gardu_Induk} onChange={(e) => setRtacForm((v) => ({ ...v, Gardu_Induk: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div><div><label className="mb-2 block text-sm font-semibold text-gray-700">Bay Target</label><input value={rtacForm.Bay_Target} onChange={(e) => setRtacForm((v) => ({ ...v, Bay_Target: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div></div>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Skema</label><input value={selectedSkema?.skema || ""} readOnly className="w-full rounded-lg border bg-gray-50 px-4 py-3 text-gray-600" /></div>
                  <div><label className="mb-2 block text-sm font-semibold text-gray-700">Tahap</label><input value={rtacForm.Tahap} onChange={(e) => setRtacForm((v) => ({ ...v, Tahap: e.target.value }))} className="w-full rounded-lg border px-4 py-3" required /></div>
                </>
              ) : (
                <>
                  <div className="relative">
                    <label className="mb-2 block text-sm font-semibold text-gray-700">Pilih Perangkat</label>
                    <input
                      value={deviceSearch}
                      onChange={(e) => { setDeviceSearch(e.target.value); setShowDeviceDropdown(true); }}
                      onFocus={() => setShowDeviceDropdown(true)}
                      placeholder="Cari Tag Name, GI, jenis, keterangan, merek, atau tipe..."
                      className="w-full rounded-lg border px-4 py-3"
                    />
                    {showDeviceDropdown && (
                      <div className="absolute left-0 right-0 top-full z-[80] mt-1 max-h-72 overflow-y-auto rounded-lg border bg-white shadow-xl">
                        {devicesLoading ? <div className="p-4 text-sm text-gray-500">Memuat perangkat...</div> : filteredDevices.length === 0 ? <div className="p-4 text-sm text-gray-500">Perangkat tidak ditemukan.</div> : filteredDevices.map((item) => (
                          <button key={item.no} type="button" onClick={() => selectDevice(item)} className="block w-full border-b px-4 py-3 text-left hover:bg-blue-50">
                            <div className="flex items-start justify-between gap-3"><p className="font-semibold text-gray-800">#{item.no} · {item.gi || "GI -"}</p>{item.jenis && <span className="rounded-full bg-blue-100 px-2 py-1 text-[10px] font-semibold text-blue-700">{item.jenis}</span>}</div>
                            <p className="mt-1 text-xs text-gray-700">{item.tag_name || item.keterangan || "Tanpa Tag Name"}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.keterangan || "Tanpa keterangan"}{item.merek || item.tipe ? ` · ${item.merek || "-"} ${item.tipe || ""}` : ""}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {selectedDevice && (
                    <div className="rounded-xl border bg-gray-50 p-4">
                      <p className="mb-3 text-sm font-bold text-gray-800">Preview Perangkat</p>
                      <div className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2">
                        <div><span className="text-gray-400">No</span><p className="font-medium">{selectedDevice.no}</p></div>
                        <div><span className="text-gray-400">GI</span><p className="font-medium">{selectedDevice.gi || "-"}</p></div>
                        <div><span className="text-gray-400">Tag Name</span><p className="font-medium break-all">{selectedDevice.tag_name || "-"}</p></div>
                        <div><span className="text-gray-400">Jenis</span><p className="font-medium">{selectedDevice.jenis || "-"}</p></div>
                        <div><span className="text-gray-400">Keterangan</span><p className="font-medium">{selectedDevice.keterangan || "-"}</p></div>
                        <div><span className="text-gray-400">Merek / Tipe</span><p className="font-medium">{selectedDevice.merek || "-"} / {selectedDevice.tipe || "-"}</p></div>
                      </div>
                    </div>
                  )}

                  {deviceMode === "mt" && <div><label className="mb-2 block text-sm font-semibold text-gray-700">Jenis MT</label><input value={detailJenis} onChange={(e) => setDetailJenis(e.target.value)} placeholder="Jenis yang disimpan di SKEMA_MT" className="w-full rounded-lg border px-4 py-3" /></div>}
                </>
              )}

              <div className="flex gap-3 pt-2"><button type="button" onClick={closeDetailForm} disabled={detailSaving} className="flex-1 rounded-lg border px-4 py-3 font-semibold text-gray-600">Batal</button><button type="submit" disabled={detailSaving} className="flex-1 rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white disabled:opacity-50">{detailSaving ? "Menyimpan..." : detailForm === "add" ? "Simpan" : "Simpan Perubahan"}</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Skema;