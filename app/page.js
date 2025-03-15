import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Herosection from "@/components/hero";
import { featuresData, howItWorksData } from "./data/landing";

export default function Home() {
  return (
    <div>
      <Herosection />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-title">
            Manage your finance with these advanced features!
          </h2>
          <div className="overflow-hidden relative">
            <div className="flex animate-scroll">
              {/* Double the data to create a seamless loop */}
              {[...featuresData, ...featuresData].map((feature, index) => (
                <div key={index} className="flex-shrink-0 w-full md:w-1/2 lg:w-1/3 p-4">
                  <Card className="hover:shadow-lg shadow-pink-500/50 p-6 rounded-lg bg-white transition-shadow bg-gray-900 border-none">
                    <CardContent className="p-6 text-center">
                      <div className="flex justify-center mb-4 rounded-full">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2 gradient-title">{feature.title}</h3>
                      <p className="text-gray-400">{feature.description}</p>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 ">
        <div className="container mx-auto px-4 mb-30">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-title">
            How Pocket Mate Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {howItWorksData.map((howItWorksData, index) => (
              <Card key={index} className="hover:shadow-lg shadow-pink-500/50 p-6 rounded-lg bg-white transition-shadow bg-gray-900 border-none ">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {howItWorksData.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 gradient-title">{howItWorksData.title}</h3>
                  <p className="text-gray-400">{howItWorksData.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}