import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function TermsConditions() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Terms & Conditions</h1>
          
          <div className="text-suku-text-muted mb-8">
            <p><strong>Effective Date:</strong> July 19, 2025</p>
            <p><strong>Platform:</strong> SukuSuku.ai</p>
            <p><strong>Owned and operated by:</strong> AI Masters World</p>
            <p><strong>Headquarters:</strong> Bengaluru, Karnataka, India</p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Acceptance of Terms</h2>
            <p className="text-suku-text-secondary leading-relaxed">
              By accessing and using SukuSuku.ai ("we", "our", "us", or "the platform"), you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing the platform.
            </p>
            <p className="text-suku-text-secondary leading-relaxed mt-4">
              These Terms constitute a legally binding agreement between you (the "user") and AI Masters World.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. Services Offered</h2>
            <p className="text-suku-text-secondary mb-4">
              SukuSuku.ai is an AI-powered content creation platform that allows users to generate:
            </p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>Scripts for films, documentaries, or series</li>
              <li>Full-length books and stories</li>
              <li>Posters and thumbnails</li>
              <li>Voiceovers using text-to-speech</li>
              <li>AI-generated music and soundtracks</li>
              <li>Videos (Beta feature)</li>
            </ul>
            <p className="text-suku-text-secondary mt-4">
              These services are subject to change, update, or discontinuation at the sole discretion of AI Masters World.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. User Eligibility</h2>
            <p className="text-suku-text-secondary mb-4">By using this platform, you affirm that:</p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>You are at least 18 years old or have obtained the consent of a legal guardian</li>
              <li>You are capable of entering into a binding agreement under applicable law</li>
              <li>You are using the service for lawful purposes only</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. Intellectual Property</h2>
            <p className="text-suku-text-secondary mb-4">
              All trademarks, service marks, graphics, and logos used in connection with SukuSuku.ai are the property of AI Masters World. The structure, layout, design, and functionalities of the platform are proprietary.
            </p>
            <p className="text-suku-text-secondary">
              Users retain the rights to content they generate via SukuSuku.ai to the extent allowed under applicable law. However, users must ensure that their generated content complies with third-party copyright rules, platform publishing policies, and intellectual property laws.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">5. AI-Generated Content Disclaimer</h2>
            <p className="text-suku-text-secondary mb-4">
              SukuSuku.ai uses generative AI models to produce content based on user input. We do not control or monitor the specific output of the AI, and we do not guarantee that the generated content will be:
            </p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>Free from errors or bias</li>
              <li>Suitable for professional use without review</li>
              <li>Compliant with third-party platforms' content policies</li>
            </ul>
            <p className="text-suku-text-secondary mt-4">
              Users are solely responsible for reviewing, editing, and verifying the content before use or publication.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">6. Prohibited Uses</h2>
            <p className="text-suku-text-secondary mb-4">You agree not to use SukuSuku.ai:</p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>For unlawful or harmful purposes</li>
              <li>To create content that is defamatory, obscene, hateful, or discriminatory</li>
              <li>To infringe on any intellectual property rights or privacy rights</li>
              <li>To reverse-engineer, exploit, or tamper with the platform</li>
            </ul>
            <p className="text-suku-text-secondary mt-4">
              AI Masters World reserves the right to suspend or permanently ban users who violate these terms.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">7. Governing Law</h2>
            <p className="text-suku-text-secondary">
              These Terms shall be governed by and interpreted in accordance with the laws of Bengaluru, Karnataka, India, and any legal disputes shall fall under the exclusive jurisdiction of courts located therein.
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">8. Contact Information</h2>
            <p className="text-suku-text-secondary mb-4">
              For any queries regarding these Terms & Conditions, please contact us at:
            </p>
            <div className="text-suku-text-secondary">
              <p>📧 <span className="text-suku-red">hello@sukusuku.ai</span></p>
              <p>📍 Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}