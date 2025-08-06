import React from "react";

const SidebarSection = ({ items = [], onItemClick, activeItem }) => {
  return (
    <div className="flex flex-wrap gap-2 justify-center md:flex-col md:space-y-2 md:gap-0">
      {items.map((item, idx) => (
        <button
          key={idx}
          className={`
            ${activeItem === item ? "bg-mm-primary" : "bg-mm-secondery"}
            hover:bg-mm-primary 
            text-white 
            px-3 py-1 
            rounded 
            text-sm 
            md:w-[80%] 
            w-auto
          `}
          onClick={() => onItemClick(item)}
          type="button"
        >
          {item}
        </button>
      ))}
    </div>
  );
};

export default SidebarSection;
