"use client"

import { useState, useTransition, useEffect } from "react"
import { cn } from "@/lib/utils"
import { Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks"
import { toggleStoreStatusAction } from "@/lib/redux/slices/businessSlice"

interface StoreStatusToggleProps {
  businessId: string
  initialStatus: boolean
  className?: string
}

export function StoreStatusToggle({ businessId, initialStatus, className }: StoreStatusToggleProps) {
  const dispatch = useAppDispatch()
  const reduxBusinessStatus = useAppSelector(state => 
    state.business.currentBusiness?.id === businessId 
      ? state.business.currentBusiness.isManuallyOpen 
      : null
  )

  const [isOpen, setIsOpen] = useState(reduxBusinessStatus ?? initialStatus)
  const [isPending, setIsPending] = useState(false)
  const { toast } = useToast()

  // Update local state when Redux updates
  useEffect(() => {
    if (reduxBusinessStatus !== null) {
      setIsOpen(reduxBusinessStatus)
    }
  }, [reduxBusinessStatus])

  const handleToggle = async () => {
    const newState = !isOpen
    setIsPending(true)

    try {
      const resultAction = await dispatch(toggleStoreStatusAction({ id: businessId, isOpen: newState }))
      
      if (toggleStoreStatusAction.fulfilled.match(resultAction)) {
        toast({
          title: newState ? "You are now OPEN" : "You are now CLOSED",
          description: newState 
            ? "Customers can now see you as open." 
            : "Customers will see you as closed.",
          variant: "default",
        })
      } else {
        toast({
          title: "Error",
          description: "Failed to update store status. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred.",
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
