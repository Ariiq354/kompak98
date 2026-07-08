export interface ChartProvinsiData {
  provinsi: string;
  total: number;
}

export interface BarChartProps {
  title: string;
  data: ChartProvinsiData[];
}

export interface ChartIuranData {
  bulan: string;
  pemasukan: number;
  pengeluaran: number;
}

export interface AreaChartIuranProps {
  title: string;
  data: ChartIuranData[];
}
