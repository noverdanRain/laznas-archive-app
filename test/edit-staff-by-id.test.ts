import { updateStaffById } from "@/lib/actions/mutation/staff";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

test("Edit Staff - Success", async () => {
  await db.delete(users).where(eq(users.id, "test-edit-staff"));

  await db.insert(users).values({
    id: "test-edit-staff",
    username: "test-edit-staff",
    password: "password",
    divisionId: "5c6a7a01-66cc-11f0-a420-862ccfb04071",
    role: "staff",
    isDisabled: false,
  });

  const result = await updateStaffById({
    id: "test-edit-staff",
    username: "updated-staff",
    divisionId: "5c6a7756-66cc-11f0-a420-862ccfb04071",
    password: "updated-password",
  });
  expect(result).toEqual({
    isSuccess: true,
  });
});

test("Edit Staff - Not Found", async () => {
  const result = await updateStaffById({
    id: "ora nana",
  });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "Staff dengan id ora nana tidak ditemukan.",
    },
  });
});

test("Edit Staff - blank ID", async () => {
  const result = await updateStaffById({
    id: "",
    username: "test-edit-staff",
    password: "password",
    divisionId: "5c6a7a01-66cc-11f0-a420-862ccfb04071",
  });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "ID staff tidak boleh kosong.",
    },
  });
});

test("Edit Staff - blank update data", async () => {
  const result = await updateStaffById({
    id: "test-edit-staff",
  });
  expect(result).toEqual({
    isRejected: true,
    reject: {
      message: "Tidak ada data yang perlu diperbarui.",
    },
  });
});
