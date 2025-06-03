
interface ProductFeaturesProps {
  features: string[];
}

export const ProductFeatures = ({ features }: ProductFeaturesProps) => {
  return (
    <div className="space-y-2">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Features</h3>
      <ul className="grid grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center text-gray-600 dark:text-gray-400">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mr-2"></div>
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
};
