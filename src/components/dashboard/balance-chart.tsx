"use client";

import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  balance: {
    label: "Balance",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

export function BalanceChart({ data: rawData }: { data: { name: string; balance: number }[] }) {
  const data = [...rawData].sort((a, b) => b.balance - a.balance);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Balance by Organization</CardTitle>
        <CardDescription>Current net balance across all registered organizations.</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-72 w-full">
          <BarChart data={data} layout="vertical" margin={{ left: 0, right: 24 }}>
            <CartesianGrid horizontal={false} />
            <XAxis type="number" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis
              type="category"
              dataKey="name"
              tickLine={false}
              axisLine={false}
              width={168}
              fontSize={11}
            />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="balance" radius={4}>
              {data.map((d) => (
                <Cell key={d.name} fill={d.balance < 0 ? "var(--destructive)" : "var(--chart-1)"} />
              ))}
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
