export const defaultAcademyContent = {
  heroTitle: "TimmyLux Academy",
  heroSubtitle: "Become a skilled furniture designer and interior craftsman. Learn practical, real-world skills and build a career in luxury furniture.",
  heroStats: [
    { num: "6mo", label: "Intensive program" },
    { num: "4+", label: "Core skill areas" },
    { num: "100%", label: "Hands-on training" },
    { num: "₦100k", label: "Total fee (2 installments)" },
  ],
  requirementsTitle: "Admission Requirements",
  requirements: [
    { title: "Basic Education", description: "Applicants should have at least a secondary school education and basic understanding of English." },
    { title: "Passion for Craft", description: "You must have a strong interest in furniture design, woodworking, or interior styling." },
    { title: "Commitment", description: "Willingness to complete the full training program and participate in hands-on sessions." },
    { title: "Acceptance Fee", description: "A non-refundable acceptance fee of ₦30,000 is required upon admission." },
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
  rulesDescription: "A safe and focused environment is essential. All students must follow academy rules before admission.",
  rules: [
    { title: "No Smoking", description: "Smoking is strictly prohibited anywhere on academy premises." },
    { title: "No Drinking", description: "Alcohol and intoxicants are not allowed in the academy environment." },
    { title: "No Fighting", description: "Physical fights or disorderly conduct will result in immediate removal." },
    { title: "No Cultist Activity", description: "Any cult-related behavior, symbols, or gatherings are banned." },
    { title: "Respect Instructors", description: "Listen to trainers, arrive on time, and stay focused during sessions." },
  ],
  disciplineTitle: "Discipline Guidelines",
  disciplineText: "Students must maintain professionalism, respect instructors and peers, keep the learning space clean, and follow all training schedules. Failure to comply may lead to dismissal from the program.",
  statusOpenText: "The academy is open for applications. Students can apply, view the program details, and complete the admission process.",
  statusClosedText: "The academy is currently closed. Students will see a notification that it is not open yet and will be notified when applications reopen.",
  graduationNote: "Final year students will complete graduation after finishing the academy program and paying the required fees.",
};

export function loadAcademyContent() {
  if (typeof window === "undefined") return defaultAcademyContent;
  try {
    const saved = JSON.parse(window.localStorage.getItem("academyContent") || "{}");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return defaultAcademyContent;
    return {
      ...defaultAcademyContent,
      ...saved,
      heroStats: Array.isArray(saved.heroStats) ? saved.heroStats : defaultAcademyContent.heroStats,
      requirements: Array.isArray(saved.requirements) ? saved.requirements : defaultAcademyContent.requirements,
      program: Array.isArray(saved.program) ? saved.program : defaultAcademyContent.program,
      offerings: Array.isArray(saved.offerings) ? saved.offerings : defaultAcademyContent.offerings,
      rules: Array.isArray(saved.rules) ? saved.rules : defaultAcademyContent.rules,
    };
  } catch {
    return defaultAcademyContent;
  }
}
