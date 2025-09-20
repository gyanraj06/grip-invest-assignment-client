import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { UserInvestment } from '@/types';
import { ChartLineUp, Clock, TrendUp, X } from 'phosphor-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface InvestmentHistoryProps {
  investments: UserInvestment[];
  onCancelInvestment?: (investmentId: string) => void;
}

export const InvestmentHistory: React.FC<InvestmentHistoryProps> = ({
  investments,
  onCancelInvestment
}) => {
  const { toast } = useToast();
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

  const handleCancelInvestment = async (investmentId: string) => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      console.log('Cancelling investment:', investmentId);

      const response = await fetch(`${API_BASE_URL}/api/investments/${investmentId}/cancel`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        console.log('Investment cancelled successfully');
        toast({
          title: "Investment Cancelled",
          description: "Your investment has been cancelled successfully.",
        });

        // Call parent callback to refresh investments
        if (onCancelInvestment) {
          onCancelInvestment(investmentId);
        }
      } else {
        const errorData = await response.json();
        console.error('Investment cancellation failed:', errorData);
        throw new Error(errorData.message || 'Cancellation failed');
      }
    } catch (error) {
      console.error('Error cancelling investment:', error);
      toast({
        title: "Cancellation Failed",
        description: "Failed to cancel investment. Please try again.",
        variant: "destructive",
      });
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
                    <TableHead>Expected Returns</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {investments.map((investment, index) => {
                    try {
                      // Safe data access with fallbacks
                      const amountInvested = Number(investment.amount_invested || investment.amount || 0);
                      const currentValue = Number(investment.current_value || amountInvested);
                      const returnAmount = currentValue - amountInvested;
                      const returnPercentage = amountInvested > 0 ? (returnAmount / amountInvested) * 100 : 0;

                      // Calculate expected returns (total expected at maturity)
                      const expectedReturn = Number(investment.expected_return || 0);
                      const expectedPercentage = amountInvested > 0 ? (expectedReturn / amountInvested) * 100 : 0;

                      // Safe product access
                      const product = investment.product || {};
                      const productName = product.name || 'Unknown Product';
                      const tenureMonths = product.tenure_months || 0;
                      const annualYield = product.annual_yield || 0;
                      const investmentType = product.investment_type || 'unknown';
                      const riskLevel = product.risk_level || 'moderate';

                      return (
                        <motion.tr
                          key={investment.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="group hover:bg-secondary/50"
                        >
                          <TableCell className="font-medium">
                            <div>
                              <p>{productName}</p>
                              <p className="text-xs text-muted-foreground">
                                {tenureMonths} months • {annualYield}% yield
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {investmentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                            </Badge>
                          </TableCell>
                          <TableCell>{formatDate(investment.purchase_date || new Date().toISOString())}</TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(amountInvested)}
                          </TableCell>
                          <TableCell className="font-semibold">
                            {formatCurrency(currentValue)}
                          </TableCell>
                          <TableCell>
                            <div className="text-blue-600">
                              <p className="font-semibold">
                                +{formatCurrency(expectedReturn)}
                              </p>
                              <p className="text-xs">
                                +{expectedPercentage.toFixed(2)}%
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={getRiskBadgeVariant(riskLevel)}>
                              {riskLevel.charAt(0).toUpperCase() + riskLevel.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const status = investment.status || 'active';
                              const isActive = status.toLowerCase() === 'active';
                              const isCancelled = status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled';

                              return (
                                <div className="flex items-center space-x-2">
                                  <div className={`w-2 h-2 rounded-full ${
                                    isActive ? 'bg-success' :
                                    isCancelled ? 'bg-destructive' :
                                    'bg-warning'
                                  }`}></div>
                                  <span className={`text-sm capitalize ${
                                    isActive ? 'text-success' :
                                    isCancelled ? 'text-destructive' :
                                    'text-warning'
                                  }`}>
                                    {status}
                                  </span>
                                </div>
                              );
                            })()}
                          </TableCell>
                          <TableCell>
                            {(() => {
                              const status = investment.status || 'active';
                              const isCancelled = status.toLowerCase() === 'cancelled' || status.toLowerCase() === 'canceled';

                              return isCancelled ? (
                                <span className="text-sm text-muted-foreground">Cancelled</span>
                              ) : (
                                <Button
                                  onClick={() => handleCancelInvestment(investment.id)}
                                  variant="destructive"
                                  size="sm"
                                  className="h-8"
                                >
                                  <X size={14} className="mr-1" />
                                  Cancel
                                </Button>
                              );
                            })()}
                          </TableCell>
                        </motion.tr>
                      );
                    } catch (error) {
                      console.error('Error rendering investment row:', error, investment);
                      return null;
                    }
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