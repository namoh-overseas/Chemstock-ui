"use client";

import type React from "react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import { useStore } from "@/store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { countryCodes } from "@/app/buy/[id]/page";

export default function SellerSignupPage() {
  const { register, getUser } = useStore();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    country: "+91",
    phone: "",
    company: "",
    description: "",
    specialties: [] as string[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSpecialtyChange = (specialty: string) => {
    setFormData((prev) => {
      const specialties = prev.specialties.includes(specialty)
        ? prev.specialties.filter((s) => s !== specialty)
        : [...prev.specialties, specialty];
      return { ...prev, specialties };
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Validation
    let error = false;
    if (!formData.name) {
      toast.error("Name is required");
      error = true;
    }

    if (!formData.email) {
      toast.error("Email is required");
      error = true;
    }

    if (!formData.password) {
      toast.error("Password is required");
      error = true;
    }

    if (!formData.phone) {
      toast.error("Phone number is required");
      error = true;
    }

    if (!formData.company) {
      toast.error("Company name is required");
      error = true;
    }

    if (error) return;

    setIsSubmitting(true);

    try {
      register(
        formData.name,
        formData.email,
        formData.password,
        formData.country,
        formData.phone,
        formData.company,
        formData.description,
        formData.specialties.join(",")
      );
      getUser();
    } catch (error) {
      toast.error("Failed to create account. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Become a Seller</CardTitle>
            <CardDescription>
              Join our marketplace and start selling your chemical and
              pharmaceutical products to a wide audience.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Account Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="cursor-text"
                    />
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="cursor-text"
                    />
                  </div>

                  {/* Password */}
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      required
                      className="cursor-text"
                    />
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex gap-2">
                      <Select
                        value={formData.country}
                        onValueChange={(value) =>
                          handleSelectChange("country", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue>
                            {formData.country}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {countryCodes.map((code, index) => (
                            <SelectItem key={index} value={code}>
                              {code}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="cursor-text"
                      />
                    </div>
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company">Company Name</Label>
                    <Input
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="cursor-text"
                    />
                  </div>

                </div>
              </div>


              <div className="space-y-4">
                <h3 className="text-lg font-medium">Business Information</h3>

                {/* Business Description */} 
                <div className="space-y-2">
                  <Label htmlFor="description">Business Description (optional)</Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Tell us about your business and the products you sell"
                    className="cursor-text"
                  />
                </div>

                {/* Specialties */} 
                <div className="space-y-2">
                  <Label>Specialties (optional)</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {[
                      "Laboratory Chemicals",
                      "Industrial Chemicals",
                      "Specialty Chemicals",
                      "Dyes",
                      "Pigments",
                    ].map((specialty) => (
                      <div
                        key={specialty}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={`specialty-${specialty}`}
                          checked={formData.specialties.includes(specialty)}
                          onCheckedChange={() =>
                            handleSpecialtyChange(specialty)
                          }
                          className="cursor-pointer"
                        />
                        <Label
                          htmlFor={`specialty-${specialty}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {specialty}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>


              {/* Terms and Conditions */} 
              {/* <div className="flex items-center space-x-2">
                <Checkbox
                  id="agreeTerms"
                  checked={formData.agreeTerms}
                  onCheckedChange={(checked) =>
                    handleCheckboxChange("agreeTerms", !!checked)
                  }
                  className="cursor-pointer"
                />
                <Label
                  htmlFor="agreeTerms"
                  className="text-sm font-normal cursor-pointer"
                >
                  I agree to the{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline cursor-pointer"
                  >
                    terms and conditions
                  </a>{" "}
                  and{" "}
                  <a
                    href="#"
                    className="text-primary hover:underline cursor-pointer"
                  >
                    privacy policy
                  </a>
                </Label>
              </div> */}

              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer"
              >
                {isSubmitting ? "Creating Account..." : "Create Seller Account"}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center border-t pt-6">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <a
                href="/seller"
                className="text-primary hover:underline cursor-pointer"
              >
                Log in
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
