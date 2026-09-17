import { useEffect, useState } from "react";
import api from "../../api/axios";

import {
    Pencil,
    Trash2,
    X,
    Save,
    AlertTriangle,
    RefreshCw,
} from "lucide-react";


interface OlsStatusProps {
    data: any[];
}

export default function OlsStatus({
    data,
}: OlsStatusProps) {

    const [items, setItems] = useState<any[]>(data || []);

    const [selectedItem, setSelectedItem] =
        useState<any | null>(null);

    const [isEditOpen, setIsEditOpen] =
        useState(false);

    const [isDeleteOpen, setIsDeleteOpen] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [editForm, setEditForm] = useState({
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

        setEditForm({
            nama: getValue(
                item,
                [
                    "nama",
                    "nama_ols",
                    "skema",
                    "name",
                    "nama_skema",
                ],
                ""
            ),

            gi: getValue(
                item,
                [
                    "gi",
                    "nama_gi",
                    "gardu_induk",
                ],
                ""
            ),

            target: getValue(
                item,
                [
                    "target",
                    "trafo",
                    "nama_target",
                ],
                ""
            ),

            tahap: getValue(
                item,
                [
                    "tahap",
                    "stage",
                    "step",
                ],
                ""
            ),

            tag_name: getValue(
                item,
                [
                    "tag_name",
                    "tagName",
                    "tag",
                ],
                ""
            ),

            device: getValue(
                item,
                [
                    "device",
                    "nama_device",
                ],
                ""
            ),
        });

        setIsEditOpen(true);
    };

    // ======================================================
    // SAVE EDIT
    // ======================================================

    const handleSaveEdit = async () => {

        if (!selectedItem) return;

        const id = getValue(
          selectedItem,
    [
        "id_sw",
        "id",
        "ID",
        "ols_id",
        "id_ols",
    ],
    ""
    );

        if (!id) {
            alert("ID data OLS tidak ditemukan.");
            return;
        }

        setLoading(true);

        try {

            await api.put(
            `/ols/${id}`,
                {
                    nama: editForm.nama,
                    gi: editForm.gi,
                    target: editForm.target,
                    tahap: editForm.tahap,
                    tag_name: editForm.tag_name,
                    device: editForm.device,
                }
            );

            // Update tampilan tanpa mengubah data lainnya
            setItems((prev) =>
                prev.map((item) => {

                    const itemId = getValue(
                        item,
                        [
                            "id",
                            "ID",
                            "ols_id",
                            "id_ols",
                        ],
                        ""
                    );

                    if (
                        String(itemId) !==
                        String(id)
                    ) {
                        return item;
                    }

                    return {
                        ...item,

                        nama: editForm.nama,
                        nama_ols: editForm.nama,
                        skema: editForm.nama,
                        nama_skema: editForm.nama,

                        gi: editForm.gi,
                        nama_gi: editForm.gi,
                        gardu_induk:
                            editForm.gi,

                        target:
                            editForm.target,
                        trafo:
                            editForm.target,
                        nama_target:
                            editForm.target,

                        tahap:
                            editForm.tahap,
                        stage:
                            editForm.tahap,
                        step:
                            editForm.tahap,

                        tag_name:
                            editForm.tag_name,
                        tagName:
                            editForm.tag_name,
                        tag:
                            editForm.tag_name,

                        device:
                            editForm.device,
                        nama_device:
                            editForm.device,
                    };
                })
            );

            setIsEditOpen(false);
            setSelectedItem(null);

            alert(
                "Data OLS berhasil diperbarui."
            );

        } catch (error: any) {

            console.error(
                "Gagal mengedit data OLS:",
                error
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            alert(
                error?.response?.data?.message ||
                "Data gagal diperbarui."
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
    [
        "id_sw",
        "id",
        "ID",
        "ols_id",
        "id_ols",
    ],
    ""
);

        if (!id) {

            alert(
                "ID data OLS tidak ditemukan."
            );

            return;
        }

        setLoading(true);

        try {

            await api.delete(
                `/ols/config/${id}`
            );

            setItems((prev) =>
                prev.filter((item) => {

                    const id =
                getValue(
                item,
                [
                  "id_sw",
                  "id",
                  "ID",
                  "ols_id",
                   "id_ols",
                  ],
                String(index + 1)
             );

                    return (
                        String(itemId) !==
                        String(id)
                    );

                })
            );

            setIsDeleteOpen(false);
            setSelectedItem(null);

            alert(
                "Data OLS berhasil dihapus."
            );

        } catch (error: any) {

            console.error(
                "Gagal menghapus data OLS:",
                error
            );

            console.error(
                "Response:",
                error?.response?.data
            );

            alert(
                error?.response?.data?.message ||
                "Data gagal dihapus."
            );

        } finally {

            setLoading(false);

        }
    };

    // ======================================================
    // EMPTY
    // ======================================================

    if (
        !items ||
        items.length === 0
    ) {

        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center text-slate-400">
                    <p className="text-sm font-medium">
                        Tidak ada data OLS
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

            <div className="h-full overflow-auto">

                <table className="w-full min-w-[1550px] border-collapse">

                    {/* HEADER */}

                    <thead className="sticky top-0 z-30 bg-slate-50">

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

                            <th className="px-8 py-5 text-left text-sm font-bold text-slate-600">
                                STATUS
                            </th>

                            <th className="px-8 py-5 text-center text-sm font-bold text-slate-600">
                                 ACTIONS
                            </th>

                            <th className="px-6 py-5 text-left text-sm font-bold text-slate-600">
                                UPDATE TERAKHIR
                            </th>
                        </tr>

                    </thead>

                    {/* BODY */}

                    <tbody>

                        {items.map(
                            (item, index) => {

                                const id =
                                    getValue(
                                        item,
                                        [
                                            "id",
                                            "ID",
                                            "ols_id",
                                            "id_ols",
                                        ],
                                        String(index + 1)
                                    );

                                const nama =
                                    getValue(
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

                                const gi =
                                    getValue(
                                        item,
                                        [
                                            "gi",
                                            "nama_gi",
                                            "gardu_induk",
                                        ]
                                    );

                                const target =
                                    getValue(
                                        item,
                                        [
                                            "target",
                                            "trafo",
                                            "nama_target",
                                        ]
                                    );

                                const tahap =
                                    getValue(
                                        item,
                                        [
                                            "tahap",
                                            "stage",
                                            "step",
                                        ],
                                        "1"
                                    );

                                const tagName =
                                    getValue(
                                        item,
                                        [
                                            "tag_name",
                                            "tagName",
                                            "tag",
                                        ]
                                    );

                                const device =
                                    getValue(
                                        item,
                                        [
                                            "device",
                                            "nama_device",
                                        ]
                                    );

                                const status =
                                    getValue(
                                        item,
                                        [
                                            "status",
                                            "status_ols",
                                        ],
                                        "Unknown"
                                    );

                                const isNormal =
                                    String(status)
                                        .toLowerCase() ===
                                    "normal";

                                return (

                                    <tr
                                        key={`${String(id)}-${index}`}
                                        className="
                                            group
                                            border-b
                                            border-slate-100
                                            transition-all
                                            duration-200
                                            hover:bg-blue-50/50
                                        "
                                    >

                                        {/* ID / SKEMA */}

                                        <td className="px-8 py-6">

                                            <p className="
                                                text-base
                                                font-bold
                                                text-slate-900
                                            ">
                                                {nama}
                                            </p>

                                            <p className="
                                                mt-1
                                                font-mono
                                                text-sm
                                                text-slate-500
                                            ">
                                                ID: {id}
                                            </p>

                                        </td>

                                        {/* GI / TARGET */}

                                        <td className="px-8 py-6">

                                            <p className="
                                                text-base
                                                font-medium
                                                text-slate-800
                                            ">
                                                {gi}
                                            </p>

                                            <p className="
                                                mt-1
                                                text-sm
                                                text-slate-500
                                            ">
                                                {target}
                                            </p>

                                        </td>

                                        {/* TAHAP */}

                                        <td className="px-8 py-6">

                                            <span className="
                                                inline-flex
                                                h-8
                                                min-w-8
                                                items-center
                                                justify-center
                                                rounded-md
                                                border
                                                border-slate-200
                                                bg-slate-50
                                                px-2
                                                text-sm
                                                font-semibold
                                                text-slate-700
                                            ">
                                                {tahap}
                                            </span>

                                        </td>

                                        {/* TAG NAME */}

                                        <td className="px-8 py-6">

                                            <span className="
                                                font-mono
                                                text-sm
                                                text-slate-600
                                            ">
                                                {tagName}
                                            </span>

                                        </td>

                                        {/* DEVICE */}

                                        <td className="px-8 py-6">

                                            <span className="
                                                text-base
                                                text-slate-700
                                            ">
                                                {device}
                                            </span>

                                        </td>

                                        {/* STATUS + ACTION */}

                                        <td className="px-8 py-6">

                                            <div className="
                                                flex
                                                items-center
                                                gap-4
                                            ">
 
                                                {/* STATUS */}

                                                <span
                                                    className={`
                                                        inline-flex
                                                        items-center
                                                        gap-2
                                                        rounded-full
                                                        border
                                                        px-3
                                                        py-1
                                                        text-sm
                                                        font-semibold

                                                        ${
                                                            isNormal
                                                                ? `
                                                                    border-emerald-200
                                                                    bg-emerald-50
                                                                    text-emerald-600
                                                                `
                                                                : `
                                                                    border-red-200
                                                                    bg-red-50
                                                                    text-red-600
                                                                `
                                                        }
                                                    `}
                                                >

                                                    <span
                                                        className={`
                                                            h-2
                                                            w-2
                                                            rounded-full

                                                            ${
                                                                isNormal
                                                                    ? "bg-emerald-500"
                                                                    : "bg-red-500"
                                                            }
                                                        `}
                                                    />

                                                    {status}

                                                </span>

                                                {/* ACTION */}

                                                <div className="
                                                 flex
                                                    items-center
                                                    gap-2
                                                    ">

                                                    {/* EDIT */}

                                                    <button
                                                        type="button"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleEdit(item);
                                                        }}
                                                        title="Edit"
                                                        aria-label="Edit"
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-blue-200
                                                            bg-white
                                                            text-blue-500
                                                            shadow-sm
                                                            transition-all
                                                            duration-200
                                                            hover:-translate-y-0.5
                                                            hover:border-blue-400
                                                            hover:bg-blue-50
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
                                                        title="Hapus"
                                                        aria-label="Hapus"
                                                        className="
                                                            flex
                                                            h-9
                                                            w-9
                                                            items-center
                                                            justify-center
                                                            rounded-lg
                                                            border
                                                            border-red-200
                                                            bg-white
                                                            text-red-500
                                                            shadow-sm
                                                            transition-all
                                                            duration-200
                                                            hover:-translate-y-0.5
                                                            hover:border-red-400
                                                            hover:bg-red-50
                                                            hover:text-red-700
                                                        "
                                                    >

                                                        <Trash2
                                                            className="h-4 w-4"
                                                            strokeWidth={2.5}
                                                        />

                                                    </button>

                                                </div>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>

            {/* ==================================================
                MODAL EDIT
            ================================================== */}

            {isEditOpen &&
                selectedItem && (

                    <div className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-slate-900/40
                        p-6
                        backdrop-blur-sm
                    ">

                        <div className="
                            w-full
                            max-w-xl
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            shadow-2xl
                            animate-in
                            fade-in
                            zoom-in-95
                            duration-300
                        ">

                            {/* HEADER */}

                            <div className="
                                mb-6
                                flex
                                items-center
                                justify-between
                            ">

                                <div>

                                    <h2 className="
                                        text-xl
                                        font-bold
                                        text-slate-900
                                    ">
                                        Edit Data OLS
                                    </h2>

                                    <p className="
                                        mt-1
                                        text-sm
                                        text-slate-500
                                    ">
                                        Perbarui informasi konfigurasi OLS.
                                    </p>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setSelectedItem(null);
                                    }}
                                    className="
                                        flex
                                        h-9
                                        w-9
                                        items-center
                                        justify-center
                                        rounded-full
                                        text-slate-400
                                        transition-all
                                        duration-200
                                        hover:bg-slate-100
                                        hover:text-slate-700
                                    "
                                >

                                    <X className="h-5 w-5" />

                                </button>

                            </div>

                            {/* FORM */}

                            <div className="
                                grid
                                grid-cols-1
                                gap-4
                                md:grid-cols-2
                            ">

                                <Input
                                    label="Nama / Skema"
                                    value={editForm.nama}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            nama: value,
                                        }))
                                    }
                                />

                                <Input
                                    label="GI"
                                    value={editForm.gi}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            gi: value,
                                        }))
                                    }
                                />

                                <Input
                                    label="Target"
                                    value={editForm.target}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            target: value,
                                        }))
                                    }
                                />

                                <Input
                                    label="Tahap"
                                    value={editForm.tahap}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            tahap: value,
                                        }))
                                    }
                                />

                                <Input
                                    label="Tag Name"
                                    value={editForm.tag_name}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            tag_name: value,
                                        }))
                                    }
                                />

                                <Input
                                    label="Device"
                                    value={editForm.device}
                                    onChange={(value) =>
                                        setEditForm((prev) => ({
                                            ...prev,
                                            device: value,
                                        }))
                                    }
                                />

                            </div>

                            {/* BUTTON */}

                            <div className="
                                mt-7
                                flex
                                justify-end
                                gap-3
                            ">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsEditOpen(false);
                                        setSelectedItem(null);
                                    }}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-200
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        transition-all
                                        duration-200
                                        hover:bg-slate-50
                                    "
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    onClick={handleSaveEdit}
                                    disabled={loading}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-blue-600
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        shadow-sm
                                        transition-all
                                        duration-200
                                        hover:bg-blue-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {loading ? (
                                        <RefreshCw
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    ) : (
                                        <Save className="h-4 w-4" />
                                    )}

                                    {loading
                                        ? "Menyimpan..."
                                        : "Simpan Perubahan"}

                                </button>

                            </div>

                        </div>

                    </div>

                )}

            {/* ==================================================
                MODAL DELETE
            ================================================== */}

            {isDeleteOpen &&
                selectedItem && (

                    <div className="
                        fixed
                        inset-0
                        z-[100]
                        flex
                        items-center
                        justify-center
                        bg-slate-900/40
                        p-6
                        backdrop-blur-sm
                    ">

                        <div className="
                            w-full
                            max-w-md
                            rounded-2xl
                            border
                            border-slate-200
                            bg-white
                            p-7
                            text-center
                            shadow-2xl
                            animate-in
                            fade-in
                            zoom-in-95
                            duration-300
                        ">

                            {/* ICON */}

                            <div className="
                                mx-auto
                                flex
                                h-14
                                w-14
                                items-center
                                justify-center
                                rounded-full
                                bg-red-50
                                text-red-500
                            ">

                                <AlertTriangle
                                    className="h-7 w-7"
                                />

                            </div>

                            {/* TITLE */}

                            <h2 className="
                                mt-5
                                text-xl
                                font-bold
                                text-slate-900
                            ">
                                Hapus Data OLS?
                            </h2>

                            {/* DESCRIPTION */}

                            <p className="
                                mt-2
                                text-sm
                                leading-relaxed
                                text-slate-500
                            ">

                                Data{" "}

                                <span className="
                                    font-semibold
                                    text-slate-700
                                ">

                                    {getValue(
                                        selectedItem,
                                        [
                                            "nama",
                                            "nama_ols",
                                            "skema",
                                            "name",
                                            "nama_skema",
                                        ],
                                        "OLS"
                                    )}

                                </span>{" "}

                                akan dihapus dari sistem.

                            </p>

                            {/* BUTTON */}

                            <div className="
                                mt-7
                                flex
                                justify-center
                                gap-3
                            ">

                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsDeleteOpen(false);
                                        setSelectedItem(null);
                                    }}
                                    className="
                                        rounded-lg
                                        border
                                        border-slate-200
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-slate-600
                                        transition-all
                                        duration-200
                                        hover:bg-slate-50
                                    "
                                >
                                    Batal
                                </button>

                                <button
                                    type="button"
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                        rounded-lg
                                        bg-red-600
                                        px-5
                                        py-2.5
                                        text-sm
                                        font-semibold
                                        text-white
                                        transition-all
                                        duration-200
                                        hover:bg-red-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    {loading ? (
                                        <RefreshCw
                                            className="
                                                h-4
                                                w-4
                                                animate-spin
                                            "
                                        />
                                    ) : (
                                        <Trash2
                                            className="h-4 w-4"
                                        />
                                    )}

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
// INPUT COMPONENT
// ======================================================

function Input({
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

            <label className="
                mb-2
                block
                text-xs
                font-semibold
                text-slate-600
            ">
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
                    border
                    border-slate-200
                    bg-white
                    px-3.5
                    py-2.5
                    text-sm
                    text-slate-800
                    outline-none
                    transition-all
                    duration-200
                    focus:border-blue-400
                    focus:ring-4
                    focus:ring-blue-500/10
                "
            />

        </div>

    );
}