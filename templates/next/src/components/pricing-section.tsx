import { Check } from "lucide-react";
import { Container } from "@/components/container";

export default function PricingSection() {
  return (
    <section className="py-16">
      <Container>
        <h2 className="text-3xl font-bold text-center mb-12 font-serif">Flexible Pricing Plans</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Team Plan */}
          <div className="border rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Team</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold font-serif">$1,000</span>
                <span className="text-gray-500 ml-2">/monthly</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>50 Agents</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>1,000 Monthly queries</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>100 Doc library</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>1 Data connection</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <a href="https://cal.com/jt-hotsheet/brokerbot-demo" target="_blank" className="block text-center bg-black text-white py-2 rounded-md">
                Get Started
              </a>
            </div>
          </div>

          {/* Brokerage Plan - Updated with dark gray background and white text */}
          <div className="bg-gray-800 text-white border rounded-lg overflow-hidden shadow-md relative">
            <div className="absolute top-2 right-2">
              <span className="bg-gray-600 text-white text-xs px-3 py-1 rounded-md">
                Popular
              </span>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Brokerage</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold font-serif">$2,000</span>
                <span className="text-gray-300 ml-2">/monthly</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-400" />
                  <span>250 Agents</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-400" />
                  <span>5,000 Monthly queries</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-400" />
                  <span>500 Doc library</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-400" />
                  <span>10 Data connections</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gray-700 border-t border-gray-600">
              <a href="https://cal.com/jt-hotsheet/brokerbot-demo" target="_blank" className="block text-center bg-white text-black py-2 rounded-md">
                Get Started
              </a>
            </div>
          </div>

          {/* Enterprise Plan */}
          <div className="border rounded-lg overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Enterprise</h3>
              <div className="flex items-baseline mb-6">
                <span className="text-3xl font-bold font-serif">Custom pricing</span>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>250+ Agents</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>5,000+ Monthly queries</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>500+ Doc library</span>
                </li>
                <li className="flex items-center">
                  <Check size={16} className="mr-2 text-green-500" />
                  <span>10+ Data connections</span>
                </li>
              </ul>
            </div>
            <div className="p-6 bg-gray-50 border-t">
              <a href="mailto:sales@brokerbot.net" className="block text-center bg-black text-white py-2 rounded-md">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
