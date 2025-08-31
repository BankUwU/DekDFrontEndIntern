import { useEffect, useState } from "react";
import AddNovelModal from "./AddNovelModal";
import NovelCard from "./NovelCard";

const NovelList = ({ novels: initialNovels }) => {
  const [novels, setNovels] = useState(initialNovels || []);
  const [editMode, setEditMode] = useState(false);
  const [selected, setSelected] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openAdd, setOpenAdd] = useState(false);

  // Load from API so UI = file
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/novels");
        if (res.ok) {
          const data = await res.json();
          setNovels(data.novels || []);
        }
      } catch {}
    };
    load();
  }, []);

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleDelete = async () => {
    if (selected.length === 0) return;
    if (!confirm(`ลบ ${selected.length} รายการ?`)) return;
    setLoading(true);
    try {
      const res = await fetch("/api/novels", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ids: selected }),
      });
      if (!res.ok) throw new Error("Delete failed");
      const data = await res.json();
      setNovels(data.novels || []);
      setSelected([]);
      setEditMode(false);
    } catch {
      alert("ลบไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
  {!editMode ? (
    <>
      {/* Left: เพิ่มนิยาย */}
      <button
        onClick={() => setOpenAdd(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-3 py-1.5 text-sm text-white sm:px-4 sm:py-2 sm:text-base"
      >
        เพิ่มนิยาย
      </button>

      {/* Right: แก้ไข */}
      <button
        onClick={() => setEditMode(true)}
        className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
      >
        แก้ไข
      </button>
    </>
  ) : (
    // (unchanged) edit toolbar already uses justify-between
    <div className="flex w-full items-center justify-between">
      <button
        onClick={() => setEditMode(false)}
        disabled={loading}
        className="rounded-lg border border-gray-300 bg-gray-100 px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base"
      >
        ยกเลิก
      </button>
      <div className="flex items-center gap-2">
        <span className="text-sm sm:text-base">{selected.length} รายการ</span>
        <button
          onClick={handleDelete}
          disabled={loading || selected.length === 0}
          aria-label="Delete selected"
          className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-3 py-1.5 text-sm text-white disabled:cursor-not-allowed disabled:opacity-60 sm:px-4 sm:py-2 sm:text-base"
        >
          {loading ? "กำลังลบ..." : "ลบที่เลือก"}
        </button>
      </div>
    </div>
  )}
</div>

      {/* List */}
      {novels.map((novel) => (
        <NovelCard
          key={novel.id}
          novel={novel}
          isEditing={editMode}
          selected={selected.includes(novel.id)}
          onSelect={toggleSelect}
        />
      ))}

      {/* Add modal */}
      <AddNovelModal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        onAdded={setNovels}
      />
    </div>
  );
};

export default NovelList;
