import { Link } from "react-router-dom";

const About = () => {
  return (
    <div className="w-full bg-white">
      {/* Hero Section */}
      <section className="bg-[#011F5B] text-white py-24 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            TimmyLux Furniture & Interior
          </h1>
          <p className="text-gray-200 text-xl md:text-2xl max-w-3xl mx-auto">
            Professional bespoke furniture & interior solutions — designed and led by our CEO, Timmy Lux.
          </p>
        </div>
      </section>

      {/* CEO Message Section */}
      <section className="py-16 px-6 bg-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* CEO Text */}
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold mb-4 text-[#011F5B]">A Message from the CEO</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              Hi, I’m <strong>Timmy Lux</strong>, founder and CEO of TimmyLux Furniture & Interior. Over the past decade I’ve poured my passion for design and craftsmanship into building a company that creates not just furniture, but lasting experiences. As a designer, maker, and entrepreneur, I believe that every piece we create should tell a story and elevate the spaces where people live, work, and gather.
            </p>
            <p className="text-gray-700 mb-4 leading-relaxed">
              This portfolio is a snapshot of the work we’re proud of—tailor-made projects that reflect our commitment to quality, innovation, and customer satisfaction. Thank you for taking the time to learn more about our journey. I invite you to explore our portfolio and see what we can build together.
            </p>
            <Link
              to="/custom-request"
              className="inline-block mt-4 bg-[#D4AF37] hover:bg-[#b8942a] text-white font-semibold px-8 py-3 rounded-full transition-all duration-300 shadow-lg"
            >
              Reach Out to Me
            </Link>
          </div>

          {/* CEO pic */}
          <div className="order-1 md:order-2 flex justify-center">
            <div className="w-80 h-80 relative rounded-full overflow-hidden shadow-lg bg-gray-300">
              {/* background accent image that covers the lower part */}
              <img
                src="src/assets/ceo.png"
                alt="Background accent"
                className="w-full h-full object-cover object-bottom"
              />
            </div>
          </div>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Who We Are</h2>
            <p className="text-gray-700 mb-4 leading-relaxed">
              At TimmyLux Furniture & Interior, we specialize in creating
              premium, custom-made furniture and delivering exceptional interior
              solutions that combine comfort, durability, and elegant design. We
              believe every space tells a story, and our mission is to transform
              homes, offices, and commercial spaces into beautiful, functional
              environments that reflect your unique style and personality.
            </p>

            <p className="text-gray-700 mb-4 leading-relaxed">
              With a strong commitment to quality craftsmanship, we carefully
              select high-grade materials and apply skilled workmanship to
              ensure every piece we create meets the highest standards. From
              modern and contemporary designs to classic and luxury finishes,
              our team brings creativity, precision, and passion into every
              project.
            </p>
          </div>

          {/* Workshop Image */}
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.pexels.com/photos/7109998/pexels-photo-7109998.jpeg"
              alt="Craftsman working on wooden furniture - Daniel Reche on Pexels"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Portfolio / Resume Section */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 border-b-4 border-[#D4AF37] pb-2">
            Portfolio & Professional Profile
          </h2>

          {/* Contact & Summary */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
            <p className="text-lg font-semibold">YEMITAN TIMOTHY ENIOLA</p>
            <p className="text-gray-700">📍 Ogun, Nigeria</p>
            <p className="text-gray-700">📞 +234 8140838535</p>
            <p className="text-gray-700">📧 timothyyemitan@gmail.com</p>
            <p className="text-gray-700">
              🌐 Portfolio: <a href="https://timmyluxfurniture-interiorcreation.vercel.app/" className="text-blue-600 underline">timmyluxfurniture-interiorcreation.vercel.app</a> | Instagram: <a href="https://instagram.com/timmy_lux" className="text-blue-600 underline">@timmy_lux</a>
            </p>
          </div>

          <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Professional Summary</h3>
            <p className="text-gray-700 leading-relaxed">
              Creative and detail-oriented Furniture Maker & Interior Designer with over 8 years of experience designing, crafting, and installing custom furniture and interior solutions for residential and commercial spaces. Skilled in space planning, woodworking, 3D visualization, material selection, and client consultation. Passionate about delivering functional, aesthetically pleasing, and durable designs tailored to client needs.
            </p>
          </div>

          {/* Two-column competencies and experience */}
          <div className="md:flex md:space-x-8">
            <div className="md:w-1/2 mb-8 md:mb-0 p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Core Competencies</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-1">
                <li>Custom Furniture Design</li>
                <li>Interior Space Planning</li>
                <li>Cabinetry & Joinery</li>
                <li>3D Rendering & Visualization</li>
                <li>Material & Finish Selection</li>
                <li>Project Management</li>
                <li>Cost Estimation & Budgeting</li>
                <li>Site Supervision</li>
                <li>Client Relationship Management</li>
              </ul>
            </div>
            <div className="md:w-1/2 p-6 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-2">Professional Experience</h3>
              <div className="text-gray-700 space-y-4">
                <div>
                  <p className="font-semibold">Senior Furniture Maker & Interior Designer</p>
                  <p>[Timmy-lux Furniture & Interior Creation] – OGUN, Nigeria (Present)</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Designed and fabricated custom furniture pieces including wardrobes, kitchen cabinets, TV consoles, office desks, and luxury bed frames.</li>
                    <li>Developed interior concepts from initial sketches to final installation.</li>
                    <li>Produced 2D drawings and 3D models using AutoCAD and SketchUp.</li>
                    <li>Supervised workshop production and on-site installations.</li>
                    <li>Managed project budgets and ensured timely delivery.</li>
                    <li>Collaborated with electricians, painters, and other artisans to complete projects.</li>
                    <li><strong>Key Achievement:</strong> Successfully delivered over 50+ residential projects with 95% client satisfaction rate.</li>
                  </ul>
                </div>
                <div>
                  <p className="font-semibold">Furniture Craftsman / Interior Assistant</p>
                  <p>[Sambright Furniture Company] – OGUN, Nigeria (01/2020 – 10/2023)</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>Assisted in furniture production and finishing.</li>
                    <li>Installed kitchen cabinets and wardrobes.</li>
                    <li>Measured spaces and prepared cutting lists.</li>
                    <li>Maintained workshop tools and ensured safety compliance.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Education & Projects */}
          <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Education</h3>
            <p className="text-gray-700">Diploma / B.Sc. in Software Engineering – Lead City University (Ibadan)</p>
            <p className="text-gray-700">Technical Certification in Carpentry & Furniture Making – Y-mayok Nig Ent Limited (Owode)</p>
          </div>

          <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Project Highlights</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li><strong>Luxury 3-Bedroom Apartment Interior – Abuja</strong> – Designed full interior concept including custom wardrobes, kitchen cabinetry, and TV units. Delivered project within 6 weeks.</li>
              <li><strong>Modern Office Workspace – Lagos</strong> – Designed and produced workstations and conference tables. Improved space efficiency by 30%.</li>
            </ul>
          </div>

          <div className="mb-12 p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Certifications</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1">
              <li>Interior Design Certification</li>
              <li>Health &amp; Safety Training</li>
              <li>Professional Furniture Maker Certification</li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-2">Personal Attributes</h3>
            <p className="text-gray-700">Strong attention to detail • Excellent communication skills • Creative problem-solving • Ability to work under pressure</p>
          </div>
        </div>
      </section>

      {/* Our Values Section */}
      <section className="py-16 px-6 bg-gradient-to-br from-gray-50 to-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            Our Core Values
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            The principles that guide everything we create
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#011F5B]">
                Quality First
              </h3>
              <p className="text-gray-600">
                We never compromise on materials or craftsmanship. Every piece
                is built to last generations.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#011F5B]">
                Custom Excellence
              </h3>
              <p className="text-gray-600">
                Your vision, our expertise. We create furniture that perfectly
                matches your style and space.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-[#D4AF37] text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="font-bold text-xl mb-3 text-[#011F5B]">
                Customer Delight
              </h3>
              <p className="text-gray-600">
                From consultation to installation, we're committed to exceeding
                your expectations.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
            What We Do
          </h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-12">
            Comprehensive furniture and interior solutions for every space
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#D4AF37]">
              <div className="text-3xl mb-3">🛋️</div>
              <h3 className="font-semibold text-lg mb-2 text-[#011F5B]">
                Custom Furniture
              </h3>
              <p className="text-gray-600 text-sm">
                Bespoke sofas, beds, wardrobes, tables, TV stands, and more —
                designed to match your space and taste perfectly.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#D4AF37]">
              <div className="text-3xl mb-3">🎨</div>
              <h3 className="font-semibold text-lg mb-2 text-[#011F5B]">
                Interior Design
              </h3>
              <p className="text-gray-600 text-sm">
                Complete interior solutions including space planning, color
                coordination, and styling for homes and offices.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#D4AF37]">
              <div className="text-3xl mb-3">🏢</div>
              <h3 className="font-semibold text-lg mb-2 text-[#011F5B]">
                Office & Commercial
              </h3>
              <p className="text-gray-600 text-sm">
                Professional office furniture and interior setups for
                productivity, comfort, and modern business environments.
              </p>
            </div>

            <div className="bg-gray-50 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow border-t-4 border-[#D4AF37]">
              <div className="text-3xl mb-3">✨</div>
              <h3 className="font-semibold text-lg mb-2 text-[#011F5B]">
                Renovation & Upgrades
              </h3>
              <p className="text-gray-600 text-sm">
                Transforming existing spaces with modern furniture upgrades and
                fresh interior redesigns.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
            <img
              src="https://images.unsplash.com/photo-1760072513357-9d450e935a80?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxMHx8bW9kZXJuJTIwaW50ZXJpb3IlMjBkZXNpZ24lMjBsaXZpbmclMjByb29tJTIwd2l0aCUyMGx1eHVyeSUyMGZ1cm5pdHVyZXxlbnwwfDB8fHwxNzY5MzYwMTM2fDA&ixlib=rb-4.1.0&q=85"
              alt="Modern living room with luxury furniture - Obegi Home on Unsplash"
              className="w-full h-full object-cover"
            />
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-[#011F5B]">
              Why Choose TimmyLux
            </h2>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] text-xl font-bold">✓</span>
                <span>
                  <strong>Premium Quality:</strong> High-grade materials and
                  expert craftsmanship in every piece
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] text-xl font-bold">✓</span>
                <span>
                  <strong>Custom Designs:</strong> Tailored furniture that
                  perfectly matches your vision and space
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] text-xl font-bold">✓</span>
                <span>
                  <strong>Transparent Pricing:</strong> Affordable rates with no
                  hidden costs or surprises
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] text-xl font-bold">✓</span>
                <span>
                  <strong>Timely Delivery:</strong> Professional installation
                  and on-schedule completion
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-[#D4AF37] text-xl font-bold">✓</span>
                <span>
                  <strong>Exceptional Service:</strong> Dedicated customer
                  support and comprehensive after-sales care
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Call To Action */}
      <section className="bg-[#011F5B] text-white py-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Let's Build Your Dream Space
          </h2>
          <p className="text-gray-200 text-lg mb-8 max-w-2xl mx-auto">
            Contact TimmyLux Furniture & Interior today and let us bring your
            vision to life with style, comfort, and quality.
          </p>
          <a href="/custom-request" className="inline-block bg-[#D4AF37] hover:bg-[#b8942a] text-white font-semibold px-10 py-4 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
            Get a Free Consultation
          </a>
        </div>
      </section>
    </div>
  );
};

export default About;
