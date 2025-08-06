'use client';

import PublicHomeTabButton from "./_components/tab-button";
import PublicHomeTabContainer from "./_components/tab-container";


export default function Home() {

  return (
    <>
      <section className="px-4 py-6 border-b-2 border-gray-200 border-dashed">
        <h5 className="font-semibold">Selemat Datang di</h5>
        <h1 className="text-2xl font-bold">Arsip Publik Laznas Al Irsyad</h1>
        <p className="max-w-xl mt-2">
          Platform ini memungkinkan pencarian dan akses mudah terhadap berbagai dokumen organisasi secara terpusat dan aman.
        </p>
      </section>
      <section className="p-4 border-b-2 border-gray-200 border-dashed sticky top-20 z-20 bg-white">
        <PublicHomeTabButton />
      </section>
      <PublicHomeTabContainer />
    </>
  );
}
