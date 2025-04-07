import Link from 'next/link';

interface CategoryCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

export default function CategoryCard({ title, description, icon, href }: CategoryCardProps) {
  return (
    <Link href={href} className="block h-full">
      <div className="card card-hover-effect h-full p-5 flex flex-col items-center text-center group relative overflow-hidden">
        {/* Background gradient that appears on hover */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

        {/* Content */}
        <div className="relative z-10">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4 mx-auto group-hover:bg-primary/20 transition-all duration-300 group-hover:scale-110 group-hover:shadow-md">
            {icon}
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200">
            {title}
          </h3>
          <p className="text-gray-600 text-sm">{description}</p>
        </div>

        {/* Hover indicator */}
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center text-primary text-xs font-medium">
          <span>Zobraziť</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-3 h-3 ml-1"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}
