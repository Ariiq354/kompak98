import Papa from "papaparse";
import { importUserCsvSchema, importUserRowSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const { file } = await readValidatedMultipart(event, importUserCsvSchema);
  const csv = file.data.toString("utf8").replace(/^\uFEFF/, "");
  const parsed = Papa.parse<Record<string, string>>(csv, {
    header: true,
    skipEmptyLines: "greedy",
    transform: value => /^'[=+\-@\t\r]/.test(value) ? value.slice(1) : value,
    transformHeader: header => header.trim(),
  });

  if (!parsed.meta.fields?.includes("id") || !parsed.meta.fields.includes("Nama")) {
    throw createError({
      statusCode: 400,
      statusMessage: "CSV wajib memiliki kolom id dan Nama",
    });
  }

  if (parsed.errors.length > 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Format CSV tidak valid",
      data: parsed.errors,
    });
  }

  const rows = parsed.data.map((row, index) => {
    const result = importUserRowSchema.safeParse({
      id: row.id,
      Nama: row.Nama,
      gender: row["Jenis Kelamin"],
      nip9: row["NIP 9"],
      nip18: row["NIP 18"],
      namaKantor: row["Nama Kantor"],
      provinsiKantor: row["Provinsi Kantor"],
      noHp: row["No HP"],
      idJabatan: row.idJabatan,
      namaUnitEs4: row["Unit Eselon 4"],
      namaPangkat: row.Pangkat,
      pendidikanFormal: row["Pendidikan Formal"],
      alamat: row.Alamat,
      kota: row.Kota,
      provinsi: row.Provinsi,
    });
    if (!result.success) {
      throw createError({
        statusCode: 400,
        statusMessage: `Data pada baris ${index + 2} tidak valid`,
        data: result.error.issues,
      });
    }
    return result.data;
  });

  if (rows.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "CSV tidak memiliki data member",
    });
  }

  const ids = rows.map(row => row.id);
  if (new Set(ids).size !== ids.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "CSV memiliki ID member yang duplikat",
    });
  }

  return await UserService.importMonitoringUsers(rows);
});
