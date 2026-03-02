"use client"

import { useState, useTransition } from "react"
import { useQueryClient } from "@tanstack/react-query"
import { User, UpdateUserRequest } from "@think-id/types"
import { updateUserAction } from "@/app/actions/user"
import { useUserQuery } from "@/lib/hooks/use-user-query"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Pencil, Save, X, User2, Phone, Mail, AtSign, CalendarDays, Loader2, ShieldCheck } from "lucide-react"
import { toast } from "sonner"
import { format, parseISO } from "date-fns"

interface UserProfileCardProps {
  userId: string
}

function getInitials(user?: User | null): string {
  if (!user) return "U"
  const first = user.firstName?.charAt(0) ?? ""
  const last = user.lastName?.charAt(0) ?? ""
  return (first + last).toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"
}

function getFullName(user?: User | null): string {
  if (!user) return "User"
  const parts = [user.firstName, user.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(" ") : user.username || user.email || "User"
}

export function UserProfileCard({ userId }: UserProfileCardProps) {
  const queryClient = useQueryClient()
  const { data: user, isLoading, error } = useUserQuery({ userId })
  const [isEditing, setIsEditing] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [form, setForm] = useState<UpdateUserRequest>({})

  function startEditing() {
    if (!user) return
    setForm({
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      mobilePhone: user.mobilePhone ?? "",
      username: user.username ?? "",
      birthDate: user.birthDate ?? "",
    })
    setIsEditing(true)
  }

  function cancelEditing() {
    setIsEditing(false)
    setForm({})
  }

  function handleChange(field: keyof UpdateUserRequest, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function handleSave() {
    startTransition(async () => {
      const result = await updateUserAction(userId, form)
      if (result.success && result.user) {
        // Update TanStack Query cache immediately
        queryClient.setQueryData(["user", userId], result.user)
        setIsEditing(false)
        setForm({})
        toast.success("Profile updated successfully")
      } else {
        toast.error(result.error ?? "Failed to update profile")
      }
    })
  }

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  if (error || !user) {
    return (
      <Card className="w-full">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center gap-2">
          <User2 className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Could not load profile data.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-2 border-primary/20">
              <AvatarImage src={(user as any).image ?? ""} alt={getFullName(user)} />
              <AvatarFallback className="text-lg font-semibold bg-primary/10 text-primary">
                {getInitials(user)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-xl">{getFullName(user)}</CardTitle>
              <CardDescription className="flex items-center gap-1 mt-0.5">
                <Mail className="h-3.5 w-3.5" />
                {user.email}
              </CardDescription>
              <Badge variant="secondary" className="mt-1.5 text-xs gap-1">
                <ShieldCheck className="h-3 w-3" />
                THiNK ID Account
              </Badge>
            </div>
          </div>

          {!isEditing ? (
            <Button variant="outline" size="sm" onClick={startEditing} className="gap-2">
              <Pencil className="h-3.5 w-3.5" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={cancelEditing} disabled={isPending} className="gap-2">
                <X className="h-3.5 w-3.5" />
                Cancel
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isPending} className="gap-2">
                {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />}
                Save
              </Button>
            </div>
          )}
        </div>
      </CardHeader>

      <Separator />

      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* First Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User2 className="h-3.5 w-3.5" /> First Name
            </Label>
            {isEditing ? (
              <Input
                value={form.firstName ?? ""}
                onChange={(e) => handleChange("firstName", e.target.value)}
                placeholder="First name"
                id="user-first-name"
              />
            ) : (
              <p className="text-sm font-medium">{user.firstName || <span className="text-muted-foreground italic">Not set</span>}</p>
            )}
          </div>

          {/* Last Name */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <User2 className="h-3.5 w-3.5" /> Last Name
            </Label>
            {isEditing ? (
              <Input
                value={form.lastName ?? ""}
                onChange={(e) => handleChange("lastName", e.target.value)}
                placeholder="Last name"
                id="user-last-name"
              />
            ) : (
              <p className="text-sm font-medium">{user.lastName || <span className="text-muted-foreground italic">Not set</span>}</p>
            )}
          </div>

          {/* Username */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <AtSign className="h-3.5 w-3.5" /> Username
            </Label>
            {isEditing ? (
              <Input
                value={form.username ?? ""}
                onChange={(e) => handleChange("username", e.target.value)}
                placeholder="username"
                id="user-username"
              />
            ) : (
              <p className="text-sm font-medium">{user.username || <span className="text-muted-foreground italic">Not set</span>}</p>
            )}
          </div>

          {/* Mobile Phone */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Phone className="h-3.5 w-3.5" /> Mobile Phone
            </Label>
            {isEditing ? (
              <Input
                value={form.mobilePhone ?? ""}
                onChange={(e) => handleChange("mobilePhone", e.target.value)}
                placeholder="+254 7XX XXX XXX"
                id="user-mobile-phone"
              />
            ) : (
              <p className="text-sm font-medium">{user.mobilePhone || <span className="text-muted-foreground italic">Not set</span>}</p>
            )}
          </div>

          {/* Date of Birth */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" /> Date of Birth
            </Label>
            {isEditing ? (
              <Input
                type="date"
                value={form.birthDate ?? ""}
                onChange={(e) => handleChange("birthDate", e.target.value)}
                id="user-birth-date"
              />
            ) : (
              <p className="text-sm font-medium">
                {user.birthDate
                  ? (() => { try { return format(parseISO(user.birthDate), "dd MMM yyyy") } catch { return user.birthDate } })()
                  : <span className="text-muted-foreground italic">Not set</span>}
              </p>
            )}
          </div>

          {/* Email – read only */}
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Email
            </Label>
            <p className="text-sm font-medium text-muted-foreground">{user.email}</p>
            <p className="text-xs text-muted-foreground">Managed by THiNK ID</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
