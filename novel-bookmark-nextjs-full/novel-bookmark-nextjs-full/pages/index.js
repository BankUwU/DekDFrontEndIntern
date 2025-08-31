import Head from "next/head";
import CarouselFullBleed from "../components/CarouselFullBleed"; // <- ชื่อไฟล์คอมโพเนนต์แบนเนอร์ใหม่
import NovelList from "../components/NovelList.jsx";
import novels from "../data/novels.json";

export default function Home() {
  return (
    <>
      <Head>
        <title>Novel Bookmark App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {/* แบนเนอร์เต็มจอ (อยู่นอก container) */}
      <CarouselFullBleed />

      {/* คอนเทนต์ภายในกรอบ */}
      <main className="mx-auto max-w-6xl px-4">
        <h1 className="mt-6 text-2xl font-semibold">รายการที่คั่นไว้</h1>
        <NovelList novels={novels} />
      </main>
    </>
  );
}
