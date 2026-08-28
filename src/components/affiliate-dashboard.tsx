"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Link as LinkIcon,
  DollarSign,
  CreditCard,
  MousePointer,
  TrendingUp,
  Copy,
  ExternalLink,
  Share2,
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
import { WithdrawalForm } from "@/components/withdrawal-form";
import { MaterialsGallery } from "@/components/materials-gallery";
import { RulesDialog } from "@/components/rules-dialog";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency, formatDate, generateAffiliateCode } from "@/lib/format";
import { ConversionStatus } from "@/lib/constants";
import { toast } from "sonner";

type AffiliateDashboardProps = {
  user: {
    id: string;
    name: string;
    affiliate: { balance: number; totalEarned: number } | null;
    affiliateLinks: AffiliateLink[];
    conversions: Conversion[];
    commissions: Commission[];
    withdrawals: Withdrawal[];
  };
  availableProducts: Product[];
};

type AffiliateLink = {
  id: string;
  code: string;
  isActive: boolean;
  product: ProductWithEnterprise;
  clicks: { id: string }[];
  conversions: { id: string; amount: number; commission: number; status: string }[];
};

type ProductWithEnterprise = {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  category: string;
  commissionType: string;
  commissionValue: number;
  enterprise: { enterprise?: { companyName: string } | null };
};

type Product = ProductWithEnterprise;

type Conversion = {
  id: string;
  amount: number;
  commission: number;
  status: string;
  createdAt: Date;
  product: { name: string };
};

type Commission = {
  id: string;
  amount: number;
  netAmount: number;
  paidAt: Date | null;
  createdAt: Date;
};

type Withdrawal = {
  id: string;
  amount: number;
  method: string;
  status: string;
  createdAt: Date;
};

type PendingRule = {
  id: string;
  title: string;
  content: string;
};

export function AffiliateDashboard({
  user,
  availableProducts,
}: AffiliateDashboardProps) {
  const { t, isAr } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [rulesDialogOpen, setRulesDialogOpen] = useState(false);
  const [pendingRules, setPendingRules] = useState<PendingRule[]>([]);

  const totalClicks = user.affiliateLinks.reduce(
    (acc, link) => acc + link.clicks.length,
    0
  );

  const validatedConversions = user.conversions.filter(
    (c) => c.status === ConversionStatus.VALIDATED
  );

  const conversionRate =
    totalClicks > 0
      ? ((validatedConversions.length / totalClicks) * 100).toFixed(2)
      : "0";

  const stats = [
    {
      title: t("balance"),
      value: formatCurrency(user.affiliate?.balance || 0),
      icon: DollarSign,
      color: "text-morocco-green",
    },
    {
      title: t("myEarnings"),
      value: formatCurrency(user.affiliate?.totalEarned || 0),
      icon: WalletIcon,
      color: "text-morocco-gold",
    },
    {
      title: t("totalClicks"),
      value: totalClicks,
      icon: MousePointer,
      color: "text-blue-600",
    },
    {
      title: t("conversionRate"),
      value: `${conversionRate}%`,
      icon: TrendingUp,
      color: "text-green-600",
    },
  ];

  async function generateLink(productId: string) {
    try {
      const res = await fetch("/api/affiliate-links", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, code: generateAffiliateCode() }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.error === "RULES_PENDING" && data.rules) {
          setPendingRules(data.rules);
          setRulesDialogOpen(true);
          return;
        }
        toast.error(data.error || t("errGeneric"));
        return;
      }

      toast.success(t("generatedLink"));
      router.refresh();
    } catch {
      toast.error(t("serverError"));
    }
  }

  function copyLink(code: string, prefix: "r" | "s" = "r") {
    const url = `${window.location.origin}/${prefix}/${code}`;
    navigator.clipboard.writeText(url);
    toast.success(t("copied"));
  }

  function openShare(code: string) {
    const shareUrl = `${window.location.origin}/s/${code}`;
    window.open(shareUrl, "_blank", "noopener,noreferrer");
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">{t("dashboard")}</h1>
          <p className="text-muted-foreground">{user.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <Card className="px-4 py-2">
            <p className="text-xs text-muted-foreground">{t("balance")}</p>
            <p className="font-bold text-morocco-green">
              {formatCurrency(user.affiliate?.balance || 0)}
            </p>
          </Card>
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <CreditCard className="mr-2 h-4 w-4" /> {t("withdraw")}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{t("withdraw")}</DialogTitle>
              </DialogHeader>
              <WithdrawalForm balance={user.affiliate?.balance || 0} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" /> {t("dashboard")}
          </TabsTrigger>
          <TabsTrigger value="catalog">
            <ShoppingBag className="h-4 w-4 mr-2" /> {t("catalog")}
          </TabsTrigger>
          <TabsTrigger value="links">
            <LinkIcon className="h-4 w-4 mr-2" /> {t("affiliateLink")}
          </TabsTrigger>
          <TabsTrigger value="commissions">
            <DollarSign className="h-4 w-4 mr-2" /> {t("myEarnings")}
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <CreditCard className="h-4 w-4 mr-2" /> {t("withdraw")}
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
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("commission")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {user.conversions.slice(0, 5).map((conversion) => (
                      <TableRow key={conversion.id}>
                        <TableCell>{conversion.product.name}</TableCell>
                        <TableCell>{formatCurrency(conversion.amount)}</TableCell>
                        <TableCell className="text-morocco-green">
                          {formatCurrency(conversion.commission)}
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={conversion.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="catalog" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableProducts.map((product) => {
              const existingLink = user.affiliateLinks.find(
                (l) => l.product.id === product.id
              );
              return (
                <Card key={product.id} className="overflow-hidden">
                  <div className="relative h-40 bg-muted">
                    {product.imageUrl && (
                      <Image
                        src={product.imageUrl}
                        alt={product.name}
                        fill
                        className="object-cover"
                      />
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-1">
                      {product.enterprise.enterprise?.companyName}
                    </p>
                    <p className="text-sm font-medium mb-2">
                      {formatCurrency(product.price)}
                    </p>
                    <p className="text-sm text-morocco-green mb-4">
                      {t("commission")}:{" "}
                      {product.commissionType === "PERCENTAGE"
                        ? `${product.commissionValue}%`
                        : formatCurrency(product.commissionValue)}
                    </p>
                    {existingLink ? (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => copyLink(existingLink.code)}
                        >
                          <Copy className="mr-2 h-4 w-4" /> {t("copy")}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={() => openShare(existingLink.code)}
                        >
                          <Share2 className="mr-2 h-4 w-4" /> {t("share")}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => generateLink(product.id)}
                      >
                        <LinkIcon className="mr-2 h-4 w-4" /> {t("generateLink")}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="links" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>{t("affiliateLink")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("productName")}</TableHead>
                    <TableHead>{t("affiliateLink")}</TableHead>
                    <TableHead>{t("clicks")}</TableHead>
                    <TableHead>{t("conversions")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.affiliateLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell>{link.product.name}</TableCell>
                      <TableCell>
                        <code className="text-xs bg-muted px-2 py-1 rounded">
                          {link.code}
                        </code>
                      </TableCell>
                      <TableCell>{link.clicks.length}</TableCell>
                      <TableCell>{link.conversions.length}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyLink(link.code)}
                            title={t("copyAffiliateLinkTitle")}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => copyLink(link.code, "s")}
                            title={t("copyShortLinkTitle")}
                          >
                            <LinkIcon className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openShare(link.code)}
                            title={t("shareSocialTitle")}
                          >
                            <Share2 className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" asChild>
                            <a
                              href={`/r/${link.code}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
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
                    <TableHead>{t("date")}</TableHead>
                    <TableHead>{t("amount")}</TableHead>
                    <TableHead>{t("commission")}</TableHead>
                    <TableHead>{t("status")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {user.commissions.map((commission) => (
                    <TableRow key={commission.id}>
                      <TableCell>{formatDate(commission.createdAt)}</TableCell>
                      <TableCell>{formatCurrency(commission.amount)}</TableCell>
                      <TableCell className="text-morocco-green">
                        {formatCurrency(commission.netAmount)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={commission.paidAt ? "success" : "warning"}>
                          {commission.paidAt ? t("paid") : t("pending")}
                        </Badge>
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
                        <StatusBadge status={withdrawal.status} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="materials" className="space-y-6">
          <MaterialsGallery />
        </TabsContent>
      </Tabs>
      <RulesDialog
        open={rulesDialogOpen}
        onOpenChange={setRulesDialogOpen}
        rules={pendingRules}
        onAgreed={() => {
          setRulesDialogOpen(false);
          setPendingRules([]);
        }}
      />
    </div>
  );
}

function WalletIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
      <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
      <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
    </svg>
  );
}

function StatusBadge({ status }: { status: string }) {
  const variantMap: Record<string, "default" | "success" | "warning" | "destructive" | "secondary"> = {
    PENDING: "warning",
    VALIDATED: "success",
    APPROVED: "success",
    PAID: "success",
    REJECTED: "destructive",
    PROCESSING: "secondary",
  };

  return <Badge variant={variantMap[status] || "default"}>{status}</Badge>;
}
