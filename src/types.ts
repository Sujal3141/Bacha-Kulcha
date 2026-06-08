export interface FoodListing {
  id: string;
  restaurantName: string;
  name: string;
  category: string;
  originalPrice: number;
  rescuePrice: number;
  savings: number;
  quantity: number;
  pickupDeadline: string; // ISO date string
  distance: number; // in km from user's current location
  image: string; // prebuilt keywords: bakery, cooked, grocery, salad, dessert
  rating: number;
  co2Saved: number; // in kg
  waterSaved: number; // in liters
  aiDemandTrend: "High" | "Moderate" | "Low";
  status: "available" | "claimed" | "expired";
  lat?: number;
  lng?: number;
  paymentId?: string;
  phone?: string;
}

export interface Order {
  id: string;
  listingId: string;
  foodName: string;
  restaurantName: string;
  price: number;
  quantity: number;
  pickupDeadline: string;
  status: "Reserved" | "Picked Up" | "Cancelled";
  qrCodeValue: string;
  timestamp: string;
  paymentMethod: "Stripe" | "Razorpay" | "UPI";
  fulfillmentMethod?: "pickup" | "delivery";
  deliveryFee?: number;
  packingFee?: number;
  taxes?: number;
  totalPaid?: number;
  deliveryAddress?: string;
  distance?: number;
  paymentRef?: string;
  paymentVerified?: boolean;
  customerLat?: number;
  customerLng?: number;
  kitchenLat?: number;
  kitchenLng?: number;
  kitchenPhone?: string;
}

export interface SystemNotification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "alert";
  timestamp: string;
}

export interface SustainabilityStats {
  mealsSaved: number;
  co2Saved: number; // kg
  waterSaved: number; // liters
  moneyRecovered: number; // INR ₹
}

export interface Restaurant {
  id: string;
  name: string;
  category: string;
  lat: number;
  lng: number;
  address: string;
  rating: number;
  distance: number;
}
