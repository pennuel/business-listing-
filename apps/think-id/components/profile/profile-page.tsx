"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@think-id/ui/components/ui/card";
import { Badge } from "@think-id/ui/components/ui/badge";
import { Button } from "@think-id/ui/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@think-id/ui/components/ui/avatar";
import { Input } from "@think-id/ui/components/ui/input";
import { Label } from "@think-id/ui/components/ui/label";
import { Textarea } from "@think-id/ui/components/ui/textarea";
import {
  Edit,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  LayoutDashboard,
  Loader2,
  User2,
  AtSign,
  ShieldCheck,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useUserQuery } from "@/hooks/useUserQuery";
import { useUserStore } from "@/stores/userStore";

interface ProfilePageProps {
  onEditProfile: () => void;
  onBack: () => void;
}

function getInitials(firstName?: string | null, lastName?: string | null, email?: string | null) {
  const f = firstName?.charAt(0) ?? "";
  const l = lastName?.charAt(0) ?? "";
  return (f + l).toUpperCase() || email?.charAt(0)?.toUpperCase() || "U";
}

export function ProfilePage({ onEditProfile, onBack }: ProfilePageProps) {
  const { data: session } = useSession();
  const userId = (session?.user as any)?.id as string | undefined;

  // Live data from FusionAuth via TanStack Query
  const { data: apiUser, isLoading } = useUserQuery(userId);

  // Zustand store as fallback while query resolves
  const { user: storeUser } = useUserStore();

  // Prefer fresh API data; fall back to Zustand-cached user; then session
  const user = apiUser ?? storeUser;

  // Safe accessors for optional FusionAuth user.data custom fields
  const professionTitle = user?.data?.profession?.title;
  const role = user?.data?.role;
  const bio = user?.data?.bio;
  const town = user?.data?.location?.town;
  const website = user?.data?.website;
  const linkedin = user?.data?.LinkedIn;
  const twitter = user?.data?.twitter;
  const github = user?.data?.github;

  if (isLoading && !user) {
    return (
      <div className="flex flex-1 items-center justify-center min-h-[40vh]">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Loader2 className="h-8 w-8 animate-spin" />
          <p className="text-sm">Loading profile…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Back Navigation */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Dashboard
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24" style={{ border: "2px solid #e5e7eb" }}>
            <AvatarImage
              src={user?.imageUrl || "/logos/THiNK_Logo_Updated-02(icon).jpg"}
              alt="Profile"
            />
            <AvatarFallback className="text-2xl">
              {getInitials(user?.firstName, user?.lastName, user?.email)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user
                  ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() || user.username || "User"
                  : "Loading…"}
              </h1>
              <Button size="sm" onClick={onEditProfile} className="w-full sm:w-auto">
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
              <Button size="sm" variant="outline" onClick={onBack} className="w-full sm:w-auto">
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </div>

            {professionTitle && (
              <p className="text-lg text-muted-foreground mb-3">{professionTitle}</p>
            )}

            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{role ?? "Member"}</Badge>
              <Badge variant="outline">
                <ShieldCheck className="h-3 w-3 mr-1" />
                {user?.verified ? "Verified" : "Not verified"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your basic profile information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName" className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5 text-muted-foreground" /> First Name
                </Label>
                <Input id="firstName" value={user?.firstName ?? ""} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName" className="flex items-center gap-1.5">
                  <User2 className="h-3.5 w-3.5 text-muted-foreground" /> Last Name
                </Label>
                <Input id="lastName" value={user?.lastName ?? ""} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username" className="flex items-center gap-1.5">
                <AtSign className="h-3.5 w-3.5 text-muted-foreground" /> Username
              </Label>
              <Input id="username" value={user?.username ?? ""} readOnly />
            </div>

            {bio !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" value={bio || ""} readOnly rows={3} />
              </div>
            )}

            {town !== undefined && (
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <Input id="location" value={town || ""} readOnly />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="dob" className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" /> Date of Birth
              </Label>
              <Input id="dob" value={user?.birthDate ?? ""} readOnly />
            </div>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
            <CardDescription>How others can reach you</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user?.email ?? ""} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input id="phone" value={user?.mobilePhone ?? ""} readOnly />
              </div>
            </div>

            {website && (
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={website} readOnly />
              </div>
            )}

            {linkedin && (
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={linkedin} readOnly />
              </div>
            )}

            {twitter && (
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter / X</Label>
                <Input id="twitter" value={twitter} readOnly />
              </div>
            )}

            {github && (
              <div className="space-y-2">
                <Label htmlFor="github">GitHub</Label>
                <Input id="github" value={github} readOnly />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
