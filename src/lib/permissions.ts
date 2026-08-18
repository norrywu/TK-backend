import { createAccessControl } from "better-auth/plugins/access";
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access";

/**
 * Statement mendefinisikan resource dan action yang diizinkan dalam aplikasi.
 * Gunakan `as const` agar TypeScript dapat menginfer tipe dengan presisi.
 */
export const statement = {
  ...defaultStatements,
  student: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
} as const;

export const ac = createAccessControl(statement);

/**
 * Role Admin: Memiliki akses penuh ke seluruh resource bawaan Better Auth (user, session)
 * serta resource custom aplikasi (student, course).
 */
export const admin = ac.newRole({
  ...adminAc.statements,
  student: ["create", "read", "update", "delete"],
  course: ["create", "read", "update", "delete"],
});

/**
 * Role Student: Hanya memiliki hak akses membaca (read-only).
 */
export const student = ac.newRole({
  student: ["read"],
  course: ["read"],
});

export const roles = {
  admin,
  student,
};
