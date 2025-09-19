import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/AuthContext";
import { Wallet, Plus, CreditCard } from "phosphor-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export const BalanceManager: React.FC = () => {
  const [addAmount, setAddAmount] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { user, updateUser } = useAuth();
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  const handleAddFunds = async () => {
    if (!user || addAmount <= 0) return;

    try {
      await updateUser({
        balance: user.balance + addAmount,
      });

      toast({
        title: "Funds Added Successfully",
        description: `$${addAmount.toLocaleString()} has been added to your account.`,
      });

      setAddAmount(0);
      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add funds. Please try again.",
        variant: "destructive",
      });
    }
  };

  const quickAmounts = [1000, 5000, 10000, 25000, 50000];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <Card className="financial-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <Wallet size={20} className="mr-2" />
              Account Balance
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="hero" size="sm">
                  <Plus size={16} className="mr-2" />
                  Add Funds
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="flex items-center">
                    <CreditCard size={20} className="mr-2" />
                    Add Funds to Account
                  </DialogTitle>
                </DialogHeader>

                <div className="space-y-6">
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        Current Balance:
                      </span>
                      <span className="text-lg font-bold">
                        {formatCurrency(user?.balance || 0)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="amount">Amount to Add</Label>
                      <Input
                        id="amount"
                        type="number"
                        value={addAmount}
                        onChange={(e) =>
                          setAddAmount(parseFloat(e.target.value) || 0)
                        }
                        min="1"
                        placeholder="Enter amount"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Quick Add</Label>
                      <div className="grid grid-cols-3 gap-2">
                        {quickAmounts.map((amount) => (
                          <Button
                            key={amount}
                            variant="outline"
                            size="sm"
                            onClick={() => setAddAmount(amount)}
                            className="text-xs"
                          >
                            ${amount.toLocaleString()}
                          </Button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {addAmount > 0 && (
                    <div className="p-4 bg-success/5 border border-success/20 rounded-lg">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          New Balance:
                        </span>
                        <span className="font-bold metric-positive text-lg">
                          {formatCurrency((user?.balance || 0) + addAmount)}
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      onClick={handleAddFunds}
                      variant="hero"
                      className="flex-1"
                      disabled={addAmount <= 0}
                    >
                      Add {formatCurrency(addAmount)}
                    </Button>
                    <Button
                      onClick={() => setIsDialogOpen(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="text-center py-6">
            <p className="text-3xl font-bold mb-2">
              {formatCurrency(user?.balance || 0)}
            </p>
            <p className="text-muted-foreground">Available for investment</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">This Month</p>
              <p className="font-semibold">$0</p>
              <p className="text-xs text-muted-foreground">Added</p>
            </div>
            <div className="text-center p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="font-semibold">$0</p>
              <p className="text-xs text-muted-foreground">All time</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};
