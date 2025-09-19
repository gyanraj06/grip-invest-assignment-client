import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PortfolioSummary as PortfolioSummaryType } from "@/types";
import { TrendUp, TrendDown, Wallet, ChartBar } from "phosphor-react";
import { motion } from "framer-motion";

interface PortfolioSummaryProps {
  summary: PortfolioSummaryType;
}

export const PortfolioSummary: React.FC<PortfolioSummaryProps> = ({
  summary,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const isPositiveReturn = summary.totalReturns >= 0;

  const metrics = [
    {
      title: "Total Invested",
      value: formatCurrency(summary.totalInvested),
      icon: Wallet,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Current Value",
      value: formatCurrency(summary.currentValue),
      icon: ChartBar,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      title: "Total Returns",
      value: formatCurrency(summary.totalReturns),
      icon: isPositiveReturn ? TrendUp : TrendDown,
      color: isPositiveReturn ? "text-success" : "text-destructive",
      bgColor: isPositiveReturn ? "bg-success/10" : "bg-destructive/10",
      change: `${
        isPositiveReturn ? "+" : ""
      }${summary.returnsPercentage.toFixed(2)}%`,
    },
    {
      title: "Active Investments",
      value: summary.activeInvestments.toString(),
      icon: ChartBar,
      color: "text-muted-foreground",
      bgColor: "bg-muted/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric, index) => (
        <motion.div
          key={metric.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="financial-card hover:shadow-lg transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground font-medium">
                    {metric.title}
                  </p>
                  <div className="space-y-1">
                    <p className="text-2xl font-bold">{metric.value}</p>
                    {metric.change && (
                      <p className={`text-sm font-medium ${metric.color}`}>
                        {metric.change}
                      </p>
                    )}
                  </div>
                </div>

                <div
                  className={`w-12 h-12 rounded-full ${metric.bgColor} flex items-center justify-center`}
                >
                  <metric.icon size={24} className={metric.color} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
};
