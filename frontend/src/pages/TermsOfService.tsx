import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { FileText, AlertCircle, Scale, UserCheck, Ban, Mail } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';

const TermsOfService: React.FC = () => {
  const lastUpdated = 'December 5, 2024';

  return (
    <>
      <PageMeta
        title="Terms of Service"
        description="Read the terms and conditions for using Chase My Career application."
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold">Terms of Service</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Last Updated: {lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <section>
                <p className="text-foreground leading-relaxed">
                  Welcome to Chase My Career. By accessing or using our application, you agree to be bound by these Terms of Service. Please read them carefully before using our service.
                </p>
              </section>

              <Separator />

              {/* Acceptance of Terms */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">1. Acceptance of Terms</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    By creating an account or using Chase My Career, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use our service.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Description of Service */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">2. Description of Service</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Chase My Career is a web application designed to help users track and manage their job search activities over a 50-day period. The service includes:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Interactive calendar for tracking daily activities</li>
                    <li>Structured 50-day career development program</li>
                    <li>Progress tracking and milestone celebrations</li>
                    <li>Google OAuth authentication</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* User Accounts */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <UserCheck className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">3. User Accounts</h2>
                </div>
                <div className="space-y-4 pl-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3.1 Account Creation</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      To use our service, you must sign in with a valid Google account. You are responsible for maintaining the confidentiality of your account credentials.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3.2 Account Responsibilities</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You agree to:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>Provide accurate and complete information</li>
                      <li>Maintain the security of your account</li>
                      <li>Notify us immediately of any unauthorized access</li>
                      <li>Be responsible for all activities under your account</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3.3 Account Termination</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You may delete your account at any time through the Privacy Settings page. We reserve the right to suspend or terminate accounts that violate these terms.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Acceptable Use */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">4. Acceptable Use</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to use Chase My Career only for lawful purposes. You must not:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Violate any applicable laws or regulations</li>
                    <li>Infringe on the rights of others</li>
                    <li>Transmit harmful or malicious code</li>
                    <li>Attempt to gain unauthorized access to our systems</li>
                    <li>Interfere with or disrupt the service</li>
                    <li>Use automated systems to access the service without permission</li>
                    <li>Impersonate another person or entity</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Intellectual Property */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">5. Intellectual Property</h2>
                </div>
                <div className="space-y-4 pl-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">5.1 Our Content</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      All content, features, and functionality of Chase My Career, including but not limited to text, graphics, logos, and software, are owned by us or our licensors and are protected by copyright, trademark, and other intellectual property laws.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">5.2 Your Content</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      You retain all rights to any content you create or upload to the service. By using our service, you grant us a limited license to store and display your content solely for the purpose of providing the service to you.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Disclaimer of Warranties */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">6. Disclaimer of Warranties</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Chase My Career is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not guarantee that:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>The service will be uninterrupted or error-free</li>
                    <li>Defects will be corrected</li>
                    <li>The service is free of viruses or harmful components</li>
                    <li>The results obtained from using the service will be accurate or reliable</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Limitation of Liability */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Ban className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">7. Limitation of Liability</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    To the maximum extent permitted by law, Chase My Career and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Your use or inability to use the service</li>
                    <li>Any unauthorized access to or use of our servers</li>
                    <li>Any interruption or cessation of the service</li>
                    <li>Any bugs, viruses, or harmful code transmitted through the service</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Indemnification */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">8. Indemnification</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    You agree to indemnify, defend, and hold harmless Chase My Career and its affiliates from any claims, liabilities, damages, losses, and expenses, including reasonable attorney's fees, arising out of or in any way connected with:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Your access to or use of the service</li>
                    <li>Your violation of these Terms of Service</li>
                    <li>Your violation of any rights of another party</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Governing Law */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Scale className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">9. Governing Law</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    These Terms of Service shall be governed by and construed in accordance with the laws of the jurisdiction in which we operate, without regard to its conflict of law provisions.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Changes to Terms */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <FileText className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">10. Changes to Terms</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    We reserve the right to modify these Terms of Service at any time. We will notify users of any material changes by posting the new terms on this page and updating the "Last Updated" date. Your continued use of the service after such changes constitutes your acceptance of the new terms.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Contact Information */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">11. Contact Information</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about these Terms of Service, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Chase My Career</p>
                    <p className="text-muted-foreground">Email: legal@chasemycareer.com</p>
                    <p className="text-muted-foreground">Support: support@chasemycareer.com</p>
                  </div>
                </div>
              </section>

              {/* Acceptance */}
              <section className="mt-8 p-6 bg-primary/10 rounded-lg border-2 border-primary/20">
                <p className="text-foreground font-semibold">
                  By using Chase My Career, you acknowledge that you have read and understood these Terms of Service and agree to be bound by them.
                </p>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default TermsOfService;
