import { ClipboardCheck, BarChart3, FileText } from "lucide-react";
import { Container } from "@/components/container";

export default function FeaturesSection() {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="mb-4 p-3 bg-gray-100 rounded-lg inline-block">
              <ClipboardCheck size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Compliance & Best Practices</h3>
            <p className="text-gray-600">
              Stay on top of regulatory requirements and best practice guidelines. Helping your team navigate risks and
              make data-driven decisions.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="mb-4 p-3 bg-gray-100 rounded-lg inline-block">
              <BarChart3 size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Intelligent Data Insights</h3>
            <p className="text-gray-600">
              Transform raw data into actionable insights. Understand your CRM and data with minimal manual effort.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-lg shadow-sm border">
            <div className="mb-4 p-3 bg-gray-100 rounded-lg inline-block">
              <FileText size={24} />
            </div>
            <h3 className="text-xl font-bold font-serif mb-3">Streamlined Administrative Tasks</h3>
            <p className="text-gray-600">
              Automate tasks like marketing, contract review, document processing, compliance, emails, and more. Let
              your team focus on strategic priorities.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}
