"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useToggleStoreStatus } from '@/lib/hooks/useBusinesses'

interface StoreStatusToggleProps {
  businessId: string
  initialStatus: boolean
  className?: string
}

export function StoreStatusToggle({ businessId, initialStatus, className }: StoreStatusToggleProps) {
  const toggleMutation = useToggleStoreStatus()

  const [isOpen, setIsOpen] = useState(initialStatus)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  const handleToggle = async () => {
    const newState = !isOpen
    // optimistic UI
    setIsOpen(newState)
    setIsPending(true)

    try {
      await toggleMutation.mutateAsync({ id: businessId, isOpen: newState })
      toast({
        title: newState ? "You are now OPEN" : "You are now CLOSED",
        description: newState ? "Customers can now see you as open." : "Customers will see you as closed.",
        variant: "default",
      })
    } catch (error) {
      // rollback optimistic update
      setIsOpen(!newState)
      toast({
        title: "Error",
        description: "Failed to update store status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsPending(false)
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isPending}
      className={cn(
        "relative flex items-center w-48 h-16 rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
        isOpen 
          ? "bg-green-500 hover:bg-green-600 focus:ring-green-500" 
          : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 focus:ring-slate-400",
        isPending && "opacity-80 cursor-wait",
        className
      )}
      aria-label={isOpen ? "Store is Open" : "Store is Closed"}
    >
      <div
        className={cn(
          "absolute left-1 top-1 h-14 w-14 rounded-full bg-white shadow-md flex items-center justify-center transition-transform duration-300 ease-spring",
          isOpen ? "translate-x-32" : "translate-x-0"
        )}
      >
        {isPending ? (
          <Loader2 className="h-6 w-6 animate-spin text-slate-400" />
        ) : (
          <div className={cn("h-4 w-4 rounded-full", isOpen ? "bg-green-500" : "bg-slate-400")} />
        )}
      </div>
      
      <span 
        className={cn(
          "absolute font-bold text-lg tracking-wide transition-opacity duration-300",
          isOpen ? "left-6 text-white opacity-100" : "left-6 text-slate-500 opacity-0"
        )}
      >
        OPEN
      </span>

      <span 
        className={cn(
          "absolute right-6 font-bold text-lg tracking-wide transition-opacity duration-300 text-slate-500",
          !isOpen ? "opacity-100" : "opacity-0"
        )}
      >
        CLOSED
      </span>
    </button>
  )
}
