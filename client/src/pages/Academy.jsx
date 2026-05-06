import { useState, useEffect } from "react";
import { CheckCircle, User, Mail, Phone, Briefcase, ChevronRight, Award, Clock, Users, BookOpen, AlertTriangle, MapPin } from "lucide-react";

const Academy = () => {
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [applicationSubmitted, setApplicationSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    motivation: "",
    availability: "",
  });
  const defaultLocations = [
    {
      id: "loc1",
      name: "TimmyLux Academy – Main Campus",
      address: "Victoria Island, Lagos",
      city: "Lagos",
      state: "Lagos State",
      phone: "+234 801 234 5678",
      hours: "Mon – Sat: 8:00 AM – 5:00 PM",
    },
    {
      id: "loc2",
      name: "TimmyLux Academy – Abuja Branch",
      address: "Wuse Zone 4, Abuja",
      city: "Abuja",
      state: "FCT",
      phone: "+234 802 345 6789",
      hours: "Mon – Fri: 9:00 AM – 4:00 PM",
    },
  ];

  const [academyStatus, setAcademyStatus] = useState("closed");
  const [locations, setLocations] = useState(defaultLocations);
  const [content, setContent] = useState({
    heroTitle: "TimmyLux Academy",
    heroSubtitle:
      "Become a skilled furniture designer and interior craftsman. Learn practical, real-world skills and build a career in luxury furniture.",
    heroStats: [
      { num: "6mo", label: "Intensive program" },
      { num: "4+", label: "Core skill areas" },
      { num: "100%", label: "Hands-on training" },
      { num: "₦100k", label: "Total fee (2 installments)" },
    ],
    requirementsTitle: "Admission Requirements",
    requirements: [
      {
        title: "Basic Education",
        description:
          "Applicants should have at least a secondary school education and basic understanding of English.",
      },
      {
        title: "Passion for Craft",
        description:
          "You must have a strong interest in furniture design, woodworking, or interior styling.",
      },
      {
        title: "Commitment",
        description:
          "Willingness to complete the full training program and participate in hands-on sessions.",
      },
      {
        title: "Acceptance Fee",
        description:
          "A non-refundable acceptance fee of ₦30,000 is required upon admission.",
      },
    ],
    programTitle: "Program Structure",
    program: [
      { title: "Duration", description: "3 - 6 months intensive training (practical & theory)." },
      { title: "Hands-on Training", description: "Work directly with tools, materials, and real client projects." },
      { title: "Mentorship", description: "Learn directly from experienced craftsmen and designers." },
      { title: "Certification", description: "Receive a TimmyLux Academy certificate upon successful completion." },
    ],
    sectionTitle: "What You Will Learn",
    offerings: [
      { title: "Furniture Design", description: "Understand modern and luxury furniture design principles and concepts." },
      { title: "Woodworking Skills", description: "Learn cutting, shaping, polishing, and finishing techniques." },
      { title: "Interior Design Basics", description: "Understand how furniture fits into complete interior spaces." },
      { title: "Business & Client Work", description: "Learn how to work with clients, pricing, and running your own furniture business." },
    ],
    ctaTitle: "Start Your Journey Today",
    ctaSubtitle: "Take the first step into a profitable and creative career in furniture design.",
    ctaButtonText: "Apply Now",
    rulesTitle: "Academy Rules",
    rulesDescription: "A safe and focused environment is essential. All students must follow academy rules.",
    rules: [
      { title: "No Smoking", description: "Smoking is strictly prohibited anywhere on academy premises." },
      { title: "No Drinking", description: "Alcohol and intoxicants are not allowed in the academy environment." },
      { title: "No Fighting", description: "Physical fights or disorderly conduct will result in immediate removal." },
      { title: "No Cultist Activity", description: "Any cult-related behavior, symbols, or gatherings are banned." },
      { title: "Respect Instructors", description: "Listen to trainers, arrive on time, and stay focused during sessions." },
    ],
  });

  useEffect(() => {
    const saved = localStorage.getItem("academyContent");
    if (saved) setContent(JSON.parse(saved));

    const savedStatus = localStorage.getItem("academyStatus");
    if (savedStatus) setAcademyStatus(savedStatus);

    const savedLocations = localStorage.getItem("academyLocations");
    if (savedLocations) {
      const parsed = JSON.parse(savedLocations);
      if (parsed.length > 0) setLocations(parsed);
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim() || !formData.motivation.trim()) {
      alert("Please fill in all required fields");
      return;
    }
    const application = {
      id: Date.now().toString(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };
    const existingApps = JSON.parse(localStorage.getItem("academyApplications") || "[]");
    existingApps.push(application);
    localStorage.setItem("academyApplications", JSON.stringify(existingApps));
    setApplicationSubmitted(true);
    setFormData({ fullName: "", email: "", phone: "", experience: "", motivation: "", availability: "" });
    setTimeout(() => {
      setApplicationSubmitted(false);
      setShowApplicationForm(false);
    }, 3000);
  };

  const learnIcons = ["🛋️", "🪚", "🏠", "💼"];
  const programIcons = [Clock, Users, Award, BookOpen];

  return (
    <div className="w-full bg-white font-sans">

      {/* ── HERO ── */}
      <section
        className="relative overflow-hidden py-28 px-6 text-white text-center"
        style={{ background: "#011F5B" }}
      >
        {/* decorative circles */}
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 400, height: 400, top: -120, right: -100, background: "#D4AF37", opacity: 0.07 }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 260, height: 260, bottom: -80, left: -60, background: "#D4AF37", opacity: 0.05 }}
        />

        <div className="relative max-w-3xl mx-auto">
          {/* pill badge */}
          <span
            className="inline-block mb-6 px-5 py-1.5 rounded-full text-xs font-semibold tracking-widest uppercase"
            style={{ background: "#D4AF37", color: "#3B1A00" }}
          >
            Craft · Design · Build
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            TimmyLux{" "}
            <span style={{ color: "#D4AF37" }}>Academy</span>
          </h1>

          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-12 leading-relaxed">
            {content.heroSubtitle}
          </p>

          {/* stats row */}
          <div className="flex flex-wrap justify-center gap-10">
            {content.heroStats.map((s) => (
              <div key={s.label} className="text-center">
                <div className="text-3xl font-extrabold" style={{ color: "#D4AF37" }}>{s.num}</div>
                <div className="text-xs text-white/50 mt-1 tracking-wide">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PAYMENT WARNING BANNER ── */}
      <div className="bg-amber-50 border-y-2 border-amber-400 py-4 px-6">
        <div className="max-w-5xl mx-auto flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-900 font-bold text-sm mb-0.5">⚠ Important Payment Notice</p>
            <p className="text-amber-800 text-sm leading-relaxed">
              All academy fee payments must be made <span className="font-bold">physically in school</span> to
              the authorised fee collector only. Do <span className="font-bold">not</span> transfer money to any
              individual or third-party account. TimmyLux Academy takes no responsibility for payments made
              outside this official process.
            </p>
          </div>
        </div>
      </div>

      {/* ── WHAT YOU WILL LEARN ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4AF37" }}>
            Curriculum
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#011F5B" }}>
            {content.sectionTitle}
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            Four core disciplines that take you from complete beginner to certified craftsman.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {content.offerings.map((item, index) => (
              <div
                key={index}
                className="relative overflow-hidden rounded-2xl p-7"
                style={{ background: "#011F5B" }}
              >
                {/* bg accent */}
                <div
                  className="absolute rounded-full pointer-events-none"
                  style={{ width: 100, height: 100, top: -24, right: -24, background: "#D4AF37", opacity: 0.12 }}
                />
                {/* icon */}
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-xl mb-5"
                  style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
                >
                  {learnIcons[index]}
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROGRAM STRUCTURE ── */}
      <section className="py-20 px-6" style={{ background: "#F8F9FC" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4AF37" }}>
            How it works
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#011F5B" }}>
            {content.programTitle}
          </h2>
          <p className="text-gray-500 mb-12 max-w-xl">
            A clear, step-by-step journey from application to certified professional.
          </p>

          <div className="flex flex-col gap-0">
            {content.program.map((item, index) => {
              const Icon = programIcons[index];
              const isLast = index === content.program.length - 1;
              return (
                <div key={index} className="flex gap-5 items-start">
                  {/* left: number + line */}
                  <div className="flex flex-col items-center flex-shrink-0" style={{ width: 40 }}>
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0"
                      style={{ background: "#011F5B", color: "#D4AF37" }}
                    >
                      {index + 1}
                    </div>
                    {!isLast && (
                      <div className="w-px flex-1 mt-1 mb-1" style={{ background: "#011F5B22", minHeight: 36 }} />
                    )}
                  </div>
                  {/* content */}
                  <div className={`pb-8 ${isLast ? "" : ""}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <Icon size={15} style={{ color: "#D4AF37" }} />
                      <h3 className="font-semibold text-base" style={{ color: "#011F5B" }}>{item.title}</h3>
                    </div>
                    <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── REQUIREMENTS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4AF37" }}>
            Admission
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#011F5B" }}>
            {content.requirementsTitle}
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            Here's what we look for before you begin your journey with us.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {content.requirements.map((item, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 border"
                style={{ background: "#F8F9FC", borderColor: "#e5e7eb" }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ background: "#D4AF37" }}
                />
                <h3 className="font-semibold text-base mb-2" style={{ color: "#011F5B" }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RULES ── */}
      <section className="py-20 px-6" style={{ background: "#F8F9FC" }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4AF37" }}>
            {content.rulesTitle}
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#011F5B" }}>
            {content.rulesTitle}
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            {content.rulesDescription}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {content.rules.map((rule, index) => (
              <div
                key={index}
                className="rounded-2xl p-6 border bg-white"
                style={{ borderColor: "#e5e7eb" }}
              >
                <div
                  className="w-2 h-2 rounded-full mb-4"
                  style={{ background: "#D4AF37" }}
                />
                <h3 className="font-semibold text-base mb-2" style={{ color: "#011F5B" }}>{rule.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{rule.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── LOCATIONS ── */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold tracking-widest uppercase mb-2" style={{ color: "#D4AF37" }}>
            Find Us
          </p>
          <h2 className="text-3xl md:text-4xl font-bold mb-3" style={{ color: "#011F5B" }}>
            Our Academy Locations
          </h2>
          <p className="text-gray-500 mb-10 max-w-xl">
            Visit any of our branches to begin your journey. Our instructors are available during training hours.
          </p>

          {locations.length === 0 ? (
            <p className="text-gray-500 text-sm">Location details coming soon. Please check back later.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {locations.map((loc) => (
                <div
                  key={loc.id}
                  className="rounded-2xl p-6 border"
                  style={{ background: "#F8F9FC", borderColor: "#e5e7eb" }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: "#011F5B" }}
                    >
                      <MapPin size={16} style={{ color: "#D4AF37" }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-base mb-1" style={{ color: "#011F5B" }}>
                        {loc.name}
                      </h3>
                      <p className="text-gray-600 text-sm">{loc.address}</p>
                      <p className="text-gray-600 text-sm">
                        {loc.city}{loc.state ? `, ${loc.state}` : ""}
                      </p>
                      {loc.phone && (
                        <a
                          href={`tel:${loc.phone}`}
                          className="text-sm font-medium mt-2 inline-block hover:underline"
                          style={{ color: "#D4AF37" }}
                        >
                          {loc.phone}
                        </a>
                      )}
                      {loc.hours && (
                        <p className="text-xs text-gray-400 mt-1">{loc.hours}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA / APPLICATION ── */}
      <section
        className="relative overflow-hidden py-24 px-6 text-center"
        style={{ background: "#011F5B" }}
      >
        {/* stripe texture */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 20px, rgba(212,175,55,0.03) 20px, rgba(212,175,55,0.03) 40px)",
          }}
        />
        <div
          className="absolute rounded-full pointer-events-none"
          style={{ width: 320, height: 320, top: -80, right: -80, background: "#D4AF37", opacity: 0.06 }}
        />

        <div className="relative max-w-2xl mx-auto">
          {!showApplicationForm && !applicationSubmitted && (
            <>
              <p className="text-xs font-semibold tracking-widest uppercase mb-4" style={{ color: "#D4AF37" }}>
                {academyStatus === "opened" ? "Enrol today" : "Applications closed"}
              </p>
              <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-5">
                {content.ctaTitle}
              </h2>
              <p className="text-white/65 text-lg mb-10 leading-relaxed">{content.ctaSubtitle}</p>

              {academyStatus === "opened" ? (
                <>
                  <button
                    onClick={() => setShowApplicationForm(true)}
                    className="inline-flex items-center gap-2 px-10 py-4 rounded-full font-bold text-sm transition-opacity hover:opacity-90"
                    style={{ background: "#D4AF37", color: "#3B1A00" }}
                  >
                    {content.ctaButtonText} <ChevronRight size={16} />
                  </button>
                  <p className="mt-5 text-xs text-white/40">Acceptance Fee: ₦30,000 · Non-refundable</p>
                </>
              ) : (
                <div
                  className="inline-flex flex-col items-center gap-3 px-10 py-6 rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)" }}
                >
                  <span style={{ fontSize: 32 }}>🔒</span>
                  <p className="text-white/80 font-semibold text-base">Academy is currently closed</p>
                  <p className="text-white/50 text-sm max-w-xs text-center leading-relaxed">
                    We are not accepting applications at this time. Check back soon or contact us for more information.
                  </p>
                </div>
              )}
            </>
          )}

          {/* ── APPLICATION FORM ── */}
          {showApplicationForm && !applicationSubmitted && (
            <div className="bg-white rounded-3xl p-8 text-left shadow-2xl">
              <h2 className="text-2xl font-bold mb-6" style={{ color: "#011F5B" }}>
                Academy Application Form
              </h2>

              <form onSubmit={handleApplicationSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    <User size={15} /> Full Name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800"
                    style={{ focusRingColor: "#011F5B" }}
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    <Mail size={15} /> Email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    <Phone size={15} /> Phone Number <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+234 8XX XXX XXXX"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="flex items-center gap-2 text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    <Briefcase size={15} /> Relevant Experience
                    <span className="text-gray-400 font-normal text-xs">(optional)</span>
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    placeholder="Any experience with furniture design, woodworking, or interior design"
                    rows={3}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800 resize-none"
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    Why do you want to join? <span className="text-red-400">*</span>
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    placeholder="Tell us about your goals and motivation"
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800 resize-none"
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5" style={{ color: "#011F5B" }}>
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-sm outline-none focus:ring-2 bg-gray-50 text-gray-800"
                  >
                    <option value="">Select your availability</option>
                    <option value="fulltime">Full-time</option>
                    <option value="parttime">Part-time</option>
                    <option value="weekends">Weekends only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-white transition-opacity hover:opacity-90"
                    style={{ background: "#011F5B" }}
                  >
                    Submit Application
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowApplicationForm(false)}
                    className="flex-1 py-3 rounded-xl font-semibold text-sm text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ── SUCCESS ── */}
          {applicationSubmitted && (
            <div className="bg-white rounded-3xl p-10 text-center shadow-2xl">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5"
                style={{ background: "rgba(15,110,86,0.1)" }}
              >
                <CheckCircle size={32} style={{ color: "#0F6E56" }} />
              </div>
              <h2 className="text-2xl font-bold mb-3" style={{ color: "#011F5B" }}>
                Application Submitted!
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                Thank you for applying to TimmyLux Academy. We will review your application and contact you shortly.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Academy;