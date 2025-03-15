import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import Herosection from "@/components/hero";
import { featuresData } from "./data/landing";

export default function Home() {
  return (
    <div>
      <Herosection />
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 gradient-title">
            Manage your finance with these advanced features!
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuresData.map((feature, index) => (
              <Card key={index} className="hover:shadow-lg shadow-pink-500/50 p-6 rounded-lg bg-white transition-shadow bg-gray-800 border-none ">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold mb-2 gradient-title">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}