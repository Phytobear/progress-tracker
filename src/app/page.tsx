"use client";

import React, { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { UserButton, useUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

// Task type definition
type Task = {
  id: number;
  title: string;
  description: string;
  progress: number;
  frequency: "daily" | "weekly";
  dueDate?: string;
  editing?: boolean;
  userId?: string;
};

export default function HomePage() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);

  // Redirect if not authenticated
  if (isLoaded && !user) {
    redirect("/sign-in");
  }

  // Load tasks from the API
  useEffect(() => {
    const fetchTasks = async () => {
      if (user) {
        const response = await fetch(`/api/tasks?userId=${user.id}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error("Error fetching tasks:", response.statusText);
        }
      }
    };
    fetchTasks();
  }, [user]);

  // Function to update task progress
  const updateTaskProgress = async (id: number, progress: number) => {
    console.log(`Updating task ${id} with progress: ${progress}`);
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, progress: Math.min(progress, 100) } : task
      )
    );
    try {
      const response = await fetch(`/api/tasks/updateProgress`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, progress: Math.min(progress, 100) }),
      });

      if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login
        window.location.href = "/signin";
        return;
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      console.log("Task progress updated successfully");
    } catch (error) {
      console.error("Update task progress error:", error);
    }
  };

  // Function to edit task
  const editTask = async (id: number, updatedTask: Partial<Task>) => {
    try {
      // Optimistic update
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updatedTask } : task
        )
      );

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, ...updatedTask }),
      });

      if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login
        window.location.href = "/signin";
        return;
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }

      const updatedTaskData = await response.json();
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, ...updatedTaskData } : task
        )
      );
    } catch (error) {
      console.error("Error editing task:", error);
      // Revert optimistic update if needed
    }
  };

  // Function to add a new task
  const addNewTask = async () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: "New Task",
      description: "Task description",
      progress: 0,
      frequency: "daily",
      userId: user?.id, // Associate new task with current user
    };
    setTasks([...tasks, newTask]);
    try {
      const response = await fetch(`/api/tasks/addTask`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newTask),
      });

      if (response.status === 401) {
        // Handle unauthorized - maybe redirect to login
        window.location.href = "/signin";
        return;
      }

      if (!response.ok) {
        throw new Error(response.statusText);
      }
    } catch (error) {
      console.error("Error adding new task:", error);
    }
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Daily Progress Tracker</h1>
          <p className="text-gray-600">Welcome, {user?.firstName || "User"}!</p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={addNewTask}
            className="bg-blue-500 text-white px-4 py-2 rounded shadow-md hover:bg-blue-600"
          >
            Add New Task
          </button>
          <UserButton afterSignOutUrl="/" />
        </div>
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
