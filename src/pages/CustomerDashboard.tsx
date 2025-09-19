import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { PortfolioSummary } from '@/components/customer/PortfolioSummary';
import { ProductMarketplace } from '@/components/customer/ProductMarketplace';
import { InvestmentHistory } from '@/components/customer/InvestmentHistory';
import { BalanceManager } from '@/components/customer/BalanceManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentProduct, UserInvestment, PortfolioSummary as PortfolioSummaryType, InvestmentType, RiskLevel } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ChartLineUp, TrendUp, Wallet, ShoppingCart } from 'phosphor-react';

const CustomerDashboard: React.FC = () => {
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [investments, setInvestments] = useState<UserInvestment[]>([]);
  const [portfolioSummary, setPortfolioSummary] = useState<PortfolioSummaryType>({
    totalInvested: 0,
    currentValue: 0,
    totalReturns: 0,
    returnsPercentage: 0,
    activeInvestments: 0,
  });
  const { user, updateUser } = useAuth();

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: InvestmentProduct[] = [
      {
        id: '1',
        name: 'Growth Equity Fund',
        investment_type: InvestmentType.STOCKS,
        tenure_months: 24,
        annual_yield: 12.5,
        risk_level: RiskLevel.HIGH,
        min_investment: 10000,
        max_investment: 500000,
        description: 'High-growth equity fund focusing on emerging markets with excellent potential for long-term wealth creation.',
        created_at: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Stable Bond Portfolio',
        investment_type: InvestmentType.BONDS,
        tenure_months: 12,
        annual_yield: 7.8,
        risk_level: RiskLevel.LOW,
        min_investment: 5000,
        max_investment: 200000,
        description: 'Conservative bond portfolio with steady returns and minimal risk exposure.',
        created_at: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Diversified Mutual Fund',
        investment_type: InvestmentType.MUTUAL_FUNDS,
        tenure_months: 18,
        annual_yield: 10.2,
        risk_level: RiskLevel.MODERATE,
        min_investment: 2000,
        max_investment: 100000,
        description: 'Well-diversified mutual fund balancing growth and stability.',
        created_at: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Fixed Deposit Plus',
        investment_type: InvestmentType.FIXED_DEPOSITS,
        tenure_months: 6,
        annual_yield: 6.5,
        risk_level: RiskLevel.LOW,
        min_investment: 1000,
        max_investment: 50000,
        description: 'Enhanced fixed deposit with competitive interest rates and guaranteed returns.',
        created_at: new Date().toISOString(),
      },
    ];
    setProducts(mockProducts);

    // Mock investments if user has balance and some mock investments
    const mockInvestments: UserInvestment[] = [
      {
        id: '1',
        user_id: user?.id || '',
        product_id: '2',
        amount_invested: 15000,
        purchase_date: '2024-01-15',
        expected_return: 1170,
        current_value: 15875,
        product: mockProducts[1],
      },
    ];
    setInvestments(mockInvestments);

    // Calculate portfolio summary
    const totalInvested = mockInvestments.reduce((sum, inv) => sum + inv.amount_invested, 0);
    const currentValue = mockInvestments.reduce((sum, inv) => sum + inv.current_value, 0);
    const totalReturns = currentValue - totalInvested;
    const returnsPercentage = totalInvested > 0 ? (totalReturns / totalInvested) * 100 : 0;

    setPortfolioSummary({
      totalInvested,
      currentValue,
      totalReturns,
      returnsPercentage,
      activeInvestments: mockInvestments.length,
    });
  }, [user?.id]);

  const handlePurchase = async (productId: string, amount: number) => {
    if (!user) return;

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Deduct from balance
    await updateUser({
      balance: user.balance - amount
    });

    // Calculate expected return
    const expectedReturn = (amount * product.annual_yield * product.tenure_months) / (12 * 100);
    const currentValue = amount + (expectedReturn * 0.1); // Simulate some growth

    // Add to investments
    const newInvestment: UserInvestment = {
      id: Date.now().toString(),
      user_id: user.id,
      product_id: productId,
      amount_invested: amount,
      purchase_date: new Date().toISOString(),
      expected_return: expectedReturn,
      current_value: currentValue,
      product,
    };

    setInvestments(prev => [...prev, newInvestment]);

    // Update portfolio summary
    const newTotalInvested = portfolioSummary.totalInvested + amount;
    const newCurrentValue = portfolioSummary.currentValue + currentValue;
    const newTotalReturns = newCurrentValue - newTotalInvested;
    const newReturnsPercentage = newTotalInvested > 0 ? (newTotalReturns / newTotalInvested) * 100 : 0;

    setPortfolioSummary({
      totalInvested: newTotalInvested,
      currentValue: newCurrentValue,
      totalReturns: newTotalReturns,
      returnsPercentage: newReturnsPercentage,
      activeInvestments: investments.length + 1,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Investment Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user?.first_name}! Manage your investments and track your portfolio.</p>
            </div>
          </div>

          {/* Portfolio Summary */}
          <PortfolioSummary summary={portfolioSummary} />

          {/* Main Content */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Left Sidebar - Balance Manager */}
            <div className="lg:col-span-1">
              <BalanceManager />
            </div>

            {/* Main Content Area */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="marketplace" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="marketplace" className="flex items-center">
                    <ShoppingCart size={16} className="mr-2" />
                    Marketplace
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="flex items-center">
                    <ChartLineUp size={16} className="mr-2" />
                    My Portfolio
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="marketplace">
                  <div className="space-y-6">
                    <Card className="financial-card">
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TrendUp size={20} className="mr-2" />
                          Available Investment Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ProductMarketplace 
                          products={products} 
                          onPurchase={handlePurchase}
                        />
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
                
                <TabsContent value="portfolio">
                  <InvestmentHistory investments={investments} />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CustomerDashboard;