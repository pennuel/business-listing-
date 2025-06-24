"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Upload,
  Save,
  X,
  Plus,
  MapPin,
  Mail,
  Phone,
  Globe,
  Linkedin,
  Github,
  Twitter,
  Calendar,
  Loader2,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { useToast } from "../ui/use-toast";
import { useRef, useState, useTransition } from "react";
import { updateProfile } from "@/app/actions/profile/updateProfile";
import { uploadImage } from "@/app/actions/profile/uploadImage";

interface ProfileEditPageProps {
  onBack: () => void;
}

export function ProfileEditPage({ onBack }: ProfileEditPageProps) {
  const { user, updateUser } = useUserStore();
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  // async function handleImageUpload(event: React.ChangeEvent<HTMLInputElement>) {
  //   const file = event.target.files?.[0];
  //   if (!file) return;

  //   try {
  //     setUploadingImage(true);
      
  //     // Create preview
  //     const objectUrl = URL.createObjectURL(file);
  //     setPreviewImage(objectUrl);

  //     // Create FormData and append file
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     // Upload image
  //     const result = await uploadImage(formData);

  //     if (result.error) {
  //       toast({
  //         title: "Error",
  //         description: result.error,
  //         variant: "destructive",
  //       });
  //       setPreviewImage(null);
  //       return;
  //     }

  //     if (result.url) {
  //       // Update user data with new image URL
  //       const updateResult = await updateProfile(
  //         new FormData(document.getElementById("profile-form") as HTMLFormElement)
  //       );
  //       if (updateResult.data) {
  //         updateUser({
  //           ...updateResult.data,
  //           imageUrl: result.url,
  //         });
  //         toast({
  //           title: "Success",
  //           description: "Profile picture updated successfully",
  //         });
  //       }
  //     }
  //   } catch (error) {
  //     toast({
  //       title: "Error",
  //       description: "Failed to upload image",
  //       variant: "destructive",
  //     });
  //     setPreviewImage(null);
  //   } finally {
  //     setUploadingImage(false);
  //   }
  // }

  // function handleRemoveImage() {
  //   if (fileInputRef.current) {
  //     fileInputRef.current.value = "";
  //   }
  //   setPreviewImage(null);
  //   // You might want to also remove the image from the server and update the user data
  // }

  async function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        const result = await updateProfile(formData);

        if (result.error) {
          toast({
            title: "Error",
            description: result.error,
            variant: "destructive",
          });
          return;
        }

        if (result.data) {
          updateUser(result.data);
          toast({
            title: "Success",
            description: "Profile updated successfully",
          });
          onBack();
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An unexpected error occurred",
          variant: "destructive",
        });
      }
    });
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-2 sm:p-4 pt-0">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <Button variant="ghost" size="sm" onClick={onBack} className="w-fit">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
      </div>
      <div className="flex flex-row items-center justify-between gap-4 w-full">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Edit Profile</h1>
          <p className="text-muted-foreground">
        Update your personal information and profile details
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <Button variant="outline" onClick={onBack} className="w-full sm:w-auto">
        <X className="h-4 w-4 mr-2" />
        Cancel
          </Button>
          {/* <Button className="w-full sm:w-auto">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button> */}
        </div>
      </div>
      <form id="profile-form" action={handleSubmit} className="space-y-8">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3">
          {/* Profile Picture & Basic Info */}
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Profile Picture</CardTitle>
              <CardDescription>
                Update your profile photo and basic information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                {/* <Avatar className="h-32 w-32">
                  <AvatarImage
                    src={previewImage || user?.imageUrl || "/placeholder.svg?height=128&width=128"}
                    alt="Profile"
                  />
                  <AvatarFallback className="text-2xl">
                    {user?.firstName?.[0]}{user?.lastName?.[0]}
                  </AvatarFallback>
                </Avatar> */}
                <Avatar
                  className="h-32 w-32"
                  style={{ border: "2px solid #e5e7eb" }}
                >
                  <AvatarImage
                    src="/logos/THiNK_Logo_Updated-02(icon).jpg"
                    alt="Profile"
                  />
                  <AvatarFallback className="text-2xl">
                    {user ? `${user.firstName[0]}${user.lastName[0]}` : "U"}
                  </AvatarFallback>
                </Avatar>
                {/* <div className="flex gap-2">
                  <input
                    type="file"
                    ref={fileInputRef}
                    className="hidden"
                    accept="image/*"
                    // onChange={handleImageUpload}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingImage}
                  >
                    {uploadingImage ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Upload className="h-4 w-4 mr-2" />
                    )}
                    Upload New
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    // onClick={handleRemoveImage}
                    disabled={uploadingImage || (!previewImage && !user?.imageUrl)}
                  >
                    Remove
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground text-center">
                  Recommended: Square image, at least 400x400px
                </p> */}
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    defaultValue={`${user?.firstName} ${user?.lastName}`}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    name="username"
                    defaultValue={user?.username}
                  />
                  <p className="text-xs text-muted-foreground">
                    This will be your unique identifier
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="title">Professional Title</Label>
                  <Input
                    id="title"
                    name="title"
                    defaultValue={user ? user.data.profession.title : ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>
                Your personal details and contact information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    name="firstName"
                    defaultValue={user?.firstName}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    name="lastName"
                    defaultValue={user?.lastName}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  name="bio"
                  defaultValue={user?.data.bio || ""}
                  rows={4}
                  placeholder="Tell us about yourself..."
                />
                <p className="text-xs text-muted-foreground">
                  Brief description for your profile. Maximum 500 characters.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      defaultValue={user?.email}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      name="mobilePhone"
                      defaultValue={user?.mobilePhone}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="location"
                    name="location"
                    defaultValue={user?.data.location.town}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="birthDate">Birth Date</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    defaultValue={user?.birthDate || ""}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* <div className="space-y-2">
              <Label htmlFor="preferredLanguages">Preferred Languages</Label>
              <Select
              id="preferredLanguages"
              value={user?.preferredLanguages || []}
              onValueChange={() => {

              }} // Replace with your handler
              multiple
              >
              <SelectTrigger>
                <SelectValue placeholder="Select Languages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="en">English</SelectItem>
                <SelectItem value="es">Spanish</SelectItem>
                <SelectItem value="fr">French</SelectItem>
                <SelectItem value="de">German</SelectItem>
                <SelectItem value="zh">Chinese</SelectItem>
                <SelectItem value="ja">Japanese</SelectItem>
              </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
              Select your preferred languages for communication and content.
              </p>
            </div> */}

              {/* <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Select defaultValue={"user?.timezone || 'utc'"}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pst">
                    Pacific Standard Time (PST)
                  </SelectItem>
                  <SelectItem value="est">
                    Eastern Standard Time (EST)
                  </SelectItem>
                  <SelectItem value="cst">
                    Central Standard Time (CST)
                  </SelectItem>
                  <SelectItem value="mst">
                    Mountain Standard Time (MST)
                  </SelectItem>
                  <SelectItem value="utc">
                    Coordinated Universal Time (UTC)
                  </SelectItem>
                </SelectContent>
              </Select>
            </div> */}
            </CardContent>
          </Card>

          {/* Social Links */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Social Links</CardTitle>
              <CardDescription>
                Add your social media profiles and professional links
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="website"
                      name="website"
                      defaultValue={user?.data.website}
                      className="pl-10"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn</Label>
                  <div className="relative">
                    <Linkedin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="linkedin"
                      name="linkedin"
                      defaultValue={user?.data.LinkedIn}
                      className="pl-10"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter</Label>
                  <div className="relative">
                    <Twitter className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="twitter"
                      name="twitter"
                      defaultValue={user?.data.twitter}
                      className="pl-10"
                      placeholder="https://twitter.com/yourprofile"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github">GitHub</Label>
                  <div className="relative">
                    <Github className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="github"
                      name="github"
                      defaultValue={user?.data.github}
                      className="pl-10"
                      placeholder="https://github.com/username"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          {/* <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Skills & Expertise</CardTitle>
            <CardDescription>
              Add your technical skills and areas of expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                React
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                Node.js
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                TypeScript
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                Python
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                AWS
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                Docker
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                PostgreSQL
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
              <Badge variant="secondary" className="flex items-center gap-1">
                GraphQL
                <X className="h-3 w-3 cursor-pointer" />
              </Badge>
            </div>
            <div className="flex gap-2">
              <Input placeholder="Add a skill..." className="flex-1" />
              <Button size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Add skills that represent your expertise. Click the X to remove a
              skill.
            </p>
          </CardContent>
        </Card> */}

          {/* Work Experience */}
          {/* <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Add your professional experience</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Input
                      defaultValue="Senior Full Stack Developer"
                      className="font-medium mb-2"
                    />
                    <Input
                      defaultValue="TechCorp Inc."
                      className="text-sm mb-2"
                    />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input defaultValue="2021" placeholder="Start Year" />
                      <Input defaultValue="Present" placeholder="End Year" />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="p-3 border rounded-lg">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <Input
                      defaultValue="Full Stack Developer"
                      className="font-medium mb-2"
                    />
                    <Input defaultValue="StartupXYZ" className="text-sm mb-2" />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Input defaultValue="2019" placeholder="Start Year" />
                      <Input defaultValue="2021" placeholder="End Year" />
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <Button variant="outline" className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          </CardContent>
        </Card> */}
        </div>

        {/* Save Actions */}
        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-6 border-t">
          <Button
            variant="outline"
            onClick={onBack}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            className="w-full sm:w-auto"
            type="submit"
            disabled={isPending}
          >
            <Save className="h-4 w-4 mr-2" />
            {isPending ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </form>
    </div>
  );
}
