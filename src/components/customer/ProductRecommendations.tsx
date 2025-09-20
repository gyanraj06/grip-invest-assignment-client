import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  Lightbulb,
  TrendUp,
  Clock,
  Shield,
  CurrencyDollar,
  ShoppingCart
} from 'phosphor-react';
import { InvestmentProduct } from '@/types';

interface ProductRecommendationsProps {
  onInvest?: (productId: string, amount: number) => void;
}

export const ProductRecommendations: React.FC<ProductRecommendationsProps> = ({
  onInvest
}) => {
  const [recommendations, setRecommendations] = useState<InvestmentProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-success';
      case 'moderate':
        return 'text-accent';
      case 'high':
        return 'text-destructive';
      default:
        return 'text-muted-foreground';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'default';
      case 'moderate':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'default';
    }
  };


  const fetchRecommendations = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      console.log('Fetching product recommendations...');

      const response = await fetch(`${API_BASE_URL}/api/products/recommendations`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Recommendations API response:', data);

        const recommendationsData = data.data || data.recommendations || data;
        setRecommendations(recommendationsData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch recommendations');
      }
    } catch (error) {
      console.error('Error fetching recommendations:', error);

      // Fallback to mock data if API is not available
      console.log('Using mock recommendations data...');
      const mockRecommendations: InvestmentProduct[] = [
        {
          id: 'rec-1',
          name: 'Business Bonds',
          investment_type: 'bond',
          tenure_months: 12,
          annual_yield: 11,
          risk_level: 'moderate',
          min_investment: 1000,
          max_investment: 100000,
          description: '12-month bond with moderate risk'
        },
        {
          id: 'rec-2',
          name: 'Grip High Yield Bond Special 2',
          investment_type: 'bond',
          tenure_months: 12,
          annual_yield: 10,
          risk_level: 'moderate',
          min_investment: 1000,
          max_investment: 100000,
          description: '12-month bond with moderate risk'
        },
        {
          id: 'rec-3',
          name: 'Mutual Growth Plus Fund',
          investment_type: 'mf',
          tenure_months: 18,
          annual_yield: 9,
          risk_level: 'moderate',
          min_investment: 1500,
          max_investment: 75000,
          description: '18-month mutual fund with moderate risk'
        }
      ];
      setRecommendations(mockRecommendations);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  if (loading) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb size={20} className="mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-muted-foreground">Loading recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb size={20} className="mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8 text-muted-foreground">
            <span>{error}</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lightbulb size={20} className="mr-2" />
            Recommended for You
          </CardTitle>
        </CardHeader>

        <CardContent>
          {recommendations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Lightbulb size={48} className="mx-auto mb-4 opacity-50" />
              <p>No recommendations available at the moment.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
              {recommendations.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="h-full hover:shadow-md transition-all duration-300 cursor-pointer group border border-border">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-semibold text-sm leading-tight">{product.name}</h3>
                          <Badge variant="outline" className="mt-1 text-xs">
                            {product.investment_type.replace(/_/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                          </Badge>
                        </div>
                        <Badge variant={getRiskBadgeVariant(product.risk_level)} className="text-xs">
                          {product.risk_level.charAt(0).toUpperCase() + product.risk_level.slice(1)}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="flex items-center space-x-1">
                          <TrendUp size={12} className="text-success" />
                          <div>
                            <p className="text-muted-foreground">Yield</p>
                            <p className="font-semibold metric-positive">{product.annual_yield}%</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-1">
                          <Clock size={12} className="text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Tenure</p>
                            <p className="font-semibold">{product.tenure_months}M</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min:</span>
                          <span className="font-medium">{formatCurrency(product.min_investment)}</span>
                        </div>
                        {product.max_investment && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Max:</span>
                            <span className="font-medium">{formatCurrency(product.max_investment)}</span>
                          </div>
                        )}
                      </div>

                      {product.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {product.description}
                        </p>
                      )}

                      <Button
                        onClick={() => onInvest?.(product.id, product.min_investment)}
                        className="w-full group-hover:scale-105 transition-transform text-xs h-8"
                        variant="hero"
                        size="sm"
                      >
                        <ShoppingCart size={12} className="mr-1" />
                        Invest Now
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};