import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PrivacyPolicy() {
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
          <h1 className="text-4xl font-bold text-white mb-8">Privacy Policy</h1>
          
          <div className="text-suku-text-muted mb-8">
            <p><strong>Effective Date:</strong> July 19, 2025</p>
            <p><strong>Platform:</strong> SukuSuku.ai</p>
            <p><strong>Operated by:</strong> AI Masters World</p>
            <p><strong>Headquarters:</strong> Bengaluru, Karnataka, India</p>
          </div>

          <p className="text-suku-text-secondary leading-relaxed mb-8">
            Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit and use SukuSuku.ai, an AI content creation platform provided by AI Masters World.
          </p>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">1. Information We Collect</h2>
            
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-suku-red mb-4">A. Personal Information (Provided by You)</h3>
              <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
                <li>Name</li>
                <li>Email address</li>
                <li>Mobile number (if provided)</li>
                <li>Account credentials</li>
                <li>Payment information (processed securely via third-party gateways like Razorpay or Stripe)</li>
              </ul>
            </div>

            <div className="mb-6">
              <h3 className="text-xl font-semibold text-suku-red mb-4">B. Usage Data (Automatically Collected)</h3>
              <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
                <li>IP address</li>
                <li>Browser type and version</li>
                <li>Device type and operating system</li>
                <li>Pages visited and time spent</li>
                <li>Interaction logs with our AI tools</li>
                <li>Language and region preferences</li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">2. How We Use Your Information</h2>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>To provide and operate the SukuSuku.ai services</li>
              <li>To generate AI-based content based on your input</li>
              <li>To improve our algorithms and user experience</li>
              <li>To respond to user inquiries or support requests</li>
              <li>To send transactional and promotional emails (you may opt out)</li>
              <li>To comply with legal obligations or enforce our Terms of Service</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">3. Your Rights Under Indian Law</h2>
            <p className="text-suku-text-secondary mb-4">
              Under the Digital Personal Data Protection Act, 2023 (DPDP Act), you have the right to:
            </p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>Access your personal data</li>
              <li>Correct inaccuracies</li>
              <li>Withdraw consent at any time</li>
              <li>Request erasure or restriction of data</li>
              <li>Lodge complaints with the Data Protection Board of India (if applicable)</li>
            </ul>
            <p className="text-suku-text-secondary mt-4">
              You may exercise any of these rights by emailing us at <span className="text-suku-red">hello@sukusuku.ai</span>
            </p>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">4. Security Measures</h2>
            <p className="text-suku-text-secondary mb-4">
              We implement industry-standard measures to secure your data:
            </p>
            <ul className="list-disc pl-6 text-suku-text-secondary space-y-2">
              <li>SSL encryption</li>
              <li>Firewall protection</li>
              <li>Regular server patching</li>
              <li>Access control and monitoring</li>
            </ul>
          </section>

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6">5. Contact Us</h2>
            <p className="text-suku-text-secondary">
              If you have any questions, requests, or concerns regarding this Privacy Policy or your data, please reach out:
            </p>
            <div className="mt-4 text-suku-text-secondary">
              <p>📧 <span className="text-suku-red">hello@sukusuku.ai</span></p>
              <p>📍 AI Masters World, Bengaluru, Karnataka, India</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}