import React from "react";

type ProgressSliderProps = {
  value: number;
  onChange: (value: number) => void;
};

export default function ProgressSlider({
  value,
  onChange,
}: ProgressSliderProps) {
  return (
    <input
      type="range"
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full"
    />
  );
}
