"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Brain, 
  Zap, 
  Shield, 
  TrendingUp, 
  Smartphone, 
  Eye, 
  Target,
  Sparkles,
  ArrowRight,
  DollarSign,
  PieChart
} from "lucide-react";

// Mock data for features
const featuresData = [
  {
    icon: <Brain className="w-8 h-8 text-blue-400" />,
    title: "AI-Powered Insights",
    description: "Advanced machine learning algorithms analyze your spending patterns and provide personalized financial recommendations."
  },
  {
    icon: <Shield className="w-8 h-8 text-purple-400" />,
    title: "Bank-Level Security",
    description: "256-bit encryption and multi-factor authentication ensure your financial data remains completely secure."
  },
  {
    icon: <TrendingUp className="w-8 h-8 text-cyan-400" />,
    title: "Smart Budgeting",
    description: "Intelligent budget tracking with predictive analytics to help you stay on track with your financial goals."
  },
  {
    icon: <Zap className="w-8 h-8 text-yellow-400" />,
    title: "Real-Time Sync",
    description: "Instant synchronization across all your devices with lightning-fast performance and zero delays."
  }
];

const howItWorksData = [
  {
    icon: <Smartphone className="w-8 h-8 text-blue-400" />,
    title: "Connect Your Accounts",
    description: "Securely link your bank accounts, credit cards, and financial institutions in seconds."
  },
  {
    icon: <Eye className="w-8 h-8 text-purple-400" />,
    title: "AI Analysis",
    description: "Our advanced AI analyzes your financial data and identifies patterns, opportunities, and risks."
  },
  {
    icon: <Target className="w-8 h-8 text-cyan-400" />,
    title: "Achieve Goals",
    description: "Get personalized recommendations and actionable insights to reach your financial objectives faster."
  }
];

const FloatingElements = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {/* Animated Orbs */}
      <motion.div
        className="absolute w-96 h-96 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ top: '10%', left: '10%' }}
      />
      <motion.div
        className="absolute w-64 h-64 bg-gradient-to-r from-cyan-500/10 to-pink-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.8, 1],
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear",
          delay: 5
        }}
        style={{ top: '60%', right: '20%' }}
      />
      <motion.div
        className="absolute w-48 h-48 bg-gradient-to-r from-purple-500/10 to-cyan-500/10 rounded-full blur-3xl"
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear",
          delay: 10
        }}
        style={{ bottom: '20%', left: '60%' }}
      />
    </div>
  );
};

const ParticleField = () => {
  const particles = Array.from({ length: 50 }, (_, i) => i);
  
  return (
    <div className="fixed inset-0 pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle}
          className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
          initial={{
            x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
            y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
            opacity: 0
          }}
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Interactive Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-50"
        style={{
          background: `radial-gradient(600px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.1), transparent 70%)`
        }}
      />

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="max-w-6xl mx-auto"
        >
          {/* Floating Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-full border border-blue-500/30 backdrop-blur-sm mb-8"
          >
            <Sparkles className="w-4 h-4 text-blue-400" />
            <span className="text-sm font-medium text-blue-300">AI-Powered Financial Intelligence</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold mb-6 leading-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Smart Finance,
            </span>
            <br />
            <motion.span
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              Smarter You
            </motion.span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.7 }}
            className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed"
          >
            Revolutionary AI-powered financial management that adapts to your lifestyle.
            <br />
            <span className="text-blue-400">Experience the future of money management today.</span>
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.9 }}
            className="flex justify-center items-center mb-16"
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <Button
                size="lg"
                className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-12 py-5 text-xl rounded-full group"
                onClick={() => window.location.href = '/dashboard'}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Get Started Free
                  <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
                </span>
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500"
                  initial={{ x: "-100%" }}
                  animate={isHovered ? { x: "0%" } : { x: "-100%" }}
                  transition={{ duration: 0.3 }}
                />
              </Button>
            </motion.div>
          </motion.div>

          {/* Futuristic Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateX: 45 }}
            animate={{ opacity: 1, scale: 1, rotateX: 0 }}
            transition={{ duration: 1.5, delay: 1.1 }}
            className="relative max-w-4xl mx-auto"
          >
            <div className="relative">
              {/* Holographic Frame */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-xl transform rotate-1" />
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 to-pink-500/20 rounded-3xl blur-xl transform -rotate-1" />
              
              {/* Main Display */}
              <div className="relative bg-zinc-950/80 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-8 shadow-2xl">
                {/* Dashboard Preview */}
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                      className="flex items-center gap-3"
                    >
                      <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <Brain className="w-4 h-4 text-white" />
                      </div>
                      <span className="text-xl font-semibold text-white">Financial Dashboard</span>
                    </motion.div>

                  </div>

                  {/* Visual Elements */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Chart Visualization */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.3 }}
                      className="md:col-span-2 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-2xl p-6 border border-blue-500/20"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-zinc-400">Portfolio Performance</span>
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </div>
                      {/* Mock Chart */}
                      <div className="relative h-24 flex items-end justify-between gap-1">
                        {Array.from({ length: 12 }, (_, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            animate={{ height: `${Math.random() * 80 + 20}%` }}
                            transition={{ duration: 1.5, delay: 1.5 + i * 0.1 }}
                            className="bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-sm flex-1"
                          />
                        ))}
                      </div>
                    </motion.div>
                    
                    {/* Quick Stats */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 1.5 }}
                      className="space-y-4"
                    >
                      <div className="bg-gradient-to-br from-purple-500/10 to-cyan-500/10 rounded-2xl p-4 border border-purple-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="w-4 h-4 text-cyan-400" />
                          <span className="text-sm text-zinc-400">Balance</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">$24,567</div>
                        <div className="text-xs text-green-400">+12.5% this month</div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-cyan-500/10 to-pink-500/10 rounded-2xl p-4 border border-cyan-500/20">
                        <div className="flex items-center gap-2 mb-2">
                          <PieChart className="w-4 h-4 text-pink-400" />
                          <span className="text-sm text-zinc-400">Expenses</span>
                        </div>
                        <div className="text-2xl font-bold text-white mb-1">$3,240</div>
                        <div className="text-xs text-pink-400">-8.2% from last month</div>
                      </div>
                    </motion.div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default function Home() {
  const featuresRef = useRef(null);
  const howItWorksRef = useRef(null);
  const isInViewFeatures = useInView(featuresRef, { once: true, margin: "-100px" });
  const isInViewHowItWorks = useInView(howItWorksRef, { once: true, margin: "-100px" });

  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Animated Background Elements */}
      <FloatingElements />
      <ParticleField />

      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
            >
              Next-Gen Features
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Powered by advanced AI to revolutionize your financial experience
            </motion.p>
          </motion.div>

          <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {featuresData.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInViewFeatures ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group"
              >
                <Card className="relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border border-zinc-800/50 hover:border-zinc-700/80 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 rounded-3xl h-full">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <CardContent className="relative p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 10 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center mb-6"
                      >
                        <div className="p-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-2xl border border-blue-500/30 group-hover:border-blue-400/50 transition-all duration-300">
                          {feature.icon}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent group-hover:from-blue-300 group-hover:to-purple-300 transition-all duration-300">
                        {feature.title}
                      </h3>
                    </div>
                    
                    <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent"
            >
              How It Works
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-xl text-zinc-400 max-w-2xl mx-auto"
            >
              Three simple steps to transform your financial future
            </motion.p>
          </motion.div>

          <div ref={howItWorksRef} className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isInViewHowItWorks ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
                transition={{ 
                  duration: 0.8, 
                  delay: index * 0.2,
                  ease: "easeOut"
                }}
                whileHover={{ y: -15, scale: 1.02 }}
                className="relative"
              >
                {/* Connecting Line */}
                {index < howItWorksData.length - 1 && (
                  <div className="hidden md:block absolute top-20 left-full w-8 h-0.5 bg-gradient-to-r from-blue-500 to-purple-500 z-0" />
                )}
                
                {/* Step Number */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={isInViewHowItWorks ? { scale: 1 } : { scale: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                  className="absolute -top-6 -left-6 w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-lg z-10 shadow-2xl"
                >
                  {index + 1}
                </motion.div>

                <Card className="group relative overflow-hidden bg-zinc-900/60 backdrop-blur-xl border border-zinc-800/50 hover:border-zinc-700/80 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 rounded-3xl h-full">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  />
                  
                  <CardContent className="relative p-8 text-center h-full flex flex-col justify-between">
                    <div>
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: -10 }}
                        transition={{ duration: 0.3 }}
                        className="flex justify-center mb-6"
                      >
                        <div className="p-4 bg-gradient-to-br from-purple-500/20 to-cyan-500/20 rounded-2xl border border-purple-500/30 group-hover:border-purple-400/50 transition-all duration-300">
                          {step.icon}
                        </div>
                      </motion.div>
                      
                      <h3 className="text-xl font-bold mb-4 bg-gradient-to-r from-zinc-100 to-zinc-300 bg-clip-text text-transparent group-hover:from-purple-300 group-hover:to-cyan-300 transition-all duration-300">
                        {step.title}
                      </h3>
                    </div>
                    
                    <p className="text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 leading-relaxed">
                      {step.description}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Ready to Transform Your Finance?
            </h2>
            <p className="text-xl text-zinc-400 mb-12 max-w-2xl mx-auto">
              Join thousands of users who've already revolutionized their financial journey with AI-powered insights.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-12 py-6 text-xl rounded-full shadow-2xl shadow-blue-500/25"
                onClick={() => window.location.href = '/dashboard'}
              >
                Start Your Journey
                <ArrowRight className="w-6 h-6 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}