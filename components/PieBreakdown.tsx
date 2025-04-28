"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Text } from "recharts";

interface PieBreakdownProps {
  categoryScores: { name: string; score: number; comment: string }[];
}

const COLORS = [
  "#4f46e5",
  "#22c55e",
  "#facc15",
  "#f43f5e",
  "#06b6d4",
  "#a855f7",
];

const PieBreakdown = ({ categoryScores }: PieBreakdownProps) => {
  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-2xl font-semibold">Breakdown of the Interview:</h2>

      <div className="flex flex-col gap-6">
        {categoryScores.map((category, index) => (
          <Card key={index} className="flex flex-row items-center p-6">
            {/* Left side: Pie Chart */}
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={[
                      { name: "Score", value: category.score },
                      { name: "Remaining", value: 100 - category.score },
                    ]}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    dataKey="value"
                    labelLine={false} // No external line
                  >
                    <Cell fill={COLORS[index % COLORS.length]} />
                    <Cell fill="#e5e7eb" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Right side: Category Name + Comment */}
            <div className="flex flex-col justify-center ml-6 flex-1">
              <h3 className="text-lg font-bold mb-2">
                {category.name} ({category.score}/100)
              </h3>
              <p className="text-gray-600">{category.comment}</p>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default PieBreakdown;
