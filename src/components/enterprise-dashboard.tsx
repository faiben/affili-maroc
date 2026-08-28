"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  Users,
  DollarSign,
  CreditCard,
  Plus,
  Eye,
  TrendingUp,
  MousePointer,
  CheckCircle,
  Shield,
  Megaphone,
} from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ProductForm } from "@/components/product-form";
import { RulesManager } from "@/components/rules-manager";
import { MaterialsManager } from "@/components/materials-manager";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { ConversionStatus } from "@/lib/constants";

type UserWithRelations = {
  id: string;
  name: string;
  email: string;
  enterprise: {
    companyName: string;
    balance: number;
  } | null;
  products: ProductWithRelations[];
  conversions: ConversionWithRelations[];
  withdrawals: Withdrawal[];
};

type ProductWithRelations = {
  id: string;
  name: string;
  price: number;
  category: string;
  commissionType: string;
  commissionValue: number;
  isActive: boolean;
  isApproved: boolean;
  imageUrl: string | null;
  url: string;
  affiliateLinks: AffiliateLinkWithRelations[];
};

type AffiliateLinkWithRelations = {
  id: string;
  code: string;
  isActive: boolean;
  affiliate: { name: string; email: string };
  clicks: { id: string }[];
  conversions: { id: string; amount: number; commission: number }[];
};

type ConversionWithRelations = {
  id: string;
  amount: number;
  commission: number;
  status: string;
  createdAt: Date;
  product: { name: string };
  affiliate: { name: string };
};

type Withdrawal = {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
};

export function EnterpriseDashboard({ user }: { user: UserWithRelations }) {
  const { t, isAr } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const totalClicks = user.products.reduce(
    (acc, p) =>
      acc +
      p.affiliateLinks.reduce((sum, link) => sum + link.clicks.length, 0),
    0
  );

  const totalConversions = user.conversions.filter(
    (c) => c.status === ConversionStatus.VALIDATED
  ).length;

  const totalRevenue = user.conversions
    .filter((c) => c.status === ConversionStatus.VALIDATED)
    .reduce((acc, c) => acc + c.amount, 0);

  const conversionRate =
    totalClicks > 0 ? ((totalConversions / totalClicks) * 100).toFixed(2) : "0";

  const stats = [
    {
      title: t("totalClicks"),
      value: totalClicks,
      icon: MousePointer,
      color: "text-blue-600",
    },
    {
      title: t("totalConversions"),
      value: totalConversions,
      icon: CheckCircle,
      color: "text-green-600",
    },
    {
      title: t("conversionRate"),
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-morocco-gold",
    },
    {
      title: t("totalRevenue"),
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
      color: "text-morocco-green",
    },
  ];

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <p className="text-muted-foreground">
            {user.enterprise?.companyName}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <p className="text-xs text-muted-foreground">{t("balance")}</p>
            <p className="font-bold text-morocco-green">
              {formatCurrency(user.enterprise?.balance || 0)}
            </p>
          </Card>
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" /> {t("addProduct")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{t("addProduct")}</DialogTitle>
              </DialogHeader>
              <ProductForm />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" /> {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" /> {t("products")}
          </TabsTrigger>
          <TabsTrigger value="affiliates">
            <Users className="h-4 w-4 mr-2" /> {t("affiliates")}
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <DollarSign className="h-4 w-4 mr-2" /> {t("commission")}
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <CreditCard className="h-4 w-4 mr-2" /> {t("withdraw")}
          </TabsTrigger>
          <TabsTrigger value="rules">
            <Shield className="h-4 w-4 mr-2" /> {t("rules")}
          </TabsTrigger>
          <TabsTrigger value="materials">
            <Megaphone className="h-4 w-4 mr-2" /> {t("marketingMaterials")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">
                      {stat.title}
                    </CardTitle>
                    <stat.icon className={`h-4 w-4 ${stat.color}`} />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{stat.value}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>{t("recentConversions")}</CardTitle>
            </CardHeader>
            <CardContent>
              {user.conversions.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  {t("noData")}
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("productName")}</TableHead>
                      <TableHead>{t("affiliate")}</TableHead>
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("commission")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.conversions.slice(0, 5).map((conversion) => (
                      <TableRow key={conversion.id}>
                        <TableCell>{conversion.product.name}</TableCell>
                        <TableCell>{conversion.affiliate.name}</TableCell>
                        <TableCell>{formatCurrency(conversion.amount)}</TableCell>
                        <TableCell className="text-morocco-green">
                          {formatCurrency(conversion.commission)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={conversion.status} label={t(conversion.status.toLowerCase() as keyof typeof import('@/lib/translations').translations.fr) || conversion.status} />
                        </TableCell>
                        <TableCell>{formatDate(conversion.createdAt)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {user.products.map((product) => (
              <Card key={product.id} className="overflow-hidden">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{
                    backgroundImage: `url(${product.imageUrl || "/placeholder.svg"})`,
                  }}
                />
                <CardHeader>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("price")}: {formatCurrency(product.price)}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {t("commission")}:{" "}
                    {product.commissionType === "PERCENTAGE"
                      ? `${product.commissionValue}%`
                      : formatCurrency(product.commissionValue)}
                  </p>
                  <div className="flex gap-2 mt-4">
                    <Badge variant={product.isActive ? "success" : "secondary"}>
                      {product.isActive ? t("active") : t("inactive")}
                    </Badge>
                    <Badge variant={product.isApproved ? "success" : "warning"}>
                      {product.isApproved ? t("approved") : t("pending")}
                    </Badge>
                  </div>
                  <Button variant="outline" size="sm" className="w-full mt-4" asChild>
                    <Link href={product.url} target="_blank">
                      <Eye className="mr-2 h-4 w-4" /> {t("view")}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="affiliates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("affiliates")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("affiliate")}</TableHead>
                    <TableHead>{t("productName")}</TableHead>
                    <TableHead>{t("affiliateLink")}</TableHead>
                    <TableHead>{t("clicks")}</TableHead>
                    <TableHead>{t("conversions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.products.flatMap((product) =>
                    product.affiliateLinks.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          {link.affiliate.name}
                          <br />
                          <span className="text-xs text-muted-foreground">
                            {link.affiliate.email}
                          </span>
                        </TableCell>
                        <TableCell>{product.name}</TableCell>
                        <TableCell>
                          <code className="text-xs bg-muted px-2 py-1 rounded">
                            {link.code}
                          </code>
                        </TableCell>
                        <TableCell>{link.clicks.length}</TableCell>
                        <TableCell>{link.conversions.length}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="commissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("commissionHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("productName")}</TableHead>
                    <TableHead>{t("affiliate")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("commission")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.conversions.map((conversion) => (
                    <TableRow key={conversion.id}>
                      <TableCell>{conversion.product.name}</TableCell>
                      <TableCell>{conversion.affiliate.name}</TableCell>
                      <TableCell>{formatCurrency(conversion.amount)}</TableCell>
                      <TableCell className="text-morocco-green">
                        {formatCurrency(conversion.commission)}
                      </TableCell>
                      <TableCell>
                        <StatusBadge status={conversion.status} label={t(conversion.status.toLowerCase() as keyof typeof import('@/lib/translations').translations.fr) || conversion.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="withdrawals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("withdrawalHistory")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("withdrawalMethod")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>{formatDate(withdrawal.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>
                        <StatusBadge status={withdrawal.status} label={t(withdrawal.status.toLowerCase() as keyof typeof import('@/lib/translations').translations.fr) || withdrawal.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          <RulesManager />
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <MaterialsManager />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function StatusBadge({ status, label }: { status: string; label: string }) {
  const variantMap: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
    PENDING: "warning",
    VALIDATED: "success",
    APPROVED: "success",
    ACTIVE: "success",
    PAID: "success",
    REJECTED: "destructive",
    PROCESSING: "secondary",
    OPEN: "warning",
    RESOLVED: "success",
  };

  return <Badge variant={variantMap[status] || "default"}>{label}</Badge>;
}
