import React, { useState } from "react";

const CustomAccordion = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div className="border rounded-lg shadow-md transition-all duration-500 ease-in-out bg-[#B3E5FC] backdrop-blur-[2px] w-full">
        <div
          className="p-4 flex justify-between items-center cursor-pointer bg-[#B3E5FC] backdrop-blur-[2px] rounded-t-lg"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h3 className="text-[16px] text-slate-700 text-left w-full">
            How to write good prompt to generate form?
          </h3>
          <span
            className={`transform transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`}
          >
            ▼
          </span>
        </div>
        <div
          className={`overflow-hidden transition-max-height duration-500 ease-in-out ${isOpen ? "max-h-screen" : "max-h-0"}`}
        >
          <div className="p-4 text-slate-700 text-left bg-[#B3E5FC]">
            <ul className="list-disc pl-5 text-[14px] leading-6">
              <li>
                <strong>State the Purpose:</strong> Say what the form is for.
              </li>
              <li>
                <strong>List What You Need:</strong> Mention the fields (e.g.,
                name, email) and their types (e.g., text, checkbox).
              </li>
              <li>
                <strong>Note Any Conditions:</strong> If some fields depend on
                others, mention it.
              </li>
              <li>
                <strong>Keep It Simple:</strong> Be clear and concise.
              </li>
              <li>
                <strong>Review:</strong> Double-check for clarity.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomAccordion;
