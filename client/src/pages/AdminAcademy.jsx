import { useState, useEffect } from "react";
import { Save, Edit3, Plus, Trash2, CheckCircle, Clock, X } from "lucide-react";

export default function AdminAcademy() {
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [academyStatus, setAcademyStatus] = useState("closed"); // "opened" or "closed"
  const [graduationStudents, setGraduationStudents] = useState([]);
  const [content, setContent] = useState({
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
      {
        title: "Basic Education",
        description: "Applicants should have at least a secondary school education and basic understanding of English."
      },
      {
        title: "Passion for Craft",
        description: "You must have a strong interest in furniture design, woodworking, or interior styling."
      },
      {
        title: "Commitment",
        description: "Willingness to complete the full training program and participate in hands-on sessions."
      },
      {
        title: "Acceptance Fee",
        description: "A non-refundable acceptance fee of ₦30,000 is required upon admission."
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
        description: "Work directly with tools, materials, and real client projects."
      },
      {
        title: "Mentorship",
        description: "Learn directly from experienced craftsmen and designers."
      },
      {
        title: "Certification",
        description: "Receive a TimmyLux Academy certificate upon successful completion."
      }
    ],
    sectionTitle: "What You Will Learn",
    offerings: [
      {
        title: "Furniture Design",
        description: "Understand modern and luxury furniture design principles and concepts."
      },
      {
        title: "Woodworking Skills",
        description: "Learn cutting, shaping, polishing, and finishing techniques."
      },
      {
        title: "Interior Design Basics",
        description: "Understand how furniture fits into complete interior spaces."
      },
      {
        title: "Business & Client Work",
        description: "Learn how to work with clients, pricing, and running your own furniture business."
      }
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
    graduationNote: "Final year students will complete graduation after finishing the academy program and paying the required fees." 
  });

  // Load content from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('academyContent');
    if (saved) {
      setContent(JSON.parse(saved));
    }
    
    // Load applications
    const savedApps = localStorage.getItem('academyApplications');
    if (savedApps) {
      setApplications(JSON.parse(savedApps));
    }

    // Load academy status
    const savedStatus = localStorage.getItem('academyStatus');
    if (savedStatus) {
      setAcademyStatus(savedStatus);
    }

    // Load graduation students
    const savedGraduates = localStorage.getItem('graduationStudents');
    if (savedGraduates) {
      setGraduationStudents(JSON.parse(savedGraduates));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('academyContent', JSON.stringify(content));
    setIsEditing(false);
    alert('Academy content saved successfully!');
  };

  const updateContent = (field, value) => {
    setContent(prev => ({ ...prev, [field]: value }));
  };

  const updateOffering = (index, field, value) => {
    const newOfferings = [...content.offerings];
    newOfferings[index][field] = value;
    setContent(prev => ({ ...prev, offerings: newOfferings }));
  };

  const updateRequirement = (index, field, value) => {
    const newRequirements = [...content.requirements];
    newRequirements[index][field] = value;
    setContent(prev => ({ ...prev, requirements: newRequirements }));
  };

  const updateProgram = (index, field, value) => {
    const newProgram = [...content.program];
    newProgram[index][field] = value;
    setContent(prev => ({ ...prev, program: newProgram }));
  };

  const updateRule = (index, field, value) => {
    const newRules = [...content.rules];
    newRules[index][field] = value;
    setContent(prev => ({ ...prev, rules: newRules }));
  };

  const addRequirement = () => {
    setContent(prev => ({
      ...prev,
      requirements: [...prev.requirements, { title: "", description: "" }]
    }));
  };

  const removeRequirement = (index) => {
    setContent(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const addRule = () => {
    setContent(prev => ({
      ...prev,
      rules: [...prev.rules, { title: "", description: "" }]
    }));
  };

  const removeRule = (index) => {
    setContent(prev => ({
      ...prev,
      rules: prev.rules.filter((_, i) => i !== index)
    }));
  };

  // Application Management Functions
  const updateApplicationStatus = (appId, newStatus) => {
    const updatedApps = applications.map(app =>
      app.id === appId ? { ...app, status: newStatus } : app
    );
    setApplications(updatedApps);
    localStorage.setItem('academyApplications', JSON.stringify(updatedApps));
  };

  const deleteApplication = (appId) => {
    if (confirm('Are you sure you want to delete this application?')) {
      const updatedApps = applications.filter(app => app.id !== appId);
      setApplications(updatedApps);
      localStorage.setItem('academyApplications', JSON.stringify(updatedApps));
      setSelectedApp(null);
    }
  };

  // Academy Status Management
  const toggleAcademyStatus = () => {
    const newStatus = academyStatus === "opened" ? "closed" : "opened";
    setAcademyStatus(newStatus);
    localStorage.setItem('academyStatus', newStatus);
    alert(`Academy is now ${newStatus}`);
  };

  // Graduation Management
  const addToGraduation = (appId) => {
    const app = applications.find(a => a.id === appId);
    if (app) {
      const newGraduates = [...graduationStudents, { ...app, graduationDate: new Date().toISOString() }];
      setGraduationStudents(newGraduates);
      localStorage.setItem('graduationStudents', JSON.stringify(newGraduates));
      alert(`${app.fullName} has been added to graduation list`);
    }
  };

  const removeFromGraduation = (appId) => {
    const newGraduates = graduationStudents.filter(g => g.id !== appId);
    setGraduationStudents(newGraduates);
    localStorage.setItem('graduationStudents', JSON.stringify(newGraduates));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-[#011F5B]">Academy Management</h1>
        <div className="flex gap-2">
          {activeTab === "content" && !isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-[#D4AF37] hover:bg-[#b8942a] text-white px-4 py-2 rounded-lg transition"
            >
              <Edit3 size={18} />
              Edit Content
            </button>
          ) : activeTab === "content" && isEditing ? (
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition"
            >
              <Save size={18} />
              Save Changes
            </button>
          ) : null}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6">
        <button
          onClick={() => setActiveTab("content")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "content"
              ? "border-[#011F5B] text-[#011F5B]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Content Editor
        </button>
        <button
          onClick={() => setActiveTab("applications")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "applications"
              ? "border-[#011F5B] text-[#011F5B]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Applications ({applications.length})
        </button>
        <button
          onClick={() => setActiveTab("status")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "status"
              ? "border-[#011F5B] text-[#011F5B]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Academy Status
        </button>
        <button
          onClick={() => setActiveTab("graduation")}
          className={`px-6 py-3 font-medium border-b-2 transition-colors ${
            activeTab === "graduation"
              ? "border-[#011F5B] text-[#011F5B]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Graduation ({graduationStudents.length})
        </button>
      </div>

      {/* Content Tab */}
      {activeTab === "content" && (
        <div className="space-y-6">
        {/* Hero Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Hero Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={content.heroTitle}
                  onChange={(e) => updateContent('heroTitle', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.heroTitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              {isEditing ? (
                <textarea
                  value={content.heroSubtitle}
                  onChange={(e) => updateContent('heroSubtitle', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.heroSubtitle}</p>
              )}
            </div>
          </div>
        </div>

        {/* Requirements Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Requirements Section</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Title</label>
            {isEditing ? (
              <input
                type="text"
                value={content.requirementsTitle}
                onChange={(e) => updateContent('requirementsTitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.requirementsTitle}</p>
            )}
          </div>
          <div className="space-y-4">
            {content.requirements.map((requirement, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="flex justify-between items-start gap-3">
                  <div className="w-full space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Requirement Title</label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={requirement.title}
                          onChange={(e) => updateRequirement(index, 'title', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">{requirement.title}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Requirement Description</label>
                      {isEditing ? (
                        <textarea
                          value={requirement.description}
                          onChange={(e) => updateRequirement(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded h-24"
                        />
                      ) : (
                        <p className="p-2 bg-gray-50 rounded">{requirement.description}</p>
                      )}
                    </div>
                  </div>
                  {isEditing && content.requirements.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeRequirement(index)}
                      className="mt-1 p-2 text-red-600 hover:text-red-800 rounded-full border border-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addRequirement}
              className="inline-flex items-center gap-2 bg-[#011F5B] text-white px-4 py-2 rounded-lg hover:bg-[#0b2b65] transition"
            >
              <Plus size={16} />
              Add Requirement
            </button>
          )}
        </div>

        {/* Program Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Program Section</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Title</label>
            {isEditing ? (
              <input
                type="text"
                value={content.programTitle}
                onChange={(e) => updateContent('programTitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.programTitle}</p>
            )}
          </div>
          <div className="space-y-4">
            {content.program.map((prog, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Program Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={prog.title}
                      onChange={(e) => updateProgram(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{prog.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Program Description</label>
                  {isEditing ? (
                    <textarea
                      value={prog.description}
                      onChange={(e) => updateProgram(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded h-20"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{prog.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Offerings Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Offerings Section</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Title</label>
            {isEditing ? (
              <input
                type="text"
                value={content.sectionTitle}
                onChange={(e) => updateContent('sectionTitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.sectionTitle}</p>
            )}
          </div>
          <div className="space-y-4">
            {content.offerings.map((offering, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={offering.title}
                      onChange={(e) => updateOffering(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{offering.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  {isEditing ? (
                    <textarea
                      value={offering.description}
                      onChange={(e) => updateOffering(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded h-20"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{offering.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Rules Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Rules Section</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Title</label>
            {isEditing ? (
              <input
                type="text"
                value={content.rulesTitle}
                onChange={(e) => updateContent('rulesTitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.rulesTitle}</p>
            )}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Section Description</label>
            {isEditing ? (
              <textarea
                value={content.rulesDescription}
                onChange={(e) => updateContent('rulesDescription', e.target.value)}
                className="w-full p-2 border rounded h-20"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.rulesDescription}</p>
            )}
          </div>
          <div className="space-y-4">
            {content.rules.map((rule, index) => (
              <div key={index} className="border p-4 rounded">
                <div className="mb-2">
                  <label className="block text-sm font-medium mb-1">Rule Title</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={rule.title}
                      onChange={(e) => updateRule(index, 'title', e.target.value)}
                      className="w-full p-2 border rounded"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{rule.title}</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Rule Description</label>
                  {isEditing ? (
                    <textarea
                      value={rule.description}
                      onChange={(e) => updateRule(index, 'description', e.target.value)}
                      className="w-full p-2 border rounded h-20"
                    />
                  ) : (
                    <p className="p-2 bg-gray-50 rounded">{rule.description}</p>
                  )}
                </div>
                {isEditing && content.rules.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeRule(index)}
                    className="mt-3 text-red-600 hover:text-red-800 text-sm"
                  >
                    Remove rule
                  </button>
                )}
              </div>
            ))}
          </div>
          {isEditing && (
            <button
              type="button"
              onClick={addRule}
              className="inline-flex items-center gap-2 bg-[#011F5B] text-white px-4 py-2 rounded-lg hover:bg-[#0b2b65] transition"
            >
              <Plus size={16} />
              Add Rule
            </button>
          )}
        </div>

        {/* Discipline Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Discipline Section</h2>
          <div>
            <label className="block text-sm font-medium mb-1">Section Title</label>
            {isEditing ? (
              <input
                type="text"
                value={content.disciplineTitle}
                onChange={(e) => updateContent('disciplineTitle', e.target.value)}
                className="w-full p-2 border rounded"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.disciplineTitle}</p>
            )}
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium mb-1">Discipline Text</label>
            {isEditing ? (
              <textarea
                value={content.disciplineText}
                onChange={(e) => updateContent('disciplineText', e.target.value)}
                className="w-full p-2 border rounded h-24"
              />
            ) : (
              <p className="p-2 bg-gray-50 rounded">{content.disciplineText}</p>
            )}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Call to Action Section</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaTitle}
                  onChange={(e) => updateContent('ctaTitle', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.ctaTitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              {isEditing ? (
                <textarea
                  value={content.ctaSubtitle}
                  onChange={(e) => updateContent('ctaSubtitle', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.ctaSubtitle}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Button Text</label>
              {isEditing ? (
                <input
                  type="text"
                  value={content.ctaButtonText}
                  onChange={(e) => updateContent('ctaButtonText', e.target.value)}
                  className="w-full p-2 border rounded"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.ctaButtonText}</p>
              )}
            </div>
          </div>
        </div>

        {/* Status Notices Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Status Notices</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Open Status Message</label>
              {isEditing ? (
                <textarea
                  value={content.statusOpenText}
                  onChange={(e) => updateContent('statusOpenText', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.statusOpenText}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Closed Status Message</label>
              {isEditing ? (
                <textarea
                  value={content.statusClosedText}
                  onChange={(e) => updateContent('statusClosedText', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.statusClosedText}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Graduation Note</label>
              {isEditing ? (
                <textarea
                  value={content.graduationNote}
                  onChange={(e) => updateContent('graduationNote', e.target.value)}
                  className="w-full p-2 border rounded h-20"
                />
              ) : (
                <p className="p-2 bg-gray-50 rounded">{content.graduationNote}</p>
              )}
            </div>
          </div>
        </div>
        </div>
      )}

      {/* Applications Tab */}
      {activeTab === "applications" && (
        <div className="space-y-6">
          {selectedApp ? (
            // Application Detail View
            <div className="bg-white p-6 rounded-lg shadow-md">
              <button
                onClick={() => setSelectedApp(null)}
                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
              >
                ← Back to Applications
              </button>

              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-[#011F5B]">
                      {selectedApp.fullName}
                    </h2>
                    <p className="text-gray-600 text-sm">
                      Applied on: {new Date(selectedApp.submittedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <select
                      value={selectedApp.status}
                      onChange={(e) => {
                        updateApplicationStatus(selectedApp.id, e.target.value);
                        setSelectedApp({
                          ...selectedApp,
                          status: e.target.value,
                        });
                      }}
                      className={`px-4 py-2 rounded-lg font-medium ${
                        selectedApp.status === "approved"
                          ? "bg-green-100 text-green-700"
                          : selectedApp.status === "rejected"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="approved">Approved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                    <button
                      onClick={() => deleteApplication(selectedApp.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Delete
                    </button>
                  </div>
                </div>

                <div className="border-t pt-4 grid grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Email</h3>
                    <p className="text-gray-900">{selectedApp.email}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-2">Phone</h3>
                    <p className="text-gray-900">{selectedApp.phone}</p>
                  </div>
                  {selectedApp.availability && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Availability
                      </h3>
                      <p className="text-gray-900 capitalize">
                        {selectedApp.availability}
                      </p>
                    </div>
                  )}
                  {selectedApp.experience && (
                    <div>
                      <h3 className="font-semibold text-gray-700 mb-2">
                        Experience
                      </h3>
                      <p className="text-gray-900">{selectedApp.experience}</p>
                    </div>
                  )}
                </div>

                <div className="border-t pt-4">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Motivation
                  </h3>
                  <p className="text-gray-900 whitespace-pre-wrap">
                    {selectedApp.motivation}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            // Applications List
            <div className="space-y-4">
              {applications.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-md text-center">
                  <p className="text-gray-600 mb-2">No applications yet</p>
                  <p className="text-sm text-gray-400">
                    Applications will appear here when customers submit them
                  </p>
                </div>
              ) : (
                applications.map((app) => (
                  <div
                    key={app.id}
                    className="bg-white p-4 rounded-lg shadow-md border-l-4 border-[#011F5B] hover:shadow-lg transition"
                  >
                    <div className="flex justify-between items-start">
                      <div
                        className="flex-1 cursor-pointer"
                        onClick={() => setSelectedApp(app)}
                      >
                        <h3 className="font-semibold text-lg text-[#011F5B]">
                          {app.fullName}
                        </h3>
                        <p className="text-sm text-gray-600">{app.email}</p>
                        <p className="text-sm text-gray-600">{app.phone}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          Applied:{" "}
                          {new Date(app.submittedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${
                            app.status === "approved"
                              ? "bg-green-100 text-green-700"
                              : app.status === "rejected"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {app.status === "approved" && (
                            <CheckCircle size={16} />
                          )}
                          {app.status === "pending" && (
                            <Clock size={16} />
                          )}
                          {app.status === "rejected" && (
                            <X size={16} />
                          )}
                          {app.status.charAt(0).toUpperCase() +
                            app.status.slice(1)}
                        </span>
                        <button
                          onClick={() => setSelectedApp(app)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Status Tab */}
      {activeTab === "status" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Academy Status Management</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">Current Status</h3>
                  <p className="text-gray-600">
                    Academy is currently <span className={`font-semibold ${academyStatus === "opened" ? "text-green-600" : "text-red-600"}`}>
                      {academyStatus.toUpperCase()}
                    </span>
                  </p>
                </div>
                <button
                  onClick={toggleAcademyStatus}
                  className={`px-6 py-3 rounded-lg font-semibold text-white transition ${
                    academyStatus === "opened"
                      ? "bg-red-600 hover:bg-red-700"
                      : "bg-green-600 hover:bg-green-700"
                  }`}
                >
                  {academyStatus === "opened" ? "Close Academy" : "Open Academy"}
                </button>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-semibold mb-2">Status Information</h4>
                <p className="text-sm text-gray-600">
                  {academyStatus === "opened"
                    ? "The academy is open for applications. Students can submit their applications and view the academy content."
                    : "The academy is closed. Students will see a notification that the academy is not currently accepting applications."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Graduation Tab */}
      {activeTab === "graduation" && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-[#011F5B]">Graduation Management</h2>
            <p className="text-gray-600 mb-6">
              Manage final year students who are ready for graduation. Add approved students here for their graduation ceremony.
            </p>

            {graduationStudents.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No students scheduled for graduation</p>
              </div>
            ) : (
              <div className="space-y-4">
                {graduationStudents.map((student) => (
                  <div key={student.id} className="border p-4 rounded-lg bg-green-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-[#011F5B]">{student.fullName}</h3>
                        <p className="text-sm text-gray-600">{student.email}</p>
                        <p className="text-xs text-gray-500">
                          Graduation Date: {new Date(student.graduationDate).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeFromGraduation(student.id)}
                        className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Add to Graduation Section */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-4 text-[#011F5B]">Add Student to Graduation</h3>
            <div className="space-y-4">
              {applications
                .filter(app => app.status === "approved")
                .filter(app => !graduationStudents.find(g => g.id === app.id))
                .map((app) => (
                  <div key={app.id} className="border p-4 rounded-lg">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-semibold">{app.fullName}</h4>
                        <p className="text-sm text-gray-600">{app.email}</p>
                      </div>
                      <button
                        onClick={() => addToGraduation(app.id)}
                        className="bg-[#D4AF37] text-white px-4 py-2 rounded hover:bg-[#b8942a]"
                      >
                        Add to Graduation
                      </button>
                    </div>
                  </div>
                ))}
              {applications.filter(app => app.status === "approved").length === 0 && (
                <p className="text-gray-500 text-center">No approved students available</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}