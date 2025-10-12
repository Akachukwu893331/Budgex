import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import {
  featuresData,
  howItWorksData,
  statsData,
  testimonialsData,
} from "@/data/landing";
import HeroSection from "@/components/hero";
import Link from "next/link";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0F0F0] to-white">
      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <section className="py-16 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {statsData.map((stat, index) => (
              <div 
                key={index} 
                className="text-center p-6 rounded-xl bg-gradient-to-br from-[#003D73] to-[#00BFFF] text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="text-3xl lg:text-4xl font-bold mb-2">
                  {stat.value}
                </div>
                <div className="text-blue-100 text-sm lg:text-base">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#003D73] mb-4">
              Everything you need to manage your finances
            </h2>
            <p className="text-[#333333] text-lg max-w-2xl mx-auto">
              Powerful tools to help you track, analyze, and optimize your financial health
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuresData.map((feature, index) => (
              <Card 
                key={index}
                className="p-6 border border-[#003D73]/10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 bg-white"
              >
                <CardContent className="space-y-4 pt-4">
                  <div className="text-[#00BFFF] text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-[#003D73]">
                    {feature.title}
                  </h3>
                  <p className="text-[#333333] leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-[#F0F0F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#003D73] mb-4">
              How It Works
            </h2>
            <p className="text-[#333333] text-lg max-w-2xl mx-auto">
              Simple steps to take control of your financial future
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {howItWorksData.map((step, index) => (
              <div 
                key={index} 
                className="relative group"
              >
                {/* Connection line between steps */}
                {index < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-1/2 w-full h-0.5 bg-[#00BFFF]/30 transform -translate-y-1/2 z-0 group-hover:bg-[#00BFFF]/50 transition-colors duration-300" />
                )}
                
                <div className="relative bg-white rounded-2xl p-8 shadow-lg border border-[#003D73]/10 hover:shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:border-[#00BFFF]/30 z-10">
                  {/* Step number */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-[#003D73] text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {index + 1}
                  </div>
                  
                  {/* Icon container with glow effect */}
                  <div className="w-20 h-20 bg-gradient-to-br from-[#003D73] to-[#00BFFF] rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-[0_0_20px_rgba(0,191,255,0.3)] transition-shadow duration-300">
                    <div className="text-white text-2xl ">
                      {step.icon}
                    </div>
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-semibold text-[#003D73] mb-4 text-center">
                    {step.title}
                  </h3>
                  <p className="text-[#333333] leading-relaxed text-center">
                    {step.description}
                  </p>
                  
                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00BFFF]/5 to-[#003D73]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Security & Privacy Section */}
      <section className="py-20 bg-white bg-red-400">
        <div className="container mx-auto px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-[#003D73] mb-6">
                Bank-Level Security for Your Finances
              </h2>
              <p className="text-[#333333] text-lg mb-8 leading-relaxed">
                Budgex protects your personal finances while keeping your data completely private. Track and manage your expenses with confidence and peace of mind.
              </p>
              <div className="space-y-4">
                {[
                  "End-to-end encryption",
                  "Secure user authentication (multi-factor login support)",
                  "AI bot protection to prevent automated attacks",
                  "Data privacy fully compliant with global standards",
                  "Regular security audits and monitoring"
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <div className="w-6 h-6 bg-[#00BFFF] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#333333] font-medium">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#003D73] to-[#00BFFF] rounded-3xl p-8 lg:p-12 text-white">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Your Privacy Matters</h3>
                <p className="text-blue-100 leading-relaxed">
                  We believe your financial data should remain private. That's why we built 
                  Budgex with privacy-first principles and transparent data practices.
                </p>
                <div className="bg-white/10 p-4 rounded-xl">
                  <p className="text-sm">
                    "Welth helped me understand my spending without compromising my privacy. 
                    I feel safe knowing my data is protected."
                  </p>
                  <div className="flex items-center mt-4">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="font-semibold">AS</span>
                    </div>
                    <div className="ml-3">
                      <p className="font-semibold">Alex Smith</p>
                      <p className="text-blue-200 text-sm">User since 2023</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 bg-[#F0F0F0]">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-[#003D73] mb-4">
              Trusted by Professionals
            </h2>
            <p className="text-[#333333] text-lg max-w-2xl mx-auto">
              See what financial experts and professionals are saying about Welth
            </p>
          </div>
          
          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {testimonialsData.map((testimonial, index) => (
              <div
                key={index}
                className="group"
              >
                <Card className="p-6 border border-[#003D73]/10 bg-white shadow-lg hover:shadow-2xl transition-all duration-500 group-hover:scale-[1.02] overflow-hidden h-full">
                  {/* Gradient accent bar */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#003D73] to-[#00BFFF]" />
                  
                  <CardContent className="pt-6">
                    {/* Quote icon */}
                    <div className="text-[#00BFFF] text-4xl mb-4 opacity-20">"</div>
                    
                    <p className="text-[#333333] text-lg leading-relaxed mb-6 italic">
                      "{testimonial.quote}"
                    </p>
                    
                    <div className="flex items-center space-x-4">
                      <div className="relative">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={60}
                          height={60}
                          className="rounded-full border-2 border-[#00BFFF] shadow-md"
                        />
                        {/* Online indicator */}
                        <div className="absolute bottom-1 right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                      </div>
                      <div className="flex-1">
                        <div className="font-semibold text-[#003D73] text-lg">
                          {testimonial.name}
                        </div>
                        <div className="text-[#333333] text-sm mb-1">
                          {testimonial.role}
                        </div>
                        {/* Rating stars */}
                        <div className="flex space-x-1">
                          {[...Array(5)].map((_, i) => (
                            <svg
                              key={i}
                              className="w-4 h-4 text-yellow-400 fill-current"
                              viewBox="0 0 20 20"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    {/* Company logo/verification badge */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F0F0F0]">
                      <div className="flex items-center space-x-2">
                        <div className="w-6 h-6 bg-[#003D73] rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <span className="text-sm text-[#333333]">Verified Professional</span>
                      </div>
                      <div className="text-xs text-[#333333] bg-[#F0F0F0] px-2 py-1 rounded">
                        {testimonial.industry || "Finance"}
                      </div>
                    </div>
                  </CardContent>
                  
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-[#00BFFF]/5 to-[#003D73]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[#003D73] via-[#0066CC] to-[#00BFFF]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
            Ready to Transform Your Finances?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
            Join thousands of users who are already managing their finances smarter with Welth. 
            Start your journey to financial freedom today.
          </p>
          <Link href="/dashboard">
            <Button
              size="lg"
              className="bg-white text-[#003D73] hover:bg-blue-50 font-semibold text-lg px-8 py-6 rounded-xl transition-all duration-300 hover:scale-105 shadow-2xl border-0"
            >
              Get Started Free
            </Button>
          </Link>
          <p className="text-blue-200 text-sm mt-4">
            No credit card required 
          </p>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;