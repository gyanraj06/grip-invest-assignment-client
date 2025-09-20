import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { PortfolioSummary } from '@/components/customer/PortfolioSummary';
import { ProductMarketplace } from '@/components/customer/ProductMarketplace';
import { InvestmentHistory } from '@/components/customer/InvestmentHistory';
import { BalanceManager } from '@/components/customer/BalanceManager';
import { InsightsSection } from '@/components/customer/InsightsSection';
import { ProductRecommendations } from '@/components/customer/ProductRecommendations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentProduct, UserInvestment, PortfolioSummary as PortfolioSummaryType, InvestmentType, RiskLevel } from '@/types';
import { useAuth } from '@/contexts/AuthContext';
import { motion } from 'framer-motion';
import { ChartLineUp, TrendUp, Wallet, ShoppingCart, Brain, Lightbulb } from 'phosphor-react';

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

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
        console.log('Fetching products from API...');

        const response = await fetch(`${API_BASE_URL}/api/products/`);

        if (response.ok) {
          const data = await response.json();
          console.log('Products API response - Full Data:', data);
          console.log('Products API response - Type:', typeof data);
          console.log('Products API response - Is Array:', Array.isArray(data));

          // Handle different response formats
          let productsData;
          if (Array.isArray(data)) {
            productsData = data;
          } else if (data.data && Array.isArray(data.data)) {
            productsData = data.data;
          } else if (data.products && Array.isArray(data.products)) {
            productsData = data.products;
          } else {
            console.warn('Unexpected API response format:', data);
            productsData = [];
          }

          console.log('Extracted products data:', productsData);
          console.log('Number of products:', productsData.length);

          // Log each product name to see what we got from API
          productsData.forEach((product, index) => {
            console.log(`Product ${index + 1}:`, product.name);
          });

          setProducts(productsData);
        } else {
          console.log('Products API failed with status:', response.status);
          console.log('API response not ok, setting empty products array');
          setProducts([]);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        // Fallback to mock data
        setProducts([]);
      }
    };

    fetchProducts();

    // Fetch user investments if user is logged in
    if (user?.id) {
      fetchUserInvestments();
    }
  }, [user?.id]);

  // Fetch user investments from API
  const fetchUserInvestments = async () => {
    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      console.log('Fetching user investments...');

      const response = await fetch(`${API_BASE_URL}/api/investments/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('User investments API response:', data);

        // Handle different response formats
        const investmentsData = data.data || data.investments || data;
        console.log('Raw investments data:', investmentsData);

        // Enrich investments with product data
        const enrichedInvestments = await Promise.all(
          investmentsData.map(async (investment: any) => {
            try {
              console.log(`Fetching product details for investment ${investment.id}, product_id: ${investment.product_id}`);

              // First try to find from loaded products
              let product = products.find(p => p.id === investment.product_id);

              // If not found in loaded products, fetch from API
              if (!product) {
                console.log(`Product not in loaded list, fetching from API: ${investment.product_id}`);

                try {
                  const productResponse = await fetch(`${API_BASE_URL}/api/products/${investment.product_id}`, {
                    headers: {
                      'Authorization': `Bearer ${token}`,
                    },
                  });

                  if (productResponse.ok) {
                    const productData = await productResponse.json();
                    console.log('Individual product API response:', productData);

                    // Handle different response formats
                    product = productData.data || productData.product || productData;
                    console.log('Extracted product:', product);
                  } else {
                    console.error('Failed to fetch individual product:', productResponse.status);
                  }
                } catch (apiError) {
                  console.error('Error fetching individual product:', apiError);
                }
              }

              if (product && product.name) {
                console.log(`Found product for investment ${investment.id}:`, product.name);
                return {
                  ...investment,
                  product: product
                };
              } else {
                console.warn(`Product still not found for investment ${investment.id}, product_id: ${investment.product_id}`);
                // Return with a fallback product structure
                return {
                  ...investment,
                  product: {
                    id: investment.product_id,
                    name: 'Product Not Found',
                    investment_type: 'unknown',
                    risk_level: 'moderate',
                    annual_yield: 0,
                    tenure_months: 0,
                  }
                };
              }
            } catch (error) {
              console.error('Error enriching investment:', error);
              return investment;
            }
          })
        );

        console.log('Enriched investments:', enrichedInvestments);
        setInvestments(enrichedInvestments);

        // Calculate portfolio summary from real data
        const totalInvested = investmentsData.reduce((sum: number, inv: any) => sum + Number(inv.amount_invested || inv.amount || 0), 0);
        const currentValue = investmentsData.reduce((sum: number, inv: any) => sum + Number(inv.current_value || inv.amount_invested || inv.amount || 0), 0);
        const totalCurrentReturns = currentValue - totalInvested;
        const currentReturnsPercentage = totalInvested > 0 ? (totalCurrentReturns / totalInvested) * 100 : 0;

        // Calculate total expected returns (sum of all individual expected returns)
        const totalExpectedReturns = investmentsData.reduce((sum: number, inv: any) => sum + Number(inv.expected_return || 0), 0);

        // Count only active investments
        const activeInvestmentsCount = investmentsData.filter((inv: any) => {
          const status = inv.status || 'active';
          return status.toLowerCase() === 'active';
        }).length;

        setPortfolioSummary({
          totalInvested,
          currentValue,
          totalReturns: totalExpectedReturns, // Use expected returns for main summary
          returnsPercentage: totalInvested > 0 ? (totalExpectedReturns / totalInvested) * 100 : 0,
          activeInvestments: activeInvestmentsCount,
        });
      } else {
        console.log('Investments API failed');
      }
    } catch (error) {
      console.error('Error fetching investments:', error);
    }
  };

  const handlePurchase = async (productId: string, amount: number) => {
    if (!user) return;

    try {
      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      console.log('Creating investment...', { productId, amount, amountType: typeof amount });

      const payload = {
        product_id: productId,
        amount: Number(amount), // Ensure amount is a number
      };

      console.log('API payload:', payload);

      const response = await fetch(`${API_BASE_URL}/api/investments/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Investment created successfully:', data);

        // Refresh user investments and balance
        await fetchUserInvestments();

        // Update user balance in context (fetch from API or deduct locally)
        await updateUser({
          balance: user.balance - amount
        });

      } else {
        const errorData = await response.json();
        console.error('Investment creation failed:', errorData);
        throw new Error(errorData.message || 'Investment failed');
      }
    } catch (error) {
      console.error('Error creating investment:', error);

      // Fallback to local mock behavior if API fails
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

      // Count only active investments (including the new one)
      const activeCount = investments.filter(inv => {
        const status = inv.status || 'active';
        return status.toLowerCase() === 'active';
      }).length + 1; // +1 for the new investment which is active

      setPortfolioSummary({
        totalInvested: newTotalInvested,
        currentValue: newCurrentValue,
        totalReturns: newTotalReturns,
        returnsPercentage: newReturnsPercentage,
        activeInvestments: activeCount,
      });
    }
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="marketplace" className="flex items-center">
                    <ShoppingCart size={16} className="mr-2" />
                    Marketplace
                  </TabsTrigger>
                  <TabsTrigger value="portfolio" className="flex items-center">
                    <ChartLineUp size={16} className="mr-2" />
                    My Portfolio
                  </TabsTrigger>
                  <TabsTrigger value="recommendations" className="flex items-center">
                    <Lightbulb size={16} className="mr-2" />
                    Recommendations
                  </TabsTrigger>
                  <TabsTrigger value="insights" className="flex items-center">
                    <Brain size={16} className="mr-2" />
                    Insights
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
                  <InvestmentHistory
                    investments={investments}
                    onCancelInvestment={fetchUserInvestments}
                  />
                </TabsContent>

                <TabsContent value="recommendations">
                  <ProductRecommendations onInvest={handlePurchase} />
                </TabsContent>

                <TabsContent value="insights">
                  <InsightsSection />
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