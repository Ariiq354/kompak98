import Papa from "papaparse";
import { getMonitoringUserSchema } from "~~/server/modules/user/model";
import { UserService } from "~~/server/modules/user/service";

export default defineEventHandler(async (event) => {
  adminGuard(event);
  const query = await getValidatedQuerySafe(event, getMonitoringUserSchema);
  const { data } = await UserService.getMonitoringUserExport(query);

  const exportData = data.map((member, index) => ({
    "No": index + 1,
    "Nama": member.name,
    "Jenis Kelamin": member.gender,
    "NIP 9": member.nip9,
    "NIP 18": member.nip18,
    "Nama Kantor": member.namaKantor,
    "Provinsi Kantor": member.provinsiKantor,
    "No HP": member.noHp,
    "Jabatan": member.namaJabatan,
    "Pangkat": member.namaPangkat,
    "Unit Eselon 4": member.namaUnitEs4,
    "Pendidikan Formal": member.pendidikanFormal,
    "Alamat": member.alamat,
    "Kota": member.kota,
    "Provinsi": member.provinsi,
    ...member,
  }));

  const csv = Papa.unparse(exportData, {
    columns: [
      "No",
      "Nama",
      "Jenis Kelamin",
      "NIP 9",
      "NIP 18",
      "Nama Kantor",
      "Provinsi Kantor",
      "No HP",
      "idJabatan",
      "kodeJabatan",
      "Jabatan",
      "Unit Eselon 4",
      "Pangkat",
      "Pendidikan Formal",
      "Alamat",
      "Kota",
      "Provinsi",
      "id",
    ],
    escapeFormulae: true,
    newline: "\r\n",
  });

  setResponseHeaders(event, {
    "Content-Disposition": "attachment; filename=data-member.csv",
    "Content-Type": "text/csv; charset=utf-8",
  });

  return `\uFEFF${csv}`;
});
