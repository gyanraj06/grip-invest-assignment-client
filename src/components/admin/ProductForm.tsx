import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { InvestmentProduct, InvestmentType, RiskLevel } from '@/types';
import { motion } from 'framer-motion';
import { Plus, FloppyDisk } from 'phosphor-react';

interface ProductFormProps {
  product?: InvestmentProduct;
  onSubmit: (product: Omit<InvestmentProduct, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
}

export const ProductForm: React.FC<ProductFormProps> = ({ product, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    investment_type: product?.investment_type || InvestmentType.STOCKS,
    tenure_months: product?.tenure_months || 12,
    annual_yield: product?.annual_yield || 0,
    risk_level: product?.risk_level || RiskLevel.MODERATE,
    min_investment: product?.min_investment || 1000,
    max_investment: product?.max_investment || undefined,
    description: product?.description || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      max_investment: formData.max_investment || undefined,
    });
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Plus size={20} className="mr-2" />
            {product ? 'Edit Product' : 'Add New Product'}
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="investment_type">Investment Type</Label>
                <Select value={formData.investment_type} onValueChange={(value) => handleChange('investment_type', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(InvestmentType).map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tenure_months">Tenure (Months)</Label>
                <Input
                  id="tenure_months"
                  type="number"
                  value={formData.tenure_months}
                  onChange={(e) => handleChange('tenure_months', parseInt(e.target.value))}
                  min="1"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="annual_yield">Annual Yield (%)</Label>
                <Input
                  id="annual_yield"
                  type="number"
                  step="0.01"
                  value={formData.annual_yield}
                  onChange={(e) => handleChange('annual_yield', parseFloat(e.target.value))}
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="risk_level">Risk Level</Label>
                <Select value={formData.risk_level} onValueChange={(value) => handleChange('risk_level', value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select risk level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.values(RiskLevel).map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.charAt(0).toUpperCase() + level.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_investment">Minimum Investment</Label>
                <Input
                  id="min_investment"
                  type="number"
                  value={formData.min_investment}
                  onChange={(e) => handleChange('min_investment', parseFloat(e.target.value))}
                  min="0"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="max_investment">Maximum Investment (Optional)</Label>
                <Input
                  id="max_investment"
                  type="number"
                  value={formData.max_investment || ''}
                  onChange={(e) => handleChange('max_investment', e.target.value ? parseFloat(e.target.value) : undefined)}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter product description"
                rows={4}
              />
            </div>

            <div className="flex space-x-3">
              <Button type="submit" variant="hero" className="flex-1">
                <FloppyDisk size={16} className="mr-2" />
                {product ? 'Update Product' : 'Create Product'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
};