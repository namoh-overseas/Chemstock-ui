"use client"
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import FallbackImage from "@/lib/imgLoader";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-center">About ChemStock</h1>

        <div className="relative h-[300px] md:h-[400px] rounded-lg overflow-hidden mb-12">
          <FallbackImage
            src="/assets/images/about.jpg"
            alt="ChemStock laboratory"
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-12">
          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Our Mission
            </h2>
            <p className="text-lg text-gray-700 mb-4">
              At ChemStock, we&apos;re dedicated to revolutionizing the way chemical
              stocks are bought and sold. Our mission is to
              create a secure, transparent, and efficient marketplace that
              connects verified sellers with buyers who need high-quality
              chemical stocks.
            </p>
            <p className="text-lg text-gray-700">
              We believe in making specialized chemicals accessible to everyone
              who needs them, from research laboratories and educational
              institutions to industrial manufacturers and agricultural
              businesses.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">Our Story</h2>
            <p className="text-lg text-gray-700 mb-4">
              ChemStock was founded in 2020 by a team of industry professionals
              who recognized the challenges in sourcing specialized chemicals.
              What began as a small operation has grown into a trusted
              marketplace with hundreds of verified sellers and thousands of
              stocks.
            </p>
            <p className="text-lg text-gray-700">
              Our journey has been driven by a commitment to quality, safety,
              and customer satisfaction. We&apos;ve built strong relationships with
              suppliers and customers alike, creating a community that values
              integrity and excellence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              What Sets Us Apart
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="hover:shadow-md transition-shadow cursor-default">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Verified Sellers
                  </h3>
                  <p className="text-gray-700">
                    Every seller on our platform undergoes a rigorous
                    verification process to ensure they meet our standards for
                    quality and reliability.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-default">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Stock Authenticity
                  </h3>
                  <p className="text-gray-700">
                    We maintain strict quality control measures to ensure that
                    all stocks listed on our platform are authentic and meet
                    industry standards.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-default">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Secure Transactions
                  </h3>
                  <p className="text-gray-700">
                    Our platform facilitates secure communication between buyers
                    and sellers, ensuring that transactions are safe and
                    transparent.
                  </p>
                </CardContent>
              </Card>

              <Card className="hover:shadow-md transition-shadow cursor-default">
                <CardContent className="pt-6">
                  <h3 className="text-xl font-semibold mb-3">
                    Customer Support
                  </h3>
                  <p className="text-gray-700">
                    Our dedicated customer support team is always ready to
                    assist with any questions or concerns you may have about
                    your orders or the platform.
                  </p>
                </CardContent>
              </Card>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-6 text-primary">
              Our Categories
            </h2>
            <div className="flex flex-wrap gap-3">
              <Badge className="px-4 py-2 text-base bg-secondary hover:bg-secondary/90 cursor-default">
                Laboratory Chemicals
              </Badge>
              <Badge className="px-4 py-2 text-base bg-secondary hover:bg-secondary/90 cursor-default">
                Industrial Chemicals
              </Badge>
              <Badge className="px-4 py-2 text-base bg-secondary hover:bg-secondary/90 cursor-default">
                Specialty Chemicals
              </Badge>
              <Badge className="px-4 py-2 text-base bg-secondary hover:bg-secondary/90 cursor-default">
                Pigments
              </Badge>
              <Badge className="px-4 py-2 text-base bg-secondary hover:bg-secondary/90 cursor-default">
                Dyes
              </Badge>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4 text-primary">
              Join Our Community
            </h2>
            <p className="text-lg text-gray-700">
              Whether you&apos;re looking to buy high-quality chemicals or sell your
              stocks to a wider audience, ChemStock offers the platform and
              support you need to succeed. Join our growing community of buyers
              and sellers today and experience the ChemStock difference.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
