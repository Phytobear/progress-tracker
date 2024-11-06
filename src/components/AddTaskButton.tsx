import React from "react";

type AddTaskButtonProps = {
  onClick: () => void;
};

export default function AddTaskButton({ onClick }: AddTaskButtonProps) {
  return (
    <button
      onClick={onClick}
      className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
    >
      Add New Task
    </button>
  );
}
