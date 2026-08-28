import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/components/language-provider";
import { ProfileForm } from "@/components/profile-form";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/connexion");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      enterprise: true,
      affiliate: true,
    },
  });

  if (!user) {
    redirect("/auth/connexion");
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/30">
      <LanguageProvider>
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-8">
          <ProfileForm user={user} />
        </main>
        <Footer />
      </LanguageProvider>
    </div>
  );
}
