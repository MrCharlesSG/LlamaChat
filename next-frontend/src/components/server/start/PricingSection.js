// Datos de los precios
const pricingPlans = [
    {
      name: "Basic",
      description: "Perfect for small businesses.",
      price: "$19/month",
      features: [
        { name: "Real-time data", available: true },
        { name: "Custom integrations", available: false },
        { name: "24/7 Support", available: false },
        { name: "Up to 100 queries/month", available: true }
      ]
    },
    {
      name: "Professional",
      description: "For growing businesses.",
      price: "$49/month",
      features: [
        { name: "Real-time data", available: true },
        { name: "Custom integrations", available: true },
        { name: "24/7 Support", available: false },
        { name: "Up to 500 queries/month", available: true }
      ]
    },
    {
      name: "Premium",
      description: "For enterprises and large teams.",
      price: "$99/month",
      features: [
        { name: "Real-time data", available: true },
        { name: "Custom integrations", available: true },
        { name: "24/7 Support", available: true },
        { name: "Unlimited queries", available: true }
      ]
    }
  ];
  
  // Componente para renderizar un plan
  function PricingCard({ plan, index }) {
    return (
      <div className="flex-shrink-0 w-full md:w-auto bg-background_secondary p-5 border-2 border-background_third shadow-background_third flex flex-col items-center justify-between shadow-xl">
        <h3 className={`${index%2 ==0?"text-exalt":" text-exalt_second"} text-3xl sm:text-4xl font-bold`}>{plan.name}</h3>
        <p className="text-lg sm:text-xl mt-5">{plan.description}</p>
        <ul className="mt-5 space-y-2 text-lg">
          {plan.features.map((feature, index) => (
            <li key={index}>
              <span className={feature.available ? "text-green-400" : "text-danger-600"}>
                {feature.available ? "✓" : "✗"}
              </span>{" "}
              {feature.name}
            </li>
          ))}
        </ul>
        <p className={`${index%2 ==0?"text-exalt":" text-exalt_second"} text-2xl sm:text-3xl font-bold mt-5`}>{plan.price}</p>
      </div>
    );
  }
  
  // Componente principal que renderiza los precios
  function PricingSection() {
    return (
      <div id="prices" className="w-full p-10">
        <h2 className="text-4xl sm:text-[60px] font-bold text-center text-exalt_main mb-10">
          Pricing Plans
        </h2>
  
        <div className="flex md:grid md:grid-cols-3 gap-5 flex-col h-full md:h-auto md:overflow-hidden">
          {pricingPlans.map((plan, index) => (
            <PricingCard key={index} plan={plan} index={index} />
          ))}
        </div>
      </div>
    );
  }
  
  export default PricingSection;
  