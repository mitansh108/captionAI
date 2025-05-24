// pages/pricing.js
import React from "react";

const pricingOptions = [
  {
    title: "Starter",
    price: "$1",
    description: "Get started with 10 transcriptions.",
    features: ["10 transcriptions", "Basic support"],
  },
  {
    title: "Pro",
    price: "$10",
    description: "Perfect for regular users.",
    features: ["250 transcriptions", "Priority support"],
  },
  {
    title: "Annual Access",
    price: "$50",
    description: "Unlimited access for one year.",
    features: ["Unlimited transcriptions (1 year)", "Premium support"],
  },
  {
    title: "Lifetime Access",
    price: "$100",
    description: "One-time payment for lifetime access.",
    features: ["Unlimited transcriptions (lifetime)", "Premium support"],
  },
];

const Pricing = () => {
  return (
    <div className="py-20 px-6 bg-white dark:bg-[#0f1117] text-black dark:text-white min-h-screen">
      <h1 className="text-4xl font-bold mb-4 text-center">Pricing</h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12">
        Choose a plan that suits your needs.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
        {pricingOptions.map((plan) => (
          <div
            key={plan.title}
            className="border border-gray-300 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            <h2 className="text-2xl font-semibold mb-2">{plan.title}</h2>
            <p className="text-3xl font-bold mb-4">{plan.price}</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              {plan.description}
            </p>
            <ul className="mb-6 space-y-2">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="text-sm">
                  ✅ {feature}
                </li>
              ))}
            </ul>
            <button className="w-full py-2 px-4 bg-blue-600 text-white rounded hover:bg-blue-700 transition">
              Choose Plan
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Pricing;
