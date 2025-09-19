import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { InvestmentProduct } from '@/types';
import { Pencil, Trash, TrendUp } from 'phosphor-react';
import { motion } from 'framer-motion';

interface ProductListProps {
  products: InvestmentProduct[];
  onEdit: (product: InvestmentProduct) => void;
  onDelete: (id: string) => void;
}

export const ProductList: React.FC<ProductListProps> = ({ products, onEdit, onDelete }) => {
  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'low': return 'default';
      case 'moderate': return 'secondary';
      case 'high': return 'destructive';
      default: return 'default';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
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
            <TrendUp size={20} className="mr-2" />
            Investment Products ({products.length})
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <TrendUp size={48} className="mx-auto mb-4 opacity-50" />
              <p>No products found. Create your first investment product!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Tenure</TableHead>
                    <TableHead>Annual Yield</TableHead>
                    <TableHead>Risk Level</TableHead>
                    <TableHead>Min Investment</TableHead>
                    <TableHead>Max Investment</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product, index) => (
                    <motion.tr
                      key={product.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group hover:bg-secondary/50"
                    >
                      <TableCell className="font-medium">{product.name}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {product.investment_type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.tenure_months} months</TableCell>
                      <TableCell className="metric-positive font-semibold">
                        {product.annual_yield}%
                      </TableCell>
                      <TableCell>
                        <Badge variant={getRiskBadgeVariant(product.risk_level)}>
                          {product.risk_level.charAt(0).toUpperCase() + product.risk_level.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatCurrency(product.min_investment)}</TableCell>
                      <TableCell>
                        {product.max_investment ? formatCurrency(product.max_investment) : 'No limit'}
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onEdit(product)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => onDelete(product.id)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <Trash size={14} />
                          </Button>
                        </div>
                      </TableCell>
                    </motion.tr>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};