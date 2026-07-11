import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";
import Button from "@/components/ui/Button";

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isCancelling: boolean;
}

export function CancelModal({ isOpen, onClose, onConfirm, isCancelling }: CancelModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={!isCancelling ? onClose : undefined}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: "20px" }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: "20px" }}
            className="fixed inset-0 z-50 flex items-center justify-center p-6 pointer-events-none"
          >
            <div className="w-full max-w-md pointer-events-auto overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-2xl relative">
              <button
                onClick={onClose}
                disabled={isCancelling}
                className="absolute right-4 top-4 text-textSecondary hover:text-textPrimary"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex flex-col items-center text-center space-y-4">
                <div className="p-3 bg-error/10 text-error rounded-full">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-textPrimary">Cancel Interview?</h2>
                  <p className="text-sm text-textSecondary mt-2 leading-relaxed">
                    Are you sure you want to cancel this interview? Progress will be saved, but the session will be marked as cancelled and you will not receive a final score.
                  </p>
                </div>
              </div>

              <div className="mt-8 flex gap-3 w-full">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isCancelling}
                  className="flex-1"
                >
                  Keep Going
                </Button>
                <Button
                  onClick={onConfirm}
                  isLoading={isCancelling}
                  className="flex-1 bg-error hover:bg-error/90 text-white border-none"
                >
                  Yes, Cancel
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
