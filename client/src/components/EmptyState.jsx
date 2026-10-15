import { SearchX } from "lucide-react";
import { Link } from "react-router-dom";

export default function EmptyState({ 
  title = "No products found", 
  message = "We couldn't find any items matching your criteria.", 
  actionText, 
  actionLink,
  onActionClick 
}) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl shadow-sm border border-gray-100 col-span-full w-full">
      <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
        <SearchX size={32} className="text-gray-400" />
      </div>
      <h3 className="text-xl font-bold text-[#011F5B] mb-2">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6">{message}</p>
      
      {actionText && (
        actionLink ? (
          <Link to={actionLink} className="btn-primary">
            {actionText}
          </Link>
        ) : (
          <button onClick={onActionClick} className="btn-primary">
            {actionText}
          </button>
        )
      )}
    </div>
  );
}