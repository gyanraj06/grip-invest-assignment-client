import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { ProductForm } from "@/components/admin/ProductForm";
import { ProductList } from "@/components/admin/ProductList";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InvestmentProduct, InvestmentType, RiskLevel } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import { motion } from "framer-motion";
import { Plus, TrendUp, Users, Package, ChartBar } from "phosphor-react";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<InvestmentProduct[]>([]);
  const [editingProduct, setEditingProduct] =
    useState<InvestmentProduct | null>(null);
  const [showForm, setShowForm] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Mock data for demonstration
  useEffect(() => {
    const mockProducts: InvestmentProduct[] = [
      {
        id: "1",
        name: "Growth Equity Fund",
        investment_type: InvestmentType.STOCKS,
        tenure_months: 24,
        annual_yield: 12.5,
        risk_level: RiskLevel.HIGH,
        min_investment: 10000,
        max_investment: 500000,
        description: "High-growth equity fund focusing on emerging markets",
        created_by: user?.id,
        created_at: new Date().toISOString(),
      },
      {
        id: "2",
        name: "Stable Bond Portfolio",
        investment_type: InvestmentType.BONDS,
        tenure_months: 12,
        annual_yield: 7.8,
        risk_level: RiskLevel.LOW,
        min_investment: 5000,
        max_investment: 200000,
        description: "Conservative bond portfolio with steady returns",
        created_by: user?.id,
        created_at: new Date().toISOString(),
      },
    ];
    setProducts(mockProducts);
  }, [user?.id]);

  const handleProductSubmit = (
    productData: Omit<InvestmentProduct, "id" | "created_at" | "updated_at">
  ) => {
    if (editingProduct) {
      // Update existing product
      const updatedProduct = {
        ...editingProduct,
        ...productData,
        updated_at: new Date().toISOString(),
      };
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
      );
      toast({
        title: "Product Updated",
        description: `${productData.name} has been updated successfully.`,
      });
    } else {
      // Create new product
      const newProduct: InvestmentProduct = {
        ...productData,
        id: Date.now().toString(),
        created_by: user?.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setProducts((prev) => [...prev, newProduct]);
      toast({
        title: "Product Created",
        description: `${productData.name} has been created successfully.`,
      });
    }

    setShowForm(false);
    setEditingProduct(null);
  };

  const handleEdit = (product: InvestmentProduct) => {
    setEditingProduct(product);
    setShowForm(true);
  };

  const handleDelete = (id: string) => {
    const product = products.find((p) => p.id === id);
    setProducts((prev) => prev.filter((p) => p.id !== id));
    toast({
      title: "Product Deleted",
      description: `${product?.name} has been deleted successfully.`,
      variant: "destructive",
    });
  };

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      title: "Average Yield",
      value: `${(
        products.reduce((sum, p) => sum + p.annual_yield, 0) /
          products.length || 0
      ).toFixed(1)}%`,
      icon: TrendUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      title: "High Risk Products",
      value: products
        .filter((p) => p.risk_level === RiskLevel.HIGH)
        .length.toString(),
      icon: ChartBar,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
    },
    {
      title: "Active Users",
      value: "24",
      icon: Users,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
  ];

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
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-muted-foreground">
                Manage investment products and monitor platform performance
              </p>
            </div>
            <Button onClick={() => setShowForm(true)} variant="hero">
              <Plus size={16} className="mr-2" />
              Add Product
            </Button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="financial-card">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground font-medium">
                          {stat.title}
                        </p>
                        <p className="text-2xl font-bold mt-1">{stat.value}</p>
                      </div>
                      <div
                        className={`w-12 h-12 rounded-full ${stat.bgColor} flex items-center justify-center`}
                      >
                        <stat.icon size={24} className={stat.color} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Main Content */}
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 lg:w-auto lg:grid-cols-3">
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              {showForm ? (
                <ProductForm
                  product={editingProduct || undefined}
                  onSubmit={handleProductSubmit}
                  onCancel={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                />
              ) : (
                <ProductList
                  products={products}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              )}
            </TabsContent>

            <TabsContent value="analytics">
              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>Platform Analytics</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Analytics dashboard coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="financial-card">
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    User management interface coming soon...
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
