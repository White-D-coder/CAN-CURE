import Link from "next/link";
import type { ReactNode } from "react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  image?: string;
  link?: string;
  bgColor?: string;
  className?: string;
  variant?: 'horizontal' | 'square';
}

export function ServiceCard({
  title,
  description,
  icon,
  image,
  link = "#",
  bgColor = "bg-white",
  className = "",
  variant = 'horizontal'
}: ServiceCardProps) {
  return (
    <div
      className={`${bgColor} rounded-3xl p-6 relative overflow-hidden ${
        variant === 'horizontal' ? 'flex items-center' : ''
      } ${className}`}
    >
      <div className={`${variant === 'horizontal' ? 'flex-1 mr-4' : ''}`}>
        <h3 className="text-xl font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-4">{description}</p>

        {link && (
          <Link
            href={link}
            className="inline-flex items-center text-gray-700 hover:text-teal-500 transition-colors"
            aria-label={`Learn more about ${title}`}
          >
            {variant === 'horizontal' ? '' : 'Learn more'}
            {variant === 'horizontal' ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-6 w-6 bg-white rounded-full p-1 shadow-sm"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ml-1 h-4 w-4"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            )}
          </Link>
        )}
      </div>

      {icon && <div className="flex-shrink-0">{icon}</div>}

      {image && (
        <div className={`${variant === 'horizontal' ? 'flex-shrink-0 w-32 h-32' : 'mt-4 w-full h-40'}`}>
          <img
            src={image}
            alt={title}
            className={`
              ${variant === 'horizontal' ? 'w-full h-full object-cover' : 'w-full h-full object-cover rounded-lg'}
            `}
          />
        </div>
      )}
    </div>
  );
}
