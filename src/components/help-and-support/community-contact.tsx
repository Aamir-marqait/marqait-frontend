import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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
import { Checkbox } from "@/components/ui/checkbox";
import { countries, countryCodes } from "../help-and-support/index";
import communityIcon from "@/assets/help-and-support/community.png";
import personIcon from "@/assets/help-and-support/person.png";

export function CommunityContact() {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "",
    phone: "",
    company: "",
    message: "",
    consent: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("[v0] Form submitted:", formData);
    // Handle form submission here
    setIsOpen(false);
  };

  return (
    <section className="py-16 -mt-16 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Join Our Community Card */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#DCDFE1] p-8 shadow-sm">
            <div className="mb-6">
              <img
                src={communityIcon}
                alt="Community"
                className="w-12 h-12 mb-4"
              />
              <h2 className="font-bold text-[24px] leading-[100%] tracking-[0%] text-[#21242A] font-inter mb-4">
                Join Our Community
              </h2>
              <p className="font-normal text-[16px] leading-[150%] tracking-[0%] text-[#333D44] font-inter">
                Discuss feature requests, ask questions, get help and connect
                with others in the Marqait community.
              </p>
            </div>
            <Button
              variant="outline"
              className="bg-[#FFFFFF] border border-[#8F00FF] shadow-[0px_1px_2px_0px_#0A0D120D] font-medium text-[16px] leading-[24px] tracking-[0%] text-[#8F00FF] font-inter hover:bg-purple-50 cursor-pointer"
            >
              Go To Community
            </Button>
          </div>

          {/* Talk to Us Card */}
          <div className="bg-[#FFFFFF] rounded-lg border border-[#DCDFE1] p-8 shadow-sm">
            <div className="mb-6">
              <img src={personIcon} alt="Contact" className="w-12 h-12 mb-4" />
              <h2 className="font-bold text-[24px] leading-[100%] tracking-[0%] text-[#21242A] font-inter mb-4">
                Talk to Us
              </h2>
              <p className="font-normal text-[16px] leading-[150%] tracking-[0%] text-[#333D44] font-inter">
                Discuss feature requests, ask questions, get help and connect
                with others in the Marqait community.
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-[#FFFFFF] border border-[#8F00FF] shadow-[0px_1px_2px_0px_#0A0D120D] font-medium text-[16px] leading-[24px] tracking-[0%] text-[#8F00FF] font-inter hover:bg-purple-50 cursor-pointer"
                >
                  Contact Us
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[695px] max-h-none bg-[#FFFFFF] rounded-none overflow-y-auto px-6">
                <DialogHeader className="flex flex-row items-center justify-between">
                  <DialogTitle className="font-bold text-[24px] leading-[100%] tracking-[0%] text-[#111827] font-open-sans">
                    Get In Touch
                  </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-3 mt-3">
                  {/* Name Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="name"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Name
                    </Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]"
                    />
                  </div>

                  {/* Email Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="email"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Email Address
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email address"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]"
                    />
                  </div>

                  {/* Country Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="country"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Country
                    </Label>
                    <Select
                      value={formData.country}
                      onValueChange={(value) =>
                        setFormData({ ...formData, country: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]">
                        <SelectValue placeholder="Select your country" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#FFFFFF] max-h-[200px] overflow-y-auto">
                        {countries.map((country) => (
                          <SelectItem key={country.value} value={country.value}>
                            {country.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Phone Number Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="phone"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Phone Number
                    </Label>
                    <div className="flex">
                      <Select defaultValue="in">
                        <SelectTrigger className="w-32 rounded-r-none border-r-0 bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-[#FFFFFF] max-h-[200px] overflow-y-auto">
                          {countryCodes.map((countryCode) => (
                            <SelectItem
                              key={countryCode.value}
                              value={countryCode.value}
                            >
                              {countryCode.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="flex-1 rounded-l-none bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]"
                      />
                    </div>
                  </div>

                  {/* Company Name Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="company"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Company Name
                    </Label>
                    <Select
                      value={formData.company}
                      onValueChange={(value) =>
                        setFormData({ ...formData, company: value })
                      }
                    >
                      <SelectTrigger className="w-full bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]">
                        <SelectValue placeholder="Enter your company name" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#FFFFFF]">
                        <SelectItem value="startup">Startup</SelectItem>
                        <SelectItem value="small">Small Business</SelectItem>
                        <SelectItem value="medium">
                          Medium Enterprise
                        </SelectItem>
                        <SelectItem value="large">Large Enterprise</SelectItem>
                        <SelectItem value="individual">Individual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Message Field */}
                  <div className="space-y-1">
                    <Label
                      htmlFor="message"
                      className="font-semibold text-[14px] leading-[20px] tracking-[0%] text-[#374151] font-inter"
                    >
                      Message for our team
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Type your message here"
                      value={formData.message}
                      onChange={(e) =>
                        setFormData({ ...formData, message: e.target.value })
                      }
                      className="w-full min-h-32 resize-none bg-[#FFFFFF] border border-[#D1D5DB] shadow-[0px_1px_2px_0px_#0000000D] font-normal text-[16px] leading-[24px] tracking-[0%] font-inter transition-none duration-0 focus:outline-none focus:ring-0 focus:border-[#D1D5DB] focus:shadow-none focus-visible:ring-0 focus-visible:border-[#D1D5DB]"
                    />
                  </div>

                  {/* Consent Checkbox */}
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="consent"
                      checked={formData.consent}
                      onCheckedChange={(checked) =>
                        setFormData({
                          ...formData,
                          consent: checked as boolean,
                        })
                      }
                      className="mt-1 border border-[#7E00E2]"
                    />
                    <Label
                      htmlFor="consent"
                      className="text-sm text-gray-600 leading-relaxed"
                    >
                      By submitting this form, you are giving consent to Marqait
                      to store your submitted information.
                    </Label>
                  </div>

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium"
                    disabled={!formData.consent}
                  >
                    Submit
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </section>
  );
}
