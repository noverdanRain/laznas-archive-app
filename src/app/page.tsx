'use client';

import { useGetDivisions } from "@/hooks/useGetDivisions";
import Image from "next/image";

export default function Home() {
  const { divisions, isLoading, error } = useGetDivisions();
  console.log("Loading Divisions:", isLoading);
  console.log("Divisions Data:", divisions);
  console.log("Error Details:", error?.message);

  return (
    <h1>Hello Madefaker</h1>
  );
}
