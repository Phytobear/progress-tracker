"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// Task type definition
type Task = {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: "daily" | "weekly";
  dueDate?: string;
  editing?: boolean;
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: 1,
      title: "Obsidian Updates",
      description: "Organise notes",
      progress: 20,
      frequency: "daily",
    },
    {
      id: 2,
      title: "Job Search",
      description: "Apply for new roles",
      progress: 50,
      frequency: "weekly",
    },
    {
      id: 3,
      title: "Touch Typing Practice",
      description: "Daily typing practice",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 4,
      title: "Reading",
      description: "Daily Pages",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 5,
      title: "Learn a New Thing",
      description: "What will it be today?",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 6,
      title: "Personal Project",
      description: "Have you pushed to github today?",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 7,
      title: "Python Practice",
      description: "Daily coding practice",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 8,
      title: "JavaScript Practice",
      description: "Daily coding practice",
      progress: 75,
      frequency: "daily",
    },
    {
      id: 9,
      title: "Chores",
      description: "Have you washed the dishes?",
      progress: 75,
      frequency: "daily",
    },
  ]);

  // Function to update task progress
  const updateTaskProgress = (id: number, progress: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, progress: Math.min(progress, 100) } : task
      )
    );
  };

  // Function to edit a task
  const editTask = (id: number, updatedTask: Partial<Task>) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedTask } : task
      )
    );
  };

  // Function to add a new task
  const addNewTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: "New Task",
      description: "Task description",
      progress: 0,
      frequency: "daily",
    };
    setTasks([...tasks, newTask]);
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Progress Tracker</h1>
        <button
          onClick={addNewTask}
          className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
        >
          Add New Task
        </button>
      </header>

      {/* Tabs List for detailed information of each task - Fixed at the top */}
      <div className="sticky top-0 bg-white z-20 p-4 shadow-md rounded">
        <Tabs defaultValue="home">
          <TabsList className="flex space-x-2">
            <TabsTrigger value="home" className="px-4 py-2 bg-gray-200 rounded">
              Home
            </TabsTrigger>
            {tasks.map((task) => (
              <TabsTrigger
                key={task.id}
                value={task.id.toString()}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                {task.title}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Tabs Content */}
          <TabsContent value="home" className="mt-4">
            {/* Task Headings and Progress Bars on Home Tab */}
            <div>
              {tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-4 bg-white shadow-md rounded mb-4"
                >
                  <h2 className="font-bold text-xl mb-2">{task.title}</h2>
                  <div className="my-2">
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
                </div>
              ))}
            </div>
          </TabsContent>

          {tasks.map((task) => (
            <TabsContent
              key={task.id}
              value={task.id.toString()}
              className="p-4 bg-white shadow-md rounded mt-4"
            >
              <h2 className="font-bold text-2xl mb-2">{task.title}</h2>
              <p className="mb-4">{task.description}</p>
              <div className="my-2">
                <label>Progress:</label>
                <input
                  type="range"
                  value={task.progress}
                  onChange={(e) =>
                    updateTaskProgress(task.id, Number(e.target.value))
                  }
                  className="w-full"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>{task.frequency} Task</span>
                <span>{task.progress}%</span>
              </div>
              <div className="flex items-center justify-end mt-4">
                <button
                  onClick={() => editTask(task.id, { editing: !task.editing })}
                  className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
                >
                  {task.editing ? "Save" : "Edit Task"}
                </button>
              </div>
              {task.editing && (
                <>
                  <div className="mb-4">
                    <label className="block mb-1">Title:</label>
                    <input
                      type="text"
                      value={task.title}
                      onChange={(e) =>
                        editTask(task.id, { title: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="block mb-1">Description:</label>
                    <textarea
                      value={task.description}
                      onChange={(e) =>
                        editTask(task.id, { description: e.target.value })
                      }
                      className="w-full p-2 border rounded"
                    />
                  </div>
                </>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
