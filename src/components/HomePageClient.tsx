"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import AddTaskButton from "@/components/AddTaskButton";
import TaskList from "@/components/TaskList";
import TaskDetail from "@/components/TaskDetail";

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

type HomePageClientProps = {
  initialTasks: Task[];
  userId: string;
};

export default function HomePageClient({
  initialTasks,
  userId,
}: HomePageClientProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [selectedTab, setSelectedTab] = useState<string>("home");

  // Function to add a new task (same as before)
  const addNewTask = () => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: "New Task",
      description: "Task description",
      progress: 0,
      frequency: "daily",
      editing: true,
      userId,
    };
    setTasks([...tasks, newTask]);
    setSelectedTab(newTask.id.toString());
  };

  // Function to update task progress using the API route
  const updateTaskProgress = async (id: number, progress: number) => {
    try {
      await fetch("/api/tasks/update", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, progress }),
      });
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === id ? { ...task, progress: Math.min(progress, 100) } : task
        )
      );
    } catch (error) {
      console.error("Error updating task progress:", error);
    }
  };

  // Function to delete a task using the API route
  const deleteTask = async (id: number) => {
    try {
      await fetch("/api/tasks/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
      setSelectedTab("home");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <header className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Daily Progress Tracker</h1>
        <AddTaskButton onClick={addNewTask} />
      </header>

      {/* Tabs for detailed information of each task */}
      <div className="sticky top-0 bg-white z-20 p-4 shadow-md rounded">
        <Tabs
          defaultValue={selectedTab}
          onValueChange={(value) => setSelectedTab(value)}
        >
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
            <TaskList tasks={tasks} updateTaskProgress={updateTaskProgress} />
          </TabsContent>

          {tasks.map((task) => (
            <TabsContent
              key={task.id}
              value={task.id.toString()}
              className="p-4 bg-white shadow-md rounded mt-4"
            >
              <TaskDetail
                task={task}
                updateTaskProgress={updateTaskProgress}
                deleteTask={deleteTask}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
