"use client";
import React, { useState } from "react";
import useOutsideClick from "/src/hooks/useOutsideClick";

type CardData = {
  title: string;
  responses: string;
};

const cardsData: CardData[] = [
  { title: "Preferred name", responses: "6 responses" },
  { title: "Form title", responses: "6 responses" },
  { title: "Form title", responses: "6 responses" },
  { title: "Form title", responses: "6 responses" },
];

interface DropdownMenuProps {
  actions: { title: string; onClick: () => void }[];
}

export const DropdownMenu = (props: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsOpen(!isOpen);
        }}
        className="absolute right-2"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24px"
          height="24px"
        >
          <circle cx="5" cy="12" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="19" cy="12" r="2" />
        </svg>
      </button>
      {isOpen && (
        <div className="absolute right-2 top-4 mt-2 w-48 bg-white shadow-md">
          {props.actions.map((action, idx) => (
            <div
              key={idx}
              onClick={() => {
                action.onClick();
                setIsOpen(false);
              }}
              className="px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white text-gray-900"
            >
              {action.title}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const CardItem: React.FC<{ data: CardData }> = ({ data }) => {
  return (
    <div className="flex items-center my-2 p-2 border border-black rounded bg-white relative">
      <div
        className="w-12 h-12 bg-gray-300 rounded mr-2"
        aria-label="Placeholder image"
      ></div>
      <div className="flex flex-col">
        <p className="m-0 font-bold">{data.title}</p>
        <p className="m-0 text-gray-400">{data.responses}</p>
      </div>
      {/*<DropdownMenu />*/}
    </div>
  );
};
