"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Star, Tag, Grid3X3, List, ArrowRight, Package } from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
}

const PRODUCTS: Product[] = [
  {
    id: "headphones",
    name: "Wireless Headphones",
    price: 79,
    originalPrice: 99,
    rating: 4.5,
    reviews: 128,
    image: "headphones",
  },
  {
    id: "watch",
    name: "Smart Watch",
    price: 199,
    originalPrice: 249,
    rating: 4.8,
    reviews: 256,
    image: "watch",
  },
  {
    id: "bag",
    name: "Leather Bag",
    price: 149,
    rating: 4.3,
    reviews: 89,
    image: "bag",
  },
];

function ProductImage({ type, rounded }: { type: string; rounded: boolean }) {
  const colors: Record<string, string> = {
    headphones: "from-purple-400 to-indigo-500",
    watch: "from-emerald-400 to-teal-500",
    bag: "from-amber-400 to-orange-500",
  };

  const icons: Record<string, React.ReactNode> = {
    headphones: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-white/80">
        <path d="M3 18v-6a9 9 0 0118 0v6" />
        <path d="M21 19a2 2 0 01-2 2h-1a2 2 0 01-2-2v-3a2 2 0 012-2h3v5zM3 19a2 2 0 002 2h1a2 2 0 002-2v-3a2 2 0 00-2-2H3v5z" />
      </svg>
    ),
    watch: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-white/80">
        <circle cx="12" cy="12" r="7" />
        <polyline points="12,9 12,12 14,14" />
        <path d="M9 2h6M9 22h6" />
      </svg>
    ),
    bag: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8 text-white/80">
        <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4zM3 6h18M16 10a4 4 0 01-8 0" />
      </svg>
    ),
  };

  return (
    <div
      className={`aspect-square bg-gradient-to-br ${colors[type] || "from-gray-400 to-gray-500"} flex items-center justify-center ${
        rounded ? "rounded-xl" : "rounded-none"
      }`}
    >
      {icons[type]}
    </div>
  );
}

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-3 w-3 ${
            star <= Math.floor(rating)
              ? "fill-amber-400 text-amber-400"
              : star - 0.5 <= rating
              ? "fill-amber-400/50 text-amber-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
}

export function EcommerceDemo() {
  const [imageStyle, setImageStyle] = useState<"square" | "rounded">("rounded");
  const [showSaleBadge, setShowSaleBadge] = useState(true);
  const [showRatings, setShowRatings] = useState(true);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [cart, setCart] = useState<{ id: string; name: string; price: number }[]>([]);
  const [cartBounce, setCartBounce] = useState(false);

  const addToCart = (product: Product) => {
    setCart((prev) => [...prev, { id: product.id, name: product.name, price: product.price }]);
    setCartBounce(true);
    setTimeout(() => setCartBounce(false), 400);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <section className="py-20 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <p className="text-sm font-medium tracking-widest uppercase text-astro-grey mb-3">
            Interactive Demo
          </p>
          <h3 className="text-2xl sm:text-3xl font-bold text-neon-navy">
            Build Your Store
          </h3>
          <p className="mt-3 text-wild-dove max-w-lg mx-auto">
            Configure your product cards, preview them live, and see how your storefront comes together
          </p>
        </motion.div>

        {/* Main content */}
        <div className="grid lg:grid-cols-[1fr_280px] gap-6">
          {/* Product cards preview */}
          <div className="min-h-[400px] rounded-2xl border border-black/10 bg-sunset/20 p-4 sm:p-6 relative">
            {/* Cart indicator */}
            <div className="absolute top-4 right-4 z-10">
              <motion.div
                animate={cartBounce ? { scale: [1, 1.3, 1] } : {}}
                transition={{ duration: 0.4 }}
                className="relative flex items-center gap-2 px-3 py-2 rounded-full bg-neon-navy text-white text-sm font-medium shadow-lg"
              >
                <ShoppingCart className="h-4 w-4" />
                <span>{cart.length}</span>
                <AnimatePresence>
                  {cart.length > 0 && (
                    <motion.span
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"
                    />
                  )}
                </AnimatePresence>
              </motion.div>
            </div>

            {/* Products */}
            <div
              className={
                layout === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-10"
                  : "flex flex-col gap-4 mt-10"
              }
            >
              {PRODUCTS.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className={`bg-white rounded-xl border border-black/10 shadow-sm overflow-hidden ${
                    layout === "list" ? "flex items-center gap-4 pr-4" : ""
                  }`}
                >
                  {/* Image */}
                  <div className={`relative ${layout === "list" ? "w-24 h-24 shrink-0" : ""}`}>
                    <ProductImage type={product.image} rounded={imageStyle === "rounded"} />
                    {/* Sale badge */}
                    <AnimatePresence>
                      {showSaleBadge && product.originalPrice && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="absolute top-2 left-2 flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full"
                        >
                          <Tag className="h-2.5 w-2.5" />
                          SALE
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Info */}
                  <div className={`p-3 flex-1 ${layout === "list" ? "py-2" : ""}`}>
                    <h4 className="text-sm font-semibold text-nebulosity">{product.name}</h4>

                    {/* Ratings */}
                    <AnimatePresence>
                      {showRatings && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center gap-1.5 mt-1"
                        >
                          <StarRating rating={product.rating} />
                          <span className="text-[10px] text-wild-dove">({product.reviews})</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-bold text-neon-navy">${product.price}</span>
                      {showSaleBadge && product.originalPrice && (
                        <span className="text-xs text-wild-dove line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Add to cart */}
                    <button
                      onClick={() => addToCart(product)}
                      className="mt-2 w-full flex items-center justify-center gap-1.5 px-3 py-1.5 bg-neon-navy/10 text-neon-navy text-xs font-medium rounded-lg hover:bg-neon-navy hover:text-white transition-all active:scale-95"
                    >
                      <ShoppingCart className="h-3 w-3" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Cart summary */}
            <AnimatePresence>
              {cart.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="mt-6 p-3 rounded-xl bg-neon-navy/5 border border-neon-navy/10"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-neon-navy" />
                    <span className="text-xs font-semibold text-neon-navy">
                      Cart Summary ({cart.length} item{cart.length !== 1 ? "s" : ""})
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {cart.map((item, i) => (
                      <span
                        key={`${item.id}-${i}`}
                        className="text-[10px] px-2 py-0.5 rounded-full bg-white border border-black/10 text-nebulosity"
                      >
                        {item.name} - ${item.price}
                      </span>
                    ))}
                  </div>
                  <div className="mt-2 text-right text-xs font-bold text-neon-navy">
                    Total: ${cartTotal}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Controls sidebar */}
          <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
            <p className="text-xs font-medium text-astro-grey uppercase tracking-wider hidden lg:block mb-1">
              Card Options
            </p>

            {/* Image style toggle */}
            <div className="shrink-0">
              <p className="text-xs text-wild-dove mb-1.5">Image Style</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setImageStyle("square")}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    imageStyle === "square"
                      ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                      : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                  }`}
                >
                  Square
                </button>
                <button
                  onClick={() => setImageStyle("rounded")}
                  className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    imageStyle === "rounded"
                      ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                      : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                  }`}
                >
                  Rounded
                </button>
              </div>
            </div>

            {/* Sale badge toggle */}
            <div className="shrink-0">
              <p className="text-xs text-wild-dove mb-1.5">Sale Badge</p>
              <button
                onClick={() => setShowSaleBadge(!showSaleBadge)}
                className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                  showSaleBadge
                    ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                    : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                }`}
              >
                {showSaleBadge ? "Visible" : "Hidden"}
              </button>
            </div>

            {/* Ratings toggle */}
            <div className="shrink-0">
              <p className="text-xs text-wild-dove mb-1.5">Ratings</p>
              <button
                onClick={() => setShowRatings(!showRatings)}
                className={`px-4 py-2 rounded-lg border text-xs font-medium transition-all ${
                  showRatings
                    ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                    : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                }`}
              >
                {showRatings ? "Visible" : "Hidden"}
              </button>
            </div>

            {/* Layout picker */}
            <div className="shrink-0">
              <p className="text-xs text-wild-dove mb-1.5">Layout</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setLayout("grid")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    layout === "grid"
                      ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                      : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                  }`}
                >
                  <Grid3X3 className="h-3 w-3" />
                  Grid
                </button>
                <button
                  onClick={() => setLayout("list")}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                    layout === "list"
                      ? "border-neon-navy bg-neon-navy/5 text-neon-navy"
                      : "border-black/10 text-wild-dove hover:border-neon-navy/20"
                  }`}
                >
                  <List className="h-3 w-3" />
                  List
                </button>
              </div>
            </div>

            {/* Reset cart */}
            {cart.length > 0 && (
              <div className="shrink-0 lg:mt-4 lg:pt-4 lg:border-t border-black/5">
                <button
                  onClick={() => setCart([])}
                  className="text-xs text-wild-dove hover:text-red-500 transition-colors px-3 py-2 rounded-lg border border-black/10 hover:border-red-200"
                >
                  Clear Cart
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-10 text-center"
        >
          <p className="text-sm text-wild-dove mb-4">
            Ready to launch your online store with a custom storefront?
          </p>
          <Link
            href="/contact"
            className="group inline-flex items-center gap-2 px-8 py-3.5 bg-neon-navy text-white font-medium rounded-full hover:bg-nebulosity transition-all"
          >
            Launch My Store
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
