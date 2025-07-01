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
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Mail, Phone, MapPin, MessageSquare } from "lucide-react";
import toast from "react-hot-toast";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [contactType, setContactType] = useState<"whatsapp" | "email" | "phone">("whatsapp");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const message = `
      Name: ${formData.name}
      Email: ${formData.email}
      Subject: ${formData.subject}
      Message: ${formData.message}
      `;
      const encodedMessage = encodeURIComponent(message);
      if(contactType === "whatsapp") {
        window.open(
          `https://wa.me/917359381236?text=${encodedMessage}`,
          "_blank",
          "noopener noreferrer"
        );
      } else if(contactType === "email") {
        window.open(
          `mailto:chemstock74@gmail.com?subject=${formData.subject}&body=${encodedMessage}`,
          "_blank",
          "noopener noreferrer"
        );
      } else {
        window.open(
          `tel:917359381236`,
          "_blank",
          "noopener noreferrer"
        );
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        <div className="lg:col-span-1 space-y-6">
          <Card className="hover:shadow-md transition-shadow cursor-default">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Phone className="mr-2 h-5 w-5 text-primary" />
                Phone
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Vansh Patel +91 7359381236</p>
              <p className="text-gray-700">Mon-Fri, 9am-6pm IST</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-default">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5 text-primary" />
                Email
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">chemstock74@gmail.com</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-default">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="mr-2 h-5 w-5 text-primary" />
                Address
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">
                59, Gajanand Industrial Hub-2, Behind Benzo Stocks, Phase - 4,
                Vatva GIDC, Ahmedabad - 382445, Gujarat, India
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-default">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-primary" />
                WhatsApp
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700">Vansh Patel +91 7359381236</p>
              <Button
                onClick={() =>
                  window.open("https://wa.me/917359381236", "_blank")
                }
                className="mt-2 w-full bg-green-500 hover:bg-green-600 cursor-pointer"
              >
                Chat with Us
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Send Us a Message</CardTitle>
              <CardDescription>
                Fill out the form below and we&apos;ll get back to you as soon as
                possible.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="cursor-text"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    required
                    className="cursor-text"
                  />
                </div>

              <Select
                onValueChange={(e: "whatsapp" | "email" | "phone") => setContactType(e)}
                defaultValue={contactType}
                value={contactType}
              >
                <SelectTrigger className="capitalize">
                  <SelectValue>{contactType}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="whatsapp"
                  >
                    WhatsApp
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="email"
                  >
                    Email
                  </SelectItem>
                  <SelectItem
                    className="hover:bg-primary cursor-pointer"
                    value="phone"
                  >
                    Phone
                  </SelectItem>
                </SelectContent>
              </Select>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full cursor-pointer"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
