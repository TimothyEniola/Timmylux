import { useState, useEffect } from "react";
import { Save, Edit3, Plus, Trash2, CheckCircle, Clock, X } from "lucide-react";

export default function AdminAcademy() {
  const [activeTab, setActiveTab] = useState("content");
  const [isEditing, setIsEditing] = useState(false);
  const [applications, setApplications] = useState([]);
  const [selectedApp, setSelectedApp] = useState(null);
  const [content, setContent] = useState({
    heroTitle: "TimmyLux Academy",
    heroSubtitle: "Become a skilled furniture designer and interior craftsman. Learn practical, real-world skills and build a career in luxury furniture.",
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
    ctaButtonText: "Apply Now"
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
    </div>
  );
}