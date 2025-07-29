'use client';

import FormAddDocument from "@/components/layout/admin/form-add-document";
import { getPinataPresignedUrl } from "@/lib/actions";


export default function Home() {



  return (
    <>
      <h1>Hello Madefaker</h1>
      <div className="max-w-2xl p-8 mx-auto mt-10">
        <FormAddDocument />
      </div>
    </>
  );
}
