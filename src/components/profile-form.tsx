"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Phone, Shield, Building2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useLanguage } from "@/components/language-provider";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { UserRole } from "@/lib/constants";
import { OtpVerification } from "@/components/otp-verification";

type ProfileFormProps = {
  user: {
    id: string;
    name: string;
    email: string;
    emailVerified: Date | null;
    phone: string | null;
    cin: string | null;
    role: string;
    enterprise?: {
      companyName: string;
      description: string | null;
      website: string | null;
      city: string | null;
      address: string | null;
      ice: string | null;
      rc: string | null;
    } | null;
    affiliate?: {
      bio: string | null;
      website: string | null;
      socialInsta: string | null;
      socialTiktok: string | null;
      socialYoutube: string | null;
      socialX: string | null;
    } | null;
  };
};

export function ProfileForm({ user }: ProfileFormProps) {
  const { t, isAr } = useLanguage();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData(e.currentTarget);

    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.get("name"),
          phone: formData.get("phone"),
          ...(user.role === UserRole.ENTERPRISE && {
            companyName: formData.get("companyName"),
            description: formData.get("description"),
            website: formData.get("website"),
            city: formData.get("city"),
            address: formData.get("address"),
            ice: formData.get("ice"),
            rc: formData.get("rc"),
          }),
          ...(user.role === UserRole.AFFILIATE && {
            bio: formData.get("bio"),
            website: formData.get("website"),
            socialInsta: formData.get("socialInsta"),
            socialTiktok: formData.get("socialTiktok"),
            socialYoutube: formData.get("socialYoutube"),
            socialX: formData.get("socialX"),
          }),
        }),
      });

      if (!res.ok) throw new Error();

      toast.success(t("profileUpdated"));
      router.refresh();
    } catch {
      toast.error(t("profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div dir={isAr ? "rtl" : "ltr"}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{t("myAccount")}</h1>
        <p className="text-muted-foreground">{t("profile")}</p>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Avatar className="h-20 w-20">
          <AvatarFallback className="text-2xl bg-morocco-green text-white">
            {user.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-sm text-muted-foreground">{user.email}</p>
          <span className="inline-flex items-center rounded-full bg-morocco-gold/20 px-2.5 py-0.5 text-xs font-medium text-morocco-darkGreen mt-1">
            {user.role === UserRole.ENTERPRISE
              ? t("enterprise")
              : user.role === UserRole.AFFILIATE
              ? t("affiliate")
              : "Admin"}
          </span>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" /> {t("profile")}
          </TabsTrigger>
          <TabsTrigger value="security">
            <Shield className="h-4 w-4 mr-2" /> {t("security")}
          </TabsTrigger>
          <TabsTrigger value="preferences">
            <Globe className="h-4 w-4 mr-2" /> {t("settings")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <form onSubmit={onSubmit}>
            <Card>
              <CardHeader>
                <CardTitle>{t("profile")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t("fullName")}</Label>
                    <Input id="name" name="name" defaultValue={user.name} />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input id="email" type="email" defaultValue={user.email} disabled />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={user.phone || ""}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cin">{t("cin")}</Label>
                    <Input id="cin" defaultValue={user.cin || ""} disabled />
                  </div>
                </div>

                {user.role === UserRole.ENTERPRISE && user.enterprise && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="companyName">{t("companyName")}</Label>
                      <div className="relative">
                        <Building2 className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="companyName"
                          name="companyName"
                          defaultValue={user.enterprise.companyName}
                          className="pl-10"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="website">{t("website")}</Label>
                        <Input
                          id="website"
                          name="website"
                          defaultValue={user.enterprise.website || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">{t("city")}</Label>
                        <Input
                          id="city"
                          name="city"
                          defaultValue={user.enterprise.city || ""}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="address">{t("address")}</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={user.enterprise.address || ""}
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="ice">ICE</Label>
                        <Input
                          id="ice"
                          name="ice"
                          defaultValue={user.enterprise.ice || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="rc">RC</Label>
                        <Input
                          id="rc"
                          name="rc"
                          defaultValue={user.enterprise.rc || ""}
                        />
                      </div>
                    </div>
                  </>
                )}

                {user.role === UserRole.AFFILIATE && user.affiliate && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="bio">{t("bio")}</Label>
                      <Input
                        id="bio"
                        name="bio"
                        defaultValue={user.affiliate.bio || ""}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="website">{t("website")}</Label>
                      <Input
                        id="website"
                        name="website"
                        defaultValue={user.affiliate.website || ""}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="socialInsta">Instagram</Label>
                        <Input
                          id="socialInsta"
                          name="socialInsta"
                          defaultValue={user.affiliate.socialInsta || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialTiktok">TikTok</Label>
                        <Input
                          id="socialTiktok"
                          name="socialTiktok"
                          defaultValue={user.affiliate.socialTiktok || ""}
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="socialYoutube">YouTube</Label>
                        <Input
                          id="socialYoutube"
                          name="socialYoutube"
                          defaultValue={user.affiliate.socialYoutube || ""}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="socialX">X / Twitter</Label>
                        <Input
                          id="socialX"
                          name="socialX"
                          defaultValue={user.affiliate.socialX || ""}
                        />
                      </div>
                    </div>
                  </>
                )}

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "..." : t("save")}
                </Button>
              </CardContent>
            </Card>
          </form>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>{t("security")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("emailVerification")}</p>
                  <p className="text-sm text-muted-foreground">
                    {user.emailVerified
                      ? t("emailVerified")
                      : t("verifyYourEmail")}
                  </p>
                </div>
                <OtpVerification email={user.email} verified={!!user.emailVerified} />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("twoFactorAuth")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("enable2FA")}
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>{t("settings")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t("darkMode")}</p>
                  <p className="text-sm text-muted-foreground">
                    {t("toggleTheme")}
                  </p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) =>
                    setTheme(checked ? "dark" : "light")
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
