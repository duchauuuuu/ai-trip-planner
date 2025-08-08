import React from 'react';

const SelectDaysUi = ({ onSelectedOption }:any) => {
  const daysOptions = [
    { id: 1, title: '1 Day', desc: 'Short trip' },
    { id: 2, title: '3 Days', desc: 'Weekend getaway' },
    { id: 3, title: '5 Days', desc: 'Extended adventure' },
    { id: 4, title: '7 Days', desc: 'Full experience' },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center mt-1">
      {daysOptions.map((item, index) => (
        <div
          key={index}
          className="p-3 border rounded-2xl bg-white hover:border-primary cursor-pointer text-center"
          onClick={() => onSelectedOption(item.title + ":" + item.desc)}
        >
          <h2 className="text-lg font-semibold">{item.title}</h2>
          <p className="text-sm text-gray-500">{item.desc}</p>
        </div>
      ))}
    </div>
  );
};

export default SelectDaysUi;