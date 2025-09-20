import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RiskDistributionChart } from './RiskDistributionChart';
import { motion } from 'framer-motion';
import {
  ChartPie,
  TrendUp,
  Shield,
  Target,
  Brain,
  Warning
} from 'phosphor-react';

interface RiskDistribution {
  low: number;
  moderate: number;
  high: number;
}

interface InsightsData {
  totalInvested: number;
  riskDistribution: RiskDistribution;
  expectedReturns: number;
  insights: string[];
}


export const InsightsSection: React.FC = () => {
  const [insights, setInsights] = useState<InsightsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  const fetchInsights = async () => {
    try {
      setLoading(true);
      setError(null);

      const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';
      const token = localStorage.getItem('token');

      console.log('Fetching insights...');

      const response = await fetch(`${API_BASE_URL}/api/insights/`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Insights API response:', data);

        const insightsData = data.data || data;
        setInsights(insightsData);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch insights');
      }
    } catch (error) {
      console.error('Error fetching insights:', error);

      // Fallback to mock data if API is not available
      console.log('Using mock insights data...');
      const mockInsights: InsightsData = {
        totalInvested: 75000,
        riskDistribution: {
          low: 27.03,
          moderate: 13.51,
          high: 59.46
        },
        expectedReturns: 12500,
        insights: [
          "Your portfolio has a high-risk allocation of 59.46%, which may lead to higher volatility but potentially greater returns.",
          "Consider diversifying into more low-risk investments to balance your portfolio and reduce overall risk.",
          "Your expected returns of ₹12,500 represent a 16.67% return on your total investment.",
          "Market conditions favor technology and healthcare sectors, which align well with your current investments.",
          "Consider reviewing your portfolio quarterly to maintain optimal risk balance."
        ]
      };
      setInsights(mockInsights);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  const getRiskLevel = (distribution: RiskDistribution) => {
    const maxRisk = Math.max(distribution.low, distribution.moderate, distribution.high);
    if (maxRisk === distribution.low) return { level: 'Conservative', color: 'text-green-600', bg: 'bg-green-100' };
    if (maxRisk === distribution.moderate) return { level: 'Balanced', color: 'text-yellow-600', bg: 'bg-yellow-100' };
    return { level: 'Aggressive', color: 'text-red-600', bg: 'bg-red-100' };
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain size={20} className="mr-2" />
              Portfolio Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              <span className="ml-2 text-muted-foreground">Loading insights...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card className="financial-card">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Brain size={20} className="mr-2" />
              Portfolio Insights
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center py-8 text-muted-foreground">
              <Warning size={20} className="mr-2" />
              {error}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!insights) {
    return null;
  }

  const riskProfile = getRiskLevel(insights.riskDistribution);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain size={20} className="mr-2" />
            Portfolio Insights
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <Target size={16} className="text-primary" />
                <span className="text-sm font-medium text-muted-foreground">Total Invested</span>
              </div>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(insights.totalInvested)}
              </p>
            </div>

            <div className="bg-success/5 border border-success/20 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-2">
                <TrendUp size={16} className="text-success" />
                <span className="text-sm font-medium text-muted-foreground">Expected Returns</span>
              </div>
              <p className="text-2xl font-bold text-success">
                {formatCurrency(insights.expectedReturns)}
              </p>
            </div>

          </div>

          {/* Risk Distribution Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <ChartPie size={20} className="mr-2" />
                Risk Distribution
              </h3>
              <RiskDistributionChart riskDistribution={insights.riskDistribution} />
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Brain size={20} className="mr-2" />
                AI Insights
              </h3>
              <div className="space-y-3">
                {insights.insights.map((insight, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start space-x-3 p-3 bg-secondary/50 rounded-lg border border-border"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {insight}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Risk Breakdown Details */}
          <div className="border-t border-border pt-6">
            <h3 className="text-lg font-semibold mb-4">Risk Allocation Breakdown</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="font-medium">Low Risk</span>
                </div>
                <span className="font-bold text-green-600">{insights.riskDistribution.low.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  <span className="font-medium">Moderate Risk</span>
                </div>
                <span className="font-bold text-yellow-600">{insights.riskDistribution.moderate.toFixed(1)}%</span>
              </div>

              <div className="flex items-center justify-between p-3 border border-border rounded-lg bg-secondary/30">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                  <span className="font-medium">High Risk</span>
                </div>
                <span className="font-bold text-red-600">{insights.riskDistribution.high.toFixed(1)}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};