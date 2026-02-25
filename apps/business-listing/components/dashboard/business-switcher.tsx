"use client"

import * as React from "react"
import { Check, ChevronsUpDown, PlusCircle, Store } from "lucide-react"

import { cn } from "@/lib/utils"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useSidebar } from "@/components/ui/sidebar"
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import { useUserBusinesses } from "@/lib/hooks/useBusinesses"

interface Business {
  id: string
  name: string
  image: string | null
}

interface BusinessSwitcherProps {
  businesses?: Business[]
  currentBusinessId?: string
  className?: string
}

export function BusinessSwitcher({
  businesses: propsBusinesses,
  currentBusinessId: propsBusinessId,
  className,
}: BusinessSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [showNewBusinessDialog, setShowNewBusinessDialog] = React.useState(false)

  // Read sidebar collapse state
  const { state } = useSidebar()
  const isCollapsed = state === "collapsed"

  const { data: session } = useSession()
  const userId = session?.user?.id || null
  const userBusinessesQuery = useUserBusinesses(userId)
  const businessesFromQuery = (userBusinessesQuery.data || []) as Business[]

  const businesses: Business[] = propsBusinesses || businessesFromQuery || []
  const currentBusinessId =
    propsBusinessId ||
    searchParams.get("businessId") ||
    (businesses.length > 0 ? businesses[0].id : "")
  const selectedBusiness =
    businesses.find((b) => b.id === currentBusinessId) || businesses[0]

  const onBusinessSelect = (business: Business) => {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.set("businessId", business.id)
    router.push(`${pathname}?${params.toString()}`)
  }

  // Shared avatar used in both collapsed and expanded triggers
  const avatarEl = (
    <Avatar className="h-6 w-6 shrink-0">
      <AvatarImage src={selectedBusiness?.image || ""} alt={selectedBusiness?.name} />
      <AvatarFallback className="rounded-md bg-primary/10 text-primary text-xs font-bold">
        {selectedBusiness?.name?.charAt(0) ?? <Store className="h-3.5 w-3.5" />}
      </AvatarFallback>
    </Avatar>
  )

  return (
    <Dialog open={showNewBusinessDialog} onOpenChange={setShowNewBusinessDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          {isCollapsed ? (
            /* ── Icon-only mode: centred avatar with tooltip ── */
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label="Select a business"
                  className="h-8 w-8 mx-auto"
                >
                  {avatarEl}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right" align="center">
                {selectedBusiness?.name ?? "Select Business"}
              </TooltipContent>
            </Tooltip>
          ) : (
            /* ── Expanded mode: full name + chevron ── */
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              aria-label="Select a business"
              className={cn(
                "w-full justify-between gap-2 transition-[width,opacity] duration-300",
                className
              )}
            >
              {avatarEl}
              <span className="flex-1 text-left text-sm truncate">
                {selectedBusiness?.name ?? "Select Business"}
              </span>
              <ChevronsUpDown className="h-3.5 w-3.5 shrink-0 opacity-50" />
            </Button>
          )}
        </PopoverTrigger>

        <PopoverContent
          className="w-64 p-0"
          align="start"
          side={isCollapsed ? "right" : "bottom"}
          sideOffset={isCollapsed ? 8 : 4}
        >
          <Command>
            <CommandList>
              <CommandInput placeholder="Search business..." />
              <CommandEmpty>No business found.</CommandEmpty>
              <CommandGroup heading="Your Businesses">
                {businesses.map((business) => (
                  <CommandItem
                    key={business.id}
                    onSelect={() => onBusinessSelect(business)}
                    className="text-sm gap-2"
                  >
                    <Avatar className="h-5 w-5">
                      <AvatarImage src={business.image || ""} alt={business.name} />
                      <AvatarFallback className="text-[10px]">
                        {business.name.substring(0, 1)}
                      </AvatarFallback>
                    </Avatar>
                    {business.name}
                    <Check
                      className={cn(
                        "ml-auto h-4 w-4",
                        selectedBusiness?.id === business.id
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
            <CommandSeparator />
            <CommandList>
              <CommandGroup>
                <DialogTrigger asChild>
                  <CommandItem
                    onSelect={() => {
                      setOpen(false)
                      setShowNewBusinessDialog(true)
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Business
                  </CommandItem>
                </DialogTrigger>
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create business</DialogTitle>
          <DialogDescription>Add a new business to manage.</DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-muted-foreground">
            Redirecting to business registration...
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewBusinessDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              const returnUrl = window.location.origin + "/dashboard"
              window.location.href = `${
                process.env.NEXT_PUBLIC_THINK_ID_URL || "http://localhost:3000"
              }/onboarding?returnTo=${encodeURIComponent(returnUrl)}`
            }}
          >
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
