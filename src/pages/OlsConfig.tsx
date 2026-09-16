import { useEffect, useState } from "react";
import api from "../../api/axios";
import {
    Pencil,
    Trash2,
    X,
    Save,
    AlertTriangle,
} from "lucide-react";

interface OlsConfigProps {
    data: any[];
}

interface FormData {
    nama: string;
    gi: string;
    target: string;
    tahap: string;
    tag_name: string;
    device: string;
}

export default function OlsConfig({ data }: OlsConfigProps) {
    const [items, setItems] = useState<any[]>(data || []);

    const [isEditOpen, setIsEditOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);

    const [selectedItem, setSelectedItem] = useState<any | null>(null);

    const [loading, setLoading] = useState(false);

    const [form, setForm] = useState<FormData>({
        nama: "",
        gi: "",
        target: "",
        tahap: "",
        tag_name: "",
        device: "",
    });

    // ======================================================
    // UPDATE DATA DARI PARENT
    // ======================================================

    useEffect(() => {
        setItems(data || []);
    }, [data]);

    // ======================================================
    // GET VALUE
    // ======================================================

    const getValue = (
        item: any,
        keys: string[],
        fallback = "-"
    ) => {
        for (const key of keys) {
            if (
                item?.[key] !== undefined &&
                item?.[key] !== null &&
                item?.[key] !== ""
            ) {
                return String(item[key]);
            }
        }

        return fallback;
    };

    // ======================================================
    // EDIT
    // ======================================================

    const handleEdit = (item: any) => {
        setSelectedItem(item);

        setForm({
            nama: getValue(
                item,
                ["nama", "nama_ols", "skema", "name", "nama_skema"],
                ""
            ),

            gi: getValue(
                item,
                ["gi", "nama_gi", "gardu_induk"],
                ""
            ),

            target: getValue(
                item,
                ["target", "trafo", "nama_target"],
                ""
            ),

            tahap: getValue(
                item,
                ["tahap", "stage", "step"],
                ""
            ),

            tag_name: getValue(
                item,
                ["tag_name", "tagName", "tag"],
                ""
            ),

            device: getValue(
                item,
                ["device", "nama_device"],
                ""
            ),
        });

        setIsEditOpen(true);
    };

    // ======================================================
    // SAVE EDIT
    // ======================================================

    const handleSave = async () => {
        if (!selectedItem) return;

        const id = getValue(
            selectedItem,
            ["id", "ID", "ols_id", "id_ols"],
            ""
        );

        if (!id) {
            alert("ID data OLS tidak ditemukan.");
            console.log("Data yang dipilih:", selectedItem);
            return;
        }

        setLoading(true);

        try {
            await api.put(`/ols/config/${id}`, {
                nama: form.nama,
                gi: form.gi,
                target: form.target,
                tahap: form.tahap,
                tag_name: form.tag_name,
                device: form.device,
            });

            setItems((prev) =>
                prev.map((item) => {
                    const itemId = getValue(
                        item,
                        ["id", "ID", "ols_id", "id_ols"],
                        ""
                    );

                    if (String(itemId) !== String(id)) {
                        return item;
                    }

                    return {
                        ...item,
                        nama: form.nama,
                        nama_ols: form.nama,
                        skema: form.nama,

                        gi: form.gi,
                        nama_gi: form.gi,
                        gardu_induk: form.gi,

                        target: form.target,
                        trafo: form.target,
                        nama_target: form.target,

                        tahap: form.tahap,
                        stage: form.tahap,
                        step: form.tahap,

                        tag_name: form.tag_name,
                        tagName: form.tag_name,
                        tag: form.tag_name,

                        device: form.device,
                        nama_device: form.device,
                    };
                })
            );

            setIsEditOpen(false);
            setSelectedItem(null);

            alert("Data OLS berhasil diperbarui.");
        } catch (error: any) {
            console.error("Gagal update OLS:", error);
            console.error("Response:", error?.response?.data);

            alert(
                error?.response?.data?.message ||
                "Gagal memperbarui data OLS. Periksa endpoint API."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // DELETE
    // ======================================================

    const openDelete = (item: any) => {
        setSelectedItem(item);
        setIsDeleteOpen(true);
    };

    const handleDelete = async () => {
        if (!selectedItem) return;

        const id = getValue(
            selectedItem,
            ["id", "ID", "ols_id", "id_ols"],
            ""
        );

        if (!id) {
            alert("ID data OLS tidak ditemukan.");
            console.log("Data yang dipilih:", selectedItem);
            return;
        }

        setLoading(true);

        try {
            await api.delete(`/ols/config/${id}`);

            setItems((prev) =>
                prev.filter((item) => {
                    const itemId = getValue(
                        item,
                        ["id", "ID", "ols_id", "id_ols"],
                        ""
                    );

                    return String(itemId) !== String(id);
                })
            );

            setIsDeleteOpen(false);
            setSelectedItem(null);

            alert("Data OLS berhasil dihapus.");
        } catch (error: any) {
            console.error("Gagal menghapus OLS:", error);
            console.error("Response:", error?.response?.data);

            alert(
                error?.response?.data?.message ||
                "Gagal menghapus data OLS. Periksa endpoint API."
            );
        } finally {
            setLoading(false);
        }
    };

    // ======================================================
    // EMPTY DATA
    // ======================================================

    if (!items || items.length === 0) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <p className="text-sm font-semibold text-slate-400">
                        Tidak ada konfigurasi OLS
                    </p>
                </div>
            </div>
        );
    }

    // ======================================================
    // TABLE
    // ======================================================

    return (
        <>
            <div className="h-full w-full overflow-auto">

                <table className="w-full min-w-[1200px] border-collapse">

                    {/* HEADER */}
                    <thead className="sticky top-0 z-20 bg-slate-50">

                        <tr className="border-b border-slate-200">

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                ID / SKEMA
                            </th>

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                GI / TARGET
                            </th>

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                TAHAP
                            </th>

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                TAG NAME
                            </th>

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                DEVICE
                            </th>

                            {/* AKSI */}
                            <th className="w-[140px] px-6 py-5 text-center text-sm font-bold text-slate-600">
                                AKSI
                            </th>

                        </tr>

                    </thead>

                    {/* BODY */}
                    <tbody>

                        {items.map((item, index) => {

                            const id = getValue(
                                item,
                                ["id", "ID", "ols_id", "id_ols"],
                                String(index + 1)
                            );

                            const nama = getValue(
                                item,
                                [
                                    "nama",
                                    "nama_ols",
                                    "skema",
                                    "name",
                                    "nama_skema",
                                ],
                                "OLS"
                            );

                            const gi = getValue(
                                item,
                                [
                                    "gi",
                                    "nama_gi",
                                    "gardu_induk",
                                ]
                            );

                            const target = getValue(
                                item,
                                [
                                    "target",
                                    "trafo",
                                    "nama_target",
                                ]
                            );

                            const tahap = getValue(
                                item,
                                [
                                    "tahap",
                                    "stage",
                                    "step",
                                ],
                                "1"
                            );

                            const tagName = getValue(
                                item,
                                [
                                    "tag_name",
                                    "tagName",
                                    "tag",
                                ]
                            );

                            const device = getValue(
                                item,
                                [
                                    "device",
                                    "nama_device",
                                ]
                            );

                            return (
                                <tr
                                    key={`${id}-${index}`}
                                    className="border-b border-slate-100 transition-colors hover:bg-blue-50/40"
                                >

                                    {/* ID / SKEMA */}
                                    <td className="px-8 py-6">

                                        <p className="font-bold text-slate-900">
                                            {nama}
                                        </p>

                                        <p className="mt-1 font-mono text-xs text-slate-400">
                                            ID: {id}
                                        </p>

                                    </td>

                                    {/* GI / TARGET */}
                                    <td className="px-8 py-6">

                                        <p className="font-medium text-slate-800">
                                            {gi}
                                        </p>

                                        <p className="mt-1 text-sm text-slate-500">
                                            {target}
                                        </p>

                                    </td>

                                    {/* TAHAP */}
                                    <td className="px-8 py-6">

                                        <span className="inline-flex min-w-8 items-center justify-center rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-sm font-semibold text-slate-700">
                                            {tahap}
                                        </span>

                                    </td>

                                    {/* TAG */}
                                    <td className="px-8 py-6">

                                        <span className="font-mono text-sm text-slate-600">
                                            {tagName}
                                        </span>

                                    </td>

                                    {/* DEVICE */}
                                    <td className="px-8 py-6">

                                        <span className="text-sm text-slate-700">
                                            {device}
                                        </span>

                                    </td>

                                    {/* ==================================================
                                        AKSI EDIT + DELETE
                                    ================================================== */}

                                    <td className="w-[140px] px-6 py-6">

                                        <div className="flex items-center justify-center gap-2">

                                            {/* EDIT */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEdit(item);
                                                }}
                                                title="Edit konfigurasi"
                                                aria-label="Edit konfigurasi"
                                                className="
                                                    flex h-9 w-9
                                                    items-center justify-center
                                                    rounded-lg
                                                    border border-blue-200
                                                    bg-blue-50
                                                    text-blue-600
                                                    shadow-sm
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:bg-blue-100
                                                    hover:text-blue-700
                                                "
                                            >
                                                <Pencil
                                                    className="h-4 w-4"
                                                    strokeWidth={2.5}
                                                />
                                            </button>

                                            {/* DELETE */}
                                            <button
                                                type="button"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    openDelete(item);
                                                }}
                                                title="Hapus konfigurasi"
                                                aria-label="Hapus konfigurasi"
                                                className="
                                                    flex h-9 w-9
                                                    items-center justify-center
                                                    rounded-lg
                                                    border border-red-200
                                                    bg-red-50
                                                    text-red-600
                                                    shadow-sm
                                                    transition-all
                                                    hover:-translate-y-0.5
                                                    hover:bg-red-100
                                                    hover:text-red-700
                                                "
                                            >
                                                <Trash2
                                                    className="h-4 w-4"
                                                    strokeWidth={2.5}
                                                />
                                            </button>

                                        </div>

                                    </td>

                                </tr>
                            );
                        })}

                    </tbody>

                </table>

            </div>

            {/* ==================================================
                MODAL EDIT
            ================================================== */}

            {isEditOpen && selectedItem && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">

                    <div className="w-full max-w-xl rounded-2xl bg-white p-7 shadow-2xl">

                        <div className="mb-6 flex items-center justify-between">

                            <div>
                                <h2 className="text-xl font-bold text-slate-900">
                                    Edit Konfigurasi OLS
                                </h2>

                                <p className="mt-1 text-sm text-slate-500">
                                    Ubah data konfigurasi OLS.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedItem(null);
                                }}
                                className="flex h-9 w-9 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                            >
                                <X className="h-5 w-5" />
                            </button>

                        </div>

                        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                            <FormInput
                                label="Nama / Skema"
                                value={form.nama}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        nama: value,
                                    })
                                }
                            />

                            <FormInput
                                label="GI"
                                value={form.gi}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        gi: value,
                                    })
                                }
                            />

                            <FormInput
                                label="Target"
                                value={form.target}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        target: value,
                                    })
                                }
                            />

                            <FormInput
                                label="Tahap"
                                value={form.tahap}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        tahap: value,
                                    })
                                }
                            />

                            <FormInput
                                label="Tag Name"
                                value={form.tag_name}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        tag_name: value,
                                    })
                                }
                            />

                            <FormInput
                                label="Device"
                                value={form.device}
                                onChange={(value) =>
                                    setForm({
                                        ...form,
                                        device: value,
                                    })
                                }
                            />

                        </div>

                        <div className="mt-7 flex justify-end gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setIsEditOpen(false);
                                    setSelectedItem(null);
                                }}
                                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                            >

                                <Save className="h-4 w-4" />

                                {loading
                                    ? "Menyimpan..."
                                    : "Simpan"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

            {/* ==================================================
                MODAL DELETE
            ================================================== */}

            {isDeleteOpen && selectedItem && (

                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 p-6 backdrop-blur-sm">

                    <div className="w-full max-w-md rounded-2xl bg-white p-7 text-center shadow-2xl">

                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">

                            <AlertTriangle className="h-7 w-7" />

                        </div>

                        <h2 className="mt-5 text-xl font-bold text-slate-900">
                            Hapus Data OLS?
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">

                            Data{" "}

                            <span className="font-semibold text-slate-700">

                                {getValue(
                                    selectedItem,
                                    [
                                        "nama",
                                        "nama_ols",
                                        "skema",
                                        "name",
                                    ],
                                    "OLS"
                                )}

                            </span>

                            {" "}akan dihapus dari sistem.

                        </p>

                        <div className="mt-7 flex justify-center gap-3">

                            <button
                                type="button"
                                onClick={() => {
                                    setIsDeleteOpen(false);
                                    setSelectedItem(null);
                                }}
                                className="rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
                            >
                                Batal
                            </button>

                            <button
                                type="button"
                                onClick={handleDelete}
                                disabled={loading}
                                className="flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                            >

                                <Trash2 className="h-4 w-4" />

                                {loading
                                    ? "Menghapus..."
                                    : "Hapus"}

                            </button>

                        </div>

                    </div>

                </div>

            )}

        </>
    );
}

// ======================================================
// FORM INPUT
// ======================================================

function FormInput({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) {
    return (
        <div>

            <label className="mb-2 block text-xs font-semibold text-slate-600">
                {label}
            </label>

            <input
                type="text"
                value={value}
                onChange={(e) =>
                    onChange(e.target.value)
                }
                className="
                    w-full
                    rounded-lg
                    border border-slate-200
                    bg-white
                    px-3.5 py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition-all
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-500/10
                "
            />

        </div>
    );
}