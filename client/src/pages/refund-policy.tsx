import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function RefundPolicy() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const goBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-suku-black text-suku-text-primary">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <Button 
          onClick={goBack}
          variant="ghost"
          className="mb-8 text-suku-text-secondary hover:text-suku-red"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="prose prose-invert prose-lg max-w-none">
          <h1 className="text-4xl font-bold text-white mb-8">💸 Refund Policy</h1>
          
          <div className="text-suku-text-muted mb-8">
            <p><strong>Effective Date:</strong> July 19, 2025</p>
            <p><strong>Platform:</strong> SukuSuku.ai</p>
            <p><strong>Operated by:</strong> AI Masters World</p>
            <p><strong>Headquarters:</strong> Bengaluru, Karnataka, India</p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. No Refunds Policy</h2>
            <p className="text-suku-text-secondary leading-relaxed mb-4">
              At SukuSuku.ai, we are committed to providing a transparent, fair, and risk-free user experience. To help you explore and understand the platform, we offer free credits for all new users so you can try our tools before making any payment.
            </p>
            <p className="text-suku-text-secondary leading-relaxed">
              Because our platform delivers instant digital outputs (scripts, books, posters, voiceovers, videos, music, etc.), and users have the ability to download, copy, or distribute that content immediately, we maintain a strict no-refund policy for all paid purchases.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Free Trial & Fair Use</h2>
            <p className="text-suku-text-secondary mb-4">
              All users receive a certain number of free credits upon signup. These credits allow you to:
            </p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>Generate content using our WRITE feature or other tools</li>
              <li>Test the quality and capabilities of our AI models</li>
              <li>Explore different content formats and styles</li>
              <li>Understand the platform's workflow and user interface</li>
            </ul>
            <p className="text-suku-text-secondary mt-4">
              This ensures that you can make an informed decision about purchasing additional credits.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Digital Product Nature</h2>
            <p className="text-suku-text-secondary leading-relaxed">
              Given the digital nature of our service and the instant delivery of content, all purchases are final. Once you use your credits to generate content, the transaction is considered complete, and the digital goods have been delivered.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. Technical Issues & Support</h2>
            <p className="text-suku-text-secondary mb-4">
              If you encounter technical issues that prevent you from using the platform, please contact our support team immediately:
            </p>
            <div className="text-suku-text-secondary">
              <p>📧 <span className="text-suku-red">hello@sukusuku.ai</span></p>
            </div>
            <p className="text-suku-text-secondary mt-4">
              We will work to resolve technical problems as quickly as possible. In rare cases where technical issues cannot be resolved, we may consider partial credit restoration on a case-by-case basis.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">5. Billing Disputes</h2>
            <p className="text-suku-text-secondary leading-relaxed">
              If you believe you have been charged incorrectly or notice any unauthorized transactions, please contact us within 7 days of the charge with details of the issue. We will investigate and resolve billing errors promptly.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">6. Contact Us</h2>
            <p className="text-suku-text-secondary mb-4">
              For any questions about this Refund Policy or billing issues, please contact:
            </p>
            <div className="text-suku-text-secondary">
              <p>📧 <span className="text-suku-red">hello@sukusuku.ai</span></p>
              <p>📍 AI Masters World, Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}