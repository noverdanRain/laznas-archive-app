'use client';

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
    </>
  );
}
