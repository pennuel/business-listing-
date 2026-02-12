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
  Briefcase,
  GraduationCap,
  Award,
  ArrowLeft,
} from "lucide-react";

import { useUserStore } from "@/stores/userStore";

interface ProfilePageProps {
  onEditProfile: () => void;
  onBack: () => void;
}

export function ProfilePage({ onEditProfile, onBack }: ProfilePageProps) {
  // fetch the user profile data from an API or state management
  const { user } = useUserStore();

  console.log("User Profile Data:", user);

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Back Navigation - Top Level */}
      <div className="flex items-center gap-2 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>

      {/* Profile Header */}
      <Card>
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <Avatar className="h-24 w-24" style={{ border: "2px solid #e5e7eb",  }}>
            <AvatarImage
              src="/logos/THiNK_Logo_Updated-02(icon).jpg"
              alt="Profile"
            />
            <AvatarFallback className="text-2xl">
              {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-2">
              <h1 className="text-2xl sm:text-3xl font-bold">
                {user ? `${user.firstName} ${user.lastName}` : "Loading..."}
              </h1>

              <Button
                size="sm"
                onClick={() => onEditProfile()}
                className="w-full sm:w-auto"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            </div>
            <p className="text-lg text-muted-foreground mb-3">
              {user ? user.data.profession.title : ""}
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">
                {user ? user.data.role : "User"}
              </Badge>
              <Badge variant="outline">
                {user && user.verified ? "Verified" : "Not verified"}
              </Badge>
              {/* <Badge variant="outline">5 Years Experience</Badge> */}
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
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={user?.firstName} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={user?.lastName} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={user?.data.bio || ""}
                readOnly
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  value={user?.data.location.town}
                  readOnly
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dob">Date of Birth</Label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <Input id="dob" value={user?.birthDate} readOnly />
              </div>
            </div>
            {/* <div className="space-y-2">
              <Label htmlFor="preferredLanguages">Preferred Languages</Label>
              <div className="flex items-center gap-2">
                <Input
                  id="preferredLanguages"
                  value={user?.preferredLanguages}
                  readOnly
                />
              </div>
            </div> */}
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
                <Input id="email" value={user?.email} readOnly />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <Input id="phone" value={user?.mobilePhone} readOnly />
              </div>
            </div>

            {user?.data.website && (
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={user?.data.website} readOnly />
              </div>
            )}
            {user?.data.LinkedIn && (
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={user?.data.LinkedIn} readOnly />
              </div>
            )}

            {user?.data.twitter && (
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter</Label>
                <Input id="twitter" value={user?.data.twitter} readOnly />
              </div>
            )}

            {user?.data.github && (
              <div className="space-y-2">
                <Label htmlFor="github">Github</Label>
                <Input id="github" value={user?.data.github} readOnly />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Professional Information */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
            <CardDescription>Your work and career details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Senior Full Stack Developer</p>
                <p className="text-sm text-muted-foreground">TechCorp Inc. • 2021 - Present</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <Briefcase className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Full Stack Developer</p>
                <p className="text-sm text-muted-foreground">StartupXYZ • 2019 - 2021</p>
              </div>
            </div>
            <div className="flex items-center gap-3 p-3 border rounded-lg">
              <GraduationCap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="font-medium">Computer Science, B.S.</p>
                <p className="text-sm text-muted-foreground">University of California • 2015 - 2019</p>
              </div>
            </div>
          </CardContent>
        </Card> */}

        {/* Skills & Achievements */}
        {/* <Card>
          <CardHeader>
            <CardTitle>Skills & Achievements</CardTitle>
            <CardDescription>Your expertise and accomplishments</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Technical Skills</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                <Badge variant="secondary">React</Badge>
                <Badge variant="secondary">Node.js</Badge>
                <Badge variant="secondary">TypeScript</Badge>
                <Badge variant="secondary">Python</Badge>
                <Badge variant="secondary">AWS</Badge>
                <Badge variant="secondary">Docker</Badge>
                <Badge variant="secondary">PostgreSQL</Badge>
                <Badge variant="secondary">GraphQL</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <Label className="text-sm font-medium">Recent Achievements</Label>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Award className="h-5 w-5 text-yellow-500" />
                <div>
                  <p className="font-medium">Employee of the Month</p>
                  <p className="text-sm text-muted-foreground">TechCorp Inc. • March 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 border rounded-lg">
                <Award className="h-5 w-5 text-blue-500" />
                <div>
                  <p className="font-medium">AWS Solutions Architect Certified</p>
                  <p className="text-sm text-muted-foreground">Amazon Web Services • 2023</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card> */}
      </div>

      {/* Account Statistics */}
      {/* <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Member Since</p>
                <p className="font-semibold">January 2019</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Profile Views</p>
                <p className="font-semibold">2,847</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Projects</p>
                <p className="font-semibold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Achievements</p>
                <p className="font-semibold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
}
