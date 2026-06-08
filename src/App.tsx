import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { 
  Sparkles, 
  ShoppingBag, 
  Store, 
  Shield, 
  HeartPulse, 
  Terminal, 
  RefreshCw, 
  Layers, 
  Leaf, 
  Database, 
  HelpCircle,
  Clock,
  Lock,
  User,
  LogIn,
  LogOut,
  ArrowLeft,
  Activity,
  Check,
  Mail,
  AlertCircle,
  Edit3,
  Eye,
  EyeOff,
  ChevronDown,
  Droplet,
  Coins
} from "lucide-react";
import { CustomerPortal } from "./components/CustomerPortal";
import { SellerPortal } from "./components/SellerPortal";
import { AdminPortal } from "./components/AdminPortal";
import { SustainabilityPortal } from "./components/SustainabilityPortal";
import { DevOpsPortal } from "./components/DevOpsPortal";
const logoImg = "/assets/logo.png";
import CustomerRescueVisual from "./components/CustomerRescueVisual";
import PartnerKitchenVisual from "./components/PartnerKitchenVisual";
import AdminSuiteVisual from "./components/AdminSuiteVisual";
import { FoodListing, SustainabilityStats } from "./types";

const GOOGLE_SIMULATED_ACCOUNTS: Record<string, { name: string; password: string }> = {
  "sujalawasthi299792458@gmail.com": { name: "Sujal Awasthi", password: "sujal123" },
  "namanawasthi20162004@gmail.com": { name: "Naman Awasthi", password: "naman123" }
};

const getStoredCustomUsers = (): Record<string, { name: string; password: string }> => {
  try {
    const data = localStorage.getItem("bacha_custom_users");
    return data ? JSON.parse(data) : {};
  } catch (e) {
    return {};
  }
};

const saveCustomUser = (email: string, name: string, password: string) => {
  try {
    const users = getStoredCustomUsers();
    users[email.trim().toLowerCase()] = { name, password };
    localStorage.setItem("bacha_custom_users", JSON.stringify(users));
  } catch (e) {
    console.error(e);
  }
};

// --- REDESIGN HERO HELPERS & SAAS ANIMATION SUITE ---

const AnimatedCounter = ({ 
  value, 
  duration = 1.2, 
  formatter = (v: number) => Math.floor(v).toString() 
}: { 
  value: number; 
  duration?: number; 
  formatter?: (v: number) => string 
}) => {
  const [currentDisplay, setCurrentDisplay] = useState(0);
  const prevValueRef = useRef(0);
  const elementRef = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    let observer: IntersectionObserver | null = null;
    
    const startAnimation = () => {
      const startVal = prevValueRef.current;
      const endVal = value;
      let startTime: number | null = null;
      
      const animate = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress); // beautiful ease-out expo
        const current = startVal + easeProgress * (endVal - startVal);
        setCurrentDisplay(current);
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          setCurrentDisplay(endVal);
          prevValueRef.current = endVal;
        }
      };
      requestAnimationFrame(animate);
    };

    if (elementRef.current) {
      if (hasAnimated.current) {
        startAnimation();
      } else {
        observer = new IntersectionObserver((entries) => {
          if (entries[0].isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            startAnimation();
          }
        }, { threshold: 0.1 });
        observer.observe(elementRef.current);
      }
    }

    return () => {
      if (observer && elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [value, duration]);

  return <span ref={elementRef}>{formatter(currentDisplay)}</span>;
};

const FloatingParticles = () => {
  const particles = [
    { size: 4, delay: 0, duration: 6, left: "15%", top: "25%", color: "bg-rose-400" },
    { size: 6, delay: 1, duration: 8, left: "30%", top: "70%", color: "bg-amber-400" },
    { size: 3, delay: 2, duration: 5, left: "65%", top: "15%", color: "bg-sky-400" },
    { size: 5, delay: 0.5, duration: 7, left: "80%", top: "60%", color: "bg-emerald-400" },
    { size: 4, delay: 1.5, duration: 9, left: "45%", top: "40%", color: "bg-rose-300" },
    { size: 5, delay: 2.2, duration: 6.5, left: "10%", top: "80%", color: "bg-sky-300" },
    { size: 3, delay: 0.8, duration: 7.5, left: "90%", top: "20%", color: "bg-amber-300" },
    { size: 6, delay: 1.8, duration: 10, left: "75%", top: "85%", color: "bg-emerald-300" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p, idx) => (
        <motion.div
          key={idx}
          className={`absolute rounded-full opacity-[0.25] blur-[0.5px] ${p.color}`}
          style={{
            width: p.size,
            height: p.size,
            left: p.left,
            top: p.top,
          }}
          animate={{
            y: [0, -40, 0],
            x: [0, 15, 0],
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.45, 0.2]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            delay: p.delay,
            ease: "easeInOut"
          }}
        />
      ))}
    </div>
  );
};

const GradientMeshBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none select-none">
      {/* Venture capital SaaS blueprint system grid pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#a3a3a30c_1px,transparent_1px),linear-gradient(to_bottom,#a3a3a30c_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-80" />

      {/* Floating Blobs with dynamic blur-3xl */}
      {/* Mesh A (Rose/Crimson background glow - slow breathing) */}
      <motion.div
        animate={{
          scale: [1, 1.25, 0.95, 1.1, 1],
          x: [0, 60, -40, 30, 0],
          y: [0, -40, 50, -20, 0],
          rotate: [0, 90, 180, 270, 360]
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/4 left-1/4 -translate-y-1/2 w-[450px] h-[450px] bg-gradient-to-tr from-[#e23744]/6 to-[#e23744]/2 rounded-full blur-[110px]"
      />
      
      {/* Mesh B (Amber floating glow - warm accent) */}
      <motion.div
        animate={{
          scale: [1, 1.15, 1.3, 0.95, 1],
          x: [0, -50, 40, -30, 0],
          y: [0, 30, -40, 20, 0],
          rotate: [360, 270, 180, 90, 0]
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-10 right-1/4 w-[380px] h-[380px] bg-gradient-to-br from-amber-500/4 to-rose-450/1 rounded-full blur-[90px]"
      />

      {/* Mesh C (Sky Blue floating glow - cooling balance) */}
      <motion.div
        animate={{
          scale: [1.15, 0.9, 1.25, 1, 1.15],
          x: [0, 40, -20, 50, 0],
          y: [0, 60, -30, 30, 0],
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute bottom-1/4 left-1/3 w-[550px] h-[550px] bg-gradient-to-tr from-sky-500/5 via-sky-400/2 to-transparent rounded-full blur-[130px]"
      />

      {/* Mesh D (Emerald Green floating glow for sustainable ledger) */}
      <motion.div
        animate={{
          scale: [0.9, 1.2, 0.95, 1.1, 0.9],
          x: [0, -40, 30, -50, 0],
          y: [0, -50, 20, -30, 0],
        }}
        transition={{
          duration: 28,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/3 right-10 w-[420px] h-[420px] bg-gradient-to-tr from-emerald-500/4 via-teal-400/1 to-transparent rounded-full blur-[110px]"
      />

      {/* Dynamic backdrop vignette spotlight */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 opacity-80"
        style={{
          background: "radial-gradient(circle at 50% 30%, transparent 20%, rgba(244, 245, 247, 0.4) 80%, rgb(244, 245, 247) 100%)"
        }}
      />
    </div>
  );
};

// Reusable physics-inspired magnetic wrapper for touchpoints
const MagneticButton = ({ 
  children, 
  className = "",
  onClick,
  disabled = false,
  id
}: { 
  children: React.ReactNode; 
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  id?: string;
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || disabled) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Pull factor makes it respond elegantly to near hovers
    const x = (e.clientX - centerX) * 0.38;
    const y = (e.clientY - centerY) * 0.38;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="inline-block relative z-20"
    >
      <motion.button
        id={id}
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 180, damping: 13, mass: 0.15 }}
        onClick={onClick}
        disabled={disabled}
        className={className}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        {children}
      </motion.button>
    </div>
  );
};

export default function App() {
  // Premium 3D Card Tilt & Holographic Spotlight tracker
  const [cardTilt, setCardTilt] = useState<Record<string, { rx: number; ry: number; x: number; y: number; active: boolean }>>({
    customer: { rx: 0, ry: 0, x: 0, y: 0, active: false },
    seller: { rx: 0, ry: 0, x: 0, y: 0, active: false },
    admin: { rx: 0, ry: 0, x: 0, y: 0, active: false },
  });

  const handleCardMouseMove = (e: React.MouseEvent<HTMLDivElement>, card: "customer" | "seller" | "admin") => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rx = ((y / rect.height) - 0.5) * -11; // Ergonomic 11 degrees tilt
    const ry = ((x / rect.width) - 0.5) * 11;
    setCardTilt(prev => ({ ...prev, [card]: { rx, ry, x, y, active: true } }));
  };

  const handleCardMouseLeave = (card: "customer" | "seller" | "admin") => {
    setCardTilt(prev => ({ ...prev, [card]: { rx: 0, ry: 0, x: 0, y: 0, active: false } }));
  };

  // Metric Spotlight tracker for SaaS metrics grid below
  const [metricSpotlight, setMetricSpotlight] = useState<Record<number, { x: number; y: number; active: boolean }>>({
    1: { x: 0, y: 0, active: false },
    2: { x: 0, y: 0, active: false },
    3: { x: 0, y: 0, active: false },
    4: { x: 0, y: 0, active: false },
  });

  const handleMetricMouseMove = (e: React.MouseEvent<HTMLDivElement>, idx: number) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMetricSpotlight(prev => ({ ...prev, [idx]: { x, y, active: true } }));
  };

  const handleMetricMouseLeave = (idx: number) => {
    setMetricSpotlight(prev => ({ ...prev, [idx]: { x: 0, y: 0, active: false } }));
  };

  // Authentication states
  const [googleUser, setGoogleUser] = useState<any | null>(() => {
    try {
      const saved = localStorage.getItem("bacha_google_user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [googleAccessToken, setGoogleAccessToken] = useState<string | null>(() => {
    return localStorage.getItem("bacha_google_token") || null;
  });

  const [activeRole, setActiveRole] = useState<"hub" | "customer" | "seller" | "admin">("hub");
  
  // Administrator auth state
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return localStorage.getItem("bacha_admin_auth") === "true";
  });

  // Interactive dialog controls
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleAuthView, setGoogleAuthView] = useState<"picker" | "picker_password" | "custom_email" | "custom_password">("picker");
  const [googleLoginPending, setGoogleLoginPending] = useState(false);
  const [customLoginEmail, setCustomLoginEmail] = useState("");
  const [customLoginName, setCustomLoginName] = useState("");
  const [customLoginPassword, setCustomLoginPassword] = useState("");
  const [selectedPickerAccount, setSelectedPickerAccount] = useState<{ email: string, name: string } | null>(null);
  const [pickerLoginPassword, setPickerLoginPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Kitchen approval state
  const [kitchens, setKitchens] = useState<any[]>([]);
  const [kitchenReg, setKitchenReg] = useState<any | null>(null);
  const [fetchingKitchen, setFetchingKitchen] = useState(false);
  const [isCorrectingReg, setIsCorrectingReg] = useState(false);
  const isCorrectingRegRef = useRef(false);
  isCorrectingRegRef.current = isCorrectingReg;
  const [pendingRoleAccess, setPendingRoleAccess] = useState<"customer" | "seller" | "admin" | null>(null);
  const [showGmailInbox, setShowGmailInbox] = useState(false);

  const [regForm, setRegForm] = useState({
    name: "",
    phone: "",
    address: "",
    fssai: "",
    gstin: "",
    openTime: "09:00 AM",
    closeTime: "10:00 PM",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
  });

  // Admin login fields
  const [formAdminId, setFormAdminId] = useState("");
  const [formAdminPass, setFormAdminPass] = useState("");
  const [adminLoginError, setAdminLoginError] = useState("");

  // Sub-tab choice for Admin Portal rendering
  const [adminSubTab, setAdminSubTab] = useState<"operations" | "esg" | "devops">("operations");

  // Real-time states synchronized from backend
  const [listings, setListings] = useState<FoodListing[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState<SustainabilityStats>({
    mealsSaved: 148,
    co2Saved: 320.5,
    waterSaved: 104000,
    moneyRecovered: 14200
  });

  const [syncing, setSyncing] = useState(false);
  const [systemStatus, setSystemStatus] = useState<any | null>(null);

  // Sync state with the backend (or fallback beautifully if offline)
  const syncServerState = async () => {
    setSyncing(true);
    try {
      // Fetch listings
      const resList = await fetch("/api/rescue-food/listings");
      if (resList.ok) {
        const dataList = await resList.json();
        setListings(dataList);
      }

      // Fetch orders
      const resOrders = await fetch("/api/rescue-food/orders");
      if (resOrders.ok) {
        const dataOrders = await resOrders.json();
        setOrders(dataOrders);
      }

      // Fetch stats
      const resStats = await fetch("/api/rescue-food/stats");
      if (resStats.ok) {
        const dataStats = await resStats.json();
        // Merge with luxury offset base
        setStats({
          mealsSaved: Math.max(148, dataStats.mealsSaved),
          co2Saved: Math.max(320.5, dataStats.co2Saved),
          waterSaved: Math.max(104000, dataStats.waterSaved),
          moneyRecovered: Math.max(14200, dataStats.moneyRecovered)
        });
      }



      // Fetch kitchens
      try {
        const resKitchens = await fetch("/api/rescue-food/kitchens");
        if (resKitchens.ok) {
          const dataKitchens = await resKitchens.json();
          setKitchens(dataKitchens);
        }
      } catch (err) {
        console.warn("Could not sync kitchens list from server", err);
      }

      // Fetch system status
      try {
        const resSys = await fetch("/api/rescue-food/system/status");
        if (resSys.ok) {
          const dataSys = await resSys.json();
          setSystemStatus(dataSys);
        }
      } catch (e) {
        console.warn("MongoDB setup pending:", e);
      }
    } catch (err) {
      console.warn("Offline fallback state active.", err);
    } finally {
      setSyncing(false);
    }
  };

  const checkKitchenStatus = async (email: string, silent = false) => {
    if (isCorrectingRegRef.current) {
      return null;
    }
    if (!silent) setFetchingKitchen(true);
    try {
      const res = await fetch(`/api/rescue-food/kitchens/gmail/${encodeURIComponent(email)}`);
      if (res.ok) {
        const data = await res.json();
        if (data && data.notFound) {
          setKitchenReg(null);
          return null;
        }
        setKitchenReg(data);
        return data;
      } else {
        setKitchenReg(null);
        return null;
      }
    } catch (err) {
      console.warn("Could not retrieve kitchen status from server:", err);
      setKitchenReg(null);
      return null;
    } finally {
      if (!silent) setFetchingKitchen(false);
    }
  };

  const sendKitchenGmail = async (toEmail: string, subject: string, bodyHTML: string) => {
    const token = googleAccessToken;
    if (!token) {
      console.warn("Gmail send bypassed: Administrator's Google token is not available in-memory.");
      alert("Gmail Dispatch Blocked: Please click the 'Connect Google Admin' button in the status bar to authenticate and authorize Gmail send scopes.");
      return false;
    }

    try {
      const response = await fetch("/api/gmail-proxy/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          token,
          to: toEmail,
          subject,
          bodyHTML
        })
      });

      const resJson = await response.json();

      if (!response.ok) {
        console.error("Gmail Proxy send rejected:", resJson);
        alert(`Gmail Transmission Error: ${resJson.error || 'Request rejected'}. Details: ${JSON.stringify(resJson.details || resJson)}`);
        return false;
      }

      console.log("Gmail Proxy send succeeded! Message ID:", resJson.messageId);
      return true;
    } catch (err: any) {
      console.error("Failed to dispatch Gmail notification via server proxy:", err);
      alert(`Gmail Transport Exception: ${err.message || 'Connection failure'}`);
      return false;
    }
  };

  const handleApproveKitchen = async (id: string) => {
    try {
      const kit = kitchens.find(k => k.id === id);
      const toEmail = kit?.gmail;
      const kitchenName = kit?.name || "Kitchen";

      const res = await fetch(`/api/rescue-food/kitchens/${id}/approve`, {
        method: "POST"
      });
      if (res.ok) {
        await syncServerState();
        if (googleUser?.email) {
          await checkKitchenStatus(googleUser.email);
        }

        if (toEmail) {
          const subject = `bacha kulcha - Your Kitchen Approved!`;
          const bodyHTML = `
            <div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; background: #ffffff;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #0f172a; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">bacha kulcha</h1>
                <p style="color: #64748b; font-size: 14px; margin: 4px 0 0 0;">Unified Surplus Food Rescue Network</p>
              </div>
              <div style="border-top: 1px solid #f1f5f9; padding-top: 24px;">
                <p style="font-size: 16px; margin-top: 0;">Hello <strong>${kitchenName}</strong> team,</p>
                <p style="font-size: 15px;">We are delighted to inform you that your commercial outlet registration has been <strong>successfully approved</strong>!</p>
                <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #475569; margin: 0 0 8px 0; letter-spacing: 0.05em;">Outlet Access Configured:</p>
                  <ul style="font-size: 14px; color: #334155; padding-left: 20px; margin: 0; line-height: 1.8;">
                    <li>Verified Commercial Name: ${kitchenName}</li>
                    <li>Licensing Audit Stamp: FSSAI Verified</li>
                    <li>Status: <strong>ACTIVE_ONLINE</strong></li>
                  </ul>
                </div>
                <p style="font-size: 15px;">Your merchant console listing privileges have been fully activated. You are now authorized to register leftover specialties, customize dynamic price curves, and receive dynamic on-demand reservations from customer users!</p>
                <p style="font-size: 15px; margin-bottom: 0;">Warmest regards,<br><span style="color: #475569; font-weight: 600;">bacha kulcha state supervisor</span></p>
              </div>
            </div>
          `;
          await sendKitchenGmail(toEmail, subject, bodyHTML);
        }
      } else {
        alert("Failed to approve kitchen.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectKitchen = async (id: string, reason: string) => {
    try {
      const kit = kitchens.find(k => k.id === id);
      const toEmail = kit?.gmail;
      const kitchenName = kit?.name || "Kitchen";

      const res = await fetch(`/api/rescue-food/kitchens/${id}/reject`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason })
      });
      if (res.ok) {
        await syncServerState();
        if (googleUser?.email) {
          await checkKitchenStatus(googleUser.email);
        }

        if (toEmail) {
          const subject = `bacha kulcha - Kitchen Verification Audit Action Required`;
          const bodyHTML = `
            <div style="font-family: system-ui, sans-serif; padding: 24px; color: #1e293b; line-height: 1.6; max-width: 600px; margin: 0 auto; border: 1px solid #fee2e2; border-radius: 12px; background: #fffcfc;">
              <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #991b1b; font-size: 24px; font-weight: 800; margin: 0; letter-spacing: -0.025em;">bacha kulcha</h1>
                <p style="color: #ef4444; font-size: 13px; font-weight: bold; text-transform: uppercase; margin: 4px 0 0 0; letter-spacing: 0.05em;">Access Suspension Notice</p>
              </div>
              <div style="border-top: 1px solid #fca5a5; padding-top: 24px;">
                <p style="font-size: 16px; margin-top: 0;">Hello <strong>${kitchenName}</strong> team,</p>
                <p style="font-size: 15px;">This email is to notify you that your commercial outlet credentials for <strong>${kitchenName}</strong> have faced a compliance status change of <strong>SUSPENDED / REJECTED</strong>.</p>
                
                <div style="background: #fff5f5; border: 1px solid #fecaca; padding: 16px; border-radius: 8px; margin: 20px 0;">
                  <p style="font-size: 13px; font-weight: bold; text-transform: uppercase; color: #991b1b; margin: 0 0 8px 0; letter-spacing: 0.05em;">Compliance Audit Analysis:</p>
                  <p style="font-size: 14px; color: #7f1d1d; margin: 0; line-height: 1.5; font-weight: 500;">
                    ${reason}
                  </p>
                </div>

                <p style="font-size: 14px; color: #64748b;">
                  Our compliance team reviews registrations to ensure all FSSAI licensing identification, GSTIN tax credentials, hygiene standards, and pricing guidelines meet the strict state supervisor mandates.
                </p>
                <p style="font-size: 14px; color: #64748b;">
                  Please update your registration credentials with corresponding valid documents to resubmit for verification.
                </p>
                
                <p style="font-size: 15px; margin-top: 24px; margin-bottom: 0;">Warmest regards,<br><span style="color: #475569; font-weight: 600;">bacha kulcha state supervisor</span></p>
              </div>
            </div>
          `;
          await sendKitchenGmail(toEmail, subject, bodyHTML);
        }
      } else {
        alert("Failed to reject kitchen.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    syncServerState();
    if (googleUser?.email) {
      checkKitchenStatus(googleUser.email);
    }
    const timer = setInterval(() => {
      syncServerState();
      if (googleUser?.email) {
        checkKitchenStatus(googleUser.email, true);
      }
    }, 5000);
    return () => clearInterval(timer);
  }, [googleUser?.email]);

  useEffect(() => {
    if (!showGoogleModal) {
      setPickerLoginPassword("");
      setCustomLoginPassword("");
      setSelectedPickerAccount(null);
      setPasswordError("");
      setShowPassword(false);
    }
  }, [showGoogleModal]);

  useEffect(() => {
    const handleOAuthMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost') && !origin.includes('0.0.0.0')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.user) {
        const user = event.data.user;
        const token = event.data.accessToken;
        handleGoogleSignIn(user.email, user.name, user.picture, token);
      }
    };
    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [pendingRoleAccess]);

  useEffect(() => {
    // Restore pending role if returning from full page OAuth redirect
    const pendingRole = localStorage.getItem("pending_role_access");
    if (pendingRole && googleUser) {
      setActiveRole(pendingRole as any);
      localStorage.removeItem("pending_role_access");
    }
  }, [googleUser]);

  const handleRealGoogleOAuth = async () => {
    // 1. Open popup window immediately on direct user click to satisfy browser security
    const width = 500;
    const height = 650;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    const popup = window.open(
      "about:blank",
      "google_oauth_popup",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=no`
    );

    if (!popup) {
      setPasswordError("Popup blocked! Please allow popups for this site so Google Sign-In can open.");
      return;
    }

    try {
      setGoogleLoginPending(true);
      const redirectUri = `${window.location.origin}/auth/callback`;
      const scopes = [
        "https://www.googleapis.com/auth/gmail.send",
        "openid",
        "profile",
        "email"
      ].join(" ");
      const res = await fetch(`/api/auth/url?redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scopes)}`);
      if (!res.ok) {
        throw new Error("Failed to initialize Google OAuth session");
      }
      const data = await res.json();
      if (!data.url) {
        throw new Error("Invalid OAuth session URL returned by backend server.");
      }
      
      // Store pending status so we know how to resume
      if (pendingRoleAccess) {
        localStorage.setItem("pending_role_access", pendingRoleAccess);
      }
      
      // Navigate popup to the authorized Google OAuth URL
      popup.location.href = data.url;
      setGoogleLoginPending(false);
    } catch (err: any) {
      console.error(err);
      popup.close();
      setPasswordError(err.message || "Failed to initiate Google OAuth.");
      setGoogleLoginPending(false);
    }
  };

  const handleTriggerAutoPrice = async () => {
    try {
      const res = await fetch("/api/rescue-food/listings/auto-price-ai", { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setListings(data.listings);
        syncServerState();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoogleSignIn = async (email: string, name: string, picture?: string, token?: string) => {
    setGoogleLoginPending(true);
    const resolvedEmail = email || "sujalawasthi299792458@gmail.com";
    const resolvedName = name || "Sujal Awasthi";
    const user = {
      email: resolvedEmail,
      name: resolvedName,
      picture: picture || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(resolvedName)}`
    };
    
    localStorage.setItem("bacha_google_user", JSON.stringify(user));
    if (token) {
      localStorage.setItem("bacha_google_token", token);
      setGoogleAccessToken(token);
    }
    setGoogleUser(user);
    setGoogleLoginPending(false);
    setShowGoogleModal(false);

    // Reset registration form inputs to avoid cross-user state leaks
    setRegForm({
      name: "",
      phone: "",
      address: "",
      fssai: "",
      gstin: "",
      openTime: "09:00 AM",
      closeTime: "10:00 PM",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
    });

    // Check status immediately
    const kit = await checkKitchenStatus(resolvedEmail);

    if (pendingRoleAccess) {
      setActiveRole(pendingRoleAccess);
      setPendingRoleAccess(null);
    } else {
      setActiveRole("hub");
    }
  };

  const handleAdminAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formAdminId === "admin" && formAdminPass === "123") {
      setIsAdminAuthenticated(true);
      localStorage.setItem("bacha_admin_auth", "true");
      setActiveRole("admin");
      setAdminLoginError("");
    } else {
      setAdminLoginError("Security Signature Mismatch: Invalid Admin ID or Password.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("bacha_google_user");
    localStorage.removeItem("bacha_google_token");
    localStorage.removeItem("bacha_admin_auth");
    setGoogleUser(null);
    setGoogleAccessToken(null);
    setKitchenReg(null);
    setIsCorrectingReg(false);
    isCorrectingRegRef.current = false;
    setIsAdminAuthenticated(false);
    setActiveRole("hub");
    setFormAdminId("");
    setFormAdminPass("");
    setCustomLoginEmail("");
    setCustomLoginName("");
    setCustomLoginPassword("");
    setPickerLoginPassword("");
    setSelectedPickerAccount(null);
    setPasswordError("");
    setShowPassword(false);
    setGoogleAuthView("picker");
    setShowGoogleModal(false);
    
    // Clear registration/correction form on logout
    setRegForm({
      name: "",
      phone: "",
      address: "",
      fssai: "",
      gstin: "",
      openTime: "09:00 AM",
      closeTime: "10:00 PM",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
    });
  };

  // Rendering screen layout
  // authenticated user app experience (Shows selection homepage / active role)
  return (
    <div className="min-h-screen bg-[#F4F5F7] text-slate-800 font-sans antialiased flex flex-col justify-between relative overflow-x-hidden selection:bg-[#e23744]/10 selection:text-[#e23744]">
      
      {/* Premium Startup Navigation Header */}
      <header className="border-b border-slate-200/60 bg-white/80 sticky top-0 z-40 backdrop-blur-2xl shadow-sm transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex items-center justify-between">
          
          <div className="flex items-center gap-6">
            <div
              onClick={() => setActiveRole("hub")}
              className="flex items-center gap-3.5 cursor-pointer group"
            >
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

            {/* If inside a portal, render exit to hub */}
            {activeRole !== "hub" && (
              <button
                onClick={() => setActiveRole("hub")}
                className="hidden md:flex items-center gap-1.5 bg-white/50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200 text-xs font-sans font-bold px-3 py-1.5 rounded-lg transition-all shadow-sm cursor-pointer"
              >
                <ArrowLeft size={13} />
                Hub Screen
              </button>
            )}
          </div>

          {/* User profile & controls */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            

            {/* Sync trigger */}
            <button
              onClick={syncServerState}
              disabled={syncing}
              className="p-2.5 text-slate-550 hover:text-[#e23744] hover:bg-slate-100 rounded-xl transition-all border border-slate-200 cursor-pointer text-xs"
              title="Sync Platform Data"
            >
              <RefreshCw size={15} className={syncing ? "animate-spin" : ""} />
            </button>

            {/* Authorized Google User metadata */}
            {googleUser ? (
              <>
                {/* Floating Gmail Inbox Trigger Button */}
                <button
                  onClick={() => setShowGmailInbox(true)}
                  className="px-3 py-2 text-slate-550 hover:text-red-500 hover:bg-slate-100 rounded-xl transition-all relative border border-slate-200 cursor-pointer flex items-center gap-1.5"
                  title="Verified Google Mail Inbox"
                >
                  <Mail size={16} className="text-red-500 animate-pulse" />
                  <span className="hidden lg:inline text-xs font-sans font-bold text-slate-600">G-Mail</span>
                  <span className="absolute -top-1 -right-1 bg-red-600 h-3 w-3 rounded-full border-2 border-white animate-pulse"></span>
                </button>

                <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 hover:bg-slate-100 transition-colors">
                  <img
                    src={googleUser.picture}
                    alt={googleUser.name}
                    referrerPolicy="no-referrer"
                    className="h-8 w-8 rounded-full border border-slate-350"
                  />
                  <div className="hidden sm:block text-left">
                    <p className="text-xs font-sans font-bold text-slate-800 leading-none">{googleUser.name}</p>
                    <p className="text-[10px] font-mono text-slate-400 leading-none mt-1 truncate max-w-[130px]" title={googleUser.email}>{googleUser.email}</p>
                  </div>
                </div>

                {/* Sign out */}
                <button
                  onClick={handleLogout}
                  className="p-2.5 text-slate-400 hover:text-stone-700 hover:bg-slate-100 border border-slate-200 rounded-xl transition-all cursor-pointer"
                  title="Logout session"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setPendingRoleAccess(null);
                  setGoogleAuthView("picker");
                  setShowGoogleModal(true);
                }}
                className="bg-[#4285F4] hover:bg-[#3574de] text-white text-[11px] font-sans font-bold px-3.5 py-2 rounded-xl transition-all shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <svg className="h-4.5 w-4.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z animate-in duration-200" />
                </svg>
                Sign In
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Main Framework Views Wrapper */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        
        {/* HOMEPAGE ROLE SELECTOR - RENDERS CLEAN INTENT SELECTORS WITHOUT LATERAL TERMINALS */}
        {activeRole === "hub" && (
          <div className="relative w-full max-w-5xl mx-auto py-6 space-y-16">
            
            {/* Background gradient mesh & floating dust elements spanning the hub */}
            <GradientMeshBackground />
            <FloatingParticles />

            {/* Tag & Heading Content with Slide Up & Fade In */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center space-y-6 max-w-4xl mx-auto z-10"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/80 border border-slate-200/80 shadow-[0_4px_12px_rgba(0,0,0,0.02)] text-[10px] font-mono font-bold text-[#e23744] uppercase tracking-wider backdrop-blur-sm">
                <Sparkles size={11} className="text-[#e23744] animate-pulse" />
                <span>Bacha Kulcha Smart-Rescue Protocol</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6.5xl font-sans font-black text-slate-1000 tracking-tight leading-[1.08] transition-all">
                Welcome to <span className="bg-gradient-to-r from-[#e23744] via-rose-600 to-amber-500 bg-clip-text text-transparent">bacha kulcha</span>
                {googleUser ? (() => {
                  const parts = googleUser.name.split(/\s+/).filter(Boolean);
                  if (parts.length === 0) return "";
                  const first = parts[0].toLowerCase().replace(/[!.,]/g, "");
                  if (first === "the" && parts.length > 1) {
                    return <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">, {parts[1]}</span>;
                  } else if (first === "the") {
                    return "";
                  }
                  return <span className="bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">, {parts[0]}</span>;
                })() : ""}!
              </h1>
              
              <p className="text-xs sm:text-sm md:text-base text-slate-550 max-w-2.5xl mx-auto leading-relaxed font-normal font-sans">
                Our smart surplus-rescue protocol matches you with premium gourmet overruns instantly. Scale back landfill emissions, conserve virtual water reserves, and unlock dining savings up to 90%.
              </p>
            </motion.div>

            {/* 3-Card Interactive Grid Selector - NOW SHIFTED TO TOP */}
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12
                  }
                }
              }}
              className="relative grid grid-cols-1 md:grid-cols-3 gap-8 z-10"
            >

              {/* Card option A: Customer Portal */}
              <motion.div 
                id="hub-card-customer"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -10, scale: 1.025, transition: { duration: 0.25, ease: "easeOut" } }}
                onMouseMove={(e) => handleCardMouseMove(e, "customer")}
                onMouseLeave={() => handleCardMouseLeave("customer")}
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.customer.rx}deg) rotateY(${cardTilt.customer.ry}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s"
                }}
                onClick={() => {
                  if (!googleUser) {
                    setPendingRoleAccess("customer");
                    setGoogleAuthView("picker");
                    setShowGoogleModal(true);
                  } else {
                    setActiveRole("customer");
                  }
                }}
                className="group relative bg-white/75 backdrop-blur-2xl border border-slate-200/60 rounded-[36px] pt-4 pb-8 px-8 text-left cursor-pointer transition-all duration-300 hover:shadow-[0_45px_90px_rgba(226,55,68,0.12)] hover:border-rose-300/80 flex flex-col justify-between h-[450px] sm:h-[480px] md:h-[510px] lg:h-[530px] overflow-hidden"
              >
                {/* Embedded Premium Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/[0.03] via-transparent to-orange-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Laser Cursor-Following Spotlight Shadow Effect */}
                {cardTilt.customer.active && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(350px circle at ${cardTilt.customer.x}px ${cardTilt.customer.y}px, rgba(226, 55, 68, 0.12), transparent 80%)`
                    }}
                  />
                )}

                {/* Soft decorative corner accent */}
                <span className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-[#e23744]/10 to-transparent blur-2xl pointer-events-none" />

                {/* Premium Card Hero Illustration with Radial Glow & Floating animations */}
                <div className="w-full h-[120px] sm:h-[135px] md:h-[145px] lg:h-[155px] relative z-10 flex items-center justify-center overflow-visible mt-2 mb-3" style={{ transform: "translateZ(50px)" }}>
                  {/* Soft Radial Glow behind illustration: Warm orange/coral glow */}
                  <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-orange-500/20 via-rose-500/15 to-transparent blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-115 transition-all duration-700" />
                  <motion.img
                    src="/assets/cusstomer.png"
                    alt="Customer Rescue Illustration"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain select-none filter drop-shadow-[0_12px_24px_rgba(226,55,68,0.12)] group-hover:drop-shadow-[0_20px_36px_rgba(226,55,68,0.20)] transition-all duration-500"
                    animate={{
                      y: [0, -6, 0],
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    transition={{
                      duration: 4.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>
                
                <div className="space-y-3 relative z-10 mt-1" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                       <h3 className="font-sans font-black text-xl text-slate-1000 leading-tight group-hover:text-[#e23744] transition-colors">Customer Portal</h3>
                      <span className="bg-[#e23744]/10 text-[#e23744] text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Rescue active</span>
                    </div>
                    <p className="text-[10px] text-[#e23744]/80 font-mono tracking-widest mt-1 uppercase font-extrabold flex items-center gap-1">
                      Order portions &amp; rescue food
                    </p>
                  </div>
                  <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans font-normal">
                    Secure chef-prepared Amritsari Kulcha reserves, unserved wedding delicacies, and organic artisan bakes from partner kitchens at 80-90% markdown rates.
                  </p>
                </div>
                
                <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-3 relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <span className="text-[10.5px] font-mono font-medium text-slate-455 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SSL Secured
                  </span>
                  <MagneticButton 
                    id="btn-customer-portal"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-[#e23744] hover:bg-[#cb202d] text-white text-[11px] font-extrabold font-sans transition-all duration-300 shadow-md shadow-[#e23744]/25"
                  >
                    Go Order &rarr;
                  </MagneticButton>
                </div>
              </motion.div>

              {/* Card option B: Partner Kitchen */}
              <motion.div 
                id="hub-card-seller"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -10, scale: 1.025, transition: { duration: 0.25, ease: "easeOut" } }}
                onMouseMove={(e) => handleCardMouseMove(e, "seller")}
                onMouseLeave={() => handleCardMouseLeave("seller")}
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.seller.rx}deg) rotateY(${cardTilt.seller.ry}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s"
                }}
                onClick={() => {
                  if (!googleUser) {
                    setPendingRoleAccess("seller");
                    setGoogleAuthView("picker");
                    setShowGoogleModal(true);
                  } else {
                    setActiveRole("seller");
                  }
                }}
                className="group relative bg-white/75 backdrop-blur-2xl border border-slate-200/60 rounded-[36px] pt-4 pb-8 px-8 text-left cursor-pointer transition-all duration-300 hover:shadow-[0_45px_90px_rgba(14,165,233,0.12)] hover:border-sky-300/80 flex flex-col justify-between h-[450px] sm:h-[480px] md:h-[510px] lg:h-[530px] overflow-hidden"
              >
                {/* Embedded Premium Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-sky-505/[0.03] via-transparent to-emerald-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Laser Cursor-Following Spotlight Shadow Effect */}
                {cardTilt.seller.active && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(350px circle at ${cardTilt.seller.x}px ${cardTilt.seller.y}px, rgba(14, 165, 233, 0.12), transparent 80%)`
                    }}
                  />
                )}

                {/* Soft decorative corner accent */}
                <span className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-sky-500/10 to-transparent blur-2xl pointer-events-none" />

                {/* Premium Card Hero Illustration with Radial Glow & Floating animations */}
                <div className="w-full h-[120px] sm:h-[135px] md:h-[145px] lg:h-[155px] relative z-10 flex items-center justify-center overflow-visible mt-2 mb-3" style={{ transform: "translateZ(50px)" }}>
                  {/* Soft Radial Glow behind illustration: Blue/teal glow */}
                  <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-sky-500/20 via-emerald-400/15 to-transparent blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-115 transition-all duration-700" />
                  <motion.img
                    src="/assets/kitchen portal.png"
                    alt="Partner Kitchen Illustration"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain select-none filter drop-shadow-[0_12px_24px_rgba(14,165,233,0.12)] group-hover:drop-shadow-[0_20px_36px_rgba(14,165,233,0.20)] transition-all duration-500"
                    animate={{
                      y: [0, -6, 0],
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    transition={{
                      duration: 5.0,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <div className="space-y-3 relative z-10 mt-1" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-black text-xl text-slate-1000 leading-tight group-hover:text-sky-600 transition-colors">Partner Kitchen</h3>
                      <span className="bg-sky-500/10 text-sky-600 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Merchant SYNC</span>
                    </div>
                    <p className="text-[10px] text-sky-600/80 font-mono tracking-widest mt-1 uppercase font-extrabold flex items-center gap-1">
                      Merchant surplus publishing
                    </p>
                  </div>
                  <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans font-normal">
                    Designed for banquet halls, premium hotels and local bakeries. Rapid-upload unserved menus, automate price recommendations, and track instant claims.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-3 relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <span className="text-[10.5px] font-mono font-medium text-slate-455 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    SYNC PORT ACTIVE
                  </span>
                  <MagneticButton 
                    id="btn-seller-portal"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-sky-600 hover:bg-sky-700 text-white text-[11px] font-extrabold font-sans transition-all duration-300 shadow-md shadow-sky-600/25"
                  >
                    Inventory &rarr;
                  </MagneticButton>
                </div>
              </motion.div>

              {/* Card option C: Administrative Suite */}
              <motion.div 
                id="hub-card-admin"
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 20 } }
                }}
                whileHover={{ y: -10, scale: 1.025, transition: { duration: 0.25, ease: "easeOut" } }}
                onMouseMove={(e) => handleCardMouseMove(e, "admin")}
                onMouseLeave={() => handleCardMouseLeave("admin")}
                style={{
                  transform: `perspective(1000px) rotateX(${cardTilt.admin.rx}deg) rotateY(${cardTilt.admin.ry}deg)`,
                  transformStyle: "preserve-3d",
                  transition: "transform 0.15s ease-out, border-color 0.3s, box-shadow 0.3s"
                }}
                onClick={() => {
                  setActiveRole("admin");
                }}
                className="group relative bg-white/75 backdrop-blur-2xl border border-slate-200/60 rounded-[36px] pt-4 pb-8 px-8 text-left cursor-pointer transition-all duration-300 hover:shadow-[0_45px_90px_rgba(100,116,139,0.12)] hover:border-slate-400/80 flex flex-col justify-between h-[450px] sm:h-[480px] md:h-[510px] lg:h-[530px] overflow-hidden"
              >
                {/* Embedded Premium Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-505/[0.03] via-transparent to-slate-500/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                {/* Laser Cursor-Following Spotlight Shadow Effect */}
                {cardTilt.admin.active && (
                  <div 
                    className="absolute inset-0 pointer-events-none transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(350px circle at ${cardTilt.admin.x}px ${cardTilt.admin.y}px, rgba(148, 163, 184, 0.12), transparent 80%)`
                    }}
                  />
                )}

                {/* Soft decorative corner accent */}
                <span className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-indigo-500/10 to-transparent blur-2xl pointer-events-none" />

                {/* Premium Card Hero Illustration with Radial Glow & Floating animations */}
                <div className="w-full h-[120px] sm:h-[135px] md:h-[145px] lg:h-[155px] relative z-10 flex items-center justify-center overflow-visible mt-2 mb-3" style={{ transform: "translateZ(50px)" }}>
                  {/* Soft Radial Glow behind illustration: Navy/indigo glow */}
                  <div className="absolute w-40 h-40 rounded-full bg-gradient-to-tr from-indigo-600/20 via-slate-400/15 to-transparent blur-3xl top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none group-hover:scale-115 transition-all duration-700" />
                  <motion.img
                    src="/assets/admin.png"
                    alt="Administrative Suite Illustration"
                    referrerPolicy="no-referrer"
                    className="h-full w-full object-contain select-none filter drop-shadow-[0_12px_24px_rgba(100,116,139,0.12)] group-hover:drop-shadow-[0_20px_36px_rgba(100,116,139,0.20)] transition-all duration-500"
                    animate={{
                      y: [0, -6, 0],
                    }}
                    whileHover={{
                      scale: 1.03,
                      transition: { duration: 0.3, ease: "easeOut" }
                    }}
                    transition={{
                      duration: 5.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                </div>

                <div className="space-y-3 relative z-10 mt-1" style={{ transform: "translateZ(30px)" }}>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-sans font-black text-xl text-slate-1000 leading-tight group-hover:text-slate-850 transition-colors">Administrative Suite</h3>
                      <span className="bg-slate-100 text-slate-700 text-[8px] font-mono font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">LOCKED DESK</span>
                    </div>
                    <p className="text-[10px] text-slate-550 font-mono tracking-widest mt-1 uppercase font-extrabold flex items-center gap-1">
                      Credential verification desk
                    </p>
                  </div>
                  <p className="text-[11.5px] text-slate-550 leading-relaxed font-sans font-normal">
                    Required credentials for clearance. Verify partner kitchen registrations, inspect anti-fraud signals, check server latency logs, and query carbon saves.
                  </p>
                </div>

                <div className="flex items-center justify-between pt-5 border-t border-slate-100 mt-3 relative z-10" style={{ transform: "translateZ(20px)" }}>
                  <span className="text-[10.5px] font-mono font-medium text-slate-455 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    ID CHECK REQUIRED
                  </span>
                  <MagneticButton 
                    id="btn-admin-portal"
                    className="inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-full bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-extrabold font-sans transition-all duration-300 shadow-md shadow-slate-800/25"
                  >
                    Clearance &rarr;
                  </MagneticButton>
                </div>
              </motion.div>

            </motion.div>

            {/* SAAS GLASSMORPHISM ANALYTICS CARDS - NOW SHIFTED TO BOTTOM */}
            <div className="relative space-y-8 z-10 pt-4">
              <div className="text-center space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/15 text-[9px] font-mono font-bold text-emerald-600 uppercase tracking-widest backdrop-blur-sm">
                  🌿 Sustainability & Community Ledger
                </span>
                <h2 className="text-xl sm:text-2xl font-sans font-black text-slate-1000 tracking-tight">
                  Real-time Ecological &amp; Monetary Impact
                </h2>
                <p className="text-xs text-slate-450 max-w-lg mx-auto">
                  Aggregated statistics of active meal rescues, landfill gas mitigation, and community savings.
                </p>
              </div>

              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.08
                    }
                  }
                }}
                className="relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto text-left"
              >
                {/* Metric 1: Portions Saved */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.15 } }}
                  onMouseMove={(e) => handleMetricMouseMove(e, 1)}
                  onMouseLeave={() => handleMetricMouseLeave(1)}
                  className="group relative bg-white/40 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/70 hover:border-rose-200 hover:shadow-[0_20px_35px_rgba(226,55,68,0.05)] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-rose-100/10 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Floating Metric Spotlight */}
                  {metricSpotlight[1].active && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(140px circle at ${metricSpotlight[1].x}px ${metricSpotlight[1].y}px, rgba(226, 55, 68, 0.09), transparent 85%)`
                      }}
                    />
                  )}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-rose-50/90 border border-rose-100/60 flex items-center justify-center text-[#e23744]">
                        <ShoppingBag size={16} />
                      </div>
                      <span className="text-[8px] font-mono uppercase bg-rose-50 border border-rose-100/80 px-2 py-0.5 rounded-full text-[#e23744] font-bold">
                        ACTIVE RESCUES
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold leading-none">Portions Saved</span>
                      <span className="text-3xl font-mono font-black text-slate-900 mt-2 block tracking-tight leading-none">
                        <AnimatedCounter value={stats.mealsSaved} /> <span className="text-xs font-sans font-extrabold text-slate-400 ml-0.5">meals</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100/80 w-full relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>RESCUE YIELD RATE</span>
                      <span className="text-[#e23744] font-bold">94.2%</span>
                    </div>
                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden mt-1.5">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: "94.2%" }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.2, delay: 0.4 }}
                        className="h-full bg-gradient-to-r from-[#e23744] to-rose-400 rounded-full"
                      />
                    </div>
                  </div>
                </motion.div>

                {/* Metric 2: Carbon Avoided */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.15 } }}
                  onMouseMove={(e) => handleMetricMouseMove(e, 2)}
                  onMouseLeave={() => handleMetricMouseLeave(2)}
                  className="group relative bg-white/40 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/70 hover:border-emerald-200 hover:shadow-[0_20px_35px_rgba(16,185,129,0.05)] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-emerald-100/10 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Floating Metric Spotlight */}
                  {metricSpotlight[2].active && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(140px circle at ${metricSpotlight[2].x}px ${metricSpotlight[2].y}px, rgba(16, 185, 129, 0.09), transparent 85%)`
                      }}
                    />
                  )}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-emerald-50/90 border border-emerald-100/60 flex items-center justify-center text-emerald-600">
                        <Leaf size={16} />
                      </div>
                      <span className="text-[8px] font-mono uppercase bg-emerald-50 border border-emerald-100/80 px-2 py-0.5 rounded-full text-emerald-600 font-bold">
                        OFFSET SCORE
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold leading-none">Carbon Avoided</span>
                      <span className="text-3xl font-mono font-black text-emerald-600 mt-2 block tracking-tight leading-none">
                        <AnimatedCounter value={stats.co2Saved} formatter={(v) => v.toFixed(0)} /> <span className="text-xs font-sans font-extrabold text-[#10b981] ml-0.5">kg CO₂</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100/80 w-full relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>EMISSION SAVINGS TREND</span>
                      <span className="text-emerald-600 font-bold">A+ INDEX</span>
                    </div>
                    <div className="flex items-end gap-1 h-3 mt-2">
                      {[40, 65, 30, 80, 50, 95, 75].map((h, i) => (
                        <div key={i} className="flex-1 bg-slate-100/80 rounded-[1px] h-full overflow-hidden">
                          <motion.div 
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.3 + i * 0.05 }}
                            className="w-full bg-[#10b981]/80"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>

                {/* Metric 3: Water Saved */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.15 } }}
                  onMouseMove={(e) => handleMetricMouseMove(e, 3)}
                  onMouseLeave={() => handleMetricMouseLeave(3)}
                  className="group relative bg-white/40 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/70 hover:border-sky-200 hover:shadow-[0_20px_35px_rgba(14,165,233,0.05)] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-sky-100/10 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Floating Metric Spotlight */}
                  {metricSpotlight[3].active && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(140px circle at ${metricSpotlight[3].x}px ${metricSpotlight[3].y}px, rgba(14, 165, 233, 0.09), transparent 85%)`
                      }}
                    />
                  )}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-sky-50/90 border border-sky-100/60 flex items-center justify-center text-sky-600">
                        <Droplet size={16} />
                      </div>
                      <span className="text-[8px] font-mono uppercase bg-sky-50 border border-sky-100/80 px-2 py-0.5 rounded-full text-sky-600 font-bold">
                        VIRTUAL H₂O
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold leading-none">Water Saved</span>
                      <span className="text-3xl font-mono font-black text-sky-600 mt-2 block tracking-tight leading-none">
                        <AnimatedCounter value={stats.waterSaved} formatter={(v) => (v / 1000).toFixed(0)} /> <span className="text-xs font-sans font-extrabold text-sky-500 ml-0.5">K Liters</span>
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100/80 w-full relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>CONSERVATION RATIO</span>
                      <span className="text-sky-600 font-bold">88.5 GL/M</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full mt-2 relative overflow-hidden">
                      <motion.div 
                        animate={{ x: [-80, 80] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 bottom-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-sky-300/45 to-transparent"
                      />
                      <div className="h-full bg-gradient-to-r from-sky-400 to-sky-500 rounded-full w-[88.5%]" />
                    </div>
                  </div>
                </motion.div>

                {/* Metric 4: Community Money */}
                <motion.div 
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100, damping: 15 } }
                  }}
                  whileHover={{ y: -5, transition: { duration: 0.15 } }}
                  onMouseMove={(e) => handleMetricMouseMove(e, 4)}
                  onMouseLeave={() => handleMetricMouseLeave(4)}
                  className="group relative bg-white/40 backdrop-blur-xl border border-slate-200/50 rounded-2xl p-5 flex flex-col justify-between hover:bg-white/70 hover:border-amber-200 hover:shadow-[0_20px_35px_rgba(245,158,11,0.05)] transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-16 h-16 bg-amber-100/10 rounded-full blur-xl pointer-events-none" />
                  
                  {/* Floating Metric Spotlight */}
                  {metricSpotlight[4].active && (
                    <div 
                      className="absolute inset-0 pointer-events-none transition-opacity duration-300 pointer-events-none"
                      style={{
                        background: `radial-gradient(140px circle at ${metricSpotlight[4].x}px ${metricSpotlight[4].y}px, rgba(245, 158, 11, 0.09), transparent 85%)`
                      }}
                    />
                  )}

                  <div className="space-y-3 relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="w-9 h-9 rounded-xl bg-amber-50/90 border border-amber-100/60 flex items-center justify-center text-amber-600">
                        <Coins size={16} />
                      </div>
                      <span className="text-[8px] font-mono uppercase bg-amber-50 border border-amber-100/80 px-2 py-0.5 rounded-full text-amber-600 font-bold">
                        MONETARY SECURE
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold leading-none">Community Savings</span>
                      <span className="text-3xl font-mono font-black text-slate-800 mt-2 block tracking-tight leading-none">
                        ₹<AnimatedCounter value={stats.moneyRecovered} formatter={(v) => Math.floor(v).toLocaleString()} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3.5 border-t border-slate-100/80 w-full relative z-10">
                    <div className="flex justify-between items-center text-[9px] font-mono text-slate-400">
                      <span>MONEY RECOVERY VELOCITY</span>
                      <span className="text-amber-600 font-bold">+12.4% MoM</span>
                    </div>
                    <div className="h-3 mt-2 flex items-center justify-center overflow-visible">
                      <svg className="w-full h-full overflow-visible" viewBox="0 0 100 20">
                        <defs>
                          <linearGradient id="money-gradient-2" x1="0" y1="1" x2="0" y2="0">
                            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0"/>
                            <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.2"/>
                          </linearGradient>
                        </defs>
                        <motion.path 
                          initial={{ pathLength: 0 }}
                          whileInView={{ pathLength: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.5, ease: "easeInOut" }}
                          d="M 0,18 Q 20,4 40,11 T 80,6 T 100,2" 
                          fill="none" 
                          stroke="#f59e0b" 
                          strokeWidth="2.5" 
                          strokeLinecap="round" 
                        />
                        <path d="M 0,18 Q 20,4 40,11 T 80,6 T 100,2 L 100,20 L 0,20 Z" fill="url(#money-gradient-2)" />
                        <motion.circle 
                          initial={{ scale: 0 }}
                          whileInView={{ scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 1.2, duration: 0.3 }}
                          cx="100" 
                          cy="2" 
                          r="3" 
                          fill="#d97706" 
                        />
                      </svg>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            </div>

          </div>
        )}

        {/* CUSTOMER PORTAL ENVELOPE */}
        {activeRole === "customer" && (
          <div className="space-y-6 w-full max-w-6xl mx-auto animate-in fade-in duration-200 text-left">
            <div className="flex justify-between items-center border-b border-slate-250 pb-4">
              <div>
                <h3 className="font-sans text-2xl font-extrabold text-[#e23744]">
                  bacha kulcha gourmet.
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">Order custom-curated portions from gourmet bakeries and slow-cooked kitchen surpluses.</p>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[9px] uppercase font-mono tracking-widest text-[#e23744] bg-[#fff0f1] px-3 py-1 rounded-full border border-[#e23744]/20 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-[#e23744] animate-ping"></span>
                Surplus Index Active
              </span>
            </div>
            
            <div className="w-full">
              <CustomerPortal 
                listings={listings} 
                onOrderCreated={syncServerState} 
                notifications={[]}
                orders={orders}
              />
            </div>
          </div>
        )}

        {/* SELLER/MERCHANT PORTAL ENVELOPE */}
        {activeRole === "seller" && (() => {
          if (!googleUser) {
            return (
              <div className="bg-white border border-slate-200 rounded-3xl p-8 max-w-md mx-auto text-center space-y-4 shadow-sm">
                <Store size={40} className="mx-auto text-slate-400" />
                <h3 className="text-lg font-sans font-extrabold text-slate-800">Authentication Required</h3>
                <p className="text-xs text-slate-550">Please authenticate using your Gmail account to access the kitchen partner console.</p>
                <button
                  onClick={() => {
                    setPendingRoleAccess("seller");
                    setGoogleAuthView("picker");
                    setShowGoogleModal(true);
                  }}
                  className="bg-[#e23744] hover:bg-[#c92430] text-white text-xs font-bold py-2.5 px-5 rounded-xl cursor-pointer"
                >
                  Authenticate via Gmail
                </button>
              </div>
            );
          }

          if (fetchingKitchen) {
            return (
              <div className="py-12 flex flex-col items-center justify-center space-y-3">
                <RefreshCw size={24} className="text-[#e23744] animate-spin" />
                <span className="text-xs font-mono text-slate-400 animate-pulse uppercase tracking-wider">Verifying licensing status...</span>
              </div>
            );
          }

          if (!kitchenReg) {
            // RENDER KITCHEN REGISTRATION FORM
            const presetImages = [
              { url: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80", label: "Heritage Oven" },
              { url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?w=800&auto=format&fit=crop&q=80", label: "Classic Dining" },
              { url: "https://images.unsplash.com/photo-1543007630-9710e4a00a20?w=800&auto=format&fit=crop&q=80", label: "Bakehouse Artisan" },
              { url: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80", label: "Platters Buffet" },
              { url: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80", label: "Salads & Organic" }
            ];

            const handleSubmitReg = async (e: React.FormEvent) => {
              e.preventDefault();
              if (!regForm.name || !regForm.phone || !regForm.address || !regForm.fssai || !regForm.gstin) {
                alert("Please satisfy all mandatory credential entries.");
                return;
              }
              // fssai number must be exactly 14 digits
              if (!/^\d{14}$/.test(regForm.fssai.replace(/\D/g, ""))) {
                alert("FSSAI license must be exactly 14 numeric digits.");
                return;
              }

              try {
                const res = await fetch("/api/rescue-food/kitchens/register", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    name: regForm.name,
                    phone: regForm.phone,
                    address: regForm.address,
                    fssai: regForm.fssai,
                    gstin: regForm.gstin,
                    businessHours: `${regForm.openTime} - ${regForm.closeTime}`,
                    image: regForm.image,
                    gmail: googleUser.email
                  })
                });

                if (res.ok) {
                  setIsCorrectingReg(false);
                  isCorrectingRegRef.current = false;
                  await checkKitchenStatus(googleUser.email);
                  await syncServerState();
                  alert("Kitchen registered! Your application has been dispatched to administrators for FSSAI verification.");
                } else {
                  const errorMsg = await res.text();
                  alert(`Registration failed: ${errorMsg}`);
                }
              } catch (err) {
                console.error("Critical error dispatching registration:", err);
              }
            };

            return (
              <div className="bg-white border border-slate-200 rounded-[32px] p-8 max-w-lg mx-auto shadow-xl space-y-6 animate-in zoom-in-95 duration-200 text-left">
                <div className="text-center space-y-2 pb-2 border-b border-slate-100">
                  <h3 className="font-sans font-extrabold text-[#e23744] text-xl">Kitchen Partner Onboarding</h3>
                  <p className="text-[11.5px] text-slate-400 font-sans">Submit your brand and certifications to publish unserved specialties.</p>
                </div>

                <form onSubmit={handleSubmitReg} className="space-y-4">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold font-semibold">Kitchen / Outlet Name <span className="text-[#e23744]">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Amritsari Kulcha Estate"
                      value={regForm.name}
                      onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#e23744] focus:bg-white font-sans"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Phone Number <span className="text-[#e23744]">*</span></label>
                      <input
                        type="tel"
                        placeholder="e.g. +91 98765 43210"
                        value={regForm.phone}
                        onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#e23744] focus:bg-white font-sans"
                        required
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold font-semibold">FSSAI License No (14 digits) <span className="text-[#e23744]">*</span></label>
                      <input
                        type="text"
                        placeholder="e.g. 12345678901234"
                        value={regForm.fssai}
                        maxLength={14}
                        onChange={(e) => setRegForm({ ...regForm, fssai: e.target.value.replace(/\D/g, "") })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#e23744] focus:bg-white font-sans"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold font-semibold">GSTIN/Tax Registration ID <span className="text-[#e23744]">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. 03AABCU1234K1Z5"
                      value={regForm.gstin}
                      onChange={(e) => setRegForm({ ...regForm, gstin: e.target.value.toUpperCase() })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#e23744] focus:bg-white font-sans font-mono"
                      required
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Operational Physical Address <span className="text-[#e23744]">*</span></label>
                    <input
                      type="text"
                      placeholder="e.g. Block C-14, Heritage Market, Ludhiana"
                      value={regForm.address}
                      onChange={(e) => setRegForm({ ...regForm, address: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2.5 text-xs text-slate-800 focus:outline-none focus:border-[#e23744] focus:bg-white font-sans"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Opening hour</label>
                      <select
                        value={regForm.openTime}
                        onChange={(e) => setRegForm({ ...regForm, openTime: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none font-sans"
                      >
                        <option>07:00 AM</option>
                        <option>08:00 AM</option>
                        <option>09:00 AM</option>
                        <option>10:00 AM</option>
                        <option>11:00 AM</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Closing hour</label>
                      <select
                        value={regForm.closeTime}
                        onChange={(e) => setRegForm({ ...regForm, closeTime: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-800 focus:outline-none font-sans"
                      >
                        <option>08:00 PM</option>
                        <option>09:00 PM</option>
                        <option>10:00 PM</option>
                        <option>11:00 PM</option>
                        <option>12:00 AM</option>
                      </select>
                    </div>
                  </div>

                  {/* Aesthetic Kitchen theme selection presets picker */}
                  <div className="space-y-1.5">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-500 font-bold">Select Brand Cover Accent</label>
                    <div className="flex gap-2.5 flex-wrap">
                      {presetImages.map((img) => (
                        <button
                          key={img.label}
                          type="button"
                          onClick={() => setRegForm({ ...regForm, image: img.url })}
                          className={`relative h-11 w-11 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${regForm.image === img.url ? 'border-[#e23744] scale-105 shadow font-semibold' : 'border-transparent opacity-70 hover:opacity-100'}`}
                          title={img.label}
                        >
                          <img src={img.url} className="h-full w-full object-cover" alt="" />
                          {regForm.image === img.url && (
                            <div className="absolute inset-0 bg-red-650/20 flex items-center justify-center text-white">
                              <Check size={12} className="stroke-[3]" />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button
                      type="submit"
                      className="w-full bg-[#e23744] hover:bg-[#c92430] text-white font-extrabold py-3.5 rounded-xl text-center text-xs shadow-md transition-all cursor-pointer active:scale-98"
                    >
                      Submit Verification Credentials
                    </button>

                    {isCorrectingReg && (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsCorrectingReg(false);
                          isCorrectingRegRef.current = false;
                          if (googleUser?.email) {
                            await checkKitchenStatus(googleUser.email);
                          }
                        }}
                        className="w-full bg-slate-100 hover:bg-slate-200 text-slate-705 font-bold py-3 rounded-xl text-center text-xs transition-colors cursor-pointer"
                      >
                        Cancel Correction &amp; Go Back
                      </button>
                    )}
                  </div>
                </form>
              </div>
            );
          }

          if (kitchenReg.approved === "pending") {
            // RENDER UNDER RE-REVIEW INSTRUCTIONS PAGE
            return (
              <div className="bg-white border border-slate-250 rounded-[32px] p-8 max-w-lg mx-auto shadow-md text-left space-y-6">
                <div className="text-center space-y-3">
                  <div className="relative h-16 w-16 mx-auto bg-amber-55 rounded-full flex items-center justify-center text-amber-500 border border-amber-200 animate-pulse">
                     <Store size={28} />
                     <span className="absolute -top-1 -right-1 bg-amber-500 rounded-full h-3.5 w-3.5 border-2 border-white animate-pulse"></span>
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-slate-900 text-lg">Awaiting Administrative Approval</h3>
                    <p className="text-[10px] font-mono uppercase tracking-wider text-amber-600 mt-1">fssai certificate &amp; gstin manual audit</p>
                  </div>
                </div>
                
                <div className="bg-amber-50/50 rounded-2xl p-4 border border-amber-100 space-y-3 text-[11.5px] leading-relaxed text-slate-700 font-sans">
                  <p>Your registration for <b className="text-slate-900">"{kitchenReg.name}"</b> has been logged successfully on the platform.</p>
                  <p className="border-t border-amber-100/50 pt-2"><span className="text-slate-400 font-mono">FSSAI License:</span> <span className="font-mono text-slate-800 font-black">{kitchenReg.fssai}</span></p>
                  <p><span className="text-slate-400 font-mono">GSTIN ID:</span> <span className="font-mono text-slate-800 font-bold">{kitchenReg.gstin}</span></p>
                  <p><span className="text-slate-400 font-mono">Verified Gmail:</span> <span className="font-sans font-medium text-slate-850">{kitchenReg.gmail}</span></p>
                </div>

                <div className="text-xs text-slate-500 leading-normal bg-slate-50 border rounded-2xl p-4 space-y-2">
                  <p className="font-semibold text-slate-700">Check Your Gmail inbox:</p>
                  <p>A verification sequence message regarding current verification status has been scheduled to your Gmail: <span className="underline font-medium text-[#e23744]">{googleUser.email}</span>. Click the red <b>"G-Mail" envelope button</b> in the top navigation header above to inspect your mailbox!</p>
                </div>

                <button
                  onClick={() => setActiveRole("hub")}
                  className="w-full border border-slate-200 hover:bg-slate-55 text-slate-500 font-bold py-3 rounded-xl text-center text-xs transition-colors cursor-pointer"
                >
                  Return to Hub Screen
                </button>
              </div>
            );
          }

          if (kitchenReg.approved === "rejected") {
            // RENDER REJECTION PAGE
            return (
              <div className="bg-white border border-red-200 rounded-[32px] p-8 max-w-lg mx-auto shadow-lg text-left space-y-6 animate-in zoom-in-95 duration-200">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-red-50 text-red-650 rounded-full flex items-center justify-center mx-auto border border-red-100">
                     <AlertCircle size={22} />
                  </div>
                  <h3 className="font-sans font-extrabold text-slate-900 text-lg">Verification Application Declined</h3>
                  <p className="text-[10px] uppercase font-mono text-red-600 font-bold tracking-wider">Regulatory audit failed</p>
                </div>

                <div className="p-4 bg-red-50 border border-red-100 rounded-2xl text-xs space-y-1">
                  <p className="font-bold text-red-950">Decline Reason reported by state inspector:</p>
                  <p className="text-red-700 font-medium italic">{kitchenReg.rejectionReason || "Mismatching trade names under GSTIN schema checker."}</p>
                </div>

                <p className="text-xs text-slate-500 leading-normal">
                  Don't worry. You can correct your license data below and click "Correct details &amp; Re-Submit" to prompt inspector re-review automatically!
                </p>

                <button
                  onClick={() => {
                    setRegForm({
                      name: kitchenReg.name,
                      phone: kitchenReg.phone,
                      address: kitchenReg.address,
                      fssai: kitchenReg.fssai,
                      gstin: kitchenReg.gstin,
                      openTime: kitchenReg.businessHours.split(" - ")[0] || "09:00 AM",
                      closeTime: kitchenReg.businessHours.split(" - ")[1] || "10:00 PM",
                      image: kitchenReg.image || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80"
                    });
                    setIsCorrectingReg(true);
                    setKitchenReg(null); // resets to form block
                  }}
                  className="w-full bg-[#e23744] hover:bg-[#c92430] text-white font-extrabold py-3.5 rounded-xl text-center text-xs shadow-md transition-all cursor-pointer active:scale-98"
                >
                  Correct details &amp; Re-Submit
                </button>
              </div>
            );
          }

          // APPROVED! RENDER Standard SellerPortal!
          return (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 w-full max-w-4xl mx-auto shadow-md animate-in fade-in duration-200 text-left">
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div>
                  <h3 className="font-sans text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Store className="text-emerald-500" size={20} />
                    {kitchenReg.name || "Approved Kitchen Console"}
                  </h3>
                  <p className="text-[11px] text-slate-550 font-mono mt-0.5">Publish surplus batches for dynamic portion mapping. FSSAI ID: {kitchenReg.fssai}</p>
                </div>
                <span className="text-[9px] bg-emerald-100 px-3 py-1 rounded-full text-emerald-800 border border-emerald-200 font-mono font-bold tracking-wider uppercase flex items-center gap-1.5 animate-pulse">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                  Verified Outlet Live
                </span>
              </div>

              <div className="text-stone-800 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                <div className="text-xs space-y-1 mb-4 leading-relaxed font-sans text-slate-650">
                  <p className="font-bold text-slate-800">Surplus Provision Control Panel:</p>
                  <p>Input your leftover kulcha batches or banquet surplus portions below. Submitting lists instantly renders dynamically in the active city mobile customer client!</p>
                </div>
                
                <SellerPortal 
                  onListingAdded={syncServerState} 
                  listings={listings}
                  onTriggerAutoPrice={handleTriggerAutoPrice}
                  sellerRestaurantName={kitchenReg.name}
                />
              </div>
            </div>
          );
        })()}

        {/* ADMINISTRATOR CONSOLE PORTAL ENVELOPE */}
        {activeRole === "admin" && (
          <div className="w-full max-w-5xl mx-auto animate-in fade-in duration-200">
            
            {/* If administrative mode is NOT verified, render credential form gate */}
            {!isAdminAuthenticated ? (
              <div className="bg-white border border-slate-200 rounded-[28px] p-8 max-w-md mx-auto shadow-xl space-y-6 text-left">
                <div className="text-center space-y-2">
                  <div className="h-12 w-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                    <Lock size={22} className="text-[#e23744]" />
                  </div>
                  <h3 className="font-sans font-extrabold text-base text-slate-900 tracking-tight">Administrative Access Lock</h3>
                  <p className="text-xs text-slate-500 leading-normal max-w-xs mx-auto">
                    Please provide operational clearance password verification.
                  </p>
                </div>

                <form onSubmit={handleAdminAuthSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Admin Identifier ID:</label>
                    <input
                      type="text"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-800 font-sans"
                      placeholder="Enter Admin ID"
                      value={formAdminId}
                      onChange={(e) => setFormAdminId(e.target.value)}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between">
                      <label className="block text-[9px] font-mono uppercase tracking-widest text-slate-500 font-bold">Operational Key / Pass:</label>
                      <span className="text-[10px] font-mono text-slate-400">Default: 123</span>
                    </div>
                    <input
                      type="password"
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-slate-800 font-sans"
                      placeholder="Access Code"
                      value={formAdminPass}
                      onChange={(e) => setFormAdminPass(e.target.value)}
                    />
                  </div>

                  {adminLoginError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-700 font-sans leading-normal">
                      ⚠️ {adminLoginError}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-slate-900 hover:bg-slate-800 text-white font-sans text-xs font-bold py-3 rounded-xl shadow-md transition-all cursor-pointer active:scale-98 text-center"
                  >
                    Authenticate Security Signature
                  </button>
                </form>

                <div className="border-t border-slate-100 pt-4 flex flex-col gap-2 mt-2 font-sans text-xs">
                  <p className="text-[10.5px] text-slate-500">Hint: Enter ID <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-850 font-bold">admin</span> and Pass <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-slate-850 font-bold">123</span></p>
                  <button
                    onClick={() => setActiveRole("hub")}
                    className="w-full border border-slate-200 text-slate-450 hover:bg-slate-50 text-[11px] font-bold py-2 rounded-xl text-center cursor-pointer"
                  >
                    Cancel &amp; Back to Hub
                  </button>
                </div>
              </div>
            ) : (
              
              /* Renders admin console workspace with unified layout (Saves switchward clutter!) */
              <div className="space-y-6 text-left">
                
                {/* Gmail Automation Status Bar */}
                <div className={`p-4 rounded-3xl border flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all duration-300 ${
                  googleAccessToken 
                    ? "bg-emerald-50/75 border-emerald-150 text-emerald-900" 
                    : "bg-amber-50/75 border-amber-150 text-amber-950"
                }`}>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${googleAccessToken ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                      <h4 className="text-xs font-sans font-black uppercase tracking-wider">
                        {googleAccessToken ? "Gmail Automation System Verified" : "Gmail Notification Setup Recommended"}
                      </h4>
                    </div>
                    <p className="text-[11px] text-slate-650 font-sans leading-normal">
                      {googleAccessToken 
                        ? `Logged in as sujalawasthi299792458@gmail.com — automated compliance and registration dispatch emails will be sent.` 
                        : "Required to send autonomous verification review updates, registration compliance checklists, and suspension emails to kitchen outlets."}
                    </p>
                  </div>
                  {!googleAccessToken ? (
                    <button
                      onClick={() => {
                        setPendingRoleAccess("admin");
                        handleRealGoogleOAuth();
                      }}
                      className="bg-amber-600 hover:bg-amber-700 text-white font-sans font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm active:scale-97 cursor-pointer whitespace-nowrap self-start md:self-auto"
                    >
                      🔌 Connect Google Admin
                    </button>
                  ) : (
                    <span className="text-[10px] font-mono font-bold bg-emerald-100 text-emerald-800 border border-emerald-250 px-3 py-1.5 rounded-lg uppercase tracking-widest whitespace-nowrap">
                      ● Active Send Connected
                    </span>
                  )}
                </div>

                {/* Unified subtab choices to combine Operations, ESG, and DevOps logs into Admin view */}
                <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-slate-200 pb-4 gap-4">
                  <div>
                    <h2 className="text-xl font-sans font-extrabold text-slate-900 flex items-center gap-2">
                      <Shield size={20} className="text-[#e23744]" />
                      Administrative Master Console
                    </h2>
                    <p className="text-[10.5px] text-slate-550 font-mono mt-0.5">Control operational, environmental &amp; dev services</p>
                  </div>

                  {/* Operational Clearance Subtab buttons */}
                  <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start md:self-auto overflow-x-auto max-w-full">
                    {[
                      { id: "operations", label: "🛡️ Operations Dashboard" },
                      { id: "esg", label: "🌱 Sustainability ESG" },
                      { id: "devops", label: "⚙️ DevOps TelemetryLogs" }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setAdminSubTab(tab.id as any)}
                        className={`px-3 py-1.5 text-xs font-sans font-medium rounded-lg whitespace-nowrap transition-colors cursor-pointer ${
                          adminSubTab === tab.id
                            ? "bg-white text-slate-900 font-extrabold shadow-xs"
                            : "text-slate-650 hover:text-slate-900"
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Sub-Portal Renders */}
                {adminSubTab === "operations" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="text-stone-800 bg-slate-50 p-4 border border-slate-200 rounded-2xl">
                      <AdminPortal 
                        listings={listings} 
                        notifications={[]}
                        onTriggerAutoPrice={handleTriggerAutoPrice}
                        orders={orders}
                        kitchens={kitchens}
                        onApproveKitchen={handleApproveKitchen}
                        onRejectKitchen={handleRejectKitchen}
                      />
                    </div>
                  </div>
                )}

                {adminSubTab === "esg" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="font-sans font-bold text-sm text-slate-800">Unified ESG Carbon Ledger</h3>
                      <span className="text-[9.5px] font-mono text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-100 font-bold uppercase">Auditable Compliance</span>
                    </div>
                    
                    <div className="text-stone-800">
                      <SustainabilityPortal stats={stats} />
                    </div>
                  </div>
                )}

                {adminSubTab === "devops" && (
                  <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6">
                    <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                      <h3 className="font-sans font-bold text-sm text-slate-800">DevOps Ingress &amp; Atlas Replica Sets</h3>
                      <span className="text-[9.5px] font-mono text-amber-600 bg-amber-50 px-2.5 py-1 rounded border border-amber-100 font-bold uppercase animate-pulse">Monitoring Active</span>
                    </div>

                    <div className="text-stone-800">
                      <DevOpsPortal />
                    </div>
                  </div>
                )}

                {/* Administrator Log out */}
                <div className="flex items-center justify-between bg-slate-100 border border-slate-200 rounded-2xl p-4 text-xs font-sans">
                  <span className="text-slate-500 font-mono text-[10.5px]">Clearance mode: LEVEL_5_SECURE</span>
                  <button
                    onClick={() => {
                      setIsAdminAuthenticated(false);
                      localStorage.removeItem("bacha_admin_auth");
                      setActiveRole("hub");
                    }}
                    className="text-[#e23744] hover:underline font-bold font-sans cursor-pointer"
                  >
                    Lock Administrative Suite
                  </button>
                </div>

              </div>
            )}

          </div>
        )}

      </main>

      {/* Gmail Inbox Simulator Modal */}
      {showGmailInbox && googleUser && (() => {
        // Build notifications list
        const messages = [];
        
        // Always include initial welcome email 
        messages.push({
          id: "welcome-email",
          sender: "Bacha Kulcha Team <welcome@bachakulcha.org>",
          subject: "Welcome to bacha kulcha! Start Saving Gourmet Plates Today 🎉",
          date: kitchenReg ? kitchenReg.registrationDate : new Date().toISOString(),
          body: `Hi ${googleUser.name},\n\nWelcome to bacha kulcha! We are thrilled to have you join our sustainable food platform.\n\nOur platform connects elite homekitchens, award-winning banquet halls, and local bakeries with discerning city food lovers to save unserved delicacies from ending up as waste.\n\nIf you want to start publish your surplus plates, make sure to register your kitchen using the FSSAI credentials in the "Partner Kitchen" dashboard.\n\nBest regards,\nThe bacha kulcha team`
        });

        if (kitchenReg) {
          if (kitchenReg.approved === "pending") {
            messages.unshift({
              id: "pending-email",
              sender: "Regulatory Audit Command <compliance@bachakulcha.org>",
              subject: `Verification Action Pending: FSSAI Audit Under Review (#BK-${kitchenReg.fssai.substring(0,5)})`,
              date: kitchenReg.registrationDate,
              body: `Hello Admin/Merchant,\n\nWe have successfully received your registration application for "${kitchenReg.name}".\n\n- Phone Number: ${kitchenReg.phone}\n- Registered GSTIN ID: ${kitchenReg.gstin}\n- Mandatory FSSAI Certification ID: ${kitchenReg.fssai}\n- Authorized Admin Account: ${kitchenReg.gmail}\n\nOur administrator inspectors have been notified and are currently auditing your FSSAI credentials. We will send an automated status update to this inbox immediately upon completion of this compliance audit.\n\nBest compliance wishes,\nRegulatory Division`
            });
          } else if (kitchenReg.approved === "approved") {
            messages.unshift({
              id: "approved-email",
              sender: "Compliance Clearance Division <admin@bachakulcha.org>",
              subject: `Congratulations! Kitchen Listing Privileges Granted! 🎉 (#BK-${kitchenReg.fssai.substring(0,5)})`,
              date: kitchenReg.registrationDate,
              body: `Hello ${googleUser.name},\n\nWe are delighted to inform you that your commercial outlet registration for "${kitchenReg.name}" has been successfully approved!\n\nOur safety inspectors verified your active FSSAI credentials (${kitchenReg.fssai}) and tax registration records (${kitchenReg.gstin}).\n\nYour merchant console listing privileges have been fully activated. You are now authorized to register leftover specialties, customize price curves, and receive dynamic on-demand reservations from customer users!\n\nWarmest rewards,\nbacha kulcha state supervisor`
            });
          } else if (kitchenReg.approved === "rejected") {
            messages.unshift({
              id: "rejected-email",
              sender: "State Inspection Board <compliance@bachakulcha.org>",
              subject: `IMPORTANT: Application Status for "${kitchenReg.name}" (#BK-${kitchenReg.fssai.substring(0,5)})`,
              date: kitchenReg.registrationDate,
              body: `Dear Merchant,\n\nYour application to onboard with bacha kulcha has failed to satisfy state regulatory verification.\n\n- Decisively Declined For: "${kitchenReg.rejectionReason || 'Mismatching trade credentials under regulatory system filters.'}"\n\nTo correct this, please review your registration details, double-check your official GSTIN and 14-digit FSSAI numbers on your formal certificate copy, and re-submit for review on the active seller command portal.\n\nDisappointed regards,\nState Licensing Auditor`
            });
          }
        }

        return (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-150">
            <div className="bg-white rounded-[28px] border border-slate-200 shadow-2xl overflow-hidden w-full max-w-2xl mx-4 flex flex-col h-[520px] animate-in zoom-in-95 duration-150 text-left">
              
              {/* Header */}
              <div className="bg-red-600 px-6 py-4 flex items-center justify-between text-white shadow-md">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-white text-red-650 rounded-full flex items-center justify-center font-extrabold shadow-sm text-sm">
                    M
                  </div>
                  <div>
                    <h3 className="font-sans font-extrabold text-sm tracking-tight leading-tight">Google Mail Simulator</h3>
                    <p className="text-[10px] font-mono text-white/80 mt-0.5">Inbox partition for {googleUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowGmailInbox(false)}
                  className="bg-white/10 hover:bg-white/20 text-white rounded-full p-1.5 transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Inbox layout split */}
              <div className="flex-1 flex min-h-0 bg-slate-50">
                
                {/* Left Rails */}
                <div className="w-1/3 border-r border-slate-200 bg-white p-3 space-y-2 select-none hidden md:block">
                  <button className="w-full bg-[#fff0f1] text-[#e23744] font-bold text-xs p-2.5 rounded-xl text-left flex items-center gap-2">
                    <Mail size={14} />
                    Inbox ({messages.length})
                  </button>
                  <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 px-2 pt-4">Google OIDC secure</div>
                </div>

                {/* Messages Listing panel */}
                <div className="flex-1 overflow-y-auto divide-y divide-slate-100 bg-slate-50">
                  {messages.map((m) => (
                    <div key={m.id} className="p-4 hover:bg-white transition-colors cursor-default space-y-1.5">
                      <div className="flex justify-between items-start text-xs">
                        <span className="font-sans font-extrabold text-slate-800 truncate max-w-[170px]" title={m.sender}>{m.sender.split("<")[0]}</span>
                        <span className="text-[9px] font-mono text-slate-400">{new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </div>
                      <p className="font-sans font-bold text-xs text-slate-900 leading-tight">{m.subject}</p>
                      <pre className="text-[10.5px] text-slate-600 font-sans whitespace-pre-line leading-relaxed pb-1 select-text border-l-2 border-red-500/20 pl-2.5 pt-1 bg-white p-2 rounded-lg border">
                        {m.body}
                      </pre>
                    </div>
                  ))}
                </div>

              </div>

            </div>
          </div>
        );
      })()}

          {/* Floating Google Account Chooser Dialog Popup */}
      {showGoogleModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 animate-in fade-in duration-205 py-6 overflow-y-auto">
          <div className="bg-white rounded-[28px] border border-slate-205 shadow-2xl p-8 w-full max-w-md mx-4 space-y-6 animate-in zoom-in-95 duration-205 text-left select-none relative my-auto">
            
            {/* Header with official Google Branding */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center gap-1 text-[28px] font-sans font-extrabold tracking-tight select-none">
                <span className="text-[#4285F4]">G</span>
                <span className="text-[#EA4335]">o</span>
                <span className="text-[#FBBC05]">o</span>
                <span className="text-[#4285F4]">g</span>
                <span className="text-[#34A853]">l</span>
                <span className="text-[#EA4335]">e</span>
              </div>
              
              <h3 className="text-xl font-sans font-medium text-slate-800">Sign in with Google API</h3>
              <p className="text-xs text-slate-500 font-sans leading-relaxed text-center">
                Authenticate using the official Google OAuth 2.0 API. This connects your account securely to the <span className="font-semibold text-slate-700 font-sans">bacha-kulcha-rescue.app</span> cloud backend.
              </p>
            </div>

            {googleLoginPending ? (
              <div className="py-12 flex flex-col items-center justify-center space-y-4">
                <div className="relative w-10 h-10 animate-spin">
                  <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-[#4285F4]"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#EA4335]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-[#FBBC05]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#34A853]"></div>
                </div>
                <span className="text-xs font-mono text-slate-500 animate-pulse uppercase tracking-wider">Opening secure Google Sign-In Window...</span>
              </div>
            ) : (
              <div className="space-y-5">
                {passwordError && (
                  <div className="bg-rose-50 border border-rose-150 p-3 rounded-xl flex items-start gap-2.5 text-[11.5px] text-rose-750 font-sans">
                    <AlertCircle size={15} className="shrink-0 mt-0.5 text-rose-600" />
                    <div>
                      <span className="font-bold block">Authorization Status:</span>
                      <span>{passwordError}</span>
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleRealGoogleOAuth}
                  className="w-full flex items-center justify-center gap-3 bg-white border border-slate-300 hover:border-slate-400 hover:bg-slate-50 text-slate-700 text-sm font-semibold py-3.5 px-4 rounded-2xl transition-all shadow-xs cursor-pointer text-center group"
                >
                  <svg className="h-5 w-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  <span className="font-sans font-bold text-[#1a73e8] group-hover:text-[#1557b0] transition-colors">Sign in with Google API</span>
                </button>

                {/* Important Admin Developer Google OAuth Guide */}
                <div className="bg-amber-50/75 border border-amber-200/80 rounded-2xl p-4 space-y-2.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-900 font-sans">
                    <span className="text-sm">⚠️</span>
                    <span>Getting "Access Blocked / Error 403" on other IDs?</span>
                  </div>
                  <p className="text-[10px] text-amber-800 leading-normal font-sans">
                    By default, untrusted Google Identity apps are set to <strong>Testing Status</strong>. To log in with <strong>any Google Account</strong> without restrictions, follow these steps:
                  </p>
                  <ol className="text-[9.5px] text-amber-800 leading-relaxed font-sans space-y-1.5 pl-4 list-decimal">
                    <li>
                      Go to the <a href="https://console.cloud.google.com/apis/credentials/consent" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-950">Google Cloud Console OAuth Screen</a>.
                    </li>
                    <li>
                      Click <strong>"Publish App"</strong>. This moves your consent status from "Testing" to "In Production", instantly unlocking login for all global Google Accounts.
                    </li>
                    <li>
                      Ensure these callback URLs are allowed in your console settings:
                      <div className="bg-white/80 border border-slate-150 p-1.5 rounded font-mono text-[8px] text-slate-600 mt-1 select-all select-text overflow-x-auto whitespace-pre">
                        {window.location.origin}/auth/callback
                      </div>
                    </li>
                    <li className="text-slate-500 font-normal">
                      Alternatively, add specific emails as <strong>"Test Users"</strong> on your Google OAuth consent settings page to authorize them manually while in sandbox mode.
                    </li>
                  </ol>
                </div>

                <div className="flex justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setPasswordError("");
                      setShowGoogleModal(false);
                    }}
                    className="w-full sm:w-auto bg-slate-100 hover:bg-slate-205 py-2.5 px-5 rounded-xl text-slate-700 text-xs font-bold font-sans transition-colors cursor-pointer text-center"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Legacy simulated views bypassed */}
      {false && (
        <div>
          <div>

            {googleLoginPending ? (
              <div className="py-10 flex flex-col items-center justify-center space-y-4">
                {/* Google colored loader circles */}
                <div className="relative w-10 h-10 animate-spin">
                  <div className="absolute top-0 left-0 w-4 h-4 rounded-full bg-[#4285F4]"></div>
                  <div className="absolute top-0 right-0 w-4 h-4 rounded-full bg-[#EA4335]"></div>
                  <div className="absolute bottom-0 left-0 w-4 h-4 rounded-full bg-[#FBBC05]"></div>
                  <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#34A853]"></div>
                </div>
                <span className="text-xs font-mono text-slate-550 animate-pulse uppercase tracking-wider">Verifying with Google Authenticator...</span>
              </div>
            ) : googleAuthView === "custom_email" ? (
              /* CUSTOM GMAIL AUTHVIEW FORM STEP 1: EMAIL ENTRY */
              <div className="space-y-4 animate-in fade-in duration-150">
                <div className="space-y-3">
                  <button
                    type="button"
                    onClick={handleRealGoogleOAuth}
                    className="w-full flex items-center justify-center gap-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-705 text-xs font-bold py-3 px-4 rounded-xl transition-all shadow-xs cursor-pointer text-center"
                  >
                    <span className="flex items-center justify-center w-5 h-5 font-sans font-bold text-[14px] leading-none bg-[#4285F4] text-white rounded-md shrink-0">G</span>
                    <span className="text-slate-700 font-sans font-semibold">Sign in with Google (OAuth API)</span>
                  </button>

                  <div className="relative flex py-1.5 items-center select-none">
                    <div className="flex-grow border-t border-slate-200"></div>
                    <span className="flex-shrink mx-3 text-[9px] text-slate-400 font-mono tracking-wider uppercase font-semibold">or simulate account key</span>
                    <div className="flex-grow border-t border-slate-200"></div>
                  </div>

                  <div className="space-y-1 relative">
                    <input
                      type="email"
                      placeholder="Email or phone (Gmail ID)"
                      value={customLoginEmail}
                      onChange={(e) => {
                        setCustomLoginEmail(e.target.value);
                        setPasswordError("");
                      }}
                      className="w-full bg-white border border-slate-300 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-md px-3.5 py-3 text-[14px] text-slate-900 focus:outline-none font-sans"
                      autoFocus
                    />
                  </div>
                  
                  <div className="flex justify-between items-center text-xs pt-1">
                    <button 
                      type="button"
                      onClick={() => alert("Simulation support: Try entering any valid Gmail address (e.g. sujalawasthi299792458@gmail.com) and click Next!")}
                      className="text-[#1a73e8] font-semibold hover:underline bg-transparent border-0 p-0 text-[12.5px] cursor-pointer"
                    >
                      Forgot email?
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleAuthView("picker");
                        setPasswordError("");
                      }}
                      className="text-[#1a73e8] font-semibold hover:underline bg-transparent border-0 p-0 text-[12.5px] cursor-pointer"
                    >
                      Use quick picker
                    </button>
                  </div>

                  {passwordError && (
                    <p className="text-[11.5px] text-red-600 flex items-center gap-1 font-sans pt-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-5">
                  <button
                    type="button"
                    onClick={() => {
                      setCustomLoginEmail("");
                      setCustomLoginName("");
                      setCustomLoginPassword("");
                      setPasswordError("");
                      setShowGoogleModal(false);
                    }}
                    className="text-[#1a73e8] hover:bg-blue-50/40 text-xs font-bold py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!customLoginEmail) {
                        setPasswordError("Enter an email or phone number.");
                        return;
                      }
                      if (!customLoginEmail.includes("@") || !customLoginEmail.includes(".")) {
                        setPasswordError("Enter a valid Google email address.");
                        return;
                      }
                      
                      // Match user details if any pre-existing or fallback capitalise
                      const emailLower = customLoginEmail.trim().toLowerCase();
                      if (emailLower === "sujalawasthi299792458@gmail.com") {
                        setCustomLoginName("Sujal Awasthi");
                      } else if (emailLower === "gourmet.tester@gmail.com") {
                        setCustomLoginName("Demo Tester");
                      } else {
                        // Formulate a clean name
                        const prefix = emailLower.split("@")[0];
                        const clean = prefix.replace(/[._-]/g, " ").replace(/\d+/g, "").trim();
                        const capitalized = clean ? clean.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") : "Custom User";
                        setCustomLoginName(capitalized);
                      }
                      
                      setPasswordError("");
                      setGoogleAuthView("custom_password");
                    }}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold py-2.5 px-6 rounded-md transition-all shadow-sm cursor-pointer"
                  >
                    Next
                  </button>
                </div>
                
                <p className="text-[10px] text-slate-400 text-center pt-2 leading-relaxed font-sans border-t border-slate-100">
                  Google Google Single-Sign-On is simulated in active-sandbox sandbox. No account data is exposed outside.
                </p>
              </div>
            ) : googleAuthView === "custom_password" ? (
              /* CUSTOM GMAIL AUTHVIEW FORM STEP 2: PASSWORD ENTRY */
              <div className="space-y-4 animate-in fade-in duration-150">
                
                {/* Chosen active account indicator */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleAuthView("custom_email");
                      setPasswordError("");
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-50 border border-slate-200 text-xs text-slate-700 rounded-full select-none hover:bg-slate-100 transition-colors max-w-full"
                  >
                    <div className="h-4.5 w-4.5 bg-[#4285F4]/10 text-[#4285F4] rounded-full flex items-center justify-center text-[10px] font-bold shrink-0">
                      {customLoginName ? customLoginName[0].toUpperCase() : "G"}
                    </div>
                    <span className="truncate max-w-[170px] font-medium font-sans text-[11px] text-slate-700">{customLoginEmail}</span>
                    <ChevronDown size={12} className="text-slate-500 shrink-0" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter Google account password"
                      value={customLoginPassword}
                      onChange={(e) => {
                        setCustomLoginPassword(e.target.value);
                        setPasswordError("");
                      }}
                      className="w-full bg-white border border-slate-300 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-md px-3.5 py-3 text-[14px] text-slate-900 focus:outline-none font-sans"
                      autoFocus
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3.5 top-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>

                  {/* Hint helper */}
                  <p className="text-[10px] text-slate-400 font-sans leading-normal">
                    {(() => {
                      const emailLower = customLoginEmail.trim().toLowerCase();
                      if (GOOGLE_SIMULATED_ACCOUNTS[emailLower]) {
                        return (
                          <span>Hint: Correct password is <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[#1a73e8] font-bold">{GOOGLE_SIMULATED_ACCOUNTS[emailLower].password}</span></span>
                        );
                      } else {
                        const customUsers = getStoredCustomUsers();
                        if (customUsers[emailLower]) {
                          return (
                            <span className="text-amber-600 font-medium">Verify password for registered custom account.</span>
                          );
                        } else {
                          return (
                            <span>Set any password (3+ chars) to register this new customized account.</span>
                          );
                        }
                      }
                    })()}
                  </p>

                  {/* Profile Info Setup */}
                  <div className="bg-slate-50 border border-slate-205 p-3.5 rounded-xl space-y-1">
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-slate-550 font-bold">Display Profile Name:</label>
                    <input
                      type="text"
                      placeholder="Enter Full Name"
                      value={customLoginName}
                      onChange={(e) => setCustomLoginName(e.target.value)}
                      className="w-full bg-white border border-slate-200 focus:border-[#1a73e8] px-2.5 py-1.5 rounded-lg text-xs font-sans focus:outline-none"
                    />
                    <p className="text-[9px] text-slate-450 leading-relaxed">
                      This will act as your customer/seller credential inside App database rooms.
                    </p>
                  </div>

                  {passwordError && (
                    <p className="text-[11.5px] text-red-600 flex items-center gap-1 font-sans pt-1">
                      <AlertCircle size={13} className="shrink-0" />
                      <span>{passwordError}</span>
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleAuthView("custom_email");
                      setPasswordError("");
                    }}
                    className="text-[#1a73e8] hover:bg-blue-50/40 text-xs font-bold py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                  >
                    Back
                  </button>
                  
                  <button
                    type="button"
                    onClick={() => {
                      if (!customLoginPassword) {
                        setPasswordError("Please enter your Google password.");
                        return;
                      }
                      
                      const emailLower = customLoginEmail.trim().toLowerCase();
                      const expectedAccount = GOOGLE_SIMULATED_ACCOUNTS[emailLower];
                      if (expectedAccount) {
                        if (customLoginPassword !== expectedAccount.password) {
                          setPasswordError("Wrong password. Try again (Hint: correct password is '" + expectedAccount.password + "')");
                          return;
                        }
                      } else {
                        // Check custom users database
                        const customUsers = getStoredCustomUsers();
                        const existingCustom = customUsers[emailLower];
                        if (existingCustom) {
                          if (customLoginPassword !== existingCustom.password) {
                            setPasswordError("Incorrect password for registered custom account. Try again.");
                            return;
                          }
                        } else {
                          // First-time signup for custom user
                          if (customLoginPassword.length < 3) {
                            setPasswordError("Password must be at least 3 characters for signup simulation.");
                            return;
                          }
                          if (!customLoginName || customLoginName.trim().length === 0) {
                            setPasswordError("Please confirm your display profile name.");
                            return;
                          }
                          saveCustomUser(customLoginEmail, customLoginName, customLoginPassword);
                        }
                      }
                      
                      handleGoogleSignIn(customLoginEmail, customLoginName);
                    }}
                    className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold py-2.5 px-6 rounded-md transition-all shadow-sm cursor-pointer"
                  >
                    Sign In
                  </button>
                </div>
              </div>
            ) : googleAuthView === "picker" ? (
              /* PICKER ACCOUNT LIST VIEW */
              <div className="space-y-3">
                <p className="text-xs text-slate-500 font-sans pb-1 font-semibold text-emerald-600 animate-pulse">⚡ Click on any account name to sign-in instantly:</p>
                
                {/* Option 1: Sujal Awasthi */}
                <button
                  type="button"
                  onClick={() => {
                    handleGoogleSignIn("sujalawasthi299792458@gmail.com", "Sujal Awasthi");
                  }}
                  className="w-full p-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-350 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer group animate-in fade-in slide-in-from-bottom-2 duration-150"
                >
                  <div className="h-9 w-9 bg-rose-50 text-[#e23744] rounded-full flex items-center justify-center text-xs font-bold border border-rose-100 shadow-xs shrink-0 font-sans">
                    SA
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-sans font-bold text-xs text-slate-805 leading-tight group-hover:text-[#1a73e8] transition-colors flex items-center gap-1">
                      <span>Sujal Awasthi</span>
                      <span className="text-[9px] bg-[#e23744]/10 text-[#e23744] px-1.5 py-0.2 rounded font-mono font-medium scale-90">Instant Access</span>
                    </p>
                    <p className="text-[10px] font-mono text-slate-400 truncate mt-0.5">sujalawasthi299792458@gmail.com</p>
                    <span className="inline-flex items-center gap-1 text-[8px] bg-emerald-100 text-emerald-850 border border-emerald-200 rounded font-mono font-bold px-1 mt-1 uppercase scale-90 origin-left">
                      ✓ Active Frame
                    </span>
                  </div>
                </button>

                <div className="border-t border-slate-100 pt-3 mt-2">
                  {/* Choose Another Account Button */}
                  <button
                    type="button"
                    onClick={() => {
                      setGoogleAuthView("custom_email");
                      setCustomLoginEmail("");
                      setCustomLoginName("");
                      setCustomLoginPassword("");
                      setPasswordError("");
                    }}
                    className="w-full p-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 hover:border-slate-250 rounded-2xl flex items-center gap-3 transition-all text-left cursor-pointer font-sans font-semibold text-xs text-slate-600 hover:text-slate-900"
                  >
                    <div className="h-9 w-9 bg-white rounded-full flex items-center justify-center text-slate-450 border border-slate-200 shrink-0">
                      <User size={15} />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold font-sans">Use customized account</p>
                      <p className="text-[9.5px] text-slate-400 font-normal font-sans">Log in with any valid Google Gmail credentials</p>
                    </div>
                  </button>
                </div>

                <div className="flex justify-between items-center pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setShowGoogleModal(false)}
                    className="text-[#1a73e8] hover:bg-slate-50 text-xs py-2 px-4 rounded-md text-center transition-all cursor-pointer font-bold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              /* PICKER ACCOUNT PASSWORD VIEW */
              googleAuthView === "picker_password" && selectedPickerAccount && (
                <div className="space-y-4 animate-in fade-in duration-150">
                  
                  {/* Chosen Account Badge */}
                  <div className="bg-slate-50 rounded-xl p-2.5 flex items-center gap-2.5 border border-slate-200/80">
                    <div className="h-8 w-8 bg-[#4285F4]/10 text-[#4285F4] rounded-full flex items-center justify-center text-xs font-bold font-sans shrink-0">
                      {selectedPickerAccount.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-slate-800 leading-tight truncate">{selectedPickerAccount.name}</p>
                      <p className="text-[10px] font-mono text-slate-500 truncate">{selectedPickerAccount.email}</p>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setGoogleAuthView("picker")}
                      className="text-[10px] font-mono text-[#1a73e8] hover:underline px-2 py-1 shrink-0 bg-transparent border-0"
                    >
                      Change
                    </button>
                  </div>

                  <div className="space-y-2">
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter Google password"
                        value={pickerLoginPassword}
                        onChange={(e) => {
                          setPickerLoginPassword(e.target.value);
                          setPasswordError("");
                        }}
                        className="w-full bg-white border border-slate-300 focus:border-[#1a73e8] focus:ring-1 focus:ring-[#1a73e8] rounded-md px-3.5 py-3 text-[14px] text-slate-900 focus:outline-none font-sans"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-3.5 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>

                    {/* Mint password hint */}
                    <p className="text-[10.5px] text-slate-400 font-sans leading-normal">
                      {(() => {
                        const emailLower = selectedPickerAccount.email.trim().toLowerCase();
                        if (GOOGLE_SIMULATED_ACCOUNTS[emailLower]) {
                          return (
                            <span>Hint: Password is <span className="font-mono bg-slate-100 px-1 py-0.5 rounded text-[#1a73e8] font-bold">{GOOGLE_SIMULATED_ACCOUNTS[emailLower].password}</span></span>
                          );
                        } else {
                          const customUsers = getStoredCustomUsers();
                          if (customUsers[emailLower]) {
                            return <span className="text-amber-600 font-medium">Verify custom password registered for this guest.</span>;
                          }
                          return <span>Password must be 3+ letters to configure authentication profile.</span>;
                        }
                      })()}
                    </p>
                    
                    {passwordError && (
                      <p className="text-[11.5px] text-red-650 flex items-center gap-1 font-sans">
                        <AlertCircle size={13} />
                        <span>{passwordError}</span>
                      </p>
                    )}
                  </div>

                  <div className="flex justify-between items-center pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        setGoogleAuthView("picker");
                        setPickerLoginPassword("");
                        setPasswordError("");
                      }}
                      className="text-[#1a73e8] hover:bg-blue-50/40 text-xs font-bold py-2.5 px-4 rounded-md transition-colors cursor-pointer"
                    >
                      Back
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => {
                        if (!pickerLoginPassword) {
                          setPasswordError("Enter your password.");
                          return;
                        }
                        
                        const emailLower = selectedPickerAccount.email.trim().toLowerCase();
                        const expectedAccount = GOOGLE_SIMULATED_ACCOUNTS[emailLower];
                        if (expectedAccount) {
                          if (pickerLoginPassword !== expectedAccount.password) {
                            setPasswordError("Wrong password. Try again (Hint: password is '" + expectedAccount.password + "')");
                            return;
                          }
                        } else {
                          // Check dynamic custom accounts
                          const customUsers = getStoredCustomUsers();
                          const existingCustom = customUsers[emailLower];
                          if (existingCustom) {
                            if (pickerLoginPassword !== existingCustom.password) {
                              setPasswordError("Incorrect password for this registered custom account. Try again.");
                              return;
                            }
                          } else {
                            if (pickerLoginPassword.length < 3) {
                              setPasswordError("Password must be at least 3 characters for signup simulation.");
                              return;
                            }
                            // Save dynamically to let them log in
                            saveCustomUser(selectedPickerAccount.email, selectedPickerAccount.name, pickerLoginPassword);
                          }
                        }
                        
                        handleGoogleSignIn(selectedPickerAccount.email, selectedPickerAccount.name);
                      }}
                      className="bg-[#1a73e8] hover:bg-[#1557b0] text-white text-xs font-bold py-2.5 px-6 rounded-md transition-all shadow-sm cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Beautiful Minimalist Editorial Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 mt-16 text-[11px] font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>© 2026 bacha kulcha inc. All gourmet leftovers represent certified safety protocols.</p>
          <div className="flex gap-4 uppercase">
            <span>256bit SSL Encryption</span>
            <span>•</span>
            <span>Mongoose atlas db</span>
            <span>•</span>
            <span>Notion Meets Zomato</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
