import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserInvestment } from '@/types';
import { ChartLineUp, Clock, TrendUp } from 'phosphor-react';
import { motion } from 'framer-motion';

interface InvestmentHistoryProps {
  investments: UserInvestment[];
}

export const InvestmentHistory: React.FC<InvestmentHistoryProps> = ({ investments }) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getReturnColor = (current: number, invested: number) => {
    const diff = current - invested;
    return diff >= 0 ? 'metric-positive' : 'metric-negative';
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <ChartLineUp size={20} className="mr-2" />
            Investment History ({investments.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {investments.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ChartLineUp size={48} className="mx-auto mb-4 opacity-50" />
              <p>No investments yet. Start investing to see your portfolio here!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Amount Invested</TableHead>
                    <TableHead>Current Value</TableHead>
                    <TableHead>Returns</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment, index) => {
                    const returnAmount = investment.current_value - investment.amount_invested;
                    const returnPercentage = (returnAmount / investment.amount_invested) * 100;
                    
                    return (
                      <motion.tr
                        key={investment.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="group hover:bg-secondary/50"
                      >
                        <TableCell className="font-medium">
                          <div>
                            <p>{investment.product.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {investment.product.tenure_months} months • {investment.product.annual_yield}% yield
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {investment.product.investment_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(investment.purchase_date)}</TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(investment.amount_invested)}
                        </TableCell>
                        <TableCell className="font-semibold">
                          {formatCurrency(investment.current_value)}
                        </TableCell>
                        <TableCell>
                          <div className={getReturnColor(investment.current_value, investment.amount_invested)}>
                            <p className="font-semibold">
                              {returnAmount >= 0 ? '+' : ''}{formatCurrency(returnAmount)}
                            </p>
                            <p className="text-xs">
                              {returnPercentage >= 0 ? '+' : ''}{returnPercentage.toFixed(2)}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRiskBadgeVariant(investment.product.risk_level)}>
                            {investment.product.risk_level.charAt(0).toUpperCase() + investment.product.risk_level.slice(1)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-success rounded-full"></div>
                            <span className="text-sm">Active</span>
                          </div>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};