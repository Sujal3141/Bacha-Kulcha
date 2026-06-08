import React, { useState, useMemo, useEffect, useRef } from "react";
import { Map as GoogleMap, useMap, useMapsLibrary, APIProvider } from "@vis.gl/react-google-maps";
import { 
  Search, 
  MapPin, 
  Star, 
  Clock, 
  Heart, 
  ArrowRight, 
  ShoppingBag, 
  Minus, 
  Plus, 
  ChevronLeft, 
  Sparkles, 
  CheckCircle2, 
  X, 
  Coins, 
  Truck, 
  ShieldCheck, 
  ArrowUpRight,
  Compass
} from "lucide-react";
import { FoodListing, Order } from "../types";
import { motion, AnimatePresence } from "motion/react";
import logoImg from "../../assets/logo.png";

interface CustomerPortalProps {
  listings: FoodListing[];
  onOrderCreated: () => void;
  notifications?: any[]; // Deprecated: notifications now sent via email
  orders: Order[];
}

// Gourmet Default static menus mapped elegantly if API is loading or empty
const GOURMET_RESTAURANTS_STATIC = [
  {
    id: "rest-heritage",
    name: "The Heritage Kulcha House",
    tagline: "Slow-baked heirloom Amritsari clay oven masterpieces",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    rating: 4.9,
    time: "20 mins",
    distance: "1.2 km",
    address: "Regal Circle, Connaught Place, New Delhi",
    specialty: "Authentic Kulchas",
    items: [
      {
        id: "static-1",
        name: "Saffron Amritsari Chole Kulcha",
        price: 55,
        originalPrice: 180,
        description: "Clay-oven baked kulcha with rich saffron-herbed potato filling, served with slow-cooked spicy Chickpea chole.",
        category: "Trending",
        image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
        co2Saved: 1.4,
        quantity: 5
      },
      {
        id: "static-2",
        name: "Black Truffle Cheese Kulcha",
        price: 99,
        originalPrice: 320,
        description: "Artisanal Cheddar, mozzarella, and dynamic black truffle oils baked into ultra-flaky, layered hand-stretched kulcha.",
        category: "Near You",
        image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=800&auto=format&fit=crop&q=80",
        co2Saved: 2.1,
        quantity: 3
      }
    ]
  },
  {
    id: "rest-artisanal",
    name: "The Artisanal Yeast",
    tagline: "High-hydration wild ferment luxury pastries and Boulangerie",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
    rating: 4.8,
    time: "15 mins",
    distance: "0.8 km",
    address: "Block E, Dev Center, Connaught Place",
    specialty: "French Bakery",
    items: [
      {
        id: "static-3",
        name: "Pistachio Butter Cardamom Croissant",
        price: 65,
        originalPrice: 220,
        description: "Organic butter laminated 32-layer luxury pastry, cold-proofed for 48 hours, loaded with slow-roasted green pistachio paste.",
        category: "Near You",
        image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80",
        co2Saved: 0.9,
        quantity: 4
      },
      {
        id: "static-4",
        name: "Saffron Vanilla Mille-Feuille",
        price: 90,
        originalPrice: 290,
        description: "Crispy dark caramelized pastry leaves, organic vanilla bean pastry cream, and delicate Kashmiri saffron dust glaze.",
        category: "Under 30 min",
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80",
        co2Saved: 1.2,
        quantity: 2
      }
    ]
  },
  {
    id: "rest-saffron",
    name: "Saffron Court Banquet",
    tagline: "Five-star hotel boutique surplus and slow-cooked royal culinary arts",
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
    rating: 4.7,
    time: "25 mins",
    distance: "1.9 km",
    address: "LIF Blocks, Outer Ring, New Delhi",
    specialty: "Gourmet Mains",
    items: [
      {
        id: "static-5",
        name: "Velvet Garlic Butter Naan & Dal Makhani",
        price: 85,
        originalPrice: 280,
        description: "Copper-cauldron slow simmered creamy black lentils paired with freshly baked woodfired garlic butter naan portions.",
        category: "Trending",
        image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=800&auto=format&fit=crop&q=80",
        co2Saved: 1.8,
        quantity: 6
      }
    ]
  }
];

interface DirectionsProps {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
}

function Directions({ origin, destination }: DirectionsProps) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map) return;
    
    // Clear previous route
    if (polylinesRef.current) {
      polylinesRef.current.forEach(p => p.setMap(null));
      polylinesRef.current = [];
    }

    routesLib.Route.computeRoutes({
      origin,
      destination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    }).then(({ routes }) => {
      if (routes?.[0]) {
        const newPolylines = routes[0].createPolylines();
        newPolylines.forEach(p => p.setMap(map));
        polylinesRef.current = newPolylines;
        if (routes[0].viewport) {
          map.fitBounds(routes[0].viewport);
        }
      }
    }).catch(err => {
      console.warn("Route calculation failed / directions not enabled on API key:", err);
    });

    return () => {
      if (polylinesRef.current) {
        polylinesRef.current.forEach(p => p.setMap(null));
      }
    };
  }, [routesLib, map, origin, destination]);

  return null;
}

export function CustomerPortal({ listings, onOrderCreated, orders }: CustomerPortalProps) {
  // Screens state: "home" | "restaurant" | "receipt"
  const [currentScreen, setCurrentScreen] = useState<"home" | "restaurant" | "receipt" | "how-it-works">("home");
  const [selectedRestaurantId, setSelectedRestaurantId] = useState<string>("rest-heritage");
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"All" | "Trending" | "Near You" | "Under 30 min">("All");
  
  // Cart state: map of itemId -> { item, quantity, restaurant }
  const [cart, setCart] = useState<Record<string, { item: any; quantity: number; restaurant: any }>>({});
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [likedRestaurants, setLikedRestaurants] = useState<string[]>([]);
  const [checkoutPending, setCheckoutPending] = useState(false);
  const [latestCompletedOrder, setLatestCompletedOrder] = useState<Order | null>(null);

  // Delivery configuration (strictly self-pickup by default)
  const [fulfillmentMethod, setFulfillmentMethod] = useState<"pickup" | "delivery">("pickup");
  const [deliveryAddress, setDeliveryAddress] = useState("Flat 401, Saffron Meadows, Connaught Place, New Delhi");
  const [paymentBroker, setPaymentBroker] = useState<"UPI" | "Stripe" | "Razorpay">("UPI");

  // Map server listings into beautiful editorial Restaurants
  const restaurants = useMemo(() => {
    // Start with the base high-end static curated restaurants
    const baseList = JSON.parse(JSON.stringify(GOURMET_RESTAURANTS_STATIC));
    
    // Add dynamically listed items from the kitchen server
    listings.forEach(listing => {
      if (listing.status !== "available" || listing.quantity <= 0) return;
      
      // Look if the restaurant already exists in our luxury template
      // Normalize name to match existing or generate elegant template
      let targetRest = baseList.find((r: any) => r.name.toLowerCase() === listing.restaurantName.toLowerCase());
      
      // Determine elegant imagery for new menu dynamic items
      let defaultImage = "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80";
      
      if (listing.image && listing.image.startsWith("data:")) {
        defaultImage = listing.image;
      } else {
        if (listing.category === "bakery") {
          defaultImage = "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=800&auto=format&fit=crop&q=80";
        } else if (listing.category === "dessert") {
          defaultImage = "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80";
        } else if (listing.category === "grocery" || listing.category === "salad") {
          defaultImage = "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80";
        }
      }

      const formattedItem = {
        id: listing.id,
        name: listing.name,
        price: listing.rescuePrice,
        originalPrice: listing.originalPrice,
        description: `Delicately prepared leftover portion, safe-certified. High dynamic demand. Saving ${listing.co2Saved.toFixed(1)}kg of CO₂.`,
        category: listing.distance < 1.2 ? "Near You" : listing.rating ? "Trending" : "Under 30 min",
        image: defaultImage,
        co2Saved: listing.co2Saved || 1.1,
        quantity: listing.quantity
      };

      if (targetRest) {
        // Prevent duplicate items
        if (!targetRest.items.some((i: any) => i.id === listing.id)) {
          targetRest.items.push(formattedItem);
        }
      } else {
        // Spawn an incredibly stylish new restaurant block (editorial metadata)
        const sampleNames = [
          "Gourmet Royal Buffet",
          "The Green Leaf Lab",
          "Ambrosia Artisan Kitchens",
          "Chef's Secret Reserve"
        ];
        const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
        
        baseList.push({
          id: `rest-dynamic-${listing.restaurantName.replace(/\s+/g, '-').toLowerCase()}`,
          name: listing.restaurantName,
          tagline: `Curator of sustainable gourmet leftovers and culinary craft`,
          image: defaultImage,
          rating: listing.rating || 4.7,
          time: `${Math.round(listing.distance * 12 + 10)} mins`,
          distance: `${listing.distance.toFixed(1)} km`,
          address: "Central Lane Hub, New Delhi",
          specialty: "Dynamic Surplus Menu",
          items: [formattedItem]
        });
      }
    });

    return baseList;
  }, [listings]);

  // Find active selected restaurant
  const currentRestaurant = useMemo(() => {
    return restaurants.find(r => r.id === selectedRestaurantId) || restaurants[0];
  }, [restaurants, selectedRestaurantId]);

  // Filter restaurants/items based on search query and category
  const filteredItemsAndRestaurants = useMemo(() => {
    let result: Array<{ restaurant: any; item: any }> = [];
    
    restaurants.forEach(rest => {
      rest.items.forEach((item: any) => {
        // Match Search Query
        const matchesSearch = 
          item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          rest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          item.description.toLowerCase().includes(searchQuery.toLowerCase());
          
        // Match Category Chips
        let matchesCategory = true;
        if (selectedCategory === "Trending") {
          matchesCategory = item.category === "Trending" || rest.rating >= 4.8;
        } else if (selectedCategory === "Near You") {
          matchesCategory = item.category === "Near You" || parseFloat(rest.distance) <= 1.5;
        } else if (selectedCategory === "Under 30 min") {
          matchesCategory = item.category === "Under 30 min" || parseInt(rest.time) <= 20;
        }

        if (matchesSearch && matchesCategory) {
          result.push({ restaurant: rest, item });
        }
      });
    });

    return result;
  }, [restaurants, searchQuery, selectedCategory]);

  // Group filtered results back to restaurant level to render nice summary cards
  const filteredRestaurants = useMemo(() => {
    const map = new Map<string, any>();
    filteredItemsAndRestaurants.forEach(({ restaurant, item }) => {
      if (!map.has(restaurant.id)) {
        map.set(restaurant.id, {
          ...restaurant,
          items: [item]
        });
      } else {
        map.get(restaurant.id).items.push(item);
      }
    });
    return Array.from(map.values());
  }, [filteredItemsAndRestaurants]);

  // Handle Cart Increments/Decrements
  const addToCart = (item: any, restaurant: any) => {
    setCart(prev => {
      const existing = prev[item.id];
      if (existing) {
        if (existing.quantity >= item.quantity) return prev; // limit to stock
        return {
          ...prev,
          [item.id]: { ...existing, quantity: existing.quantity + 1 }
        };
      } else {
        return {
          ...prev,
          [item.id]: { item, quantity: 1, restaurant }
        };
      }
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev[itemId];
      if (!existing) return prev;
      if (existing.quantity <= 1) {
        const copy = { ...prev };
        delete copy[itemId];
        return copy;
      } else {
        return {
          ...prev,
          [itemId]: { ...existing, quantity: existing.quantity - 1 }
        };
      }
    });
  };

  // Cart math
  const cartStatistics = useMemo(() => {
    let subtotal = 0;
    let co2Saved = 0;
    let itemsCount = 0;
    
    Object.keys(cart).forEach(itemId => {
      const entry = (cart as any)[itemId];
      if (entry) {
        subtotal += entry.item.price * entry.quantity;
        co2Saved += (entry.item.co2Saved || 1.1) * entry.quantity;
        itemsCount += entry.quantity;
      }
    });

    // Strictly item amount only - zero delivery/packaging/taxes
    const deliveryFee = 0;
    const packagingFee = 0;
    const taxes = 0;
    const total = subtotal;

    return {
      subtotal,
      co2Saved,
      itemsCount,
      deliveryFee,
      packagingFee,
      taxes,
      total
    };
  }, [cart]);

  // Favorite toggle
  const toggleLike = (restId: string) => {
    setLikedRestaurants(prev => 
      prev.includes(restId) ? prev.filter(id => id !== restId) : [...prev, restId]
    );
  };

  // Perform checkout sandbox request
  const handlePerformCheckout = async () => {
    const firstCartId = Object.keys(cart)[0];
    if (!firstCartId) return;
    const firstEntry = cart[firstCartId];
    
    setCheckoutPending(true);
    try {
      // 1. Detect customer coordinates (fall back to random CP coordinate so it is non-blocking)
      let customerLat = 28.6139;
      let customerLng = 77.2090;
      try {
        const coords = await new Promise<{lat: number; lng: number}>((resolve) => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
              () => resolve({ lat: 28.6139 + (Math.random() - 0.5) * 0.03, lng: 77.2090 + (Math.random() - 0.5) * 0.03 }),
              { timeout: 2500 }
            );
          } else {
            resolve({ lat: 28.6139 + (Math.random() - 0.5) * 0.03, lng: 77.2090 + (Math.random() - 0.5) * 0.03 });
          }
        });
        customerLat = coords.lat;
        customerLng = coords.lng;
      } catch (geolocErr) {
        console.warn("Client location query bypassed.", geolocErr);
      }

      // Simulate real secure SSL routing check
      await new Promise(resolve => setTimeout(resolve, 1500));

      const txnRef = `UTR-${Math.floor(100000000000 + Math.random() * 899999999999)}`;
      
      const payload = {
        listingId: firstEntry.item.id,
        quantity: firstEntry.quantity,
        paymentMethod: paymentBroker,
        fulfillmentMethod: "pickup", // force self-pickup
        deliveryFee: 0,
        packingFee: 0,
        taxes: 0,
        totalPaid: firstEntry.item.price * firstEntry.quantity,
        deliveryAddress: "",
        paymentRef: txnRef,
        paymentVerified: true,
        customerLat,
        customerLng,
        kitchenLat: firstEntry.item.lat,
        kitchenLng: firstEntry.item.lng,
        kitchenPhone: firstEntry.item.phone
      };

      const res = await fetch("/api/rescue-food/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      
      if (res.ok) {
        const responseJson = await res.json();
        const serverOrder = responseJson.order || {};

        const orderRes: Order = {
          id: serverOrder.id || `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          listingId: firstEntry.item.id,
          foodName: firstEntry.item.name,
          restaurantName: firstEntry.restaurant.name,
          price: firstEntry.item.price,
          quantity: firstEntry.quantity,
          pickupDeadline: serverOrder.pickupDeadline || new Date(Date.now() + 2 * 3600 * 1000).toISOString(),
          status: "Reserved",
          qrCodeValue: serverOrder.qrCodeValue || `VERIFIED_B_KULCHA_${txnRef}`,
          timestamp: serverOrder.timestamp || new Date().toISOString(),
          paymentMethod: paymentBroker,
          fulfillmentMethod: "pickup",
          deliveryFee: 0,
          packingFee: 0,
          taxes: 0,
          totalPaid: firstEntry.item.price * firstEntry.quantity,
          deliveryAddress: "",
          paymentRef: txnRef,
          paymentVerified: true,
          customerLat: serverOrder.customerLat || customerLat,
          customerLng: serverOrder.customerLng || customerLng,
          kitchenLat: serverOrder.kitchenLat || firstEntry.item.lat || 28.6145,
          kitchenLng: serverOrder.kitchenLng || firstEntry.item.lng || 77.2115,
          kitchenPhone: serverOrder.kitchenPhone || firstEntry.item.phone || "9876543210"
        };

        setLatestCompletedOrder(orderRes);
        setCart({}); // clear cart
        setIsCartOpen(false);
        setCurrentScreen("receipt");
        onOrderCreated(); // sync back stats
      } else {
        const errData = await res.json();
        alert(errData.error || "Simulation gateway rejected payment. Check listing availability.");
      }
    } catch (e) {
      console.error("Order routing err:", e);
    } finally {
      setCheckoutPending(false);
    }
  };

  return (
    <div className="w-full font-sans select-none">
      
      {/* Premium responsive container layout */}
      <div 
        className="w-full bg-white/80 backdrop-blur-xl rounded-3xl border border-slate-200/50 flex flex-col shadow-[0_24px_50px_-12px_rgba(0,0,0,0.03)] hover:shadow-[0_32px_64px_-10px_rgba(0,0,0,0.05)] overflow-hidden relative transition-all duration-500"
      >
        {/* Responsive Top Navigation Tab Bar instead of a phone bottom menu */}
        <div className="bg-white/50 backdrop-blur-md border-b border-slate-200/40 px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 select-none z-30">
          <div className="flex items-center gap-2.5">
            <span className="p-2.5 bg-red-500/10 text-[#e23744] rounded-xl border border-red-500/25 flex items-center justify-center">
              <ShoppingBag size={16} />
            </span>
            <div>
              <h2 className="text-sm font-extrabold tracking-tight text-slate-900 uppercase font-mono">Gourmet Rescue Hub</h2>
              <p className="text-[10px] text-slate-500 font-medium font-sans animate-pulse">Active City Surplus Listing Terminal</p>
            </div>
          </div>
          
          <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
            <button
              onClick={() => {
                setCurrentScreen("home");
                setIsCartOpen(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                (currentScreen === "home" || currentScreen === "how-it-works") && !isCartOpen
                  ? "bg-white text-slate-900 font-extrabold shadow-sm"
                  : "text-slate-650 hover:text-slate-900"
              }`}
            >
              <Compass size={13} />
              <span>Surplus Feed</span>
            </button>

            <button
              onClick={() => {
                setCurrentScreen("restaurant");
                setIsCartOpen(false);
              }}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                currentScreen === "restaurant" && !isCartOpen
                  ? "bg-white text-slate-900 font-extrabold shadow-sm"
                  : "text-slate-650 hover:text-slate-900"
              }`}
            >
              <Star size={13} />
              <span>Explore Menu</span>
            </button>

            <button
              onClick={() => setIsCartOpen(true)}
              className={`px-4 py-1.5 rounded-lg text-xs font-sans font-medium transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
                isCartOpen
                  ? "bg-white text-slate-900 font-extrabold shadow-sm"
                  : "text-slate-650 hover:text-slate-900"
              }`}
            >
              <ShoppingBag size={13} />
              <span>Basket</span>
              {cartStatistics.itemsCount > 0 && (
                <span className="bg-[#e23744] text-white font-mono text-[9px] font-black px-1.5 py-0.2 rounded-full shadow-sm">
                  {cartStatistics.itemsCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Scrollable Screen Body with generous background styling */}
        <div className="flex-1 flex flex-col text-slate-800 relative select-none bg-slate-50/50 min-h-[500px]">
          
          <AnimatePresence mode="wait">
            {/* SCREEN 1: DISCOVERY FEED */}
            {currentScreen === "home" && (
              <motion.div
                key="home-screen"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25 }}
                className="p-5 space-y-5"
              >
                {/* Brand Editorial Greeting */}
                <div className="flex justify-between items-center mt-2 mb-2">
                  <div className="flex items-center gap-3.5 group cursor-pointer">
                    <img 
                      src={logoImg} 
                      alt="Bacha Kulcha Logo" 
                      className="h-[50px] sm:h-[60px] lg:h-[65px] w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ border: "none", padding: 0, margin: 0, display: "block" }}
                    />
                    <div className="flex flex-col justify-center">
                      <span className="text-xl sm:text-2xl md:text-[26px] font-extrabold tracking-tight leading-tight bg-gradient-to-r from-[#e23744] via-[#f97316] to-[#e23744] bg-[length:200%_auto] bg-clip-text text-transparent transition-all duration-700 group-hover:bg-[right_center]">
                        Bacha Kulcha
                      </span>
                      <span className="hidden sm:block text-[10px] md:text-xs font-semibold text-slate-500 tracking-wide mt-0.5 transition-colors group-hover:text-slate-600">
                        Food Rescue Platform
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => setCurrentScreen("how-it-works")}
                    className="p-1 px-2.5 bg-slate-100 hover:bg-slate-200 rounded-full text-[9px] font-mono tracking-widest text-[#e23744] border border-slate-200 uppercase active:scale-95 transition-all cursor-pointer"
                  >
                    Brief ?
                  </button>
                </div>

                {/* Floating pill-style search bar */}
                <div className="relative bg-white/90 hover:bg-white rounded-2xl border border-slate-200/80 p-0.5 shadow-[0_2px_8px_rgba(0,0,0,0.01)] focus-within:shadow-[0_12px_24px_-8px_rgba(226,55,68,0.05)] focus-within:border-[#e23744]/25 hover:border-slate-300 transition-all duration-300">
                  <span className="absolute inset-y-0 left-4 flex items-center text-slate-400 pointer-events-none">
                    <Search size={14} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search leftovers, croissants &amp; kulchas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-transparent pl-11 pr-4 py-3 placeholder-slate-400 text-xs text-slate-800 focus:outline-none focus:placeholder-slate-200"
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-4 inset-y-0 flex items-center text-slate-400 hover:text-slate-600"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>

                {/* Horizontal Category Scroll Chips */}
                <div className="flex gap-2.5 overflow-x-auto no-scrollbar py-0.5 -mx-5 px-5">
                  {(["All", "Trending", "Near You", "Under 30 min"] as const).map(chip => (
                    <button
                      key={chip}
                      onClick={() => setSelectedCategory(chip)}
                      className={`px-4.5 py-1.8 rounded-full text-[11px] font-sans whitespace-nowrap active:scale-95 transition-all cursor-pointer ${
                        selectedCategory === chip
                          ? "bg-[#e23744] hover:bg-[#c92430] text-white font-extrabold shadow-sm shadow-[#e23744]/20 border border-transparent"
                          : "bg-white/95 text-slate-600 border border-slate-200/80 hover:bg-slate-50 hover:text-slate-900 font-bold"
                      }`}
                    >
                      {chip === "Trending" ? "Trending 🔥" : chip === "Near You" ? "Near You 📍" : chip === "Under 30 min" ? "Under 30 min ⚡" : chip}
                    </button>
                  ))}
                </div>

                {/* Main Discovery Feed Feed portion */}
                <div className="space-y-5">
                  {filteredRestaurants.length === 0 ? (
                    <div className="py-16 text-center space-y-3 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
                      <p className="text-2xl">🍽️</p>
                      <h4 className="font-sans text-sm font-semibold text-slate-800">No surplus available</h4>
                      <p className="text-[10px] text-slate-400 max-w-xs mx-auto">
                        No culinary surpluses match current filter sectors. Broaden your search metrics or check back soon.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {filteredRestaurants.map(rest => {
                        const isLiked = likedRestaurants.includes(rest.id);
                        // Take first item as hero deal
                        const heroItem = rest.items[0];
                        if (!heroItem) return null;
                        const savingPercentage = Math.round(((heroItem.originalPrice - heroItem.price) / heroItem.originalPrice) * 100);

                        return (
                          <div
                            key={rest.id}
                            className="group bg-white rounded-[24px] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.015)] border border-slate-200/50 transition-all duration-400 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.03)] hover:border-[#e23744]/25 flex flex-col cursor-pointer active:scale-[0.985]"
                            onClick={() => {
                              setSelectedRestaurantId(rest.id);
                              setCurrentScreen("restaurant");
                            }}
                          >
                            {/* Full-bleed photography Aspect ratio 4:3 */}
                            <div className="relative w-full aspect-[4/3] bg-neutral-900 overflow-hidden">
                              <img
                                src={heroItem.image || rest.image}
                                alt={heroItem.name}
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                              {/* Linear premium overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                              
                              {/* Heart favorite badge */}
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleLike(rest.id);
                                }}
                                className="absolute top-4 right-4 h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all cursor-pointer animate-none"
                              >
                                <Heart size={14} fill={isLiked ? "#e23744" : "none"} className={isLiked ? "text-[#e23744]" : "text-white/80"} />
                              </button>

                              {/* Prominent Save Marker */}
                              <div className="absolute bottom-4 left-4 flex flex-col gap-1">
                                <span className="bg-[#e23744] text-white text-[9px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded-sm shadow-md w-max">
                                  SAVE {savingPercentage}% TODAY
                                </span>
                                <h3 className="font-sans text-lg font-extrabold text-white drop-shadow-md">
                                  {rest.name}
                                </h3>
                              </div>
                            </div>

                            {/* Minimalist Info Strip */}
                            <div className="p-4 space-y-2 bg-white text-slate-800">
                              <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono tracking-wider">
                                <span className="truncate max-w-[120px]">{rest.specialty}</span>
                                <div className="flex items-center gap-1">
                                  <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[9.5px] font-sans font-bold flex items-center gap-0.5 leading-none">
                                    {rest.rating} <Star size={9} fill="currentColor" />
                                  </span>
                                  <span className="text-slate-200">•</span>
                                  <span>{rest.distance}</span>
                                </div>
                              </div>

                              <p className="text-xs text-slate-600 font-sans line-clamp-1 italic">
                                "{rest.tagline}"
                              </p>

                              <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs bg-white">
                                <div className="min-w-0 flex-1 pr-2">
                                  <span className="text-slate-400 text-[9px] block">Gourmet Surplus Deal:</span>
                                  <span className="font-sans font-semibold text-slate-700 truncate block text-[11px]">{heroItem.name}</span>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="text-slate-400 text-[9px] line-through block">₹{heroItem.originalPrice}</span>
                                  <span className="text-[#e23744] font-mono font-bold text-[11px]">₹{heroItem.price}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* SCREEN 2: RESTAURANT DETAIL PAGE */}
            {currentScreen === "restaurant" && (
              <motion.div
                key="restaurant-screen"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                className="flex flex-col select-none"
              >
                {/* Parallax-style Full Bleed Hero Cover */}
                <div className="relative h-56 w-full bg-neutral-900 group">
                  <img
                    src={currentRestaurant.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"}
                    alt={currentRestaurant.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-50 via-slate-50/35 to-black/20" />
                  
                  {/* Floating Action back strip */}
                  <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
                    <button
                      onClick={() => setCurrentScreen("home")}
                      className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center text-white hover:text-[#e23744] active:scale-90 transition-all cursor-pointer"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    <button
                      onClick={() => toggleLike(currentRestaurant.id)}
                      className="h-8 w-8 rounded-full bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center active:scale-90 transition-all cursor-pointer"
                    >
                      <Heart 
                        size={14} 
                        fill={likedRestaurants.includes(currentRestaurant.id) ? "#e23744" : "none"} 
                        className={likedRestaurants.includes(currentRestaurant.id) ? "text-[#e23744]" : "text-white/80"} 
                      />
                    </button>
                  </div>

                  {/* Absolute positioning of title inside hero */}
                  <div className="absolute bottom-3 left-5 right-5">
                    <span className="text-[9px] font-mono tracking-widest text-[#e23744] uppercase bg-white/20 px-2.5 py-0.5 rounded-full border border-[#e23744]/20 font-bold backdrop-blur-sm shadow-xs">
                      {currentRestaurant.specialty}
                    </span>
                    <h2 className="text-2xl font-sans font-extrabold text-slate-800 mt-2">
                      {currentRestaurant.name}
                    </h2>
                  </div>
                </div>
                
                {/* Restaurant Detail Body Information Section */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 p-5">
                  {/* Left Column: Menu list */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Rating + Distance Info Strip (Minimal and elegant with zero harsh borders) */}
                    <div className="py-3 px-4 rounded-xl bg-white border border-slate-205/60 flex justify-between items-center text-xs text-slate-600 shadow-xs">
                      <div className="text-center flex-1">
                        <span className="text-[9px] uppercase tracking-wider font-mono block text-slate-400 mb-0.5">Rating</span>
                        <span className="text-[#e23744] font-bold font-sans flex items-center justify-center gap-1">
                          <Star size={11} fill="currentColor" className="text-emerald-600" /> {currentRestaurant.rating}
                        </span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="text-center flex-1">
                        <span className="text-[9px] uppercase tracking-wider font-mono block text-slate-400 mb-0.5">Delivery ETA</span>
                        <span className="font-semibold text-slate-800 block">{currentRestaurant.time}</span>
                      </div>
                      <div className="w-px h-6 bg-slate-200" />
                      <div className="text-center flex-1">
                        <span className="text-[9px] uppercase tracking-wider font-mono block text-slate-400 mb-0.5">Distance</span>
                        <span className="font-semibold text-slate-800 block">{currentRestaurant.distance}</span>
                      </div>
                    </div>

                    <p className="text-slate-500 text-xs italic text-center px-2">
                      "{currentRestaurant.tagline}"
                    </p>

                    {/* Scrollable menu catalog segment */}
                    <div className="space-y-4">
                      <h3 className="text-[11px] font-mono uppercase tracking-wider text-[#e23744] font-bold">
                        End-Of-Day Surplus Ration (Items in Stock)
                      </h3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {currentRestaurant.items.map((item: any) => {
                          const cartQty = cart[item.id]?.quantity || 0;
                          const savings = item.originalPrice - item.price;
                          
                          return (
                            <div
                              key={item.id}
                              className="p-3.5 bg-white hover:bg-slate-50 rounded-2xl border border-slate-150 transition-colors flex items-start gap-3 justify-between shadow-xs"
                            >
                              <div className="flex-1 space-y-1">
                                <span className="text-[9px] text-[#e23744] bg-[#e23744]/15 px-2 py-0.5 rounded-sm uppercase tracking-wide font-mono inline-block mb-1 font-bold">
                                  Stock: {item.quantity} portions left
                                </span>
                                <h4 className="font-sans font-semibold text-xs text-slate-800">
                                  {item.name}
                                </h4>
                                <p className="text-[10px] text-slate-505 line-clamp-2 leading-relaxed">
                                  {item.description}
                                </p>
                                
                                <div className="flex items-center gap-2 pt-1">
                                  <span className="text-xs font-mono font-bold text-[#e23744]">₹{item.price}</span>
                                  <span className="text-[9px] line-through text-slate-400 font-mono">₹{item.originalPrice}</span>
                                  <span className="text-[9.5px] text-slate-450 font-mono">
                                    (Saved ₹{savings})
                                  </span>
                                </div>
                              </div>

                              {/* Tactile incrementer micro buttons with motion scale tap */}
                              <div className="flex flex-col items-center gap-2 shrink-0">
                                <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                </div>

                                {cartQty > 0 ? (
                                  <div className="flex items-center bg-[#e23744] text-white rounded-lg text-xs p-1 gap-2 border border-[#e23744]/25 shadow-sm">
                                    <button
                                      onClick={() => removeFromCart(item.id)}
                                      className="p-1 text-white font-black hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="font-mono font-bold text-[10px]">{cartQty}</span>
                                    <button
                                      onClick={() => addToCart(item, currentRestaurant)}
                                      className="p-1 text-white font-black hover:scale-110 active:scale-90 transition-transform cursor-pointer"
                                      disabled={cartQty >= item.quantity}
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => addToCart(item, currentRestaurant)}
                                    className="bg-slate-50 hover:bg-[#e23744] hover:text-white text-[#e23744] text-[10px] uppercase font-bold px-3 py-1.5 rounded-lg border border-[#e23744]/20 active:scale-95 transition-all text-center w-full shadow-xs cursor-pointer"
                                  >
                                    Claim
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Sticky desktop sidebar basket */}
                  <div className="lg:col-span-4 hidden lg:block">
                    <div className="sticky top-6 bg-white border border-slate-200 rounded-[24px] p-5 shadow-xs space-y-5">
                      {/* Cart Sheet Header with Close handle */}
                      <div className="flex items-center gap-2 border-b border-slate-105 pb-3">
                        <span className="h-6 w-6 bg-[#e23744]/15 rounded-full flex items-center justify-center text-[#e23744]">
                          <ShoppingBag size={12} />
                        </span>
                        <h3 className="font-sans font-bold text-base text-[#e23744]">
                          Gourmet Basket
                        </h3>
                      </div>

                      {/* Quantity based Food Items List */}
                      {cartStatistics.itemsCount === 0 ? (
                        <div className="py-8 text-center text-slate-400 text-xs">
                          <p className="text-xl mb-2">🛍️</p>
                          Your basket is empty.<br />Select surplus portions from the menu.
                        </div>
                      ) : (
                        <>
                          <div className="space-y-4 max-h-[220px] overflow-y-auto no-scrollbar pb-2 pr-1">
                            {Object.keys(cart).map((itemId) => {
                              const entry = cart[itemId];
                              if (!entry) return null;
                              return (
                                <div
                                  key={itemId}
                                  className="flex justify-between items-center gap-3 py-2 border-b border-slate-100"
                                >
                                  <div className="flex-1 min-w-0">
                                    <h4 className="font-sans font-semibold text-xs text-slate-800 leading-tight truncate">
                                      {entry.item.name}
                                    </h4>
                                    <span className="text-xs font-mono font-bold text-[#e23744] inline-block mt-0.5">
                                      ₹{entry.item.price * entry.quantity}
                                    </span>
                                  </div>

                                  <div className="flex items-center bg-slate-100 rounded-lg text-xs p-1 px-2 gap-2 border border-slate-200 shrink-0">
                                    <button
                                      onClick={() => removeFromCart(itemId)}
                                      className="text-slate-500 hover:text-[#e23744] p-0.5 font-bold cursor-pointer"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="font-mono text-slate-800 text-[11px] font-bold">{entry.quantity}</span>
                                    <button
                                      onClick={() => addToCart(entry.item, entry.restaurant)}
                                      className="text-slate-505 hover:text-[#e23744] p-0.5 font-bold cursor-pointer"
                                      disabled={entry.quantity >= entry.item.quantity}
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Fulfillment protocol configuration UI */}
                          <div className="space-y-3 pt-3 border-t border-slate-100">
                            <div className="flex items-center justify-between">
                              <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Fulfillment</span>
                              <div className="flex bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                                <span className="text-emerald-700 text-[10px] font-extrabold tracking-wider font-mono uppercase">🏪 Self-Pickup Only</span>
                              </div>
                            </div>

                            <p className="text-[9.5px] text-slate-400 italic bg-slate-200/50 p-2 text-center rounded-xl border border-slate-150">
                              🏪 Free collection from Restaurant Kitchen. Pickup is active.
                            </p>

                            {/* Bold Total Section */}
                            <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 flex flex-col gap-1.5 text-xs text-slate-600">
                              <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                                <span className="font-sans italic text-[#e23744]">Amount:</span>
                                <span className="text-[#e23744] font-mono text-base font-extrabold">₹{cartStatistics.total}</span>
                              </div>
                            </div>

                            {/* Direct SSL payment broker choice */}
                            <div className="space-y-2">
                              <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Simulation SSL Gateway</span>
                              <div className="grid grid-cols-3 gap-2">
                                {(["UPI", "Stripe", "Razorpay"] as const).map(gw => (
                                  <button
                                    key={gw}
                                    type="button"
                                    onClick={() => setPaymentBroker(gw)}
                                    className={`py-1.5 rounded-lg text-[9.5px] font-mono font-semibold text-center border active:scale-95 transition-all cursor-pointer ${
                                      paymentBroker === gw
                                        ? "border-[#e23744] bg-[#e23744]/10 text-[#e23744]"
                                        : "border-slate-250 text-slate-400 hover:text-slate-650"
                                    }`}
                                  >
                                    {gw}
                                  </button>
                                ))}
                              </div>
                            </div>

                            {/* Checkout button */}
                            <button
                              onClick={handlePerformCheckout}
                              disabled={checkoutPending}
                              className="w-full bg-[#e23744] hover:bg-[#c92c3a] text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer select-none"
                            >
                              {checkoutPending ? (
                                <>
                                  <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                                  Routing Ledger...
                                </>
                              ) : (
                                <>
                                  <span>Settle &amp; Checkout Portfolio</span>
                                  <ArrowUpRight size={14} />
                                </>
                              )}
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* SCREEN 3: HOW IT WORKS / BRIEF */}
            {currentScreen === "how-it-works" && (
              <motion.div
                key="brief-screen"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 space-y-6"
              >
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <button
                    onClick={() => setCurrentScreen("home")}
                    className="h-7 w-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 hover:text-slate-800 active:scale-90 transition-colors cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  <h2 className="font-sans font-extrabold text-lg text-[#e23744]">Our Editorial Philosophy</h2>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-600">
                  <p>
                    <strong>bacha kulcha</strong> is a high-end food rescue platform where everyday utility meets luxurious editorial design.
                  </p>
                  
                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-150">
                    <p className="font-semibold text-sm text-[#e23744]">🌱 Re-directing Elite Surplus</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Discerning consumer meets chef-prepared meals, baked flatbreads, and French pastries. High-quality inventory saved from going to waste.
                    </p>
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-2xl border border-slate-150">
                    <p className="font-semibold text-sm text-[#e23744]">📍 Carbon Emission Sidelining</p>
                    <p className="text-[11px] text-slate-500 leading-normal">
                      Every order placed bypasses landfills, reducing organic garbage outputs and preventing substantial CO₂ and water waste footprints.
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 italic">
                    Designed for discerning foodies. Minimalist, intentional, and beautifully satisfying.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentScreen("home")}
                  className="w-full bg-[#e23744] text-white text-xs font-bold py-3 rounded-xl hover:bg-[#c92c3a] active:scale-98 transition-all shadow-md cursor-pointer"
                >
                  Return to Menu
                </button>
              </motion.div>
            )}

            {/* SCREEN 4: ORDER CONFIRMED RECEIPT TICKET */}
            {currentScreen === "receipt" && latestCompletedOrder && (
              <motion.div
                key="receipt-screen"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-5 space-y-5 select-none"
              >
                <div className="text-center py-4 space-y-2">
                  <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl animate-bounce">
                    ✓
                  </div>
                  <h2 className="font-sans font-extrabold text-xl text-slate-800">Order Reserved</h2>
                  <p className="text-[10px] uppercase font-mono tracking-widest text-[#e23744]">Allocation Secured</p>
                </div>

                {/* Highly structured Luxury Receipt ticket with dashed separations */}
                <div className="bg-white rounded-[24px] overflow-hidden border border-slate-200 shadow-md">
                  {/* Ticket Header */}
                  <div className="p-4 bg-[#e23744] text-white flex justify-between items-center">
                    <div>
                      <span className="text-[8px] tracking-wider font-mono uppercase block text-white/80">Ticket Code</span>
                      <span className="text-xs font-mono font-extrabold">{latestCompletedOrder.id}</span>
                    </div>
                    <div>
                      <span className="text-[8px] tracking-wider font-mono uppercase block text-white/80">Broker Method</span>
                      <span className="text-[11px] font-sans font-bold">{latestCompletedOrder.paymentMethod}</span>
                    </div>
                  </div>

                  {/* Body Info */}
                  <div className="p-4 space-y-4 text-xs font-sans text-slate-600 leading-relaxed">
                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Restaurant Partner</span>
                      <span className="font-semibold text-slate-800 text-sm font-sans">{latestCompletedOrder.restaurantName}</span>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Rescued Portions</span>
                      <span className="font-semibold text-slate-800">{latestCompletedOrder.foodName} <b className="font-mono text-[#e23744]">x {latestCompletedOrder.quantity}</b></span>
                    </div>

                    <div className="w-full border-t border-dashed border-slate-200 my-1" />

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 block font-mono">Fulfillment Protocol</span>
                      <span className="font-semibold text-slate-800">
                        {latestCompletedOrder.fulfillmentMethod === "delivery" ? "🏍 Eco-travel Delivery Rider Assigned" : "🏪 Counter Self-Pickup"}
                      </span>
                    </div>

                    {latestCompletedOrder.deliveryAddress && (
                      <div className="space-y-1 bg-slate-50 p-2.5 rounded-xl border border-slate-150">
                        <span className="text-[8px] uppercase tracking-wider text-[#e23744] block font-mono">Delivery Coordinates Destination:</span>
                        <p className="text-[10px] leading-relaxed text-slate-600 mt-1">{latestCompletedOrder.deliveryAddress}</p>
                      </div>
                    )}

                    <div className="w-full border-t border-dashed border-slate-200 my-1" />

                    <div className="flex justify-between items-center">
                      <span className="text-slate-400 text-[9px] font-mono uppercase">Reference Ledger</span>
                      <span className="text-[9.5px] font-mono text-slate-505 truncate max-w-[155px]" title={latestCompletedOrder.paymentRef}>{latestCompletedOrder.paymentRef}</span>
                    </div>

                    <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                      <span>Grand Total Settled:</span>
                      <span className="font-mono text-[#e23744]">₹{latestCompletedOrder.totalPaid}</span>
                    </div>
                  </div>

                  {/* Ticket QR Stub */}
                  <div className="bg-[#FAFAFA] p-5 border-t border-dashed border-slate-200 flex flex-col items-center justify-center space-y-3">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-slate-100 flex items-center justify-center">
                      {/* Generates standard verification QR template structure */}
                      <svg width="100" height="100" viewBox="0 0 100 100" className="opacity-90">
                        {/* Outlines of QR code */}
                        <path d="M0 0h30v30H0V0zm10 10v10h10V10H10zM70 0h30v30H70V0zm10 10v10h10V10H10zM0 70h30v30H0V70zm10 10v10h10V10H10z" fill="#0A0A0A" />
                        <rect x="40" y="4" width="8" height="8" fill="#e23744" />
                        <rect x="52" y="16" width="12" height="12" fill="#0A0A0A" />
                        <rect x="80" y="80" width="12" height="12" fill="#e23744" />
                        <rect x="44" y="44" width="20" height="20" fill="#0A0A0A" />
                        <rect x="20" y="45" width="12" height="6" fill="#0A0A0A" />
                        <path d="M70 50h10v10H70V50zm10 10h10v10H80V60z" fill="#0A0A0A" />
                      </svg>
                    </div>
                    <span className="text-[8px] font-mono tracking-widest text-slate-400 uppercase text-center">
                      Scan ticket at counter
                    </span>
                  </div>
                </div>

                {/* Embedded google route maps with driving path directions */}
                <div className="bg-white rounded-[24px] border border-slate-200 overflow-hidden shadow-sm space-y-3 p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 block font-bold">🗺️ Navigation driving route</span>
                      <p className="text-[10.5px] font-sans text-slate-600">Driving route from you to the kitchen</p>
                    </div>
                    {latestCompletedOrder.kitchenPhone && (
                      <a 
                        href={`tel:${latestCompletedOrder.kitchenPhone}`}
                        className="flex items-center gap-1 bg-[#e23744]/15 border border-[#e23744]/25 hover:bg-[#e23744]/25 text-[#e23744] text-[10px] font-extrabold py-1 px-2.5 rounded-full transition-colors active:scale-95"
                      >
                        📞 Call Kitchen
                      </a>
                    )}
                  </div>
                  
                  {/* Google Maps Container */}
                  <div className="w-full h-56 rounded-xl overflow-hidden border border-slate-200 shadow-inner relative">
                    <APIProvider apiKey={process.env.GOOGLE_MAPS_PLATFORM_KEY || ""}>
                      <GoogleMap
                        defaultCenter={{ 
                          lat: (latestCompletedOrder.customerLat || 28.6139), 
                          lng: (latestCompletedOrder.customerLng || 77.2090) 
                        }}
                        defaultZoom={14}
                        gestureHandling="cooperative"
                        disableDefaultUI={true}
                        mapId="DEMO_MAP_ID"
                        style={{ width: '100%', height: '100%' }}
                        internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
                      >
                        <Directions 
                          origin={{ 
                            lat: (latestCompletedOrder.customerLat || 28.6139), 
                            lng: (latestCompletedOrder.customerLng || 77.2090) 
                          }}
                          destination={{ 
                            lat: (latestCompletedOrder.kitchenLat || 28.6145), 
                            lng: (latestCompletedOrder.kitchenLng || 77.2115) 
                          }}
                        />
                      </GoogleMap>
                    </APIProvider>
                  </div>

                  {/* Directions metadata list and action call button */}
                  <div className="flex flex-col gap-2 pt-1 text-[11px] font-sans text-slate-600">
                    <div className="flex justify-between text-slate-500 font-mono text-[9px] uppercase">
                      <span>Kitchen Contact Number:</span>
                      <span className="text-slate-800 font-bold">{latestCompletedOrder.kitchenPhone || "9876543210"}</span>
                    </div>

                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&origin=${latestCompletedOrder.customerLat || 28.6139},${latestCompletedOrder.customerLng || 77.2090}&destination=${latestCompletedOrder.kitchenLat || 28.6145},${latestCompletedOrder.kitchenLng || 77.2115}&travelmode=driving`}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      className="w-full flex items-center justify-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 rounded-xl transition-all shadow-sm active:scale-95 text-center leading-none text-xs"
                    >
                      🗺️ Open driving routes in Google Maps app
                    </a>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="space-y-2">
                  <p className="text-[10px] text-center text-emerald-600 font-bold bg-emerald-500/10 py-2 px-3 rounded-xl border border-emerald-500/20 leading-relaxed font-mono uppercase tracking-wide">
                    ✔ Carbon Offset saved {latestCompletedOrder?.quantity * 1.5} kg
                  </p>

                  <button
                    onClick={() => {
                      setCurrentScreen("home");
                    }}
                    className="w-full bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold py-3 rounded-xl hover:bg-slate-200 active:scale-95 transition-all text-center cursor-pointer"
                  >
                    Go back to Discover Feed
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* SCREEN 3 (DESKTOP SLIDE-OVER DRAWER): CART & CHECKOUT DRAWER */}
        <AnimatePresence>
          {isCartOpen && (
            <>
              {/* Dark screen overlay backdrop */}
              <motion.div
                key="cart-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.5 }}
                exit={{ opacity: 0 }}
                onClick={() => setIsCartOpen(false)}
                className="absolute inset-0 bg-slate-900/40 z-44 cursor-pointer backdrop-blur-xs"
              />

              {/* Slide-over right drawer container */}
              <motion.div
                key="cart-sheet"
                initial={{ x: "100%" }}
                animate={{ x: 0 }}
                exit={{ x: "100%" }}
                transition={{ type: "spring", damping: 28, stiffness: 240 }}
                className="absolute top-0 right-0 h-full w-full max-w-md bg-white border-l border-slate-200 z-50 p-6 flex flex-col justify-between select-none shadow-2xl"
                id="checkout-bottom-sheet"
              >
                <div>
                  {/* Cart Sheet Header with Close handle */}
                  <div className="flex justify-between items-center mb-5 border-b border-slate-100 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="h-6 w-6 bg-[#e23744]/15 rounded-full flex items-center justify-center text-[#e23744]">
                        <ShoppingBag size={12} />
                      </span>
                      <h3 className="font-sans font-bold text-base text-[#e23744]">
                        Gourmet Basket
                      </h3>
                    </div>
                    
                    <button
                      onClick={() => setIsCartOpen(false)}
                      className="h-7 w-7 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-600 active:scale-90 transition-all cursor-pointer"
                    >
                      <X size={12} />
                    </button>
                  </div>

                  {/* Quantity based Food Items List */}
                  {cartStatistics.itemsCount === 0 ? (
                    <div className="py-12 text-center text-slate-400 text-xs">
                      <p className="text-xl mb-2">🛍️</p>
                      Your basket is empty. Select surplus portions from a menu.
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-[220px] overflow-y-auto no-scrollbar pb-2">
                      {Object.keys(cart).map((itemId) => {
                        const entry = (cart as any)[itemId];
                        if (!entry) return null;
                        return (
                          <div
                            key={itemId}
                            className="flex justify-between items-center gap-3 py-2 border-b border-slate-100"
                          >
                            <div className="flex-1">
                              <h4 className="font-sans font-semibold text-xs text-slate-800 leading-tight">
                                {entry.item.name}
                              </h4>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                                {entry.restaurant.name}
                              </p>
                              <span className="text-xs font-mono font-bold text-[#e23744] inline-block mt-0.5">
                                ₹{entry.item.price * entry.quantity}
                              </span>
                            </div>

                            <div className="flex items-center bg-slate-100 rounded-lg text-xs p-1 px-2 gap-2 border border-slate-200 shrink-0">
                              <button
                                onClick={() => removeFromCart(itemId)}
                                className="text-slate-500 hover:text-[#e23744] p-0.5 font-bold cursor-pointer"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="font-mono text-slate-800 text-[11px] font-bold">{entry.quantity}</span>
                              <button
                                onClick={() => addToCart(entry.item, entry.restaurant)}
                                className="text-slate-505 hover:text-[#e23744] p-0.5 font-bold cursor-pointer"
                                disabled={entry.quantity >= entry.item.quantity}
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Fulfillment protocol configuration UI (No harsh borders) */}
                  <div className="space-y-3 mt-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">Fulfillment</span>
                      <div className="flex bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-500/20">
                        <span className="text-emerald-700 text-[10px] font-extrabold tracking-wider font-mono uppercase">🏪 Self-Pickup Only</span>
                      </div>
                    </div>

                    <p className="text-[9.5px] text-slate-400 italic bg-slate-200/50 p-2 text-center rounded-xl border border-slate-150">
                      🏪 Free collection from Restaurant Kitchen. Pickup is active.
                    </p>

                    {/* Bold Total Section */}
                    {cartStatistics.itemsCount > 0 && (
                      <div className="bg-slate-50 rounded-xl p-3 border border-slate-150 flex flex-col gap-1.5 text-xs text-slate-600">
                        <div className="flex justify-between items-center text-sm font-bold text-slate-800">
                          <span className="font-sans italic text-[#e23744]">Amount:</span>
                          <span className="text-[#e23744] font-mono text-base font-extrabold">₹{cartStatistics.total}</span>
                        </div>
                      </div>
                    )}

                    {/* Direct SSL payment broker choice */}
                    <div className="space-y-2">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-mono block">Simulation SSL Payment Gateway</span>
                      <div className="grid grid-cols-3 gap-2">
                        {(["UPI", "Stripe", "Razorpay"] as const).map(gw => (
                          <button
                            key={gw}
                            type="button"
                            onClick={() => setPaymentBroker(gw)}
                            className={`py-1.5 rounded-lg text-[9.5px] font-mono font-semibold text-center border active:scale-95 transition-all cursor-pointer ${
                              paymentBroker === gw
                                ? "border-[#e23744] bg-[#e23744]/10 text-[#e23744]"
                                : "border-slate-250 text-slate-400 hover:text-slate-650"
                            }`}
                          >
                            {gw} PORT
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Confirm Action CTA with Pulsing Glow Animation */}
                <div className="pt-4 mt-4 border-t border-slate-100">
                  <button
                    onClick={handlePerformCheckout}
                    disabled={checkoutPending || cartStatistics.itemsCount === 0}
                    className="w-full bg-[#e23744] hover:bg-[#c92c3a] text-white text-xs font-black py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 pulse-cta cursor-pointer select-none"
                  >
                    {checkoutPending ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/60 border-t-white rounded-full animate-spin"></span>
                        Routing SSL Ledger Settle...
                      </>
                    ) : (
                      <>
                        <span>Secure Verification &amp; Settle Portal</span>
                        <ArrowUpRight size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
