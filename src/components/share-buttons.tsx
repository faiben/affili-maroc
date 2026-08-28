"use client";

import { useState } from "react";
import { Copy, Check, MessageCircle, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ShareButtonsProps {
  url: string;
  title: string;
  imageUrl?: string | null;
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = [
    {
      name: "WhatsApp",
      href: `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
      icon: MessageCircle,
      color: "text-green-600 hover:text-green-700 hover:bg-green-50",
    },
    {
      name: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      icon: FacebookIcon,
      color: "text-blue-600 hover:text-blue-700 hover:bg-blue-50",
    },
    {
      name: "X / Twitter",
      href: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      icon: TwitterIcon,
      color: "text-slate-900 hover:text-slate-800 hover:bg-slate-100",
    },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success("Lien copié !");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("Impossible de copier le lien");
    }
  }

  async function nativeShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch {
        // User cancelled
      }
    } else {
      copyLink();
    }
  }

  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      {shareLinks.map((item) => (
        <Button
          key={item.name}
          variant="outline"
          size="icon"
          className={`rounded-full ${item.color}`}
          asChild
        >
          <a
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Partager sur ${item.name}`}
          >
            <item.icon className="h-4 w-4" />
          </a>
        </Button>
      ))}

      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={copyLink}
        aria-label="Copier le lien"
      >
        {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="rounded-full"
        onClick={nativeShare}
        aria-label="Partager"
      >
        <Share2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
