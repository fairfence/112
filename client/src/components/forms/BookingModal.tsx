import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar, MessageSquare } from "lucide-react";

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  estimate?: number;
}

export default function BookingModal({ isOpen, onClose, estimate }: BookingModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[650px] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">
            Schedule Your Free Site Visit
          </DialogTitle>
          <DialogDescription className="space-y-2">
            <div>Our small team will personally visit your property to provide an accurate quote.</div>
            {estimate && (
              <div className="font-semibold">
                Your estimated investment: <span className="text-orange-500">${estimate.toLocaleString()}</span>
              </div>
            )}
            <div className="flex items-center gap-2 pt-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm">Prefer to text? Message us on 021 0835 8914</span>
            </div>
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 pt-0 h-[500px] flex items-center justify-center bg-gradient-to-b from-transparent to-orange-950/10">
          <div className="text-center space-y-4 p-8 rounded-lg bg-black/60 border border-orange-900/30">
            <Calendar className="h-16 w-16 text-orange-500 mx-auto animate-pulse" />
            <h3 className="text-xl font-bold">Book Your Free Site Visit</h3>
            <p className="text-muted-foreground max-w-md">
              To schedule your appointment, please use one of these options:
            </p>
            <div className="space-y-3 pt-4">
              <Button 
                className="w-full bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-500 hover:to-red-500"
                onClick={() => window.open('https://calendly.com/alex-fairfence/30min?back=1&month=2025-09', '_blank')}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Open Booking Calendar
              </Button>
              <Button 
                variant="outline" 
                className="w-full border-orange-500/50"
                onClick={() => window.location.href = 'sms:02108358914?body=Hi, I would like to schedule a site visit for my fencing project. My estimated quote was $' + (estimate || '0')}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Text Us to Schedule
              </Button>
              <p className="text-xs text-muted-foreground">
                Or email us at Admin@fairfence.co.nz
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}