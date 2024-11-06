import React from "react";

type Task = {
  id: number;
  title: string;
  progress: number;
};

type TaskListProps = {
  tasks: Task[];
  updateTaskProgress: (id: number, progress: number) => void;
};

export default function TaskList({ tasks, updateTaskProgress }: TaskListProps) {
  return (
    <div>
      {tasks.map((task) => (
        <div key={task.id} className="p-4 bg-white shadow-md rounded mb-4">
          <h2 className="font-bold text-xl mb-2">{task.title}</h2>
          <input
            type="range"
            value={task.progress}
            onChange={(e) =>
              updateTaskProgress(task.id, Number(e.target.value))
            }
            className="w-full"
          />
          <div className="flex items-center justify-between">
            <span>{task.progress}% Completed</span>
          </div>
        </div>
      ))}
    </div>
  );
}
