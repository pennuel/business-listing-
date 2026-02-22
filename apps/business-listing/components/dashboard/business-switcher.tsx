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
import { useRouter, useSearchParams, usePathname } from "next/navigation"
import { useAppSelector } from "@/lib/redux/hooks"

interface Business {
  id: string
  name: string
  image: string | null
}

interface BusinessSwitcherProps {
  businesses?: Business[] // Now optional, defaults to Redux
  currentBusinessId?: string // Now optional, defaults to Redux
  className?: string
}

export function BusinessSwitcher({ businesses: propsBusinesses, currentBusinessId: propsBusinessId, className }: BusinessSwitcherProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [open, setOpen] = React.useState(false)
  const [showNewBusinessDialog, setShowNewBusinessDialog] = React.useState(false)

  // Use Redux if props not provided
  const reduxBusinesses = useAppSelector(state => state.business.userBusinesses)
  const reduxCurrentBusinessId = useAppSelector(state => state.business.currentBusiness?.id)

  const businesses = propsBusinesses || reduxBusinesses.map(b => ({
    id: b.id,
    name: b.name,
    image: (b as any).coverImage || null
  }))

  const currentBusinessId = propsBusinessId || searchParams.get("businessId") || reduxCurrentBusinessId || (businesses.length > 0 ? businesses[0].id : "")
  
  const selectedBusiness = businesses.find((b) => b.id === currentBusinessId) || businesses[0]

  const onBusinessSelect = (business: Business) => {
    setOpen(false)
    const params = new URLSearchParams(searchParams.toString())
    params.set("businessId", business.id)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <Dialog open={showNewBusinessDialog} onOpenChange={setShowNewBusinessDialog}>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            aria-label="Select a business"
            className={cn("w-full justify-between", className)}
          >
            <Avatar className="mr-2 h-5 w-5">
              <AvatarImage
                src={selectedBusiness?.image || ""}
                alt={selectedBusiness?.name}
              />
              <AvatarFallback>
                 <Store className="h-4 w-4" />
              </AvatarFallback>
            </Avatar>
            {selectedBusiness?.name || "Select Business"}
            <ChevronsUpDown className="ml-auto h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandList>
              <CommandInput placeholder="Search business..." />
              <CommandEmpty>No business found.</CommandEmpty>
              <CommandGroup heading="Recent Businesses">
                {businesses.map((business) => (
                  <CommandItem
                    key={business.id}
                    onSelect={() => onBusinessSelect(business)}
                    className="text-sm"
                  >
                    <Avatar className="mr-2 h-5 w-5">
                      <AvatarImage
                        src={business.image || ""}
                        alt={business.name}
                      />
                      <AvatarFallback>
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
                    <PlusCircle className="mr-2 h-5 w-5" />
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
          <DialogDescription>
            Add a new business to manage.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
            <p className="text-sm text-muted-foreground">Redirecting to business registration...</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setShowNewBusinessDialog(false)}>
            Cancel
          </Button>
          <Button onClick={() => {
            const returnUrl = window.location.origin + "/dashboard"
            window.location.href = `${process.env.NEXT_PUBLIC_THINK_ID_URL || 'http://localhost:3000'}/onboarding?returnTo=${encodeURIComponent(returnUrl)}`
          }}>
            Continue
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
