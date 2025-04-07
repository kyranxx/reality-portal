import Link from 'next/link';
import SafeImage from './SafeImage';

interface PropertyCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  size: number; // This is for backward compatibility
  bedrooms?: number;
  bathrooms?: number;
  landSize?: number;
  imageUrl: string;
  isFeatured?: boolean;
  isNew?: boolean;
  type: 'apartment' | 'house' | 'land' | 'commercial';
}

// Property type icons mapping
const typeIcons = {
  apartment: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 21h19.5m-18-18v18m10.5-18v18m6-13.5V21M6.75 6.75h.75m-.75 3h.75m-.75 3h.75m3-6h.75m-.75 3h.75m-.75 3h.75M6.75 21v-3.375c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21M3 3h12m-.75 4.5H21m-3.75 3.75h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008zm0 3h.008v.008h-.008v-.008z"
      />
    </svg>
  ),
  house: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
      />
    </svg>
  ),
  land: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c-.317-.159-.69-.159-1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
      />
    </svg>
  ),
  commercial: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className="w-3.5 h-3.5"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21"
      />
    </svg>
  ),
};

// Property type labels
const typeLabels = {
  apartment: 'Byt',
  house: 'Dom',
  land: 'Pozemok',
  commercial: 'Komerčné',
};

export default function PropertyCard({
  id,
  title,
  location,
  price,
  size,
  bedrooms,
  bathrooms,
  landSize,
  imageUrl,
  isFeatured = false,
  isNew = false,
  type,
}: PropertyCardProps) {
  // Format price with spaces as thousand separators
  const formattedPrice = price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

  return (
    <Link href={`/nehnutelnosti/${id}`} className="block h-full">
      <div className="rounded-lg h-full flex flex-col card-hover-effect">
        <div className="relative">
          <div className="property-image bg-gray-50 relative overflow-hidden rounded-t-lg">
            {imageUrl ? (
              <SafeImage
                src={imageUrl}
                alt={title}
                propertyType={type}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 ease-out"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gray-100">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1}
                  stroke="currentColor"
                  className="w-8 h-8 text-gray-300"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
                  />
                </svg>
              </div>
            )}
          </div>

          {/* Type badge */}
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-white/80 backdrop-blur-sm text-xs font-medium py-1.5 px-3 rounded-full shadow-sm flex items-center">
              <span className="text-black mr-1.5">{typeIcons[type]}</span>
              <span>{typeLabels[type]}</span>
            </div>
          </div>

          {/* Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-1.5 z-10">
            {isFeatured && (
              <span className="badge badge-primary text-xs px-3 py-1.5 shadow-sm bg-white/80 backdrop-blur-sm">Odporúčané</span>
            )}
            {isNew && (
              <span className="badge badge-accent text-xs px-3 py-1.5 shadow-sm bg-white/80 backdrop-blur-sm">Nové</span>
            )}
          </div>
        </div>

        <div className="p-6 flex-grow flex flex-col">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-lg font-medium text-black">
                {title}
              </h2>
              <div className="flex items-center text-gray-500 text-sm mt-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-1.5 text-gray-400"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
                <p>{location}</p>
              </div>
            </div>
            <div className="bg-black text-white font-medium text-sm px-4 py-1.5 rounded-full whitespace-nowrap">
              {formattedPrice} €
            </div>
          </div>

          <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
            {size && (
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15"
                  />
                </svg>
                <span>{size} m²</span>
              </div>
            )}

            {bedrooms !== undefined && (
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                  />
                </svg>
                <span>
                  {bedrooms} {bedrooms === 1 ? 'izba' : bedrooms < 5 ? 'izby' : 'izieb'}
                </span>
              </div>
            )}

            {bathrooms !== undefined && (
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span>
                  {bathrooms} {bathrooms === 1 ? 'kúpeľňa' : bathrooms < 5 ? 'kúpeľne' : 'kúpeľní'}
                </span>
              </div>
            )}

            {landSize !== undefined && (
              <div className="flex items-center bg-gray-50 px-4 py-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 mr-2 text-gray-500"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 6.75V15m6-6v8.25m.503 3.498l4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 00-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0z"
                  />
                </svg>
                <span>Pozemok: {landSize} m²</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
