"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  Package,
  DollarSign,
  CreditCard,
  AlertCircle,
  Settings,
  CheckCircle,
  XCircle,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useLanguage } from "@/components/language-provider";
import { formatCurrency, formatDate } from "@/lib/format";
import { ConversionStatus, WithdrawalStatus, UserRole } from "@/lib/constants";
import { toast } from "sonner";

/* eslint-disable @typescript-eslint/no-explicit-any */
type AdminDashboardProps = {
  users: any[];
  products: any[];
  conversions: any[];
  withdrawals: any[];
  disputes: any[];
  settings?: {
    platformFee: number;
    minWithdrawal: number;
    cookieDays: number;
    payoutDelayDays: number;
    autoValidate: boolean;
  };
};

export function AdminDashboard({
  users,
  products,
  conversions,
  withdrawals,
  disputes,
  settings,
}: AdminDashboardProps) {
  const { isAr } = useLanguage();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");

  const totalRevenue = conversions
    .filter((c) => c.status === ConversionStatus.VALIDATED)
    .reduce((acc, c) => acc + c.amount, 0);

  const totalCommissions = conversions
    .filter((c) => c.status === ConversionStatus.VALIDATED)
    .reduce((acc, c) => acc + c.commission, 0);

  const stats = [
    {
      title: "Utilisateurs",
      value: users.length,
      icon: Users,
    },
    {
      title: "Produits",
      value: products.length,
      icon: Package,
    },
    {
      title: "Revenus générés",
      value: formatCurrency(totalRevenue),
      icon: DollarSign,
    },
    {
      title: "Commissions",
      value: formatCurrency(totalCommissions),
      icon: CreditCard,
    },
  ];

  async function approveProduct(productId: string, approved: boolean) {
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isApproved: approved }),
      });

      if (!res.ok) throw new Error();

      toast.success(approved ? "Produit approuvé" : "Produit rejeté");
      router.refresh();
    } catch {
      toast.error("Erreur");
    }
  }

  async function updateWithdrawal(withdrawalId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/withdrawals/${withdrawalId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      toast.success("Retrait mis à jour");
      router.refresh();
    } catch {
      toast.error("Erreur");
    }
  }

  async function updateConversion(conversionId: string, status: string) {
    try {
      const res = await fetch(`/api/admin/conversions/${conversionId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!res.ok) throw new Error();

      toast.success("Conversion mise à jour");
      router.refresh();
    } catch {
      toast.error("Erreur");
    }
  }

  async function saveSettings(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          platformFee: parseFloat(formData.get("platformFee") as string),
          minWithdrawal: parseFloat(formData.get("minWithdrawal") as string),
          cookieDays: parseInt(formData.get("cookieDays") as string),
          payoutDelayDays: parseInt(formData.get("payoutDelayDays") as string),
          autoValidate: formData.get("autoValidate") === "on",
        }),
      });

      if (!res.ok) throw new Error();

      toast.success("Paramètres enregistrés");
      router.refresh();
    } catch {
      toast.error("Erreur");
    }
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Admin Panel</h1>
        <p className="text-muted-foreground">Gestion de la plateforme</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6 flex-wrap h-auto">
          <TabsTrigger value="overview">
            <LayoutDashboard className="h-4 w-4 mr-2" /> Vue d&apos;ensemble
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" /> Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="products">
            <Package className="h-4 w-4 mr-2" /> Produits
          </TabsTrigger>
          <TabsTrigger value="conversions">
            <DollarSign className="h-4 w-4 mr-2" /> Conversions
          </TabsTrigger>
          <TabsTrigger value="withdrawals">
            <CreditCard className="h-4 w-4 mr-2" /> Retraits
          </TabsTrigger>
          <TabsTrigger value="disputes">
            <AlertCircle className="h-4 w-4 mr-2" /> Litiges
          </TabsTrigger>
          <TabsTrigger value="settings">
            <Settings className="h-4 w-4 mr-2" /> Paramètres
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <stat.icon className="h-4 w-4 text-morocco-green" />
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.role === UserRole.ADMIN
                              ? "destructive"
                              : user.role === UserRole.ENTERPRISE
                              ? "default"
                              : "secondary"
                          }
                        >
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>{user.status}</TableCell>
                      <TableCell>{formatDate(user.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="products">
          <Card>
            <CardHeader>
              <CardTitle>Modération des produits</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Entreprise</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.enterprise.enterprise?.companyName}</TableCell>
                      <TableCell>{formatCurrency(product.price)}</TableCell>
                      <TableCell>
                        <Badge
                          variant={product.isApproved ? "success" : "warning"}
                        >
                          {product.isApproved ? "Approuvé" : "En attente"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {!product.isApproved && (
                            <Button
                              size="sm"
                              onClick={() => approveProduct(product.id, true)}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" /> Approuver
                            </Button>
                          )}
                          {product.isApproved && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => approveProduct(product.id, false)}
                            >
                              <XCircle className="h-4 w-4 mr-1" /> Suspendre
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="conversions">
          <Card>
            <CardHeader>
              <CardTitle>Conversions</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Produit</TableHead>
                    <TableHead>Affilié</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Commission</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {conversions.map((conversion) => (
                    <TableRow key={conversion.id}>
                      <TableCell>{conversion.product.name}</TableCell>
                      <TableCell>{conversion.affiliate.name}</TableCell>
                      <TableCell>{formatCurrency(conversion.amount)}</TableCell>
                      <TableCell>
                        {formatCurrency(conversion.commission)}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            conversion.status === ConversionStatus.VALIDATED
                              ? "success"
                              : conversion.status === ConversionStatus.REJECTED
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {conversion.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateConversion(
                                conversion.id,
                                ConversionStatus.VALIDATED
                              )
                            }
                          >
                            Valider
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateConversion(
                                conversion.id,
                                ConversionStatus.REJECTED
                              )
                            }
                          >
                            Rejeter
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

        <TabsContent value="withdrawals">
          <Card>
            <CardHeader>
              <CardTitle>Demandes de retrait</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Utilisateur</TableHead>
                    <TableHead>Montant</TableHead>
                    <TableHead>Méthode</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {withdrawals.map((withdrawal) => (
                    <TableRow key={withdrawal.id}>
                      <TableCell>
                        {withdrawal.user.name}
                        <br />
                        <span className="text-xs text-muted-foreground">
                          {withdrawal.user.email}
                        </span>
                      </TableCell>
                      <TableCell>{formatCurrency(withdrawal.amount)}</TableCell>
                      <TableCell>{withdrawal.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            withdrawal.status === WithdrawalStatus.PAID
                              ? "success"
                              : withdrawal.status === WithdrawalStatus.REJECTED
                              ? "destructive"
                              : "warning"
                          }
                        >
                          {withdrawal.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              updateWithdrawal(
                                withdrawal.id,
                                WithdrawalStatus.PAID
                              )
                            }
                          >
                            Payer
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              updateWithdrawal(
                                withdrawal.id,
                                WithdrawalStatus.REJECTED
                              )
                            }
                          >
                            Rejeter
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

        <TabsContent value="disputes">
          <Card>
            <CardHeader>
              <CardTitle>Litiges</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plaignant</TableHead>
                    <TableHead>Cible</TableHead>
                    <TableHead>Raison</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disputes.map((dispute) => (
                    <TableRow key={dispute.id}>
                      <TableCell>{dispute.opener.name}</TableCell>
                      <TableCell>{dispute.target.name}</TableCell>
                      <TableCell>{dispute.reason}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            dispute.status === "OPEN" ? "warning" : "success"
                          }
                        >
                          {dispute.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(dispute.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card>
            <CardHeader>
              <CardTitle>Paramètres de la plateforme</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={saveSettings} className="space-y-4 max-w-md">
                <div className="space-y-2">
                  <Label htmlFor="platformFee">
                    Frais de plateforme (%)
                  </Label>
                  <Input
                    id="platformFee"
                    name="platformFee"
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    defaultValue={settings?.platformFee || 10}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="minWithdrawal">
                    Retrait minimum (MAD)
                  </Label>
                  <Input
                    id="minWithdrawal"
                    name="minWithdrawal"
                    type="number"
                    min="0"
                    defaultValue={settings?.minWithdrawal || 100}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cookieDays">Durée du cookie (jours)</Label>
                  <Input
                    id="cookieDays"
                    name="cookieDays"
                    type="number"
                    min="1"
                    defaultValue={settings?.cookieDays || 30}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="payoutDelayDays">
                    Délai de paiement (jours)
                  </Label>
                  <Input
                    id="payoutDelayDays"
                    name="payoutDelayDays"
                    type="number"
                    min="0"
                    defaultValue={settings?.payoutDelayDays || 14}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    id="autoValidate"
                    name="autoValidate"
                    defaultChecked={settings?.autoValidate}
                  />
                  <Label htmlFor="autoValidate">
                    Validation automatique des conversions
                  </Label>
                </div>
                <Button type="submit">Enregistrer</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
