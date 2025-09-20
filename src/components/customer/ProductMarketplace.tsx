import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { InvestmentProduct } from "@/types";
import {
  TrendUp,
  ShoppingCart,
  Clock,
  Shield,
  CurrencyDollar,
} from "phosphor-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

interface ProductMarketplaceProps {
  products: InvestmentProduct[];
  onPurchase: (productId: string, amount: number) => void;
}

export const ProductMarketplace: React.FC<ProductMarketplaceProps> = ({
  products,
  onPurchase,
}) => {
  const [selectedProduct, setSelectedProduct] =
    useState<InvestmentProduct | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "low":
        return "text-success";
      case "moderate":
        return "text-accent";
      case "high":
        return "text-destructive";
      default:
        return "text-muted-foreground";
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case "low":
        return "default";
      case "moderate":
        return "secondary";
      case "high":
        return "destructive";
      default:
        return "default";
    }
  };

  const handleInvest = () => {
    if (!selectedProduct || !investmentAmount) return;

    onPurchase(selectedProduct.id, investmentAmount);
    setIsDialogOpen(false);
    setInvestmentAmount(0);
    setSelectedProduct(null);

    toast({
      title: "Investment Successful",
      description: `Successfully invested ${formatCurrency(
        investmentAmount
      )} in ${selectedProduct.name}`,
    });
  };

  const openInvestDialog = (product: InvestmentProduct) => {
    setSelectedProduct(product);
    setInvestmentAmount(product.min_investment);
    setIsDialogOpen(true);
  };

  const calculateExpectedReturn = () => {
    if (!selectedProduct || !investmentAmount) return 0;
    return (
      (investmentAmount *
        selectedProduct.annual_yield *
        selectedProduct.tenure_months) /
      (12 * 100)
    );
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, index) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className="financial-card hover:shadow-lg transition-all duration-300 cursor-pointer group">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <Badge variant={getRiskBadgeVariant(product.risk_level)}>
                    {product.risk_level.charAt(0).toUpperCase() +
                      product.risk_level.slice(1)}
                  </Badge>
                </div>
                <Badge variant="outline" className="w-fit">
                  {product.investment_type
                    .replace(/_/g, " ")
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center space-x-2">
                    <TrendUp size={16} className="text-success" />
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Annual Yield
                      </p>
                      <p className="font-semibold metric-positive">
                        {product.annual_yield}%
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Tenure</p>
                      <p className="font-semibold">{product.tenure_months}M</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      Min Investment:
                    </span>
                    <span className="font-medium">
                      {formatCurrency(product.min_investment)}
                    </span>
                  </div>
                  {product.max_investment && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">
                        Max Investment:
                      </span>
                      <span className="font-medium">
                        {formatCurrency(product.max_investment)}
                      </span>
                    </div>
                  )}
                </div>

                {product.description && (
                  <p className="text-sm text-muted-foreground">
                    {product.description}
                  </p>
                )}

                <Button
                  onClick={() => openInvestDialog(product)}
                  className="w-full group-hover:scale-105 transition-transform"
                  variant="hero"
                >
                  <ShoppingCart size={16} className="mr-2" />
                  Invest Now
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <CurrencyDollar size={20} className="mr-2" />
              Invest in {selectedProduct?.name}
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              <div className="p-4 bg-secondary rounded-lg space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Annual Yield:
                  </span>
                  <span className="font-semibold metric-positive">
                    {selectedProduct.annual_yield}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tenure:</span>
                  <span className="font-semibold">
                    {selectedProduct.tenure_months} months
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Risk Level:
                  </span>
                  <Badge
                    variant={getRiskBadgeVariant(selectedProduct.risk_level)}
                  >
                    {selectedProduct.risk_level.charAt(0).toUpperCase() +
                      selectedProduct.risk_level.slice(1)}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Investment Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={investmentAmount}
                  onChange={(e) =>
                    setInvestmentAmount(parseFloat(e.target.value) || 0)
                  }
                  min={selectedProduct.min_investment}
                  max={selectedProduct.max_investment || undefined}
                  placeholder="Enter amount"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>
                    Min: {formatCurrency(selectedProduct.min_investment)}
                  </span>
                  {selectedProduct.max_investment && (
                    <span>
                      Max: {formatCurrency(selectedProduct.max_investment)}
                    </span>
                  )}
                </div>
              </div>

              {investmentAmount > 0 && (
                <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">
                      Expected Return:
                    </span>
                    <span className="font-bold metric-positive text-lg">
                      {formatCurrency(calculateExpectedReturn())}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Total after {selectedProduct.tenure_months} months:{" "}
                    {formatCurrency(
                      investmentAmount + calculateExpectedReturn()
                    )}
                  </p>
                </div>
              )}

              <div className="flex space-x-3">
                <Button
                  onClick={handleInvest}
                  variant="hero"
                  className="flex-1"
                >
                  Confirm Investment
                </Button>
                <Button
                  onClick={() => setIsDialogOpen(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
