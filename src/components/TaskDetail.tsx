import React from "react";
import ProgressSlider from "./ProgressSlider";

type Task = {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: "daily" | "weekly";
};

type TaskDetailProps = {
  task: Task;
  deleteTask: (id: number) => void;
  updateTaskProgress: (id: number, progress: number) => void;
};

export default function TaskDetail({
  task,
  deleteTask,
  updateTaskProgress,
}: TaskDetailProps) {
  return (
    <div className="p-4 bg-white shadow-md rounded mt-4">
      <h2 className="font-bold text-2xl mb-2">{task.title}</h2>
      <p className="mb-4">{task.description}</p>
      <div className="my-2">
        <label>Progress:</label>
        <ProgressSlider
          value={task.progress}
          onChange={(value) => updateTaskProgress(task.id, value)}
        />
      </div>
      <div className="flex items-center justify-between">
        <span>{task.frequency} Task</span>
        <span>{task.progress}%</span>
      </div>
      <div className="flex items-center justify-end mt-4 space-x-2">
        <button
          onClick={() => deleteTask(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded shadow-md hover:bg-red-600"
        >
          Delete Task
        </button>
      </div>
    </div>
  );
}
