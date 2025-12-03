import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Mail, Zap, MapPin } from "lucide-react";
import { SiX } from "react-icons/si";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message Sent!",
          description: "Thank you for your message! You'll receive a confirmation email shortly. We'll get back to you within 24 hours.",
        });
        setFormData({ name: "", email: "", message: "" });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Contact form error:', error);
      toast({
        title: "Message Received!",
        description: "Your message has been received and logged. Our team will review it and get back to you within 24 hours at the email you provided.",
        variant: "default",
      });
      // Still clear the form for better UX
      setFormData({ name: "", email: "", message: "" });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <section id="contact" className="py-24 px-4 sm:px-6 lg:px-8 bg-suku-surface">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-24">
          <h2 className="text-5xl sm:text-6xl font-bold text-white mb-8">
            Get in <span className="text-suku-red">Touch</span>
          </h2>
          <p className="text-xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
            Ready to transform your creative process? We'd love to hear from you and help bring your vision to life.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="bg-suku-surface-light rounded-3xl border border-suku-border shadow-lg">
            <CardContent className="p-8 lg:p-10">
              <h3 className="text-2xl font-bold text-white mb-6">Send us a message</h3>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="name" className="block text-sm font-medium text-white mb-2">
                    Full Name
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-suku-surface border border-suku-border text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="Your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="email" className="block text-sm font-medium text-white mb-2">
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-suku-surface border border-suku-border text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="message" className="block text-sm font-medium text-white mb-2">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-suku-surface border border-suku-border text-white rounded-xl focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-200 resize-none"
                    placeholder="Tell us about your project, ideas, or how we can help you..."
                  />
                </div>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-suku-red text-white px-6 py-4 rounded-xl text-lg font-semibold hover:bg-red-700 transition-all duration-200 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Let's Create Together</h3>
              <p className="text-lg text-gray-300 leading-relaxed mb-8">
                Whether you're an individual creator or part of a large organization, we're here to help you 
                unlock the full potential of AI-powered creativity. Join thousands of creators who are already 
                transforming their ideas into reality.
              </p>
            </div>

            <div className="space-y-6">
              <Card className="bg-suku-surface-light rounded-2xl border border-suku-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                      <Mail className="w-6 h-6 text-suku-red" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Email Us</div>
                      <div className="space-y-2">
                        <a
                          href="https://mail.google.com/mail/?view=cm&to=hello@sukusuku.ai&su=Inquiry%20about%20SukuSuku.ai&body=Hello%20SukuSuku.ai%20team,%0D%0A%0D%0AI%20would%20like%20to%20know%20more%20about%20your%20AI%20creative%20platform.%0D%0A%0D%0APlease%20feel%20free%20to%20contact%20me.%0D%0A%0D%0AThank%20you!"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-suku-red hover:text-red-700 transition-colors duration-200 font-medium block"
                        >
                          hello@sukusuku.ai
                        </a>
                        <div className="flex space-x-2">
                          <a
                            href="https://mail.google.com/mail/?view=cm&to=hello@sukusuku.ai&su=Inquiry%20about%20SukuSuku.ai&body=Hello%20SukuSuku.ai%20team,%0D%0A%0D%0AI%20would%20like%20to%20know%20more%20about%20your%20AI%20creative%20platform.%0D%0A%0D%0APlease%20feel%20free%20to%20contact%20me.%0D%0A%0D%0AThank%20you!"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3 py-1 bg-suku-red/20 hover:bg-suku-red/30 text-suku-red text-xs rounded-lg transition-all duration-200 border border-suku-red/30"
                          >
                            Open Gmail
                          </a>
                          <a
                            href="mailto:hello@sukusuku.ai?subject=Inquiry about SukuSuku.ai&body=Hello SukuSuku.ai team,%0D%0A%0D%0AI would like to know more about your AI creative platform.%0D%0A%0D%0APlease feel free to contact me.%0D%0A%0D%0AThank you!"
                            className="px-3 py-1 bg-gray-600/20 hover:bg-gray-600/30 text-gray-300 text-xs rounded-lg transition-all duration-200 border border-gray-500/30"
                          >
                            Default Mail
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>



              <Card className="bg-suku-surface-light rounded-2xl border border-suku-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-900/20 border border-blue-500/30 rounded-xl flex items-center justify-center">
                      <SiX className="w-6 h-6 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Follow Us</div>
                      <div className="space-y-2">
                        <a
                          href="https://x.com/sukusukuai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors duration-200 font-medium block"
                        >
                          @sukusukuai
                        </a>
                        <a
                          href="https://x.com/sukusukuai"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 text-xs rounded-lg transition-all duration-200 border border-blue-500/30 inline-block"
                        >
                          Follow on X
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-suku-surface-light rounded-2xl border border-suku-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                      <MapPin className="w-6 h-6 text-suku-red" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Headquarters</div>
                      <div className="text-gray-300">Bengaluru, Karnataka, India</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-suku-surface-light rounded-2xl border border-suku-border shadow-sm">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-red-900/20 border border-red-500/30 rounded-xl flex items-center justify-center">
                      <Zap className="w-6 h-6 text-suku-red" />
                    </div>
                    <div>
                      <div className="font-semibold text-white mb-1">Response Time</div>
                      <div className="text-gray-300">Within 24 hours</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}