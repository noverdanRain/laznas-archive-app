'use client';

import FormAddDocument from "@/components/layout/admin/form-add-document";
import { getPinataPresignedUrl } from "@/lib/actions";


export default function Home() {


  const handleClick = () => {
    getPinataPresignedUrl({
      fileName: "Coba Mas",
      visibility: "private"
    }).then((url) => {
      console.log("Presigned URL:", url);
    }).catch((err) => {
      console.log("Error Get Presigned: ", err);
    })
  }

  return (
    <>
      <h1>Hello Madefaker</h1>
      <button onClick={handleClick}>Tes</button>
      <div className="max-w-2xl p-8 mx-auto mt-10">
        <FormAddDocument />
      </div>
    </>
  );
}
