import { useEffect, useRef, useState } from "react";
import Modal from "./Modal";

const TEMPLATE = {
  title: "บุตรอนุ",
  author: "ม่านหลังจันทร์",
  chapter: "ตอนที่ 18",
  date: "9 ต.ค. 63 / 22.56 น.",
  cover:
    "https://cdn-local.mebmarket.com/meb/server1/383602/Thumbnail/book_detail_large.gif?2",
};

export default function AddNovelModal({ open, onClose, onAdded }) {
  const [form, setForm] = useState(TEMPLATE);
  const [loading, setLoading] = useState(false);
  const firstInputRef = useRef(null);

  useEffect(() => {
    if (open) {
      // reset or keep previous values as you prefer
      setForm((f) => ({ ...f }));
      // focus first field
      setTimeout(() => firstInputRef.current?.focus(), 0);
    }
  }, [open]);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!form.title?.trim() || !form.author?.trim()) {
      alert("กรอกชื่อเรื่องและผู้เขียนด้วยครับ");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/novels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novel: form }),
      });
      if (!res.ok) throw new Error("Create failed");
      const data = await res.json();
      onAdded?.(data.novels || []);
      onClose?.();
    } catch (err) {
      alert("เพิ่มรายการไม่สำเร็จ ลองใหม่อีกครั้ง");
    } finally {
      setLoading(false);
    }
  };

  const inputCls =
    "w-full rounded-lg border border-gray-300 px-3 py-1.5 text-sm " +
    "sm:py-2 sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500";

  const btnPrimary =
    "rounded-lg bg-green-600 text-white disabled:opacity-70 disabled:cursor-not-allowed " +
    "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base";
  const btnGhost =
    "rounded-lg border border-gray-300 bg-gray-100 " +
    "px-3 py-1.5 text-sm sm:px-4 sm:py-2 sm:text-base";

  return (
    <Modal open={open} onClose={onClose} title="เพิ่มนิยาย">
      <form onSubmit={submit} className="grid gap-2 sm:gap-3">
        <input
          ref={firstInputRef}
          value={form.title}
          onChange={set("title")}
          placeholder="ชื่อเรื่อง"
          className={inputCls}
        />
        <input
          value={form.author}
          onChange={set("author")}
          placeholder="ผู้เขียน"
          className={inputCls}
        />
        <input
          value={form.chapter}
          onChange={set("chapter")}
          placeholder="ตอนที่"
          className={inputCls}
        />
        <input
          value={form.date}
          onChange={set("date")}
          placeholder="วันที่"
          className={inputCls}
        />
        <input
          value={form.cover}
          onChange={set("cover")}
          placeholder="ลิงก์รูปปก (URL)"
          className={inputCls}
        />

        <div className="mt-1 flex gap-2">
          <button type="submit" disabled={loading} className={btnPrimary}>
            {loading ? "กำลังเพิ่ม..." : "เพิ่มนิยาย"}
          </button>
          <button type="button" onClick={() => setForm(TEMPLATE)} className={btnGhost}>
            เติมจากเทมเพลต
          </button>
        </div>
      </form>
    </Modal>
  );
}
