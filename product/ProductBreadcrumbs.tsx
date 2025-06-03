
import { Link } from "react-router-dom";

interface ProductBreadcrumbsProps {
  productTitle: string;
  productCategory?: string;
}

export const ProductBreadcrumbs = ({ productTitle, productCategory }: ProductBreadcrumbsProps) => {
  return (
    <nav className="text-sm text-gray-500 dark:text-gray-400">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="hover:text-gray-900 dark:hover:text-gray-100">Home</Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        <li>
          <Link to="/products" className="hover:text-gray-900 dark:hover:text-gray-100">Products</Link>
        </li>
        <li>
          <span className="mx-2">/</span>
        </li>
        {productCategory && (
          <>
            <li>
              <Link to={`/category/${productCategory}`} className="hover:text-gray-900 dark:hover:text-gray-100">
                {productCategory.charAt(0).toUpperCase() + productCategory.slice(1)}
              </Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
          </>
        )}
        <li>
          <span className="text-gray-900 dark:text-white font-medium">{productTitle}</span>
        </li>
      </ol>
    </nav>
  );
};
