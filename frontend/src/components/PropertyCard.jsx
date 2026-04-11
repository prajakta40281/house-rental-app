const PropertyCard = ({ id, title, location, price, image }) => {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
      
      {/* Image */}
      <div className="h-48 bg-gray-200">
        {image && (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800">
          {title}
        </h3>

        <p className="text-gray-500 text-sm">
          {location}
        </p>

        <p className="text-yellow-600 font-semibold">
          ₹{price}/month
        </p>

        <button onClick={() => (window.location.href = `/property/${id}`)} className="mt-2 text-sm text-yellow-600 hover:underline">
          View Details
        </button>
      </div>

    </div>
  );
};

export default PropertyCard;