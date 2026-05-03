import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, User, Mail, Phone, Briefcase } from "lucide-react";

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
  const [content, setContent] = useState({
    heroTitle: "TimmyLux Academy",
    heroSubtitle:
      "Become a skilled furniture designer and interior craftsman. Learn practical, real-world skills and build a career in luxury furniture.",

    requirementsTitle: "Admission Requirements",
    requirements: [
      {
        title: "Basic Education",
        description:
          "Applicants should have at least a secondary school education and basic understanding of English."
      },
      {
        title: "Passion for Craft",
        description:
          "You must have a strong interest in furniture design, woodworking, or interior styling."
      },
      {
        title: "Commitment",
        description:
          "Willingness to complete the full training program and participate in hands-on sessions."
      },
      {
        title: "Acceptance Fee",
        description:
          "A non-refundable acceptance fee of ₦30,000 is required upon admission."
      }
    ],

    programTitle: "Program Structure",
    program: [
      {
        title: "Duration",
        description: "3 - 6 months intensive training (practical & theory)."
      },
      {
        title: "Hands-on Training",
        description:
          "Work directly with tools, materials, and real client projects."
      },
      {
        title: "Mentorship",
        description:
          "Learn directly from experienced craftsmen and designers."
      },
      {
        title: "Certification",
        description:
          "Receive a TimmyLux Academy certificate upon successful completion."
      }
    ],

    sectionTitle: "What You Will Learn",
    offerings: [
      {
        title: "Furniture Design",
        description:
          "Understand modern and luxury furniture design principles and concepts."
      },
      {
        title: "Woodworking Skills",
        description:
          "Learn cutting, shaping, polishing, and finishing techniques."
      },
      {
        title: "Interior Design Basics",
        description:
          "Understand how furniture fits into complete interior spaces."
      },
      {
        title: "Business & Client Work",
        description:
          "Learn how to work with clients, pricing, and running your own furniture business."
      }
    ],

    ctaTitle: "Start Your Journey Today",
    ctaSubtitle:
      "Take the first step into a profitable and creative career in furniture design.",
    ctaButtonText: "Apply Now"
  });

  useEffect(() => {
    const saved = localStorage.getItem("academyContent");
    if (saved) {
      setContent(JSON.parse(saved));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleApplicationSubmit = (e) => {
    e.preventDefault();
    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.motivation.trim()
    ) {
      alert("Please fill in all required fields");
      return;
    }

    // Save application to localStorage
    const application = {
      id: Date.now().toString(),
      ...formData,
      submittedAt: new Date().toISOString(),
      status: "pending",
    };

    const existingApps = JSON.parse(
      localStorage.getItem("academyApplications") || "[]"
    );
    existingApps.push(application);
    localStorage.setItem("academyApplications", JSON.stringify(existingApps));

    setApplicationSubmitted(true);
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      experience: "",
      motivation: "",
      availability: "",
    });

    setTimeout(() => {
      setApplicationSubmitted(false);
      setShowApplicationForm(false);
    }, 3000);
  };

  return (
    <div className="w-full bg-white">
      {/* HERO */}
      <section className="relative bg-[#011F5B] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6">
            {content.heroTitle}
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto text-gray-200">
            {content.heroSubtitle}
          </p>
        </div>
      </section>

      {/* IMAGE SECTION */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
          <img
            src="https://images.unsplash.com/photo-1582582494700-7b2e7d3c4c1f"
            alt="Workshop"
            className="rounded-2xl shadow-md object-cover h-64 w-full"
          />
          <img
            src="https://images.unsplash.com/photo-1503387762-592deb58ef4e"
            alt="Furniture Design"
            className="rounded-2xl shadow-md object-cover h-64 w-full"
          />
          <img
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6"
            alt="Interior"
            className="rounded-2xl shadow-md object-cover h-64 w-full"
          />
        </div>
      </section>

      {/* REQUIREMENTS */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#011F5B]">
            {content.requirementsTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {content.requirements.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border"
              >
                <h3 className="text-xl font-semibold text-[#011F5B] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROGRAM STRUCTURE */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#011F5B]">
            {content.programTitle}
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {content.program.map((item, index) => (
              <div
                key={index}
                className="bg-[#F8FAFC] p-6 rounded-2xl shadow-sm"
              >
                <h3 className="text-xl font-semibold text-[#011F5B] mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-700">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT YOU WILL LEARN */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold mb-10 text-center text-[#011F5B]">
            {content.sectionTitle}
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {content.offerings.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-xl shadow-md"
              >
                <h3 className="text-lg font-semibold text-[#011F5B] mb-2">
                  {item.title}
                </h3>
                <p className="text-gray-700 text-sm">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA - APPLICATION FORM */}
      <section className="py-20 px-6 bg-[#D4AF37] text-white text-center">
        <div className="max-w-3xl mx-auto">
          {!showApplicationForm && !applicationSubmitted && (
            <>
              <h2 className="text-4xl font-bold mb-4">
                {content.ctaTitle}
              </h2>
              <p className="text-lg mb-8">
                {content.ctaSubtitle}
              </p>

              <button
                onClick={() => setShowApplicationForm(true)}
                className="bg-[#011F5B] px-10 py-4 rounded-full font-semibold hover:opacity-90 transition"
              >
                {content.ctaButtonText}
              </button>

              <p className="mt-6 text-sm text-white/80">
                Acceptance Fee: ₦30,000 (Non-refundable)
              </p>
            </>
          )}

          {showApplicationForm && !applicationSubmitted && (
            <form onSubmit={handleApplicationSubmit} className="bg-white text-gray-900 p-8 rounded-2xl">
              <h2 className="text-2xl font-bold text-[#011F5B] mb-6">
                Academy Application Form
              </h2>

              <div className="space-y-4 text-left">
                {/* Full Name */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-[#011F5B] mb-2">
                    <User size={18} /> Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    placeholder="Enter your full name"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-[#011F5B] mb-2">
                    <Mail size={18} /> Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-[#011F5B] mb-2">
                    <Phone size={18} /> Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    placeholder="+234 8XX XXX XXXX"
                  />
                </div>

                {/* Experience */}
                <div>
                  <label className="flex items-center gap-2 font-semibold text-[#011F5B] mb-2">
                    <Briefcase size={18} /> Relevant Experience
                  </label>
                  <textarea
                    name="experience"
                    value={formData.experience}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    placeholder="Any experience with furniture design, woodworking, or interior design (optional)"
                    rows="3"
                  />
                </div>

                {/* Motivation */}
                <div>
                  <label className="block font-semibold text-[#011F5B] mb-2">
                    Why do you want to join our academy? *
                  </label>
                  <textarea
                    name="motivation"
                    value={formData.motivation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                    placeholder="Tell us about your goals and motivation"
                    rows="4"
                    required
                  />
                </div>

                {/* Availability */}
                <div>
                  <label className="block font-semibold text-[#011F5B] mb-2">
                    Availability
                  </label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#011F5B]"
                  >
                    <option value="">Select your availability</option>
                    <option value="fulltime">Full-time</option>
                    <option value="parttime">Part-time</option>
                    <option value="weekends">Weekends only</option>
                    <option value="flexible">Flexible</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-8">
                <button
                  type="submit"
                  className="flex-1 bg-[#011F5B] text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setShowApplicationForm(false)}
                  className="flex-1 bg-gray-300 text-gray-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {applicationSubmitted && (
            <div className="bg-white text-center p-8 rounded-2xl">
              <div className="flex justify-center mb-4">
                <CheckCircle size={64} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-[#011F5B] mb-2">
                Application Submitted!
              </h2>
              <p className="text-gray-700">
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