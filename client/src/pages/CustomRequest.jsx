import { useEffect, useState } from "react";
import {
  MessageSquare,
  User,
  Mail,
  Phone,
  Home,
  CheckCircle,
} from "lucide-react";
import { apiRequest } from "../utils/api";

export default function CustomRequest() {
  const [submitted, setSubmitted] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    roomType: "",
    topic: "",
    address: "",
    description: "",
    budget: "",
  });

  useEffect(() => () => previewUrls.forEach((url) => URL.revokeObjectURL(url)), [previewUrls]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const description = formData.description.trim();

    if (!name || !email || !phone || !description || !/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please complete all required fields with a valid email address before submitting.");
      setSubmitting(false);
      return;
    }

    const body = new FormData();
    body.append("name", name);
    body.append("email", email);
    body.append("phone", phone);
    body.append("message", description);
    body.append("requestDetails", JSON.stringify({
      roomType: formData.roomType,
      topic: formData.topic,
      address: formData.address.trim(),
      budget: formData.budget.trim(),
    }));
    imageFiles.forEach((file) => body.append("images", file));

    try {
      await apiRequest("/custom-request", { method: "POST", body });
      setSubmitted(true);
      setImageFiles([]);
      setPreviewUrls([]);
      window.setTimeout(() => {
        setSubmitted(false);
        setFormData({
          name: "",
          email: "",
          phone: "",
          roomType: "",
          topic: "",
          address: "",
          description: "",
          budget: "",
        });
      }, 3000);
    } catch (requestError) {
      setError(requestError.message || "The request could not be completed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 5) {
      setError("Choose up to five reference images.");
      e.target.value = "";
      return;
    }
    if (files.some((file) => !file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) {
      setError("Each reference must be an image no larger than 5 MB.");
      e.target.value = "";
      return;
    }
    setError("");
    setImageFiles(files);
    setPreviewUrls(files.map((file) => URL.createObjectURL(file)));
  };

  const removeImages = () => {
    setImageFiles([]);
    setPreviewUrls([]);
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-[#D4AF37]/5 py-12">
      <div className="container-custom px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-14">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Custom Furniture Request
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Can't find what you're looking for? Let us create custom furniture
              tailored to your needs.
            </p>
          </div>

          {/* Form */}
          <div className="bg-white rounded-3xl shadow-xl p-6 md:p-10">
            {submitted ? (
              <div className="text-center py-12">
                <CheckCircle size={48} className="text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">
                  Request Submitted!
                </h2>
                <p className="text-gray-600">
                  We'll contact you within 24–48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* GRID */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Full Name *
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Phone *
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 text-[#D4AF37]" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                        required
                      />
                    </div>
                  </div>

                  {/* Room Type */}
                  <div>
                    <label className="block mb-2 font-semibold">
                      Room Type
                    </label>
                    <div className="relative">
                      <Home className="absolute left-3 top-3 text-[#D4AF37]" />
                      <select
                        name="roomType"
                        value={formData.roomType}
                        onChange={handleChange}
                        className="w-full pl-10 p-3 border rounded-xl"
                      >
                        <option value="">Select</option>
                        <option>Living Room</option>
                        <option>Bedroom</option>
                        <option>Dining Room</option>
                        <option>Office</option>
                      </select>
                    </div>
                  </div>

                  {/* Topic (full width) */}
                  <div className="md:col-span-2">
                    <label className="block mb-2 font-semibold">
                      Request Topic
                    </label>
                    <select
                      name="topic"
                      value={formData.topic}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-xl"
                    >
                      <option value="">Select</option>
                      <option>Custom Furniture</option>
                      <option>Order Tracking</option>
                      <option>Returns</option>
                    </select>
                  </div>
                </div>

                {/* Address */}
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Address"
                  className="w-full p-3 border rounded-xl"
                />

                {/* Description */}
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe your request..."
                  className="w-full p-3 border rounded-xl min-h-[120px]"
                  required
                />

                {/* Image upload */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                  <label className="w-full sm:w-auto text-sm font-medium">Reference image (optional)</label>
                  <div className="flex-1">
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={handleImageChange}
                      className="w-full"
                    />
                    <p className="mt-1 text-xs text-gray-500">Up to 5 images, maximum 5 MB each.</p>
                    {previewUrls.length > 0 && (
                      <div className="mt-3 flex flex-wrap items-start gap-3">
                        {previewUrls.map((url, index) => (
                          <div key={url} className="relative">
                            <img src={url} alt={`Reference preview ${index + 1}`} className="h-24 w-28 rounded-md border object-cover" />
                          </div>
                        ))}
                        <button type="button" onClick={removeImages} className="text-sm text-red-600 underline">Remove images</button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit */}
                {error && <p role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p>}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-xl bg-[#D4AF37] py-3 text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? "Sending request..." : "Submit Request"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}