import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from "lucide-react";
import { Container } from "@/components/container";
import { Logo } from "@repo/ui/components/logo";

export default function Footer() {
  return (
    <footer className="bg-white py-12 border-t w-full flex justify-center">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 mx-5 md:mx-0">
          <div className="flex flex-col items-center md:items-start">
            <div className="mb-6">
              <Logo className="h-12" />
            </div>
            <div className="flex gap-4">
              <a href="https://facebook.com/startupkit" aria-label="Facebook">
                <Facebook size={24} />
              </a>
              <a href="https://twitter.com/startupkit" aria-label="Twitter">
                <Twitter size={24} />
              </a>
              <a href="https://instagram.com/startupkit" aria-label="Instagram">
                <Instagram size={24} />
              </a>
              <a href="https://linkedin.com/company/startupkit" aria-label="LinkedIn">
                <Linkedin size={24} />
              </a>
              <a href="https://youtube.com/startupkit" aria-label="YouTube">
                <Youtube size={24} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div className="">
            <h3 className="text-lg font-bold mb-4">Quick Links</h3>
            <div className="flex flex-col space-y-2">
              <a href="/privacy" className="text-gray-600 hover:text-gray-900">
                Privacy Policy
              </a>
              <a href="/terms" className="text-gray-600 hover:text-gray-900">
                Terms of Service
              </a>
            </div>
          </div>

          {/* Contact information */}
          <div className="">
            <h3 className="text-lg font-bold mb-4">Contact</h3>
            <div className="flex flex-col space-y-3">
              <div className="flex items-center">
                <Mail size={18} className="mr-2 text-gray-500" />
                <a href="mailto:support@repo.net" className="text-gray-600 hover:text-gray-900">
                  support@repo.net
                </a>
              </div>
              <div className="flex items-center">
                <Phone size={18} className="mr-2 text-gray-500" />
                <a href="tel:8582551652" className="text-gray-600 hover:text-gray-900">
                  858.255.1652
                </a>
              </div>
              <div className="flex items-start">
                <MapPin size={18} className="mr-2 mt-1 text-gray-500 flex-shrink-0" />
                <address className="text-gray-600 not-italic">
                  1234 Somewhere Rd.
                  <br />
                  Suite ABC-123
                  <br />
                  Nashville, TN 37201
                </address>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t pt-6 flex flex-col items-center md:flex-row md:items-center md:justify-between text-sm text-gray-500">
          <div> {new Date().getFullYear()} StartupKit. All rights reserved.</div>
        </div>
      </Container>
    </footer>
  );
}
