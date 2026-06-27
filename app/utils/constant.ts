export const MONTH_OPTION = [
  {
    label: "Januari",
    value: 1,
  },
  {
    label: "Februari",
    value: 2,
  },
  {
    label: "Maret",
    value: 3,
  },
  {
    label: "April",
    value: 4,
  },
  {
    label: "Mei",
    value: 5,
  },
  {
    label: "Juni",
    value: 6,
  },
  {
    label: "Juli",
    value: 7,
  },
  {
    label: "Agustus",
    value: 8,
  },
  {
    label: "September",
    value: 9,
  },
  {
    label: "Oktober",
    value: 10,
  },
  {
    label: "November",
    value: 11,
  },
  {
    label: "Desember",
    value: 12,
  },
];

const START_YEAR = 2026;
const END_YEAR = Math.max(new Date().getFullYear(), 2028);

export const YEAR_OPTION = Array.from(
  { length: END_YEAR - START_YEAR + 1 },
  (_, i) => {
    const year = START_YEAR + i;

    return year;
  },
);

export const MONTH_LABEL = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "Mei",
  "Jun",
  "Jul",
  "Agu",
  "Sep",
  "Okt",
  "Nov",
  "Des",
];
