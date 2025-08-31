// pages/api/novels.js
import fs from "fs/promises";
import path from "path";

const filePath = path.join(process.cwd(), "data", "novels.json");

async function readNovels() {
  const json = await fs.readFile(filePath, "utf8");
  return JSON.parse(json);
}
async function writeNovels(novels) {
  await fs.writeFile(filePath, JSON.stringify(novels, null, 2), "utf8");
}

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const novels = await readNovels();
      return res.status(200).json({ novels });
    } catch (e) {
      return res.status(500).json({ error: "Failed to read novels.json" });
    }
  }

  if (req.method === "POST") {
    try {
      const body = req.body || {};
      // Accept { novel: {...} } or { novels: [...] } or a raw novel object
      const incoming = Array.isArray(body?.novels)
        ? body.novels
        : body?.novel
        ? [body.novel]
        : [body];

      let novels = await readNovels();

      // Ensure unique string id; auto-generate if missing or collided
      const genId = () => String(Date.now() + Math.floor(Math.random() * 1000));

      const cleaned = incoming
        .filter(Boolean)
        .map((n) => {
          const base = {
            id: n.id ? String(n.id) : genId(),
            title: n.title ?? "",
            author: n.author ?? "",
            chapter: n.chapter ?? "",
            date: n.date ?? "",
            cover: n.cover ?? "",
          };
          // If id collides, generate a fresh one
          if (novels.some((x) => String(x.id) === base.id)) {
            base.id = genId();
          }
          return base;
        });

      novels = [...novels, ...cleaned];
      await writeNovels(novels);

      return res.status(200).json({ ok: true, added: cleaned.length, novels });
    } catch (e) {
      return res.status(500).json({ error: "Failed to write novels.json" });
    }
  }

  if (req.method === "DELETE") {
    try {
      const { ids } = req.body || {};
      if (!Array.isArray(ids)) {
        return res.status(400).json({ error: "Body must be { ids: string[] }" });
      }
      const novels = await readNovels();
      const remaining = novels.filter((n) => !ids.includes(String(n.id)));
      await writeNovels(remaining);
      return res.status(200).json({
        ok: true,
        deleted: novels.length - remaining.length,
        novels: remaining,
      });
    } catch (e) {
      return res.status(500).json({ error: "Failed to update novels.json" });
    }
  }

  res.setHeader("Allow", ["GET", "POST", "DELETE"]);
  return res.status(405).end("Method Not Allowed");
}

/*
⚠️ Note:
- This writes to the local filesystem. On serverless hosts (e.g. Vercel), writes are ephemeral.
- For production, consider a database (SQLite, Postgres, etc.).
*/
