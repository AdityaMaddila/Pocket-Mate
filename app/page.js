"use client";

import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { 
  Brain, 
  Zap, 
  TrendingUp, 
  Smartphone, 
  Eye, 
  Target,
  Sparkles,
  ArrowRight,
  DollarSign,
  PieChart,
  Star,
  Users,
  Award,
  Globe,
  Layers,
  BarChart3,
  Wallet,
  CreditCard,
  CheckCircle,
  Plus,
  FileText,
  Calendar
} from "lucide-react";

// Background Animation Components
const FloatingOrbs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute w-[600px] h-[600px] bg-gradient-to-r from-blue-500/5 to-purple-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 200, 0],
          y: [0, -100, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{ top: '5%', left: '20%' }}
      />
      <motion.div
        className="absolute w-[400px] h-[400px] bg-gradient-to-r from-cyan-500/5 to-pink-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, -150, 0],
          y: [0, 80, 0],
          scale: [1, 0.7, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
          delay: 8
        }}
        style={{ top: '50%', right: '10%' }}
      />
      <motion.div
        className="absolute w-[300px] h-[300px] bg-gradient-to-r from-purple-500/5 to-cyan-500/5 rounded-full blur-3xl"
        animate={{
          x: [0, 100, 0],
          y: [0, -60, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "linear",
          delay: 15
        }}
        style={{ bottom: '10%', left: '40%' }}
      />
    </div>
  );
};

const GridPattern = () => {
  return (
    <div className="fixed inset-0 pointer-events-none opacity-20">
      <div 
        className="absolute inset-0" 
        style={{
          backgroundImage: `
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
    </div>
  );
};

// Hero Section with Side Layout
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
    <div className="relative min-h-screen flex items-center overflow-hidden pt-20">
      {/* Interactive Background */}
      <motion.div
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(400px at ${mousePosition.x}px ${mousePosition.y}px, rgba(59, 130, 246, 0.08), transparent 70%)`
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="space-y-8"
          >
            {/* Badge */}


            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="text-white">Your</span>{" "}
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  AI Financial
                </span>
                <br />
                <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  Companion
                </span>
              </h1>
              
              <p className="text-xl text-zinc-400 max-w-lg leading-relaxed">
                Experience intelligent budgeting, smart insights, and automated savings that adapt to your lifestyle.
              </p>
            </motion.div>

            {/* Features Preview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              {[
                { icon: <Brain className="w-4 h-4" />, text: "AI-Powered" },
                { icon: <Plus className="w-4 h-4" />, text: "Easy Tracking" },
                { icon: <Zap className="w-4 h-4" />, text: "Real-Time Sync" }
              ].map((feature, index) => (
                <div key={index} className="flex items-center gap-2 px-4 py-2 bg-zinc-900/50 backdrop-blur-sm rounded-full border border-zinc-800/50">
                  <div className="text-blue-400">{feature.icon}</div>
                  <span className="text-sm text-zinc-300">{feature.text}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.7 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onHoverStart={() => setIsHovered(true)}
                onHoverEnd={() => setIsHovered(false)}
              >
                <Button
                  size="lg"
                  className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-8 py-4 rounded-full group"
                  onClick={() => window.location.href = '/dashboard'}
                >
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
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
          </motion.div>

          {/* Right Visual */}
          <motion.div
            initial={{ opacity: 0, x: 50, rotateY: 15 }}
            animate={{ opacity: 1, x: 0, rotateY: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Glow Effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl transform rotate-3" />
              <div className="absolute inset-0 bg-gradient-to-tl from-cyan-500/20 to-pink-500/20 rounded-3xl blur-2xl transform -rotate-3" />
              
              {/* Main Card */}
              <div className="relative bg-zinc-950/90 backdrop-blur-2xl rounded-3xl border border-zinc-800/50 p-8 shadow-2xl">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                      <Wallet className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">Smart Wallet</h3>
                      <p className="text-sm text-zinc-400">AI-Powered Insights</p>
                    </div>
                  </div>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  >
                    <Brain className="w-6 h-6 text-blue-400" />
                  </motion.div>
                </div>

                {/* Features Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { icon: <TrendingUp className="w-5 h-5 text-green-400" />, label: "Growth Tracking", value: "Active" },
                    { icon: <PieChart className="w-5 h-5 text-blue-400" />, label: "Analytics", value: "Insights" },
                    { icon: <Target className="w-5 h-5 text-purple-400" />, label: "Goal Progress", value: "On Track" },
                    { icon: <Zap className="w-5 h-5 text-yellow-400" />, label: "Auto-Save", value: "Enabled" }
                  ].map((item, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                      className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 rounded-2xl p-4 border border-zinc-800/30"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {item.icon}
                        <span className="text-sm text-zinc-400">{item.label}</span>
                      </div>
                      <div className="text-lg font-semibold text-white">{item.value}</div>
                    </motion.div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button className="flex-1 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 text-blue-300 hover:bg-blue-500/30 rounded-xl">
                    <Eye className="w-4 h-4 mr-2" />
                    View Details
                  </Button>
                  <Button className="flex-1 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 text-purple-300 hover:bg-purple-500/30 rounded-xl">
                    <Target className="w-4 h-4 mr-2" />
                    Set Goals
                  </Button>
                </div>
              </div>

              {/* Floating Elements */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2 }}
                className="absolute -top-4 -right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                <CheckCircle className="w-4 h-4 inline mr-1" />
                Verified
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.4 }}
                className="absolute -bottom-4 -left-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg"
              >
                <Sparkles className="w-4 h-4 inline mr-1" />
                AI Active
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Features Section with Bento Layout
const FeaturesSection = () => {
  const featuresRef = useRef(null);
  const isInView = useInView(featuresRef, { once: true, margin: "-100px" });

  const features = [
    {
      icon: <Brain className="w-8 h-8 text-blue-400" />,
      title: "AI-Powered Analytics",
      description: "Advanced machine learning algorithms provide deep insights into your spending patterns and financial behavior.",
      gradient: "from-blue-500/20 to-purple-500/20",
      border: "border-blue-500/30",
      size: "lg"
    },
    {
      icon: <Plus className="w-6 h-6 text-purple-400" />,
      title: "Easy Transaction Tracking",
      description: "Effortlessly add and manage your transactions.",
      gradient: "from-purple-500/20 to-pink-500/20",
      border: "border-purple-500/30",
      size: "sm"
    },

    {
      icon: <TrendingUp className="w-6 h-6 text-cyan-400" />,
      title: "Smart Budgeting",
      description: "Predictive budgeting that adapts to your lifestyle.",
      gradient: "from-cyan-500/20 to-blue-500/20",
      border: "border-cyan-500/30",
      size: "sm"
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-400" />,
      title: "Real-Time Sync",
      description: "Instant synchronization across all your devices with lightning-fast performance and zero delays.",
      gradient: "from-yellow-500/20 to-orange-500/20",
      border: "border-yellow-500/30",
      size: "lg"
    },
    {
      icon: <Globe className="w-6 h-6 text-green-400" />,
      title: "Global Access",
      description: "Access your finances from anywhere in the world.",
      gradient: "from-green-500/20 to-emerald-500/20",
      border: "border-green-500/30",
      size: "sm"
    },

  ];

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Powerful Features
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Everything you need to take control of your financial future
          </p>
        </motion.div>

        <div ref={featuresRef} className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className={`group ${
                feature.size === 'lg' ? 'md:col-span-2' : 'md:col-span-1'
              } ${index === 0 ? 'md:row-span-2' : ''}`}
            >
              <Card className={`relative overflow-hidden bg-zinc-900/50 backdrop-blur-xl border ${feature.border} hover:border-opacity-60 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 rounded-2xl h-full`}>
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
                />
                
                <CardContent className={`relative p-6 h-full flex flex-col ${feature.size === 'lg' ? 'justify-between' : 'justify-center'}`}>
                  <div>
                    <motion.div
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                      className="flex justify-start mb-4"
                    >
                      <div className={`p-3 bg-gradient-to-br ${feature.gradient} rounded-xl border ${feature.border}`}>
                        {feature.icon}
                      </div>
                    </motion.div>
                    
                    <h3 className={`${feature.size === 'lg' ? 'text-2xl' : 'text-lg'} font-bold mb-3 text-white group-hover:text-blue-100 transition-colors duration-300`}>
                      {feature.title}
                    </h3>
                  </div>
                  
                  <p className={`text-zinc-400 group-hover:text-zinc-300 transition-colors duration-300 ${feature.size === 'lg' ? 'text-base' : 'text-sm'}`}>
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// How It Works Section
const HowItWorksSection = () => {
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const steps = [
    {
      icon: <Users className="w-8 h-8 text-blue-400" />,
      title: "Create Your Account",
      description: "Sign up in seconds and set up your personalized financial dashboard",
      color: "blue"
    },
    {
      icon: <Plus className="w-8 h-8 text-purple-400" />,
      title: "Add & Update Transactions",
      description: "Easily log your income and expenses with our intuitive interface",
      color: "purple"
    },
    {
      icon: <BarChart3 className="w-8 h-8 text-cyan-400" />,
      title: "Get Monthly Insights",
      description: "Receive automated AI-powered insights and recommendations every month",
      color: "cyan"
    }
  ];

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
            How It Works
          </h2>
          <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
            Get started in minutes, not hours
          </p>
        </motion.div>

        <div ref={sectionRef} className="max-w-4xl mx-auto">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              className={`flex items-center gap-8 mb-16 ${index % 2 === 1 ? 'flex-row-reverse' : ''}`}
            >
              {/* Step Content */}
              <div className="flex-1">
                <div className={`flex items-center gap-4 mb-4 ${index % 2 === 1 ? 'justify-end' : ''}`}>
                  <div className={`w-12 h-12 bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                    {index + 1}
                  </div>
                  <h3 className="text-2xl font-bold text-white">{step.title}</h3>
                </div>
                <p className={`text-lg text-zinc-400 ${index % 2 === 1 ? 'text-right' : ''}`}>
                  {step.description}
                </p>
              </div>

              {/* Step Visual */}
              <div className="flex-1">
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 2 }}
                  transition={{ duration: 0.3 }}
                  className={`relative bg-zinc-900/50 backdrop-blur-xl rounded-2xl border border-zinc-800/50 p-8 shadow-2xl hover:shadow-${step.color}-500/20 transition-all duration-300`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br from-${step.color}-500/5 to-${step.color}-600/5 rounded-2xl opacity-0 hover:opacity-100 transition-opacity duration-300`} />
                  <div className="relative flex items-center justify-center">
                    <div className={`p-4 bg-gradient-to-br from-${step.color}-500/20 to-${step.color}-600/20 rounded-2xl border border-${step.color}-500/30`}>
                      {step.icon}
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

// Final CTA Section
const CTASection = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="py-32 relative z-10">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-4xl mx-auto"
        >
          <div className="relative">
            {/* Glow Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-3xl" />
            
            {/* Content */}
            <div className="relative bg-zinc-900/50 backdrop-blur-xl rounded-3xl border border-zinc-800/50 p-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                Start Your Financial Journey
              </h2>
              <p className="text-xl text-zinc-400 mb-8 max-w-2xl mx-auto">
                Join thousands of users who have transformed their financial lives with AI-powered insights
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onHoverStart={() => setIsHovered(true)}
                  onHoverEnd={() => setIsHovered(false)}
                >
                  <Button
                    size="lg"
                    className="relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold px-12 py-6 text-lg rounded-full shadow-2xl shadow-blue-500/25"
                    onClick={() => window.location.href = '/dashboard'}
                  >
                    <span className="relative z-10 flex items-center gap-2">
                      Get Started Free
                      <ArrowRight className="w-5 h-5" />
                    </span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-purple-500 to-cyan-500"
                      initial={{ x: "-100%" }}
                      animate={isHovered ? { x: "0%" } : { x: "-100%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Button>
                </motion.div>
                
                <div className="flex items-center gap-2 text-sm text-zinc-400">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>No credit card required</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 relative overflow-hidden">
      {/* Background Elements */}
      <FloatingOrbs />
      <GridPattern />

      {/* Main Content */}
      <HeroSection />
      <FeaturesSection />
      <HowItWorksSection />
      <CTASection />
    </div>
  );
}