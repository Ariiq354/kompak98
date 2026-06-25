export interface ChartProvinsiData {
  provinsi: string;
  total: number;
}

export interface BarChartProps {
  title: string;
  data: ChartProvinsiData[];
}

export const categories = {
  total: { name: "Total Member per Provinsi", color: "#22c55e" },
};
