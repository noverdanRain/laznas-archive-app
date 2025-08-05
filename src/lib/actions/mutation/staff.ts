import { eq } from "drizzle-orm";
import db from "@/lib/db";
import { users } from "@/lib/db/schema";
import { revalidateTag } from "next/cache";
import { MutateActionsReturnType } from "@/types";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { throwActionError } from "../helpers";

export interface IAddStaffParams {
  username: string;
  password: string;
  divisionId: string;
}

type UpdateStaffByIdParams = {
  id: string;
  username?: string;
  password?: string;
  divisionId?: string;
};

async function addStaff(
  params: IAddStaffParams
): Promise<MutateActionsReturnType> {
  const { username, password, divisionId } = params;
  try {
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.username, username));
    if (existingUser?.username) {
      return {
        isSuccess: false,
        isRejected: true,
        reject: {
          message: "Username sudah dipakai.",
        },
      };
    }
    const generatedUid = randomUUID();
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.insert(users).values({
      id: generatedUid,
      username: username.toLocaleLowerCase(),
      password: hashedPassword,
      divisionId,
    });
    revalidateTag("all-staff");
    return {
      isSuccess: true,
      isRejected: false,
    };
  } catch (error) {
    console.error("Error adding staff:", error);
    throwActionError(error);
  }
}

async function disableStaff(id: string): Promise<MutateActionsReturnType> {
  try {
    await db.update(users).set({ isDisabled: true }).where(eq(users.id, id));

    revalidateTag(`staff-${id}`);
    revalidateTag("all-staff");

    return {
      isSuccess: true,
      isRejected: false,
    };
  } catch (error) {
    console.error("Error disabling staff:", error);
    throwActionError(error);
  }
}

async function enableStaff(id: string): Promise<MutateActionsReturnType> {
  try {
    await db.update(users).set({ isDisabled: false }).where(eq(users.id, id));

    revalidateTag(`staff-${id}`);
    revalidateTag("all-staff");

    return {
      isSuccess: true,
      isRejected: false,
    };
  } catch (error) {
    console.error("Error enabling staff:", error);
    throwActionError(error);
  }
}
async function updateStaffById(
  params: UpdateStaffByIdParams
): Promise<MutateActionsReturnType> {
  try {
    const { id, username, password, divisionId } = params;

    if (!id) {
      return {
        isRejected: true,
        reject: {
          message: "ID staff tidak boleh kosong.",
        },
      };
    }

    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!existingUser) {
      return {
        isRejected: true,
        reject: {
          message: `Staff dengan id ${id} tidak ditemukan.`,
        },
      };
    }

    const updateData: Record<string, string> = {};
    if (username) {
      updateData.username = username;
    }
    if (divisionId) {
      updateData.divisionId = divisionId;
    }
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      updateData.password = hashedPassword;
    }
    if (Object.keys(updateData).length === 0) {
      return {
        isRejected: true,
        reject: {
          message: "Tidak ada data yang perlu diperbarui.",
        },
      };
    }

    await db.update(users).set(updateData).where(eq(users.id, id));
    return {
      isSuccess: true,
    };
  } catch (error) {
    console.error("Error select staff by id: ", error);
    throwActionError(error);
  }
}

export { addStaff, disableStaff, enableStaff, updateStaffById };
