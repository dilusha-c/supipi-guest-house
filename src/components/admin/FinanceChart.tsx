"use client";

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

type FinanceChartProps = {
  data: any[];
};

export default function FinanceChart({ data }: FinanceChartProps) {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} />
        <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280'}} tickFormatter={(value) => `LKR ${value/1000}k`} />
        <Tooltip 
          formatter={(value: any) => [`LKR ${value.toLocaleString()}`, undefined]}
          cursor={{fill: '#F3F4F6'}}
          contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
        />
        <Legend iconType="circle" />
        <Bar dataKey="Income" fill="#2C5234" radius={[4, 4, 0, 0]} />
        <Bar dataKey="Expense" fill="#EF4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
