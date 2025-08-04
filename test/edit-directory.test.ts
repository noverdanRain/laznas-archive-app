import { editDirectory } from "@/lib/actions/mutation/directories";
import axios from "axios";

async function revalidateTag(tag: string) {
  console.log(`Revalidating tag: ${tag}`);
  try {
    const data = await axios.post("http://localhost:3000/api/revalidate-tag", {
      tag,
    });
    console.log("Revalidation response:", data.data);
    console.log(`Successfully revalidated tag: ${tag}`);
  } catch (error) {
    throw new Error(`Failed to revalidate tag: ${tag}`);
  }
}

// Mock revalidateTag
jest.mock("next/cache", () => ({
  revalidateTag: jest.fn(),
}));

test("Edit Directory", async () => {
  const result = await editDirectory({
    id: "f6d3aaad-6dc7-11f0-a420-862ccfb04071",
    name: "Ahihihihihihihehe",
    description: "Direktori yang telah direvisi",
    isPrivate: false,
  });
  await revalidateTag("get-dir-public");
  await revalidateTag("get-dir-staff");
  expect(result).toEqual({
    isSuccess: true,
  });
});

test("Edit Directory - Not Found", async () => {
  const result = await editDirectory({
    id: "ora nana",
  });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "Direktori dengan id ora nana tidak ditemukan.",
    },
  });
});

test(" Edit Directory - Existing Name", async () => {
  const result = await editDirectory({
    id: "f6d3aaad-6dc7-11f0-a420-862ccfb04071",
    name: "Harun Al Irsyad",
    description: "Direktori yang telah direvisi",
    isPrivate: false,
  });
  expect(result).toEqual({
    isSuccess: true,
  });
});
