import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Star, 
  ShoppingCart, 
  Heart, 
  ArrowLeft, 
  Check, 
  Info,
  Package,
  Truck,
  ShieldCheck
} from "lucide-react";
import { products } from "../data/Products";
import { toast } from "react-toastify";
import useCartStore from "../store/cartStore";
import useWishlistStore from "../store/wishlistStore";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const addToCart = useCartStore((state) => state.addItem);
  const addToWishlist = useWishlistStore((state) => state.addItem);
  const removeFromWishlist = useWishlistStore((state) => state.removeItem);
  const isInWishlist = useWishlistStore((state) => state.isInWishlist);

  const product = products.find((p) => p.id === parseInt(id));

  const [selectedVariation, setSelectedVariation] = useState(null);

  useEffect(() => {
    if (product && product.variations && product.variations.length > 0) {
      setSelectedVariation(product.variations[0]);
    }

    // If coming from "View Design Variations", scroll to that section
    if (location.hash === "#variations") {
      setTimeout(() => {
        document.getElementById("variations")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold text-[#011F5B] mb-4">Product Not Found</h2>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Back to Shop
        </button>
      </div>
    );
  }

  const currentImage = selectedVariation?.image || product.image;
  const currentPrice = selectedVariation?.price || product.price;
  const currentName = selectedVariation ? `${product.name} - ${selectedVariation.name}` : product.name;

  const handleAddToCart = () => {
    const itemToAdd = {
      ...product,
      selectedVariation: selectedVariation,
      price: currentPrice,
      image: currentImage,
      name: currentName
    };
    addToCart(itemToAdd);
    toast.success(`${currentName} added to cart!`);
  };

  const toggleWishlist = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast.info("Removed from wishlist");
    } else {
      addToWishlist(product);
      toast.success("Added to wishlist");
    }
  };

  return (
    <div className="bg-white min-h-screen py-8 sm:py-12">
      <div className="container-custom">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-gray-500 hover:text-[#011F5B] transition-colors mb-8 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Collection</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square rounded-3xl overflow-hidden bg-gray-100 border border-gray-100 shadow-sm">
              <img 
                src={currentImage} 
                alt={currentName} 
                className="w-full h-full object-cover transition-all duration-500 hover:scale-105"
              />
            </div>
            
            {/* Variations Thumbnails */}
            {product.variations && product.variations.length > 0 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {product.variations.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariation(v)}
                    className={`relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-all ${
                      selectedVariation?.id === v.id ? "border-[#D4AF37] scale-95" : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                    {selectedVariation?.id === v.id && (
                      <div className="absolute inset-0 bg-[#D4AF37]/10 flex items-center justify-center">
                        <Check size={16} className="text-[#D4AF37]" strokeWidth={3} />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <p className="text-[#D4AF37] font-semibold uppercase tracking-widest text-sm mb-2">
                {product.collection || product.category}
              </p>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#011F5B] leading-tight mb-2">
                {product.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-[#D4AF37] text-[#D4AF37]" />
                  ))}
                  <span className="text-sm font-bold text-gray-700 ml-1">4.9</span>
                </div>
                <span className="text-gray-300">|</span>
                <span className="text-sm text-green-600 font-medium">In Stock</span>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-3xl font-bold text-[#011F5B] mb-4">
                ₦{currentPrice.toLocaleString()}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Design Variation Selector */}
            {product.variations && product.variations.length > 0 && (
              <div id="variations" className="mb-8 p-6 bg-gray-50 rounded-2xl border border-gray-100 scroll-mt-20">
                <h3 className="text-sm font-bold text-[#011F5B] uppercase tracking-wider mb-4 flex items-center gap-2">
                  <Package size={16} /> Choose Design Variation
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {product.variations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariation(v)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                        selectedVariation?.id === v.id 
                          ? "bg-white border-[#D4AF37] shadow-md ring-1 ring-[#D4AF37]" 
                          : "bg-white border-transparent hover:border-gray-200"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                        <img src={v.image} alt={v.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="text-left">
                        <p className={`text-xs font-bold ${selectedVariation?.id === v.id ? "text-[#D4AF37]" : "text-[#011F5B]"}`}>
                          {v.name}
                        </p>
                        <p className="text-[10px] text-gray-500 font-medium">
                          ₦{v.price.toLocaleString()} • {v.color} {v.material && `• ${v.material}`}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-auto">
              <button 
                onClick={handleAddToCart}
                className="flex-1 bg-[#011F5B] hover:bg-[#0d2f7a] text-white py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all shadow-lg active:scale-95"
              >
                <ShoppingCart size={20} />
                Add to Cart
              </button>
              <button 
                onClick={toggleWishlist}
                className={`p-4 rounded-xl border-2 transition-all active:scale-95 ${
                  isInWishlist(product.id) 
                    ? "border-red-500 bg-red-50 text-red-500" 
                    : "border-gray-200 text-gray-400 hover:border-[#D4AF37] hover:text-[#D4AF37]"
                }`}
              >
                <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 text-[#011F5B] rounded-lg"><Truck size={18} /></div>
                <span className="text-xs font-semibold text-gray-600">Nationwide Delivery</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-50 text-green-600 rounded-lg"><ShieldCheck size={18} /></div>
                <span className="text-xs font-semibold text-gray-600">Quality Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
