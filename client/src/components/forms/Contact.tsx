import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageSquare
} from "lucide-react";
import { useSiteContent } from "@/hooks/useSiteContent";

interface ContactProps {
  className?: string;
}

export default function Contact({ className }: ContactProps) {
  const { getContent } = useSiteContent();

  return (
    <section id="contact" className={`py-16 sm:py-20 bg-gradient-to-b from-black via-orange-950/50 to-orange-950 relative overflow-hidden ${className || ''}`}>
      {/* Gradient Accents */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-tr from-black via-orange-900/30 to-black" />
        <div className="absolute top-10 left-0 w-full h-32 bg-gradient-to-r from-transparent via-orange-800/40 to-transparent transform -rotate-2" />
        <div className="absolute bottom-20 left-0 w-full h-28 bg-gradient-to-r from-transparent via-red-900/30 to-transparent transform rotate-1" />
      </div>
    </section>
  );
}