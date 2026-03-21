import { useState, useEffect, useRef } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  Zap, Wrench, Hammer, Settings, Sparkles, Paintbrush,
  Wind, Flame, Cog, Grid, Shirt, Shield,
  Search, Home, BookOpen, User, Plus, ArrowLeft,
  Star, MapPin, CheckCircle, Circle, Send, ChevronRight,
  LogOut, Phone, Clock, Menu, X, Lock
} from "lucide-react";

const SUPABASE_URL = "https://wikdqgzamwwjubrivrwo.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indpa2RxZ3phbXd3anVicml2cndvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwMzQxOTQsImV4cCI6MjA4OTYxMDE5NH0.EOoGbDazRpyVHd4p4M94jucojOUhUbk-BvqycY0SW88";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const SERVICE_ICONS = {
  electrician: Zap,
  plumber: Wrench,
  carpenter: Hammer,
  mechanic: Settings,
  cleaner: Sparkles,
  painter: Paintbrush,
  ac_repair: Wind,
  welder: Flame,
  generator: Cog,
  tiler: Grid,
  laundry: Shirt,
  security: Shield,
};

const SERVICES = [
  { id: "electrician", label: "Electrician", icon: "⚡" },
  { id: "plumber", label: "Plumber", icon: "🔧" },
  { id: "carpenter", label: "Carpenter", icon: "🪚" },
  { id: "mechanic", label: "Mechanic", icon: "🔩" },
  { id: "cleaner", label: "Cleaner", icon: "🧹" },
  { id: "painter", label: "Painter", icon: "🖌️" },
  { id: "ac_repair", label: "AC Repair", icon: "❄️" },
  { id: "welder", label: "Welder", icon: "🔥" },
  { id: "generator", label: "Generator Tech", icon: "⚙️" },
  { id: "tiler", label: "Tiler", icon: "🧱" },
  { id: "laundry", label: "Laundry", icon: "👕" },
  { id: "security", label: "Security", icon: "🛡️" },
];

const LOCATIONS = ["Lagos", "Abuja", "Port Harcourt", "Ibadan", "Kano", "Enugu", "Benin City", "Warri"];

const PROVIDERS = [
  { id: 1, name: "Emeka Okafor", service: "electrician", location: "Lagos", area: "Lekki", rating: 4.9, jobs: 142, price: "₦5,000/hr", verified: true, available: true, img: "EO", bio: "10 years wiring residential and commercial buildings. Fast, clean, reliable.", tags: ["Wiring", "Solar", "Panel"] },
  { id: 2, name: "Chukwudi Nwosu", service: "plumber", location: "Lagos", area: "Ikeja", rating: 4.8, jobs: 98, price: "₦4,500/hr", verified: true, available: true, img: "CN", bio: "Expert in burst pipes, installations, and bathroom fittings.", tags: ["Pipes", "Bathrooms", "Tanks"] },
  { id: 3, name: "Bola Adeyemi", service: "cleaner", location: "Lagos", area: "VI", rating: 4.7, jobs: 210, price: "₦8,000/visit", verified: true, available: false, img: "BA", bio: "Deep cleaning, post-construction, and regular home cleaning.", tags: ["Deep Clean", "Post-Construction", "Offices"] },
  { id: 4, name: "Yusuf Musa", service: "mechanic", location: "Abuja", area: "Wuse", rating: 4.6, jobs: 77, price: "₦6,000/hr", verified: false, available: true, img: "YM", bio: "Specialist in Toyota, Honda and general car repairs.", tags: ["Toyota", "Honda", "Diagnostics"] },
  { id: 5, name: "Tunde Fashola", service: "carpenter", location: "Lagos", area: "Surulere", rating: 5.0, jobs: 55, price: "₦7,000/hr", verified: true, available: true, img: "TF", bio: "Custom furniture, wardrobes, doors and general woodwork.", tags: ["Furniture", "Wardrobes", "Doors"] },
  { id: 6, name: "Ngozi Eze", service: "ac_repair", location: "Port Harcourt", area: "GRA", rating: 4.8, jobs: 134, price: "₦5,500/hr", verified: true, available: true, img: "NE", bio: "AC installation, servicing, gas refill and all brands repair.", tags: ["Installation", "Servicing", "Gas Refill"] },
  { id: 7, name: "Sola Adewale", service: "painter", location: "Ibadan", area: "Bodija", rating: 4.5, jobs: 66, price: "₦3,500/hr", verified: false, available: true, img: "SA", bio: "Interior and exterior painting, POP ceiling work.", tags: ["Interior", "Exterior", "POP"] },
  { id: 8, name: "Ifeanyi Obi", service: "generator", location: "Abuja", area: "Garki", rating: 4.9, jobs: 89, price: "₦4,000/hr", verified: true, available: false, img: "IO", bio: "Generator repairs, rewinding and maintenance. All brands.", tags: ["Repairs", "Rewinding", "Maintenance"] },
];

const COLORS = {
  "EO": "#7a4f00", "CN": "#1a3b6b", "BA": "#6b1a3b",
  "YM": "#5c4a00", "TF": "#4a3500", "NE": "#006b6b",
  "SA": "#6b3b1a", "IO": "#3b2800",
};

const SAMPLE_MESSAGES = {
  1: [
    { from: "provider", text: "Hello! I'm Emeka. How can I help you today?", time: "10:02 AM" },
  ],
};

export default function App() {
  const [view, setView] = useState("landing");
  const [dbProviders, setDbProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(true);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);
  const [bookingMessage, setBookingMessage] = useState("");
  const [bookingTarget, setBookingTarget] = useState(null);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingSending, setBookingSending] = useState(false);

  // Reviews state
  const [reviews, setReviews] = useState({});
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [hoverRating, setHoverRating] = useState(0);

  // Auth state
  const [user, setUser] = useState(null);
  const [authView, setAuthView] = useState("login"); // login | signup
  const [authEmail, setAuthEmail] = useState("");
  const [authPassword, setAuthPassword] = useState("");
  const [authName, setAuthName] = useState("");
  const [authRole, setAuthRole] = useState("customer"); // customer | provider
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [chatTarget, setChatTarget] = useState(null);
  const [messages, setMessages] = useState({});
  const [inputMsg, setInputMsg] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterAvailable, setFilterAvailable] = useState(false);
  const chatEndRef = useRef(null);

  // Registration form state
  const [regStep, setRegStep] = useState(1);
  const [regSuccess, setRegSuccess] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [form, setForm] = useState({
    name: "", phone: "", service: "", location: "", area: "",
    experience: "", bio: "", price: "", priceUnit: "hr"
  });
  const [formErrors, setFormErrors] = useState({});
  const [regLoading, setRegLoading] = useState(false);
  const fileInputRef = useRef(null);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setFormErrors(prev => ({ ...prev, [field]: "" }));
  };

  const validateStep = (step) => {
    const errors = {};
    if (step === 1) {
      if (!form.name.trim()) errors.name = "Full name is required";
      if (!form.phone.trim()) errors.phone = "Phone number is required";
      else if (!/^[0-9+\s]{10,14}$/.test(form.phone.trim())) errors.phone = "Enter a valid phone number";
    }
    if (step === 2) {
      if (!form.service) errors.service = "Select a service category";
      if (!form.location) errors.location = "Select your city";
      if (!form.area.trim()) errors.area = "Enter your area/neighbourhood";
    }
    if (step === 3) {
      if (!form.experience) errors.experience = "Select years of experience";
      if (!form.bio.trim()) errors.bio = "Write a short bio";
      else if (form.bio.trim().length < 20) errors.bio = "Bio must be at least 20 characters";
      if (!form.price.trim()) errors.price = "Enter your rate";
    }
    return errors;
  };

  const handleNextStep = () => {
    const errors = validateStep(regStep);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setRegStep(prev => prev + 1);
  };

  const handleSubmitReg = async () => {
    const errors = validateStep(3);
    if (Object.keys(errors).length > 0) { setFormErrors(errors); return; }
    setRegLoading(true);
    const { error } = await supabase.from("providers").insert([{
      name: form.name,
      phone: form.phone,
      service: form.service,
      location: form.location,
      area: form.area,
      experience: form.experience,
      bio: form.bio,
      price: form.price,
      price_unit: form.priceUnit,
      photo_url: photoPreview || null,
    }]);
    setRegLoading(false);
    if (error) { alert("Something went wrong. Please try again."); return; }
    setRegSuccess(true);
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (view === "chat" && chatTarget) {
      const init = SAMPLE_MESSAGES[chatTarget.id] || [
        { from: "provider", text: `Hi there! I'm ${chatTarget.name}. What service do you need?`, time: "Just now" }
      ];
      setMessages(prev => ({ ...prev, [chatTarget.id]: prev[chatTarget.id] || init }));
    }
  }, [view, chatTarget]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, view]);

  // Check existing session on load
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleSignup = async () => {
    if (!authName.trim()) { setAuthError("Enter your full name"); return; }
    if (!authEmail.trim()) { setAuthError("Enter your email"); return; }
    if (authPassword.length < 6) { setAuthError("Password must be at least 6 characters"); return; }
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signUp({
      email: authEmail,
      password: authPassword,
      options: { data: { full_name: authName, role: authRole } }
    });
    setAuthLoading(false);
    if (error) { setAuthError(error.message); return; }
    setView("home");
  };

  const handleLogin = async () => {
    if (!authEmail.trim()) { setAuthError("Enter your email"); return; }
    if (!authPassword.trim()) { setAuthError("Enter your password"); return; }
    setAuthLoading(true);
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({
      email: authEmail,
      password: authPassword,
    });
    setAuthLoading(false);
    if (error) { setAuthError("Invalid email or password"); return; }
    setView("home");
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setView("home");
  };

  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      const { data, error } = await supabase.from("providers").select("*").order("created_at", { ascending: false });
      if (!error && data) setDbProviders(data);
      setLoadingProviders(false);
    };
    fetchProviders();
  }, [regSuccess]);

  // Merge mock providers with real DB providers
  const allProviders = [
    ...PROVIDERS,
    ...dbProviders.map(p => ({
      id: p.id,
      name: p.name,
      service: p.service,
      location: p.location,
      area: p.area,
      rating: p.rating || 5.0,
      jobs: p.jobs || 0,
      price: `₦${p.price}/${p.price_unit}`,
      verified: p.verified || false,
      available: p.available !== false,
      img: p.name.split(" ").map(n => n[0]).join("").slice(0,2).toUpperCase(),
      bio: p.bio,
      tags: [p.service],
      photoUrl: p.photo_url,
      isReal: true,
    }))
  ];

  const filteredProviders = allProviders.filter(p => {
    const matchService = !selectedService || p.service === selectedService;
    const matchLocation = !selectedLocation || p.location === selectedLocation;
    const matchAvail = !filterAvailable || p.available;
    const matchSearch = !searchQuery || p.name.toLowerCase().includes(searchQuery.toLowerCase()) || (p.tags && p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase())));
    return matchService && matchLocation && matchAvail && matchSearch;
  });

  const sendMessage = () => {
    if (!inputMsg.trim() || !chatTarget) return;
    const now = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    setMessages(prev => ({
      ...prev,
      [chatTarget.id]: [...(prev[chatTarget.id] || []), { from: "user", text: inputMsg, time: now }]
    }));
    setInputMsg("");
    setTimeout(() => {
      const replies = [
        "Sure, I can handle that. When would you like me to come?",
        "Yes, I'm available. Can you share your address?",
        "That's within my scope. My rate is fixed for the first hour.",
        "No problem! I've done this many times. I can come tomorrow.",
      ];
      const reply = replies[Math.floor(Math.random() * replies.length)];
      const replyTime = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      setMessages(prev => ({
        ...prev,
        [chatTarget.id]: [...(prev[chatTarget.id] || []), { from: "provider", text: reply, time: replyTime }]
      }));
    }, 1200);
  };

  const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'DM Sans', sans-serif;
      background: #FAFAF7;
      color: #1A1400;
      min-height: 100vh;
      overflow-x: hidden;
    }

    .app { max-width: 100%; margin: 0 auto; min-height: 100vh; position: relative; background: #FAFAF7; }

    /* ── RESPONSIVE LAYOUT ── */
    @media (min-width: 768px) {
      .app { max-width: 100%; }

      /* Nav */
      .nav { padding: 16px 40px; }

      /* Hero */
      .hero { padding: 60px 40px 40px; max-width: 700px; margin: 0 auto; }
      .hero h1 { font-size: 42px; }

      /* Stats */
      .stats-row { max-width: 800px; margin: 0 auto; padding: 24px 40px 0; grid-template-columns: repeat(3, 1fr); }

      /* Section */
      .section { padding: 32px 40px 0; max-width: 900px; margin: 0 auto; }

      /* Services grid - 6 columns on desktop */
      .services-grid { grid-template-columns: repeat(6, 1fr); }

      /* Browse */
      .browse-header { padding: 20px 40px; max-width: 900px; margin: 0 auto; }
      .providers-list { padding: 8px 40px 100px; max-width: 900px; margin: 0 auto; display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px; }

      /* Provider cards in grid */
      .provider-card { margin-bottom: 0 !important; }

      /* Profile */
      .profile-hero { padding: 40px 40px 28px; }
      .profile-section { padding: 24px 40px; max-width: 700px; margin: 0 auto; }
      .profile-cta { padding: 24px 40px 60px; max-width: 700px; margin: 0 auto; }
      .profile-stats { max-width: 700px; margin: 0 auto; }

      /* Chat */
      .chat-header { padding: 16px 40px; max-width: 700px; margin: 0 auto; }
      .chat-body { padding: 24px 40px; max-width: 700px; margin: 0 auto; }
      .chat-input-area { padding: 16px 40px 32px; max-width: 700px; margin: 0 auto; }

      /* Bottom bar */
      .bottom-bar { max-width: 100%; background: rgba(250,250,247,0.97); padding: 12px 40px 16px; justify-content: center; gap: 40px; }
      .bottom-tab { padding: 8px 24px; }
      .bottom-tab-label { font-size: 12px; }

      /* Auth */
      .auth-container { max-width: 480px; margin: 0 auto; padding: 40px 40px 100px; }

      /* Register */
      .reg-container { max-width: 560px; margin: 0 auto; }

      /* Bookings */
      .bookings-container { max-width: 700px; margin: 0 auto; }

      /* Profile tab */
      .profile-tab-container { max-width: 600px; margin: 0 auto; }

      /* Booking modal */
      .booking-modal { max-width: 520px; margin: 0 auto; border-radius: 24px; margin-bottom: 40px; }
    }

    @media (min-width: 1024px) {
      .nav { padding: 18px 80px; }

      .hero { padding: 80px 80px 50px; max-width: 800px; }
      .hero h1 { font-size: 52px; }

      .stats-row { max-width: 1000px; padding: 28px 80px 0; }
      .section { padding: 40px 80px 0; max-width: 1100px; }
      .services-grid { grid-template-columns: repeat(6, 1fr); gap: 14px; }

      .browse-header { padding: 24px 80px; max-width: 1100px; }
      .providers-list { padding: 8px 80px 100px; max-width: 1100px; grid-template-columns: repeat(3, 1fr); }

      /* Landing page desktop */
      .bottom-bar { padding: 14px 80px 18px; gap: 60px; }
    }

    /* ── TOP NAV ── */
    .nav {
      position: sticky; top: 0; z-index: 100;
      background: rgba(250,250,247,0.96);
      backdrop-filter: blur(16px);
      padding: 14px 20px;
      display: flex; align-items: center; justify-content: space-between;
      border-bottom: 1px solid rgba(0,0,0,0.08);
    }
    .nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #1A1400; letter-spacing: -0.5px; }
    .nav-logo span { color: #D4A846; }
    .nav-back { display: flex; align-items: center; gap: 6px; color: #888; font-size: 14px; cursor: pointer; background: none; border: none; color: #777; }
    .nav-back:hover { color: #1A1400; }

    /* ── HOME ── */
    .hero {
      padding: 40px 20px 28px;
      background: linear-gradient(160deg, #FAFAF7 0%, #FFF8E7 100%);
    }
    .hero-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(212,168,70,0.1); border: 1px solid rgba(212,168,70,0.3);
      border-radius: 100px; padding: 4px 12px; font-size: 12px; color: #D4A846;
      margin-bottom: 16px; font-weight: 500;
    }
    .hero-badge::before { content: ''; }
    .hero h1 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; line-height: 1.15; margin-bottom: 10px; letter-spacing: -1px; }
    .hero h1 em { color: #D4A846; font-style: normal; }
    .hero p { color: #777; font-size: 14px; line-height: 1.6; margin-bottom: 24px; }

    .search-bar {
      display: flex; gap: 8px;
      background: rgba(0,0,0,0.04);
      border: 1px solid rgba(212,168,70,0.15);
      border-radius: 14px; padding: 10px 14px;
      align-items: center; margin-bottom: 12px;
    }
    .search-bar input {
      background: none; border: none; outline: none; color: #1A1400;
      font-size: 14px; flex: 1; font-family: 'DM Sans', sans-serif;
    }
    .search-bar input::placeholder { color: #999; }
    .search-bar-icon { color: #D4A846; font-size: 16px; }

    .location-row {
      display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px;
      scrollbar-width: none;
    }
    .location-row::-webkit-scrollbar { display: none; }
    .loc-chip {
      white-space: nowrap; padding: 6px 14px; border-radius: 100px;
      font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid rgba(212,168,70,0.2); color: #888;
      background: transparent; transition: all 0.2s;
    }
    .loc-chip.active { background: #D4A846; color: #0A0A0A; border-color: #D4A846; font-weight: 700; }

    /* ── SERVICES GRID ── */
    .section { padding: 24px 20px 0; }
    .section-title { font-family: 'Syne', sans-serif; font-size: 17px; font-weight: 700; margin-bottom: 14px; display: flex; align-items: center; justify-content: space-between; color: #1A1400; }
    .section-title span { font-family: 'DM Sans', sans-serif; font-size: 13px; font-weight: 400; color: #D4A846; cursor: pointer; }

    .services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .service-tile {
      background: #fff; border: 1px solid rgba(0,0,0,0.08);
      border-radius: 14px; padding: 14px 8px;
      display: flex; flex-direction: column; align-items: center; gap: 6px;
      cursor: pointer; transition: all 0.2s;
    }
    .service-tile:hover, .service-tile.active {
      background: rgba(212,168,70,0.12); border-color: rgba(212,168,70,0.4);
      transform: translateY(-2px);
    }
    .service-tile-icon { font-size: 22px; }
    .service-tile-label { font-size: 10px; font-weight: 500; color: #888; text-align: center; line-height: 1.2; }
    .service-tile.active .service-tile-label { color: #D4A846; }

    /* ── STATS ── */
    .stats-row { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; padding: 20px 20px 0; }
    .stat-card {
      background: rgba(212,168,70,0.06); border: 1px solid rgba(212,168,70,0.15);
      border-radius: 14px; padding: 16px 12px; text-align: center;
    }
    .stat-num { font-family: 'Syne', sans-serif; font-size: 22px; font-weight: 800; color: #D4A846; }
    .stat-label { font-size: 11px; color: #666; margin-top: 2px; }

    /* ── BROWSE ── */
    .browse-header { padding: 16px 20px; }
    .filter-row { display: flex; gap: 8px; overflow-x: auto; padding-bottom: 4px; scrollbar-width: none; }
    .filter-row::-webkit-scrollbar { display: none; }
    .filter-chip {
      white-space: nowrap; padding: 7px 14px; border-radius: 100px;
      font-size: 12px; font-weight: 500; cursor: pointer;
      border: 1px solid rgba(212,168,70,0.2); color: #888;
      background: transparent; transition: all 0.2s;
    }
    .filter-chip.active { background: #D4A846; color: #0A0A0A; border-color: #D4A846; font-weight: 700; }

    .providers-list { padding: 8px 20px 100px; display: flex; flex-direction: column; gap: 12px; }
    .provider-card {
      background: #fff; border: 1px solid rgba(0,0,0,0.08);
      border-radius: 18px; padding: 16px; cursor: pointer;
      transition: all 0.2s;
    }
    .provider-card:hover { border-color: rgba(212,168,70,0.4); background: rgba(212,168,70,0.03); }

    .provider-card-top { display: flex; gap: 12px; align-items: flex-start; margin-bottom: 10px; }
    .avatar {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
      color: #1A1400; flex-shrink: 0; border: 1px solid rgba(212,168,70,0.2);
    }
    .provider-info { flex: 1; }
    .provider-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 2px; display: flex; align-items: center; gap: 6px; }
    .verified-badge { background: #D4A846; color: #0A0A0A; font-size: 9px; font-weight: 700; padding: 2px 6px; border-radius: 100px; }
    .provider-sub { font-size: 12px; color: #666; }

    .provider-meta { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
    .rating { display: flex; align-items: center; gap: 4px; font-size: 13px; font-weight: 600; }
    .rating-star { color: #D4A846; margin-right: 3px; }
    .jobs { font-size: 12px; color: #666; }
    .price { font-size: 13px; font-weight: 600; color: #D4A846; margin-left: auto; }

    .avail-dot { width: 8px; height: 8px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
    .avail-dot.on { background: #D4A846; box-shadow: 0 0 6px #D4A846; }
    .avail-dot.off { background: #444; }

    .provider-tags { display: flex; gap: 6px; flex-wrap: wrap; }
    .tag { font-size: 11px; color: #888; background: rgba(0,0,0,0.04); border: 1px solid rgba(0,0,0,0.08); border-radius: 100px; padding: 3px 9px; }

    .chat-btn {
      width: 100%; margin-top: 12px; padding: 13px;
      background: #D4A846; color: #0A0A0A; border: none; border-radius: 12px;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 14px;
      cursor: pointer; transition: all 0.2s; letter-spacing: 0.02em;
    }
    .chat-btn:hover { background: #e8bc55; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(212,168,70,0.3); }
    .chat-btn:disabled { background: rgba(0,0,0,0.06); color: #aaa; cursor: not-allowed; transform: none; box-shadow: none; }

    /* ── PROFILE ── */
    .profile-hero {
      background: linear-gradient(160deg, #FFF8E7, #FAFAF7);
      padding: 24px 20px 20px;
      display: flex; flex-direction: column; align-items: center; text-align: center;
    }
    .avatar-lg {
      width: 80px; height: 80px; border-radius: 22px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px;
      color: #1A1400; margin-bottom: 14px;
      border: 2px solid rgba(212,168,70,0.4);
    }
    .profile-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 4px; }
    .profile-service { font-size: 13px; color: #D4A846; margin-bottom: 8px; font-weight: 500; }
    .profile-location { font-size: 13px; color: #666; }

    .profile-stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1px; background: rgba(212,168,70,0.1); border-top: 1px solid rgba(212,168,70,0.1); }
    .profile-stat { padding: 16px; text-align: center; background: #FAFAF7; }
    .profile-stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; color: #D4A846; }
    .profile-stat-label { font-size: 11px; color: #666; margin-top: 2px; }

    .profile-section { padding: 20px; border-bottom: 1px solid rgba(0,0,0,0.08); }
    .profile-section-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 0.08em; margin-bottom: 10px; }
    .bio-text { font-size: 14px; color: #666; line-height: 1.7; }
    .profile-tags { display: flex; gap: 8px; flex-wrap: wrap; }
    .profile-tag { font-size: 12px; color: #D4A846; background: rgba(212,168,70,0.1); border: 1px solid rgba(212,168,70,0.25); border-radius: 100px; padding: 5px 12px; }

    .profile-cta { padding: 20px; padding-bottom: 40px; }

    /* ── CHAT ── */
    .chat-header {
      padding: 14px 20px;
      display: flex; align-items: center; gap: 12px;
      border-bottom: 1px solid rgba(212,168,70,0.1);
    }
    .chat-avatar {
      width: 40px; height: 40px; border-radius: 12px;
      display: flex; align-items: center; justify-content: center;
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 13px;
      color: #1A1400; border: 1px solid rgba(212,168,70,0.2);
    }
    .chat-name { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
    .chat-status { font-size: 12px; color: #D4A846; }
    .chat-body { flex: 1; overflow-y: auto; padding: 20px 16px; display: flex; flex-direction: column; gap: 12px; }

    .msg { max-width: 78%; display: flex; flex-direction: column; gap: 3px; }
    .msg.user { align-self: flex-end; align-items: flex-end; }
    .msg.provider { align-self: flex-start; align-items: flex-start; }
    .msg-bubble { padding: 10px 14px; border-radius: 16px; font-size: 14px; line-height: 1.5; }
    .msg.user .msg-bubble { background: #D4A846; color: #0A0A0A; border-bottom-right-radius: 4px; font-weight: 500; }
    .msg.provider .msg-bubble { background: rgba(0,0,0,0.05); color: #1A1400; border-bottom-left-radius: 4px; }
    .msg-time { font-size: 10px; color: #999; }

    .chat-input-area {
      padding: 12px 16px 28px;
      border-top: 1px solid rgba(0,0,0,0.08);
      display: flex; gap: 10px; align-items: center;
      background: rgba(250,250,247,0.97);
    }
    .chat-input {
      flex: 1; background: rgba(0,0,0,0.04); border: 1px solid rgba(212,168,70,0.15);
      border-radius: 12px; padding: 10px 14px; color: #1A1400; font-size: 14px;
      font-family: 'DM Sans', sans-serif; outline: none;
    }
    .chat-input::placeholder { color: #999; }
    .send-btn {
      width: 42px; height: 42px; background: #D4A846; border: none; border-radius: 12px;
      cursor: pointer; font-size: 16px; display: flex; align-items: center; justify-content: center;
      transition: all 0.2s; flex-shrink: 0; color: #0A0A0A; font-weight: 800;
    }
    .send-btn:hover { background: #e8bc55; }

    .empty-state { padding: 60px 20px; text-align: center; }
    .empty-state-icon { font-size: 48px; margin-bottom: 16px; }
    .empty-state h3 { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 18px; margin-bottom: 8px; }
    .empty-state p { font-size: 14px; color: #888; }

    .bottom-bar {
      position: fixed; bottom: 0; left: 50%; transform: translateX(-50%);
      width: 100%; max-width: 430px;
      background: rgba(250,250,247,0.97); backdrop-filter: blur(16px);
      border-top: 1px solid rgba(0,0,0,0.08);
      display: flex; justify-content: space-around; padding: 10px 0 16px;
      z-index: 99;
    }
    .bottom-tab {
      display: flex; flex-direction: column; align-items: center; gap: 3px;
      cursor: pointer; color: #aaa; transition: color 0.2s; background: none; border: none;
      padding: 4px 16px;
    }
    .bottom-tab.active { color: #D4A846; }
    .bottom-tab-icon { font-size: 20px; }
    .bottom-tab-label { font-size: 10px; font-weight: 500; }

    .chat-container { display: flex; flex-direction: column; height: calc(100vh - 56px); }

    .gold-divider { height: 1px; background: linear-gradient(90deg, transparent, rgba(212,168,70,0.3), transparent); margin: 0 20px; }

    /* ── LANDING ── */
    .landing { min-height: 100vh; display: flex; flex-direction: column; background: #FAFAF7; overflow: hidden; }

    .landing-nav {
      padding: 18px 24px; display: flex; align-items: center; justify-content: space-between;
      position: absolute; top: 0; left: 0; right: 0; z-index: 10;
    }
    .landing-nav-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; color: #1A1400; }
    .landing-nav-logo span { color: #D4A846; }
    .landing-nav-btn {
      padding: 8px 18px; border: 1px solid rgba(212,168,70,0.4); border-radius: 100px;
      background: transparent; color: #D4A846; font-family: 'Syne', sans-serif;
      font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .landing-nav-btn:hover { background: rgba(212,168,70,0.1); }

    .landing-hero {
      flex: 1; display: flex; flex-direction: column; align-items: center;
      justify-content: center; text-align: center; padding: 100px 24px 40px;
      background: radial-gradient(ellipse 80% 60% at 50% 0%, rgba(212,168,70,0.12) 0%, transparent 70%);
      position: relative;
    }
    .landing-hero::before {
      content: ''; position: absolute; inset: 0;
      background: radial-gradient(ellipse 40% 40% at 50% 100%, rgba(212,168,70,0.06) 0%, transparent 70%);
    }
    .landing-badge {
      display: inline-flex; align-items: center; gap: 6px;
      background: rgba(212,168,70,0.1); border: 1px solid rgba(212,168,70,0.3);
      border-radius: 100px; padding: 5px 14px; font-size: 12px; color: #D4A846;
      margin-bottom: 24px; font-weight: 600; letter-spacing: 0.02em;
      animation: fadeUp 0.6s ease forwards;
    }
    .landing-h1 {
      font-family: 'Syne', sans-serif; font-weight: 800; font-size: 42px;
      line-height: 1.1; letter-spacing: -1.5px; margin-bottom: 16px;
      animation: fadeUp 0.6s ease 0.1s both;
    }
    .landing-h1 em { color: #D4A846; font-style: normal; display: block; }
    .landing-p {
      font-size: 15px; color: #888; line-height: 1.7; max-width: 320px;
      margin: 0 auto 36px; animation: fadeUp 0.6s ease 0.2s both;
    }
    .landing-cta-row {
      display: flex; flex-direction: column; gap: 12px; width: 100%; max-width: 320px;
      animation: fadeUp 0.6s ease 0.3s both;
    }
    .landing-cta-primary {
      width: 100%; padding: 16px; background: #D4A846; color: #0A0A0A;
      border: none; border-radius: 14px; font-family: 'Syne', sans-serif;
      font-weight: 800; font-size: 16px; cursor: pointer; transition: all 0.2s;
      letter-spacing: 0.02em;
    }
    .landing-cta-primary:hover { background: #e8bc55; transform: translateY(-2px); box-shadow: 0 8px 30px rgba(212,168,70,0.3); }
    .landing-cta-secondary {
      width: 100%; padding: 15px; background: transparent; color: #1A1400;
      border: 1px solid rgba(0,0,0,0.1); border-radius: 14px;
      font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px;
      cursor: pointer; transition: all 0.2s;
    }
    .landing-cta-secondary:hover { border-color: rgba(212,168,70,0.4); color: #D4A846; }

    .landing-stats {
      display: grid; grid-template-columns: repeat(3, 1fr);
      gap: 1px; background: rgba(212,168,70,0.1);
      border-top: 1px solid rgba(0,0,0,0.08);
      border-bottom: 1px solid rgba(0,0,0,0.08);
      animation: fadeUp 0.6s ease 0.4s both;
    }
    .landing-stat { padding: 20px 12px; text-align: center; background: #FAFAF7; }
    .landing-stat-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; color: #D4A846; }
    .landing-stat-label { font-size: 11px; color: #666; margin-top: 3px; }

    .landing-features { padding: 36px 24px; display: flex; flex-direction: column; gap: 14px; }
    .landing-feature {
      display: flex; align-items: flex-start; gap: 14px;
      background: rgba(0,0,0,0.03); border: 1px solid rgba(212,168,70,0.1);
      border-radius: 16px; padding: 16px;
    }
    .landing-feature-icon { font-size: 24px; flex-shrink: 0; }
    .landing-feature-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; margin-bottom: 4px; }
    .landing-feature-desc { font-size: 13px; color: #777; line-height: 1.5; }

    .landing-services { padding: 0 24px 36px; }
    .landing-services-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 16px; text-align: center; }
    .landing-services-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; }
    .landing-service-pill {
      background: rgba(212,168,70,0.07); border: 1px solid rgba(212,168,70,0.12);
      border-radius: 12px; padding: 12px 6px;
      display: flex; flex-direction: column; align-items: center; gap: 5px;
    }
    .landing-service-pill-icon { font-size: 20px; }
    .landing-service-pill-label { font-size: 10px; color: #888; text-align: center; font-weight: 500; }

    .landing-footer {
      padding: 24px; text-align: center; border-top: 1px solid rgba(0,0,0,0.08);
    }
    .landing-footer-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 18px; margin-bottom: 6px; }
    .landing-footer-logo span { color: #D4A846; }
    .landing-footer-text { font-size: 12px; color: #999; }

    .landing-bottom-cta {
      padding: 20px 24px 40px; display: flex; flex-direction: column; gap: 10px;
      border-top: 1px solid rgba(0,0,0,0.08);
    }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }

    /* ── REVIEWS ── */
    .reviews-section { padding: 20px; border-bottom: 1px solid rgba(0,0,0,0.08); }
    .reviews-header { display: flex; align-items: center; justify-content: space-between; margin-bottom: 14px; }
    .reviews-title { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; color: #666; text-transform: uppercase; letter-spacing: 0.08em; }
    .write-review-btn { padding: 6px 14px; background: rgba(212,168,70,0.1); border: 1px solid rgba(212,168,70,0.3); border-radius: 100px; font-size: 12px; color: #D4A846; font-weight: 600; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all 0.2s; }
    .write-review-btn:hover { background: rgba(212,168,70,0.2); }

    .review-card { padding: 14px 0; border-bottom: 1px solid rgba(0,0,0,0.06); }
    .review-card:last-child { border-bottom: none; }
    .review-card-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 6px; }
    .review-author { font-weight: 600; font-size: 14px; color: #1A1400; }
    .review-date { font-size: 11px; color: #aaa; }
    .review-stars { display: flex; gap: 2px; margin-bottom: 6px; }
    .review-star { color: #D4A846; }
    .review-star.empty { color: #ddd; }
    .review-comment { font-size: 13px; color: #777; line-height: 1.6; }
    .no-reviews { font-size: 13px; color: #aaa; text-align: center; padding: 20px 0; }

    .rating-summary { display: flex; align-items: center; gap: 12px; padding: 16px; background: rgba(212,168,70,0.06); border-radius: 14px; margin-bottom: 16px; border: 1px solid rgba(212,168,70,0.15); }
    .rating-big-num { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 36px; color: #D4A846; }
    .rating-summary-right { flex: 1; }
    .rating-summary-stars { display: flex; gap: 3px; margin-bottom: 4px; }
    .rating-count { font-size: 12px; color: #888; }

    /* ── REVIEW MODAL ── */
    .review-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
    .review-modal { background: #FAFAF7; border: 1px solid rgba(0,0,0,0.1); border-radius: 24px 24px 0 0; padding: 28px 24px 40px; width: 100%; max-width: 430px; }
    .review-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 4px; color: #1A1400; }
    .review-modal-sub { font-size: 13px; color: #888; margin-bottom: 24px; }
    .star-picker { display: flex; gap: 8px; margin-bottom: 20px; justify-content: center; }
    .star-pick { font-size: 36px; cursor: pointer; transition: transform 0.15s; color: #ddd; }
    .star-pick.active { color: #D4A846; }
    .star-pick:hover { transform: scale(1.2); }
    .rating-label { text-align: center; font-size: 13px; color: #888; margin-bottom: 16px; font-weight: 500; min-height: 20px; }

    /* ── AUTH ── */
    .auth-container { padding: 40px 24px 100px; display: flex; flex-direction: column; min-height: calc(100vh - 56px); }
    .auth-logo { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 32px; margin-bottom: 6px; }
    .auth-logo span { color: #D4A846; }
    .auth-tagline { font-size: 13px; color: #666; margin-bottom: 36px; }
    .auth-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; margin-bottom: 6px; }
    .auth-sub { font-size: 13px; color: #777; margin-bottom: 28px; }

    .role-toggle { display: flex; background: rgba(0,0,0,0.04); border: 1px solid rgba(212,168,70,0.15); border-radius: 12px; padding: 4px; margin-bottom: 20px; gap: 4px; }
    .role-btn { flex: 1; padding: 10px; border: none; border-radius: 9px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; background: transparent; color: #666; }
    .role-btn.active { background: #D4A846; color: #0A0A0A; }

    .auth-error { background: rgba(255,80,80,0.1); border: 1px solid rgba(255,80,80,0.3); border-radius: 10px; padding: 10px 14px; font-size: 13px; color: #ff8080; margin-bottom: 16px; }

    .auth-divider { display: flex; align-items: center; gap: 12px; margin: 20px 0; }
    .auth-divider-line { flex: 1; height: 1px; background: rgba(0,0,0,0.06); }
    .auth-divider-text { font-size: 12px; color: #999; }

    .auth-switch { text-align: center; font-size: 13px; color: #666; margin-top: 20px; }
    .auth-switch span { color: #D4A846; font-weight: 600; cursor: pointer; }

    /* ── USER PROFILE TAB ── */
    .profile-tab-container { padding: 24px 20px 100px; }
    .profile-tab-header { display: flex; flex-direction: column; align-items: center; padding: 28px 20px; background: linear-gradient(160deg, #FFF8E7, #FAFAF7); border-radius: 20px; margin-bottom: 20px; text-align: center; }
    .profile-tab-avatar { width: 72px; height: 72px; border-radius: 20px; background: #D4A846; display: flex; align-items: center; justify-content: center; font-family: 'Syne', sans-serif; font-weight: 800; font-size: 24px; color: #0A0A0A; margin-bottom: 14px; }
    .profile-tab-name { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 4px; }
    .profile-tab-email { font-size: 13px; color: #666; margin-bottom: 8px; }
    .profile-tab-role { font-size: 11px; background: rgba(212,168,70,0.15); color: #D4A846; border: 1px solid rgba(212,168,70,0.25); padding: 3px 10px; border-radius: 100px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; }
    .profile-tab-menu { display: flex; flex-direction: column; gap: 10px; }
    .profile-menu-item { display: flex; align-items: center; gap: 14px; background: rgba(0,0,0,0.03); border: 1px solid rgba(212,168,70,0.1); border-radius: 14px; padding: 16px; cursor: pointer; transition: all 0.2s; }
    .profile-menu-item:hover { border-color: rgba(212,168,70,0.3); background: rgba(212,168,70,0.05); }
    .profile-menu-icon { font-size: 20px; }
    .profile-menu-label { font-size: 14px; font-weight: 500; flex: 1; }
    .profile-menu-arrow { color: #999; font-size: 14px; }
    .logout-btn { width: 100%; margin-top: 16px; padding: 14px; background: rgba(255,80,80,0.1); color: #ff8080; border: 1px solid rgba(255,80,80,0.2); border-radius: 12px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 14px; cursor: pointer; transition: all 0.2s; }
    .logout-btn:hover { background: rgba(255,80,80,0.2); }

    /* ── BOOKINGS ── */
    .bookings-container { padding: 20px 20px 100px; }
    .bookings-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 22px; margin-bottom: 4px; }
    .bookings-sub { font-size: 13px; color: #666; margin-bottom: 20px; }
    .booking-card { background: rgba(0,0,0,0.03); border: 1px solid rgba(212,168,70,0.12); border-radius: 16px; padding: 16px; margin-bottom: 12px; }
    .booking-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px; }
    .booking-provider { font-family: 'Syne', sans-serif; font-weight: 700; font-size: 15px; }
    .booking-service { font-size: 12px; color: #888; margin-top: 2px; }
    .booking-status { font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: 100px; text-transform: uppercase; letter-spacing: 0.05em; }
    .booking-status.pending { background: rgba(212,168,70,0.15); color: #D4A846; }
    .booking-status.accepted { background: rgba(0,200,100,0.15); color: #00c864; }
    .booking-status.declined { background: rgba(255,80,80,0.15); color: #ff8080; }
    .booking-message { font-size: 13px; color: #aaa; line-height: 1.6; padding: 10px 12px; background: rgba(0,0,0,0.03); border-radius: 10px; margin-bottom: 10px; }
    .booking-meta { font-size: 11px; color: #999; }
    .booking-actions { display: flex; gap: 8px; margin-top: 12px; }
    .booking-accept-btn { flex: 1; padding: 10px; background: rgba(0,200,100,0.15); color: #00c864; border: 1px solid rgba(0,200,100,0.25); border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .booking-accept-btn:hover { background: rgba(0,200,100,0.25); }
    .booking-decline-btn { flex: 1; padding: 10px; background: rgba(255,80,80,0.1); color: #ff8080; border: 1px solid rgba(255,80,80,0.2); border-radius: 10px; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; cursor: pointer; transition: all 0.2s; }
    .booking-decline-btn:hover { background: rgba(255,80,80,0.2); }

    /* ── BOOKING REQUEST MODAL ── */
    .booking-modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); backdrop-filter: blur(6px); z-index: 200; display: flex; align-items: flex-end; justify-content: center; }
    .booking-modal { background: #FFFFF5; border: 1px solid rgba(212,168,70,0.2); border-radius: 24px 24px 0 0; padding: 28px 24px 40px; width: 100%; max-width: 430px; }
    .booking-modal-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 4px; }
    .booking-modal-sub { font-size: 13px; color: #777; margin-bottom: 20px; }
    .booking-modal-success { text-align: center; padding: 20px 0; }
    .booking-modal-success-icon { font-size: 48px; margin-bottom: 12px; }
    .booking-modal-success-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 20px; margin-bottom: 6px; }
    .booking-modal-success-sub { font-size: 13px; color: #777; }

    /* ── REGISTER ── */
    .reg-container { padding: 24px 20px 100px; }
    .reg-header { margin-bottom: 28px; }
    .reg-header h2 { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; margin-bottom: 6px; letter-spacing: -0.5px; }
    .reg-header p { font-size: 13px; color: #777; line-height: 1.5; }

    .reg-steps { display: flex; align-items: center; gap: 6px; margin-bottom: 28px; }
    .reg-step-dot {
      height: 4px; border-radius: 100px; transition: all 0.3s; flex: 1;
    }
    .reg-step-dot.done { background: #D4A846; }
    .reg-step-dot.active { background: #D4A846; opacity: 0.5; }
    .reg-step-dot.pending { background: rgba(255,255,255,0.1); }
    .reg-step-label { font-size: 11px; color: #666; margin-bottom: 20px; }
    .reg-step-label span { color: #D4A846; font-weight: 600; }

    .field-group { margin-bottom: 18px; }
    .field-label { font-size: 12px; font-weight: 600; color: #888; text-transform: uppercase; letter-spacing: 0.06em; margin-bottom: 8px; display: block; }
    .field-input {
      width: 100%; background: rgba(0,0,0,0.04); border: 1px solid rgba(212,168,70,0.15);
      border-radius: 12px; padding: 12px 14px; color: #1A1400; font-size: 14px;
      font-family: 'DM Sans', sans-serif; outline: none; transition: border-color 0.2s;
    }
    .field-input:focus { border-color: rgba(212,168,70,0.5); background: rgba(212,168,70,0.04); }
    .field-input.error { border-color: rgba(255,80,80,0.5); }
    .field-input::placeholder { color: #aaa; }
    .field-error { font-size: 11px; color: #ff6b6b; margin-top: 5px; }

    .field-select {
      width: 100%; background: rgba(0,0,0,0.04); border: 1px solid rgba(212,168,70,0.15);
      border-radius: 12px; padding: 12px 14px; color: #1A1400; font-size: 14px;
      font-family: 'DM Sans', sans-serif; outline: none; appearance: none;
      cursor: pointer; transition: border-color 0.2s;
    }
    .field-select:focus { border-color: rgba(212,168,70,0.5); }
    .field-select.error { border-color: rgba(255,80,80,0.5); }
    .field-select option { background: #FFF8E7; color: #1A1400; }

    .field-textarea {
      width: 100%; background: rgba(0,0,0,0.04); border: 1px solid rgba(212,168,70,0.15);
      border-radius: 12px; padding: 12px 14px; color: #1A1400; font-size: 14px;
      font-family: 'DM Sans', sans-serif; outline: none; resize: none; min-height: 100px;
      transition: border-color 0.2s; line-height: 1.6;
    }
    .field-textarea:focus { border-color: rgba(212,168,70,0.5); background: rgba(212,168,70,0.04); }
    .field-textarea.error { border-color: rgba(255,80,80,0.5); }
    .field-textarea::placeholder { color: #aaa; }
    .char-count { font-size: 11px; color: #999; text-align: right; margin-top: 4px; }

    .price-row { display: flex; gap: 10px; }
    .price-row .field-input { flex: 1; }
    .price-unit-toggle { display: flex; border: 1px solid rgba(212,168,70,0.2); border-radius: 12px; overflow: hidden; }
    .price-unit-btn {
      padding: 12px 14px; background: transparent; border: none; color: #888;
      font-family: 'DM Sans', sans-serif; font-size: 13px; cursor: pointer; transition: all 0.2s;
    }
    .price-unit-btn.active { background: #D4A846; color: #0A0A0A; font-weight: 700; }

    .photo-upload {
      border: 2px dashed rgba(212,168,70,0.25); border-radius: 16px;
      padding: 28px 20px; text-align: center; cursor: pointer;
      transition: all 0.2s; background: rgba(212,168,70,0.03);
    }
    .photo-upload:hover { border-color: rgba(212,168,70,0.5); background: rgba(212,168,70,0.06); }
    .photo-upload-icon { font-size: 32px; margin-bottom: 8px; }
    .photo-upload-text { font-size: 13px; color: #888; }
    .photo-upload-text span { color: #D4A846; font-weight: 600; }
    .photo-preview {
      width: 90px; height: 90px; border-radius: 20px; object-fit: cover;
      border: 2px solid rgba(212,168,70,0.4); margin: 0 auto 8px; display: block;
    }
    .photo-change { font-size: 12px; color: #D4A846; cursor: pointer; }

    .reg-btn {
      width: 100%; padding: 14px; background: #D4A846; color: #0A0A0A;
      border: none; border-radius: 12px; font-family: 'Syne', sans-serif;
      font-weight: 800; font-size: 15px; cursor: pointer; transition: all 0.2s;
      margin-top: 8px; letter-spacing: 0.02em;
    }
    .reg-btn:hover { background: #e8bc55; transform: translateY(-1px); box-shadow: 0 4px 20px rgba(212,168,70,0.3); }
    .reg-btn-outline {
      width: 100%; padding: 13px; background: transparent; color: #888;
      border: 1px solid rgba(0,0,0,0.1); border-radius: 12px;
      font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer;
      transition: all 0.2s; margin-top: 10px;
    }
    .reg-btn-outline:hover { color: #1A1400; border-color: rgba(255,255,255,0.2); }

    .success-screen { padding: 60px 24px; text-align: center; }
    .success-icon { font-size: 64px; margin-bottom: 20px; }
    .success-title { font-family: 'Syne', sans-serif; font-weight: 800; font-size: 26px; margin-bottom: 10px; }
    .success-sub { font-size: 14px; color: #888; line-height: 1.7; margin-bottom: 32px; }
    .success-card {
      background: rgba(212,168,70,0.1); border: 1px solid rgba(212,168,70,0.2);
      border-radius: 18px; padding: 20px; text-align: left; margin-bottom: 24px;
    }
    .success-card-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid rgba(0,0,0,0.08); font-size: 13px; }
    .success-card-row:last-child { border-bottom: none; }
    .success-card-label { color: #777; }
    .success-card-value { color: #1A1400; font-weight: 500; }
  `;

  const fetchBookings = async () => {
    if (!user) return;
    setLoadingBookings(true);
    const { data, error } = await supabase
      .from("bookings")
      .select("*")
      .or(`customer_id.eq.${user.id},provider_id.eq.${user.id}`)
      .order("created_at", { ascending: false });
    if (!error && data) setBookings(data);
    setLoadingBookings(false);
  };

  useEffect(() => {
    if (user) fetchBookings();
  }, [user]);

  useEffect(() => {
    if (view === "profile" && selectedProvider) {
      fetchReviews(selectedProvider.id);
    }
  }, [view, selectedProvider]);

  const sendBooking = async () => {
    if (!user) { setView("auth"); setAuthView("login"); return; }
    if (!bookingMessage.trim()) return;
    setBookingSending(true);
    const { error } = await supabase.from("bookings").insert([{
      customer_id: user.id,
      customer_name: user.user_metadata?.full_name || "Customer",
      customer_email: user.email,
      provider_id: String(bookingTarget.id),
      provider_name: bookingTarget.name,
      service: bookingTarget.service,
      location: bookingTarget.location,
      message: bookingMessage,
      status: "pending",
    }]);
    setBookingSending(false);
    if (error) { alert("Something went wrong. Try again."); return; }
    setBookingSuccess(true);
    setBookingMessage("");
    fetchBookings();
  };

  const updateBookingStatus = async (bookingId, status) => {
    await supabase.from("bookings").update({ status }).eq("id", bookingId);
    fetchBookings();
  };

  const fetchReviews = async (providerId) => {
    const { data, error } = await supabase
      .from("reviews")
      .select("*")
      .eq("provider_id", String(providerId))
      .order("created_at", { ascending: false });
    if (!error && data) {
      setReviews(prev => ({ ...prev, [providerId]: data }));
    }
  };

  const submitReview = async () => {
    if (!user) { setView("auth"); setAuthView("login"); return; }
    if (reviewRating === 0) return;
    setReviewSubmitting(true);
    const { error } = await supabase.from("reviews").insert([{
      provider_id: String(reviewTarget.id),
      customer_id: user.id,
      customer_name: user.user_metadata?.full_name || "Anonymous",
      rating: reviewRating,
      comment: reviewComment,
    }]);
    setReviewSubmitting(false);
    if (error) { alert("Something went wrong. Try again."); return; }
    setReviewSuccess(true);
    fetchReviews(reviewTarget.id);
  };

  const getAverageRating = (providerId) => {
    const provReviews = reviews[providerId] || [];
    if (provReviews.length === 0) return null;
    const avg = provReviews.reduce((sum, r) => sum + r.rating, 0) / provReviews.length;
    return avg.toFixed(1);
  };

  const serviceLabel = (id) => SERVICES.find(s => s.id === id)?.label || id;

  return (
    <>
      <style>{styles}</style>
      <div className="app">

        {/* NAV */}
        {view !== "landing" && (
          <div className="nav">
          {view === "home" || view === "browse" || view === "register" || view === "auth" || view === "userprofile" || view === "bookings" ? (
            <div className="nav-logo">Handy<span>NG</span></div>
          ) : (
<button className="nav-back" onClick={() => setView(view === "chat" ? "profile" : "browse")}>
              <ArrowLeft size={16} strokeWidth={2} style={{marginRight:4}}/> Back
            </button>
          )}
          {(view === "home" || view === "browse") && (
            <div style={{ fontSize: 13, color: "#888" }}>🇳🇬 Nigeria</div>
          )}
          {view === "register" && (
            <div style={{ fontSize: 13, color: "#D4A846" }}>Provider Sign Up</div>
          )}
          {view === "bookings" && (
            <div style={{ fontSize: 13, color: "#666" }}>My Bookings</div>
          )}
          {view === "profile" && selectedProvider && (
            <div style={{ fontSize: 13, color: "#666" }}>{serviceLabel(selectedProvider.service)}</div>
          )}
          {view === "chat" && chatTarget && (
            <div style={{ fontSize: 13, color: "#D4A846", display:"flex", alignItems:"center", gap:4 }}><Lock size={13} strokeWidth={2}/>Secure Chat</div>
          )}
        </div>
        )}

        {/* ── LANDING ── */}
        {view === "landing" && (
          <div style={{ overflowY: "auto", height: "100vh", background: "#FAFAF7" }}>

            {/* NAV */}
            <div style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(250,250,247,0.96)", backdropFilter: "blur(16px)", borderBottom: "1px solid rgba(0,0,0,0.08)", padding: "14px 20px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, color: "#1A1400" }}>Handy<span style={{ color: "#D4A846" }}>NG</span></div>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => { setAuthView("login"); setView("auth"); }} style={{ padding: "8px 16px", background: "transparent", border: "1px solid rgba(212,168,70,0.35)", borderRadius: 100, color: "#D4A846", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Log In</button>
                <button onClick={() => { setAuthView("signup"); setView("auth"); }} style={{ padding: "8px 16px", background: "#D4A846", border: "none", borderRadius: 100, color: "#0A0A0A", fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 13, cursor: "pointer" }}>Sign Up</button>
              </div>
            </div>

            {/* HERO */}
            <div style={{ background: "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(212,168,70,0.14) 0%, transparent 65%)", padding: "52px 24px 40px", textAlign: "center" }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(212,168,70,0.1)", border: "1px solid rgba(212,168,70,0.3)", borderRadius: 100, padding: "5px 14px", fontSize: 12, color: "#D4A846", marginBottom: 20, fontWeight: 600 }}>Nigeria's #1 Service Marketplace</div>
              <h1 style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: "clamp(36px, 6vw, 64px)", lineHeight: 1.1, letterSpacing: -1, marginBottom: 14, color: "#1A1400" }}>
                List. Find. <span style={{ color: "#D4A846" }}>Connect.</span>
              </h1>
              <p style={{ fontSize: 14, color: "#666", lineHeight: 1.7, maxWidth: 300, margin: "0 auto 28px" }}>
                A meeting point for skilled service providers and customers across Nigeria.
              </p>

              {/* Search bar */}
              <div style={{ display: "flex", gap: 0, background: "#fff", borderRadius: 14, overflow: "hidden", maxWidth: "min(560px, 90vw)", margin: "0 auto 16px", boxShadow: "0 4px 30px rgba(212,168,70,0.2)" }}>
                <input
                  placeholder="What service do you need?"
                  style={{ flex: 1, border: "none", outline: "none", padding: "14px 16px", fontSize: 14, fontFamily: "DM Sans, sans-serif", color: "#0A0A0A", background: "transparent" }}
                  onFocus={() => setView("browse")}
                />
                <button onClick={() => setView("browse")} style={{ padding: "14px 20px", background: "#D4A846", border: "none", cursor: "pointer", display:"flex", alignItems:"center", justifyContent:"center" }}><Search size={20} strokeWidth={2} color="#0A0A0A" /></button>
              </div>

              {/* Popular tags */}
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "center", marginBottom: 32 }}>
                {["Electrician", "Plumber", "Cleaner", "Mechanic", "Carpenter"].map(s => (
                  <button key={s} onClick={() => { setSelectedService(SERVICES.find(x => x.label === s)?.id || ""); setView("browse"); }} style={{ padding: "6px 14px", background: "rgba(212,168,70,0.08)", border: "1px solid rgba(212,168,70,0.2)", borderRadius: 100, fontSize: 12, color: "#D4A846", cursor: "pointer", fontWeight: 500 }}>{s}</button>
                ))}
              </div>

              {/* Stats */}
              <div style={{ display: "flex", justifyContent: "center", gap: 32 }}>
                {[["1,200+", "Providers"], ["8", "Cities"], ["4.8★", "Avg Rating"]].map(([num, label]) => (
                  <div key={label} style={{ textAlign: "center" }}>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 22, color: "#D4A846" }}>{num}</div>
                    <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* CATEGORIES */}
            <div style={{ padding: "clamp(24px, 4vw, 60px) clamp(20px, 8vw, 120px) 0", background: "#FAFAF7" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, color: "#1A1400" }}>Featured Categories</div>
                <span onClick={() => setView("browse")} style={{ fontSize: 13, color: "#D4A846", cursor: "pointer" }}>View All</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", gap: 10 }}>
                {[
                  { id: "electrician", label: "Electrician", bg: "#FFF8E7", color: "#D4A846" },
                  { id: "plumber", label: "Plumber", bg: "#EFF4FF", color: "#4A7FD4" },
                  { id: "carpenter", label: "Carpenter", bg: "#FFF3E7", color: "#D4804A" },
                  { id: "cleaner", label: "Cleaner", bg: "#EFFFF2", color: "#4AD47A" },
                  { id: "mechanic", label: "Mechanic", bg: "#FFF8E0", color: "#D4B84A" },
                  { id: "ac_repair", label: "AC Repair", bg: "#EFF8FF", color: "#4AB8D4" },
                ].map(cat => {
                  const Icon = SERVICE_ICONS[cat.id];
                  return (
                  <div key={cat.id} onClick={() => { setSelectedService(cat.id); setView("browse"); }}
                    style={{ background: cat.bg, border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "20px 12px", textAlign: "center", cursor: "pointer", transition: "all 0.2s" }}>
                    <div style={{ marginBottom: 8, display:"flex", justifyContent:"center" }}>{Icon && <Icon size={28} strokeWidth={1.6} color={cat.color} />}</div>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "#555" }}>{cat.label}</div>
                  </div>
                )})}
              </div>
            </div>

            {/* HOW IT WORKS */}
            <div style={{ padding: "clamp(24px, 4vw, 60px) clamp(20px, 8vw, 120px) 0", background: "#FAFAF7", maxWidth: "100%" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 6, textAlign: "center", color: "#1A1400" }}>How HandyNG Works</div>
              <div style={{ fontSize: 13, color: "#666", textAlign: "center", marginBottom: 24 }}>Simple. Fast. Reliable.</div>
              {[
                { num: "01", title: "Find a Provider", desc: "Search by service and city. Browse verified profiles with ratings and reviews.", Icon: Search },
                { num: "02", title: "Connect & Chat", desc: "Message providers directly in-app. No need to share your phone number.", Icon: Phone },
                { num: "03", title: "Book & Get it Done", desc: "Send a booking request, agree on details, and get the job done.", Icon: CheckCircle },
              ].map(step => (
                <div key={step.num} style={{ display: "flex", gap: 16, alignItems: "flex-start", marginBottom: 20, background: "#fff", border: "1px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: 16 }}>
                  <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(212,168,70,0.15)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{step.Icon && <step.Icon size={22} strokeWidth={1.8} color="#D4A846" />}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "#D4A846", fontWeight: 700, marginBottom: 4 }}>{step.num}</div>
                    <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 15, marginBottom: 4, color: "#1A1400" }}>{step.title}</div>
                    <div style={{ fontSize: 13, color: "#777", lineHeight: 1.6 }}>{step.desc}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* ARE YOU A PROVIDER */}
            <div style={{ margin: "32px 20px 0", background: "linear-gradient(135deg, rgba(212,168,70,0.12), rgba(212,168,70,0.04))", border: "1px solid rgba(212,168,70,0.25)", borderRadius: 20, padding: "28px 20px", textAlign: "center" }}>
              <div style={{ marginBottom: 12, display:"flex", justifyContent:"center" }}><Wrench size={36} strokeWidth={1.6} color="#D4A846" /></div>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Are you a service provider?</div>
              <div style={{ fontSize: 13, color: "#888", lineHeight: 1.7, marginBottom: 20 }}>Join thousands of skilled professionals already earning on HandyNG. Register for free and start getting hired today.</div>
              <button onClick={() => { setView("register"); setRegStep(1); setRegSuccess(false); }} style={{ padding: "13px 28px", background: "#D4A846", border: "none", borderRadius: 12, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 14, color: "#0A0A0A", cursor: "pointer" }}>Register as a Provider</button>
            </div>

            {/* BOTTOM CTA */}
            <div style={{ padding: "clamp(24px, 4vw, 48px) clamp(20px, 8vw, 120px) 20px", display: "flex", flexDirection: "row", gap: 12, background: "#FAFAF7", justifyContent: "center", flexWrap: "wrap" }}>
              <button onClick={() => { setAuthView("signup"); setView("auth"); }} style={{ flex: "1 1 200px", maxWidth: 280, padding: 15, background: "#D4A846", border: "none", borderRadius: 14, fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 15, color: "#0A0A0A", cursor: "pointer" }}>Get Started — It's Free</button>
              <button onClick={() => setView("home")} style={{ flex: "1 1 200px", maxWidth: 280, padding: 14, background: "transparent", border: "1px solid rgba(0,0,0,0.1)", borderRadius: 14, fontFamily: "Syne, sans-serif", fontWeight: 700, fontSize: 14, color: "#888", cursor: "pointer" }}>Browse Without Account</button>
            </div>

            {/* FOOTER */}
            <div style={{ padding: "clamp(20px, 4vw, 40px) clamp(24px, 8vw, 120px) 40px", borderTop: "1px solid rgba(0,0,0,0.08)", textAlign: "center", background: "#FAFAF7" }}>
              <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 18, marginBottom: 6, color: "#1A1400" }}>Handy<span style={{ color: "#D4A846" }}>NG</span></div>
              <div style={{ fontSize: 12, color: "#888", marginBottom: 12 }}>Nigeria's Trusted Service Network</div>
              <div style={{ fontSize: 11, color: "#aaa" }}>© {new Date().getFullYear()} HandyNG. All rights reserved.</div>
            </div>

          </div>
        )}

        {/* ── HOME ── */}        {/* ── HOME ── */}
        {view === "home" && (
          <div style={{ paddingBottom: 80 }}>
            <div className="hero">
              <div className="hero-badge">Nigeria's Trusted Service Network</div>
              <h1>Find skilled hands <em>near you.</em></h1>
              <p>Connect with verified electricians, plumbers, mechanics and more — in your city, ready today.</p>
              <div className="search-bar">
                <Search size={16} strokeWidth={2} style={{color:"#D4A846", flexShrink:0}} />
                <input
                  placeholder="Search service or provider..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setView("browse")}
                />
              </div>
              <div className="location-row">
                {LOCATIONS.map(loc => (
                  <button key={loc} className={`loc-chip ${selectedLocation === loc ? "active" : ""}`}
                    onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            <div className="stats-row">
              <div className="stat-card"><div className="stat-num">1,200+</div><div className="stat-label">Providers</div></div>
              <div className="stat-card"><div className="stat-num">8</div><div className="stat-label">Cities</div></div>
              <div className="stat-card"><div className="stat-num">4.8★</div><div className="stat-label">Avg Rating</div></div>
            </div>

            <div className="section">
              <div className="section-title">
                Services
                <span onClick={() => setView("browse")}>See all</span>
              </div>
              <div className="services-grid">
                {SERVICES.map(s => (
                  <div key={s.id}
                    className={`service-tile ${selectedService === s.id ? "active" : ""}`}
                    onClick={() => { setSelectedService(selectedService === s.id ? "" : s.id); setView("browse"); }}>
                    <div className="service-tile-icon">
                      {(() => { const Icon = SERVICE_ICONS[s.id]; return Icon ? <Icon size={22} strokeWidth={1.8} /> : null; })()}
                    </div>
                    <div className="service-tile-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section" style={{ paddingBottom: 20 }}>
              <div className="section-title">Top Rated</div>
              {PROVIDERS.filter(p => p.rating >= 4.8).slice(0, 2).map(provider => (
                <div key={provider.id} className="provider-card" style={{ marginBottom: 10 }}
                  onClick={() => { setSelectedProvider(provider); setView("profile"); }}>
                  <div className="provider-card-top">
                    <div className="avatar" style={{ background: COLORS[provider.img] }}>{provider.img}</div>
                    <div className="provider-info">
                      <div className="provider-name">
                        {provider.name}
                        {provider.verified && <span className="verified-badge"><CheckCircle size={9} strokeWidth={3} style={{display:"inline", marginRight:2}}/>Verified</span>}
                      </div>
                      <div className="provider-sub">{serviceLabel(provider.service)} · {provider.area}, {provider.location}</div>
                    </div>
                    <span className={`avail-dot ${provider.available ? "on" : "off"}`} />
                  </div>
                  <div className="provider-meta">
                    <span className="rating">{provider.rating}</span>
                    <span className="jobs">{provider.jobs} jobs</span>
                    <span className="price">{provider.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── BROWSE ── */}
        {view === "browse" && (
          <div style={{ paddingBottom: 80 }}>
            <div className="browse-header">
              <div className="search-bar" style={{ marginBottom: 12 }}>
                <Search size={16} strokeWidth={2} style={{color:"#D4A846", flexShrink:0}} />
                <input
                  placeholder="Search service or provider..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                />
              </div>
              <div className="filter-row">
                <button className={`filter-chip ${filterAvailable ? "active" : ""}`} onClick={() => setFilterAvailable(!filterAvailable)}>Available Now</button>
                {SERVICES.map(s => (
                  <button key={s.id} className={`filter-chip ${selectedService === s.id ? "active" : ""}`}
                    onClick={() => setSelectedService(selectedService === s.id ? "" : s.id)}>
                    {(() => { const Icon = SERVICE_ICONS[s.id]; return Icon ? <Icon size={12} strokeWidth={2} style={{display:"inline", marginRight:4}} /> : null; })()}
                    {s.label}
                  </button>
                ))}
              </div>
              <div className="filter-row" style={{ marginTop: 8 }}>
                {LOCATIONS.map(loc => (
                  <button key={loc} className={`filter-chip ${selectedLocation === loc ? "active" : ""}`}
                    onClick={() => setSelectedLocation(selectedLocation === loc ? "" : loc)}>
                    {loc}
                  </button>
                ))}
              </div>
            </div>

            {filteredProviders.length === 0 ? (
              <div className="empty-state">
                <div className="empty-state-icon"><Search size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                <h3>No providers found</h3>
                <p>Try a different service or location</p>
              </div>
            ) : (
              <div className="providers-list">
                {filteredProviders.map(provider => (
                  <div key={provider.id} className="provider-card"
                    onClick={() => { setSelectedProvider(provider); setView("profile"); }}>
                    <div className="provider-card-top">
                      <div className="avatar" style={{ background: COLORS[provider.img] }}>{provider.img}</div>
                      <div className="provider-info">
                        <div className="provider-name">
                          {provider.name}
                          {provider.verified && <span className="verified-badge"><CheckCircle size={9} strokeWidth={3} style={{display:"inline", marginRight:2}}/>✓</span>}
                        </div>
                        <div className="provider-sub">{serviceLabel(provider.service)} · {provider.area}, {provider.location}</div>
                      </div>
                      <span className={`avail-dot ${provider.available ? "on" : "off"}`} />
                    </div>
                    <div className="provider-meta">
                      <span className="rating">{provider.rating}</span>
                      <span className="jobs">{provider.jobs} jobs done</span>
                      <span className="price">{provider.price}</span>
                    </div>
                    <div className="provider-tags">
                      {provider.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── PROFILE ── */}
        {view === "profile" && selectedProvider && (
          <div style={{ paddingBottom: 100, overflowY: "auto", height: "calc(100vh - 56px)" }}>
            <div className="profile-hero">
              <div className="avatar-lg" style={{ background: COLORS[selectedProvider.img] }}>{selectedProvider.img}</div>
              <div className="profile-name">
                {selectedProvider.name}
                {selectedProvider.verified && <span className="verified-badge" style={{ marginLeft: 8, fontSize: 11 }}>✓ Verified</span>}
              </div>
              <div className="profile-service">{serviceLabel(selectedProvider.service)}</div>
              <div className="profile-location"><MapPin size={13} strokeWidth={2} style={{display:"inline", marginRight:4, color:"#D4A846"}}/>{selectedProvider.area}, {selectedProvider.location}</div>
            </div>

            <div className="profile-stats">
              <div className="profile-stat"><div className="profile-stat-num">{selectedProvider.rating}★</div><div className="profile-stat-label">Rating</div></div>
              <div className="profile-stat"><div className="profile-stat-num">{selectedProvider.jobs}</div><div className="profile-stat-label">Jobs Done</div></div>
              <div className="profile-stat"><div className="profile-stat-num" style={{ fontSize: 14, paddingTop: 3 }}>{selectedProvider.available ? "🟡 Available" : "🔴 Busy"}</div><div className="profile-stat-label">Status</div></div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">About</div>
              <div className="bio-text">{selectedProvider.bio}</div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Specialties</div>
              <div className="profile-tags">
                {selectedProvider.tags.map(t => <span key={t} className="profile-tag">{t}</span>)}
              </div>
            </div>

            <div className="profile-section">
              <div className="profile-section-title">Rate</div>
              <div style={{ fontSize: 26, fontFamily: "Syne", fontWeight: 800, color: "#D4A846" }}>{selectedProvider.price}</div>
            </div>

            <div className="profile-cta">
              <button className="chat-btn"
                disabled={!selectedProvider.available}
                onClick={() => { setChatTarget(selectedProvider); setView("chat"); }}>
                {selectedProvider.available ? "Chat with " + selectedProvider.name.split(" ")[0] : "Currently Unavailable"}
              </button>
              {selectedProvider.available && (
                <button className="chat-btn" style={{ marginTop: 10, background: "transparent", border: "1px solid rgba(212,168,70,0.4)", color: "#D4A846" }}
                  onClick={() => { setBookingTarget(selectedProvider); setBookingSuccess(false); }}>
                  Request Booking
                </button>
              )}
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <div className="reviews-title">Reviews</div>
                <button className="write-review-btn" onClick={() => {
                  if (!user) { setView("auth"); setAuthView("login"); return; }
                  setReviewTarget(selectedProvider);
                  setReviewRating(0);
                  setReviewComment("");
                  setReviewSuccess(false);
                  setShowReviewModal(true);
                }}>
                  + Write a Review
                </button>
              </div>

              {/* Rating Summary */}
              {reviews[selectedProvider.id]?.length > 0 && (
                <div className="rating-summary">
                  <div className="rating-big-num">{getAverageRating(selectedProvider.id)}</div>
                  <div className="rating-summary-right">
                    <div className="rating-summary-stars">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={16} strokeWidth={0} fill={s <= Math.round(getAverageRating(selectedProvider.id)) ? "#D4A846" : "#ddd"} />
                      ))}
                    </div>
                    <div className="rating-count">{reviews[selectedProvider.id].length} review{reviews[selectedProvider.id].length !== 1 ? "s" : ""}</div>
                  </div>
                </div>
              )}

              {/* Review list */}
              {!reviews[selectedProvider.id] ? (
                <div className="no-reviews">Loading reviews...</div>
              ) : reviews[selectedProvider.id].length === 0 ? (
                <div className="no-reviews">No reviews yet. Be the first to review!</div>
              ) : (
                reviews[selectedProvider.id].map(review => (
                  <div key={review.id} className="review-card">
                    <div className="review-card-top">
                      <div className="review-author">{review.customer_name}</div>
                      <div className="review-date">{new Date(review.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                    <div className="review-stars">
                      {[1,2,3,4,5].map(s => (
                        <Star key={s} size={14} strokeWidth={0} fill={s <= review.rating ? "#D4A846" : "#ddd"} className={s <= review.rating ? "review-star" : "review-star empty"} />
                      ))}
                    </div>
                    {review.comment && <div className="review-comment">"{review.comment}"</div>}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── CHAT ── */}
        {view === "chat" && chatTarget && (
          <div className="chat-container">
            <div className="chat-header">
              <div className="chat-avatar" style={{ background: COLORS[chatTarget.img] }}>{chatTarget.img}</div>
              <div>
                <div className="chat-name">{chatTarget.name}</div>
                <div className="chat-status">● Online</div>
              </div>
            </div>

            <div className="chat-body">
              {(messages[chatTarget.id] || []).map((msg, i) => (
                <div key={i} className={`msg ${msg.from}`}>
                  <div className="msg-bubble">{msg.text}</div>
                  <div className="msg-time">{msg.time}</div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="chat-input-area">
              <input
                className="chat-input"
                placeholder="Type a message..."
                value={inputMsg}
                onChange={e => setInputMsg(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage()}
              />
              <button className="send-btn" onClick={sendMessage}><Send size={16} strokeWidth={2} /></button>
            </div>
          </div>
        )}

        {/* ── REGISTER ── */}
        {view === "register" && (
          <div style={{ overflowY: "auto", height: "calc(100vh - 56px)", paddingBottom: 80 }}>
            {regSuccess ? (
              <div className="success-screen">
                <div className="success-icon"><CheckCircle size={64} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                <div className="success-title">You're registered!</div>
                <div className="success-sub">Your profile is under review. We'll notify you within 24 hours once you're verified and live on HandyNG.</div>
                <div className="success-card">
                  <div className="success-card-row"><span className="success-card-label">Name</span><span className="success-card-value">{form.name}</span></div>
                  <div className="success-card-row"><span className="success-card-label">Service</span><span className="success-card-value">{SERVICES.find(s => s.id === form.service)?.label}</span></div>
                  <div className="success-card-row"><span className="success-card-label">Location</span><span className="success-card-value">{form.area}, {form.location}</span></div>
                  <div className="success-card-row"><span className="success-card-label">Rate</span><span className="success-card-value">₦{form.price}/{form.priceUnit}</span></div>
                </div>
                <button className="reg-btn" onClick={() => { setView("home"); setRegSuccess(false); setRegStep(1); setForm({ name: "", phone: "", service: "", location: "", area: "", experience: "", bio: "", price: "", priceUnit: "hr" }); setPhotoPreview(null); }}>
                  Back to Home
                </button>
              </div>
            ) : (
              <div className="reg-container">
                <div className="reg-header">
                  <h2>Join as a <span style={{ color: "#D4A846" }}>Provider</span></h2>
                  <p>List your skills on HandyNG and get hired by customers in your city.</p>
                </div>

                {/* Step progress */}
                <div className="reg-steps">
                  {[1,2,3].map(s => (
                    <div key={s} className={`reg-step-dot ${s < regStep ? "done" : s === regStep ? "active" : "pending"}`} />
                  ))}
                </div>
                <div className="reg-step-label">Step <span>{regStep}</span> of 3 — {regStep === 1 ? "Personal Info" : regStep === 2 ? "Service & Location" : "Experience & Pricing"}</div>

                {/* STEP 1 */}
                {regStep === 1 && (
                  <>
                    {/* Photo upload */}
                    <div className="field-group">
                      <label className="field-label">Profile Photo</label>
                      <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handlePhotoChange} />
                      <div className="photo-upload" onClick={() => fileInputRef.current.click()}>
                        {photoPreview ? (
                          <>
                            <img src={photoPreview} className="photo-preview" alt="preview" />
                            <div className="photo-change">Tap to change photo</div>
                          </>
                        ) : (
                          <>
                            <div className="photo-upload-icon"><User size={32} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                            <div className="photo-upload-text"><span>Tap to upload</span> your photo</div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="field-group">
                      <label className="field-label">Full Name</label>
                      <input className={`field-input ${formErrors.name ? "error" : ""}`} placeholder="e.g. Emeka Okafor" value={form.name} onChange={e => updateForm("name", e.target.value)} />
                      {formErrors.name && <div className="field-error">{formErrors.name}</div>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Phone Number</label>
                      <input className={`field-input ${formErrors.phone ? "error" : ""}`} placeholder="e.g. 08012345678" value={form.phone} onChange={e => updateForm("phone", e.target.value)} type="tel" />
                      {formErrors.phone && <div className="field-error">{formErrors.phone}</div>}
                    </div>

                    <button className="reg-btn" onClick={handleNextStep}>Continue</button>
                  </>
                )}

                {/* STEP 2 */}
                {regStep === 2 && (
                  <>
                    <div className="field-group">
                      <label className="field-label">Service Category</label>
                      <select className={`field-select ${formErrors.service ? "error" : ""}`} value={form.service} onChange={e => updateForm("service", e.target.value)}>
                        <option value="">Select your trade...</option>
                        {SERVICES.map(s => <option key={s.id} value={s.id}>{s.icon} {s.label}</option>)}
                      </select>
                      {formErrors.service && <div className="field-error">{formErrors.service}</div>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">City</label>
                      <select className={`field-select ${formErrors.location ? "error" : ""}`} value={form.location} onChange={e => updateForm("location", e.target.value)}>
                        <option value="">Select your city...</option>
                        {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                      </select>
                      {formErrors.location && <div className="field-error">{formErrors.location}</div>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Area / Neighbourhood</label>
                      <input className={`field-input ${formErrors.area ? "error" : ""}`} placeholder="e.g. Lekki, Wuse, GRA..." value={form.area} onChange={e => updateForm("area", e.target.value)} />
                      {formErrors.area && <div className="field-error">{formErrors.area}</div>}
                    </div>

                    <button className="reg-btn" onClick={handleNextStep}>Continue</button>
                    <button className="reg-btn-outline" onClick={() => setRegStep(1)}>Back</button>
                  </>
                )}

                {/* STEP 3 */}
                {regStep === 3 && (
                  <>
                    <div className="field-group">
                      <label className="field-label">Years of Experience</label>
                      <select className={`field-select ${formErrors.experience ? "error" : ""}`} value={form.experience} onChange={e => updateForm("experience", e.target.value)}>
                        <option value="">Select experience...</option>
                        <option value="1">Less than 1 year</option>
                        <option value="1-2">1 – 2 years</option>
                        <option value="3-5">3 – 5 years</option>
                        <option value="6-10">6 – 10 years</option>
                        <option value="10+">10+ years</option>
                      </select>
                      {formErrors.experience && <div className="field-error">{formErrors.experience}</div>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Short Bio</label>
                      <textarea
                        className={`field-textarea ${formErrors.bio ? "error" : ""}`}
                        placeholder="Describe your skills and what makes you reliable..."
                        value={form.bio}
                        onChange={e => updateForm("bio", e.target.value)}
                        maxLength={200}
                      />
                      <div className="char-count">{form.bio.length}/200</div>
                      {formErrors.bio && <div className="field-error">{formErrors.bio}</div>}
                    </div>

                    <div className="field-group">
                      <label className="field-label">Your Rate (₦)</label>
                      <div className="price-row">
                        <input className={`field-input ${formErrors.price ? "error" : ""}`} placeholder="e.g. 5000" value={form.price} onChange={e => updateForm("price", e.target.value.replace(/\D/g, ""))} type="tel" />
                        <div className="price-unit-toggle">
                          <button className={`price-unit-btn ${form.priceUnit === "hr" ? "active" : ""}`} onClick={() => updateForm("priceUnit", "hr")}>/ hr</button>
                          <button className={`price-unit-btn ${form.priceUnit === "visit" ? "active" : ""}`} onClick={() => updateForm("priceUnit", "visit")}>/ visit</button>
                          <button className={`price-unit-btn ${form.priceUnit === "job" ? "active" : ""}`} onClick={() => updateForm("priceUnit", "job")}>/ job</button>
                        </div>
                      </div>
                      {formErrors.price && <div className="field-error">{formErrors.price}</div>}
                    </div>

                    <button className="reg-btn" onClick={handleSubmitReg} disabled={regLoading}>{regLoading ? "Saving..." : "Submit Registration 🎉"}</button>
                    <button className="reg-btn-outline" onClick={() => setRegStep(2)}>Back</button>
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── AUTH ── */}
        {view === "auth" && (
          <div style={{ overflowY: "auto", height: "calc(100vh - 56px)" }}>
            <div className="auth-container">
              <div className="auth-logo">Handy<span>NG</span></div>
              <div className="auth-tagline">Nigeria's Trusted Service Network</div>

              {authView === "login" ? (
                <>
                  <div className="auth-title">Welcome back</div>
                  <div className="auth-sub">Log in to your account</div>
                  {authError && <div className="auth-error">{authError}</div>}
                  <div className="field-group">
                    <label className="field-label">Email</label>
                    <input className="field-input" placeholder="you@email.com" value={authEmail} onChange={e => { setAuthEmail(e.target.value); setAuthError(""); }} type="email" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Password</label>
                    <input className="field-input" placeholder="Your password" value={authPassword} onChange={e => { setAuthPassword(e.target.value); setAuthError(""); }} type="password" />
                  </div>
                  <button className="reg-btn" onClick={handleLogin} disabled={authLoading}>{authLoading ? "Logging in..." : "Log In"}</button>
                  <div className="auth-switch">Don't have an account? <span onClick={() => { setAuthView("signup"); setAuthError(""); }}>Sign up</span></div>
                </>
              ) : (
                <>
                  <div className="auth-title">Create account</div>
                  <div className="auth-sub">Join HandyNG today</div>
                  <div className="role-toggle">
                    <button className={`role-btn ${authRole === "customer" ? "active" : ""}`} onClick={() => setAuthRole("customer")}><User size={14} strokeWidth={2} style={{display:"inline", marginRight:4}}/>Customer</button>
                    <button className={`role-btn ${authRole === "provider" ? "active" : ""}`} onClick={() => setAuthRole("provider")}><Wrench size={14} strokeWidth={2} style={{display:"inline", marginRight:4}}/>Provider</button>
                  </div>
                  {authError && <div className="auth-error">{authError}</div>}
                  <div className="field-group">
                    <label className="field-label">Full Name</label>
                    <input className="field-input" placeholder="e.g. Emeka Okafor" value={authName} onChange={e => { setAuthName(e.target.value); setAuthError(""); }} />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Email</label>
                    <input className="field-input" placeholder="you@email.com" value={authEmail} onChange={e => { setAuthEmail(e.target.value); setAuthError(""); }} type="email" />
                  </div>
                  <div className="field-group">
                    <label className="field-label">Password</label>
                    <input className="field-input" placeholder="Min. 6 characters" value={authPassword} onChange={e => { setAuthPassword(e.target.value); setAuthError(""); }} type="password" />
                  </div>
                  <button className="reg-btn" onClick={handleSignup} disabled={authLoading}>{authLoading ? "Creating account..." : "Create Account"}</button>
                  <div className="auth-switch">Already have an account? <span onClick={() => { setAuthView("login"); setAuthError(""); }}>Log in</span></div>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── USER PROFILE TAB ── */}
        {view === "userprofile" && (
          <div style={{ overflowY: "auto", height: "calc(100vh - 56px)" }}>
            {user ? (
              <div className="profile-tab-container">
                <div className="profile-tab-header">
                  <div className="profile-tab-avatar">
                    {(user.user_metadata?.full_name || user.email || "U").charAt(0).toUpperCase()}
                  </div>
                  <div className="profile-tab-name">{user.user_metadata?.full_name || "User"}</div>
                  <div className="profile-tab-email">{user.email}</div>
                  <div className="profile-tab-role">{user.user_metadata?.role || "Customer"}</div>
                </div>
                <div className="profile-tab-menu">
                  <div className="profile-menu-item" onClick={() => setView("browse")}>
                    <span className="profile-menu-icon"><Search size={20} strokeWidth={1.8} style={{color:"#D4A846"}} /></span>
                    <span className="profile-menu-label">Browse Services</span>
                    <ChevronRight size={16} strokeWidth={2} style={{color:"#bbb"}} />
                  </div>
                  <div className="profile-menu-item" onClick={() => setView("register")}>
                    <span className="profile-menu-icon"><Plus size={20} strokeWidth={1.8} style={{color:"#D4A846"}} /></span>
                    <span className="profile-menu-label">Register as Provider</span>
                    <ChevronRight size={16} strokeWidth={2} style={{color:"#bbb"}} />
                  </div>
                  <div className="profile-menu-item" onClick={() => setView("bookings")}>
                    <span className="profile-menu-icon"><BookOpen size={20} strokeWidth={1.8} style={{color:"#D4A846"}} /></span>
                    <span className="profile-menu-label">My Bookings</span>
                    <ChevronRight size={16} strokeWidth={2} style={{color:"#bbb"}} />
                  </div>
                  <div className="profile-menu-item">
                    <span className="profile-menu-icon"><Settings size={20} strokeWidth={1.8} style={{color:"#D4A846"}} /></span>
                    <span className="profile-menu-label">Settings</span>
                    <ChevronRight size={16} strokeWidth={2} style={{color:"#bbb"}} />
                  </div>
                </div>
                <button className="logout-btn" onClick={handleLogout}><LogOut size={16} strokeWidth={2} style={{display:"inline", marginRight:8}}/>Log Out</button>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-state-icon"><User size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                <h3>Not logged in</h3>
                <p style={{ marginBottom: 24 }}>Create an account or log in to access your profile</p>
                <button className="reg-btn" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => { setAuthView("signup"); setView("auth"); }}>Get Started</button>
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS SCREEN ── */}
        {view === "bookings" && (
          <div style={{ overflowY: "auto", height: "calc(100vh - 56px)" }}>
            <div className="bookings-container">
              <div className="bookings-title">Bookings</div>
              <div className="bookings-sub">{user ? "Your active and past job requests" : "Log in to view your bookings"}</div>
              {!user ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Lock size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                  <h3>Not logged in</h3>
                  <p style={{ marginBottom: 24 }}>Log in to send and manage bookings</p>
                  <button className="reg-btn" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => { setAuthView("login"); setView("auth"); }}>Log In</button>
                </div>
              ) : loadingBookings ? (
                <div className="empty-state"><div className="empty-state-icon"><Clock size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div><h3>Loading...</h3></div>
              ) : bookings.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><BookOpen size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                  <h3>No bookings yet</h3>
                  <p style={{ marginBottom: 24 }}>Browse services and send a booking request to get started</p>
                  <button className="reg-btn" style={{ maxWidth: 280, margin: "0 auto" }} onClick={() => setView("browse")}>Browse Services</button>
                </div>
              ) : (
                bookings.map(booking => (
                  <div key={booking.id} className="booking-card">
                    <div className="booking-card-top">
                      <div>
                        <div className="booking-provider">{booking.customer_id === user?.id ? booking.provider_name : booking.customer_name}</div>
                        <div className="booking-service">{serviceLabel(booking.service)} · {booking.location}</div>
                      </div>
                      <div className={`booking-status ${booking.status}`}>{booking.status}</div>
                    </div>
                    <div className="booking-message">"{booking.message}"</div>
                    <div className="booking-meta">{new Date(booking.created_at).toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" })}</div>
                    {booking.customer_id !== user?.id && booking.status === "pending" && (
                      <div className="booking-actions">
                        <button className="booking-accept-btn" onClick={() => updateBookingStatus(booking.id, "accepted")}><CheckCircle size={14} strokeWidth={2} style={{display:"inline", marginRight:4}}/>Accept</button>
                        <button className="booking-decline-btn" onClick={() => updateBookingStatus(booking.id, "declined")}><X size={14} strokeWidth={2} style={{display:"inline", marginRight:4}}/>Decline</button>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ── BOOKING REQUEST MODAL ── */}
        {bookingTarget && (
          <div className="booking-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setBookingTarget(null); setBookingSuccess(false); setBookingMessage(""); } }}>
            <div className="booking-modal">
              {bookingSuccess ? (
                <div className="booking-modal-success">
                  <div className="booking-modal-success-icon"><CheckCircle size={48} strokeWidth={1.4} style={{color:"#D4A846", margin:"0 auto"}} /></div>
                  <div className="booking-modal-success-title">Request Sent!</div>
                  <div className="booking-modal-success-sub">Your booking request has been sent to {bookingTarget.name}. They'll respond shortly.</div>
                  <button className="reg-btn" style={{ marginTop: 24 }} onClick={() => { setBookingTarget(null); setBookingSuccess(false); setView("bookings"); }}>View Bookings</button>
                </div>
              ) : (
                <>
                  <div className="booking-modal-title">Book {bookingTarget.name.split(" ")[0]}</div>
                  <div className="booking-modal-sub">{serviceLabel(bookingTarget.service)} · {bookingTarget.area}, {bookingTarget.location}</div>
                  <div className="field-group">
                    <label className="field-label">Describe your job</label>
                    <textarea
                      className="field-textarea"
                      placeholder={`Tell ${bookingTarget.name.split(" ")[0]} what you need done, your address, and preferred time...`}
                      value={bookingMessage}
                      onChange={e => setBookingMessage(e.target.value)}
                      maxLength={300}
                    />
                    <div className="char-count">{bookingMessage.length}/300</div>
                  </div>
                  <button className="reg-btn" onClick={sendBooking} disabled={bookingSending || !bookingMessage.trim()}>
                    {bookingSending ? "Sending..." : user ? "Send Booking Request" : "Log in to Book"}
                  </button>
                  <button className="reg-btn-outline" onClick={() => { setBookingTarget(null); setBookingMessage(""); }}>Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* ── REVIEW MODAL ── */}
        {showReviewModal && reviewTarget && (
          <div className="review-modal-overlay" onClick={(e) => { if (e.target === e.currentTarget) { setShowReviewModal(false); } }}>
            <div className="review-modal">
              {reviewSuccess ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <div style={{ marginBottom: 12, display: "flex", justifyContent: "center" }}><CheckCircle size={56} strokeWidth={1.4} color="#D4A846" /></div>
                  <div style={{ fontFamily: "Syne, sans-serif", fontWeight: 800, fontSize: 20, marginBottom: 6, color: "#1A1400" }}>Review Submitted!</div>
                  <div style={{ fontSize: 13, color: "#888", marginBottom: 24 }}>Thanks for reviewing {reviewTarget.name.split(" ")[0]}.</div>
                  <button className="reg-btn" onClick={() => setShowReviewModal(false)}>Done</button>
                </div>
              ) : (
                <>
                  <div className="review-modal-title">Review {reviewTarget.name.split(" ")[0]}</div>
                  <div className="review-modal-sub">{serviceLabel(reviewTarget.service)} · {reviewTarget.area}, {reviewTarget.location}</div>

                  {/* Star picker */}
                  <div className="star-picker">
                    {[1,2,3,4,5].map(s => (
                      <Star
                        key={s}
                        size={40}
                        strokeWidth={1.5}
                        fill={(hoverRating || reviewRating) >= s ? "#D4A846" : "none"}
                        color={(hoverRating || reviewRating) >= s ? "#D4A846" : "#ddd"}
                        style={{ cursor: "pointer", transition: "transform 0.15s" }}
                        onMouseEnter={() => setHoverRating(s)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setReviewRating(s)}
                      />
                    ))}
                  </div>
                  <div className="rating-label">
                    {reviewRating === 1 ? "Poor" : reviewRating === 2 ? "Fair" : reviewRating === 3 ? "Good" : reviewRating === 4 ? "Very Good" : reviewRating === 5 ? "Excellent!" : "Tap to rate"}
                  </div>

                  <div className="field-group">
                    <label className="field-label">Comment (optional)</label>
                    <textarea
                      className="field-textarea"
                      placeholder={`Share your experience with ${reviewTarget.name.split(" ")[0]}...`}
                      value={reviewComment}
                      onChange={e => setReviewComment(e.target.value)}
                      maxLength={300}
                    />
                    <div className="char-count">{reviewComment.length}/300</div>
                  </div>

                  <button className="reg-btn" onClick={submitReview} disabled={reviewSubmitting || reviewRating === 0}>
                    {reviewSubmitting ? "Submitting..." : reviewRating === 0 ? "Select a rating first" : "Submit Review"}
                  </button>
                  <button className="reg-btn-outline" onClick={() => setShowReviewModal(false)}>Cancel</button>
                </>
              )}
            </div>
          </div>
        )}

        {/* BOTTOM BAR */}
        {view !== "chat" && view !== "landing" && (
          <div className="bottom-bar">
            <button className={`bottom-tab ${view === "home" ? "active" : ""}`} onClick={() => setView("home")}>
              <Home size={22} strokeWidth={1.8} />
              <span className="bottom-tab-label">Home</span>
            </button>
            <button className={`bottom-tab ${view === "browse" ? "active" : ""}`} onClick={() => setView("browse")}>
              <Search size={22} strokeWidth={1.8} />
              <span className="bottom-tab-label">Browse</span>
            </button>
            <button className={`bottom-tab ${view === "bookings" ? "active" : ""}`} onClick={() => setView("bookings")}>
              <BookOpen size={22} strokeWidth={1.8} />
              <span className="bottom-tab-label">Bookings</span>
            </button>
            <button className={`bottom-tab ${view === "userprofile" || view === "auth" ? "active" : ""}`} onClick={() => setView("userprofile")}>
              {user ? <User size={22} strokeWidth={1.8} /> : <Lock size={22} strokeWidth={1.8} />}
              <span className="bottom-tab-label">{user ? "Profile" : "Login"}</span>
            </button>
          </div>
        )}

      </div>
    </>
  );
}
