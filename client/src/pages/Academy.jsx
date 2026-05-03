import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Academy = () => {
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

      {/* CTA */}
      <section className="py-20 px-6 bg-[#D4AF37] text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-4">
            {content.ctaTitle}
          </h2>
          <p className="text-lg mb-8">
            {content.ctaSubtitle}
          </p>

          <Link
            to="/custom-request"
            className="bg-[#011F5B] px-10 py-4 rounded-full font-semibold hover:opacity-90 transition"
          >
            {content.ctaButtonText}
          </Link>

          <p className="mt-6 text-sm text-white/80">
            Acceptance Fee: ₦30,000 (Non-refundable)
          </p>
        </div>
      </section>
    </div>
  );
};

export default Academy;