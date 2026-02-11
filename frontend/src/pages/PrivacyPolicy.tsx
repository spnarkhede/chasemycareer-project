import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Shield, Lock, Eye, Database, Mail, Globe } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';

const PrivacyPolicy: React.FC = () => {
  const lastUpdated = 'December 5, 2024';

  return (
    <>
      <PageMeta
        title="Privacy Policy"
        description="Learn how Chase My Career collects, uses, and protects your personal information."
      />
      <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="shadow-lg">
            <CardHeader className="space-y-4">
              <div className="flex items-center gap-3">
                <Shield className="h-8 w-8 text-primary" />
                <CardTitle className="text-3xl font-bold">Privacy Policy</CardTitle>
              </div>
              <p className="text-muted-foreground">
                Last Updated: {lastUpdated}
              </p>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Introduction */}
              <section>
                <p className="text-foreground leading-relaxed">
                  At Chase My Career, we take your privacy seriously. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application. Please read this privacy policy carefully.
                </p>
              </section>

              <Separator />

              {/* Information We Collect */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">1. Information We Collect</h2>
                </div>
                <div className="space-y-4 pl-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1.1 Information from Google OAuth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      When you sign in with Google, we collect:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>Your name</li>
                      <li>Your email address</li>
                      <li>Your profile picture</li>
                      <li>Your Google account ID</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1.2 Usage Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We may collect information about how you interact with our application, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>Pages visited and features used</li>
                      <li>Time spent on the application</li>
                      <li>Browser type and version</li>
                      <li>Device information</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">1.3 Cookies and Local Storage</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We use browser local storage to maintain your session and store your preferences. This data remains on your device and is not transmitted to our servers.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* How We Use Your Information */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">2. How We Use Your Information</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    We use the information we collect to:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Provide and maintain our service</li>
                    <li>Authenticate your identity</li>
                    <li>Personalize your experience</li>
                    <li>Track your progress through the 50-day program</li>
                    <li>Improve our application and user experience</li>
                    <li>Communicate with you about updates or changes</li>
                  </ul>
                </div>
              </section>

              <Separator />

              {/* Data Storage and Security */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lock className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">3. Data Storage and Security</h2>
                </div>
                <div className="space-y-4 pl-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3.1 Where We Store Your Data</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Your authentication data is stored locally in your browser using localStorage. We do not store your Google credentials on our servers.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">3.2 Security Measures</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We implement appropriate technical and organizational security measures to protect your personal information, including:
                    </p>
                    <ul className="list-disc list-inside space-y-1 mt-2 text-muted-foreground">
                      <li>Secure HTTPS connections</li>
                      <li>OAuth 2.0 authentication protocol</li>
                      <li>Regular security updates and patches</li>
                      <li>Limited data collection and retention</li>
                    </ul>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Third-Party Services */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">4. Third-Party Services</h2>
                </div>
                <div className="space-y-4 pl-8">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">4.1 Google OAuth</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      We use Google OAuth for authentication. Your use of Google services is subject to Google's Privacy Policy, available at{' '}
                      <a
                        href="https://policies.google.com/privacy"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        https://policies.google.com/privacy
                      </a>
                    </p>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">4.2 Cloud Infrastructure</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      Our application is hosted on secure cloud infrastructure. We have Data Processing Agreements (DPAs) in place with our cloud providers to ensure GDPR compliance.
                    </p>
                  </div>
                </div>
              </section>

              <Separator />

              {/* Your Rights (GDPR) */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">5. Your Rights Under GDPR</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    If you are a resident of the European Economic Area (EEA), you have certain data protection rights:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li><strong>Right to Access:</strong> You can request a copy of your personal data</li>
                    <li><strong>Right to Rectification:</strong> You can request correction of inaccurate data</li>
                    <li><strong>Right to Erasure:</strong> You can request deletion of your data</li>
                    <li><strong>Right to Data Portability:</strong> You can export your data in a machine-readable format</li>
                    <li><strong>Right to Withdraw Consent:</strong> You can withdraw consent at any time</li>
                    <li><strong>Right to Object:</strong> You can object to processing of your data</li>
                  </ul>
                  <p className="text-muted-foreground leading-relaxed mt-4">
                    To exercise these rights, please visit your{' '}
                    <a href="/privacy-settings" className="text-primary hover:underline">
                      Privacy Settings
                    </a>{' '}
                    page.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Data Retention */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Database className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">6. Data Retention</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    We retain your personal information only for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy. You can delete your data at any time through the Privacy Settings page.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Children's Privacy */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">7. Children's Privacy</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    Our service is not intended for children under the age of 16. We do not knowingly collect personal information from children under 16. If you are a parent or guardian and believe your child has provided us with personal information, please contact us.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Changes to Privacy Policy */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">8. Changes to This Privacy Policy</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last Updated" date.
                  </p>
                </div>
              </section>

              <Separator />

              {/* Contact Us */}
              <section className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-semibold">9. Contact Us</h2>
                </div>
                <div className="space-y-2 pl-8">
                  <p className="text-muted-foreground leading-relaxed">
                    If you have any questions about this Privacy Policy or our data practices, please contact us at:
                  </p>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <p className="font-semibold">Chase My Career</p>
                    <p className="text-muted-foreground">Email: privacy@chasemycareer.com</p>
                    <p className="text-muted-foreground">Data Protection Officer: dpo@chasemycareer.com</p>
                  </div>
                </div>
              </section>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default PrivacyPolicy;
