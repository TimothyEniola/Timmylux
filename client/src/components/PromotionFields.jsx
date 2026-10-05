export default function PromotionFields({ value, onChange }) {
  const handleChange = (event) => {
    const { name, value: fieldValue } = event.target;
    onChange((current) => ({ ...current, [name]: fieldValue }));
  };

  return (
    <fieldset className="space-y-4 rounded-xl border border-[#D4AF37]/30 bg-[#D4AF37]/5 p-4 sm:p-5">
      <legend className="px-2 text-sm font-semibold text-[#011F5B]">
        Timed discount (optional)
      </legend>
      <p className="text-sm text-gray-600">
        Choose a percentage and local start/end time. The offer activates and ends automatically.
      </p>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label htmlFor="discountValue" className="mb-1.5 block text-sm font-medium text-gray-700">
            Discount (%)
          </label>
          <input
            id="discountValue"
            name="discountValue"
            type="number"
            min="1"
            max="100"
            step="1"
            value={value.discountValue}
            onChange={handleChange}
            className="input-premium"
            placeholder="e.g. 15"
          />
        </div>
        <div>
          <label htmlFor="promotionStartsAt" className="mb-1.5 block text-sm font-medium text-gray-700">
            Starts at
          </label>
          <input
            id="promotionStartsAt"
            name="startsAt"
            type="datetime-local"
            value={value.startsAt}
            onChange={handleChange}
            className="input-premium"
          />
        </div>
        <div>
          <label htmlFor="promotionEndsAt" className="mb-1.5 block text-sm font-medium text-gray-700">
            Ends at
          </label>
          <input
            id="promotionEndsAt"
            name="endsAt"
            type="datetime-local"
            value={value.endsAt}
            onChange={handleChange}
            className="input-premium"
          />
        </div>
      </div>
    </fieldset>
  );
}
