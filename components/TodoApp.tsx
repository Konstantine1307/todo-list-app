'use client';

import { useState, useEffect } from 'react';
import { useSession, signIn, signOut } from 'next-auth/react';
import { PlusIcon, PencilIcon, TrashIcon, SaveIcon, XIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import DeadlineComponent from './utilities/DeadlineComponent';

interface Task {
  id: string;
  title: string;
  completed: boolean;
  deadline: string;
  location: string;
}

export default function TodoApp() {
  const { data: session } = useSession();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [newDeadline, setNewDeadline] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch('/api/tasks');
        const data = await response.json();

        // Check if data is an array
        if (Array.isArray(data)) {
          setTasks(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const addTask = async () => {
    console.log('Adding new task:', newTask);
    if (newTask.trim() !== '') {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        completed: false,
        deadline: newDeadline,
        location: newLocation,
      };
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(task),
      });
      const savedTask = await response.json();
      console.log('Added task:', savedTask);
      setTasks([...tasks, savedTask]);
      setNewTask('');
      setNewDeadline('');
      setNewLocation('');
    }
  };

  const updateTask = async (id: string, updates: Partial<Task>) => {
    console.log('Updating task:', id, updates);
    const taskToUpdate = tasks.find((task) => task.id === id);

    if (!taskToUpdate) return; // Prevent further execution if task is not found

    const updatedTask = { ...taskToUpdate, ...updates }; // Merge updates with existing task
    const response = await fetch(`/api/tasks/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    });
    const updatedTaskFromServer = await response.json();
    console.log('Updated task:', updatedTaskFromServer);

    // Update the local state
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, ...updatedTaskFromServer } : task
      )
    );
  };

  const deleteTask = async (id: string) => {
    console.log('Deleting task:', id);
    await fetch(`/api/tasks/${id}`, {
      method: 'DELETE',
    });
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const startEditing = (task: Task) => {
    console.log('Starting edit of task:', task.id);
    setEditingTask(task);
    setNewTask(task.title);
    setNewDeadline(task.deadline);
    setNewLocation(task.location);
  };

  const saveEdit = async () => {
    console.log('Saving edit of task:', editingTask?.id);
    if (editingTask) {
      const updatedTask = {
        title: newTask,
        deadline: newDeadline,
        location: newLocation,
        id: editingTask.id,
        completed: editingTask.completed,
      };
      await updateTask(editingTask.id, updatedTask);
      setTasks((prevTasks) =>
        prevTasks.map((task) =>
          task.id === editingTask.id ? updatedTask : task
        )
      );
      setEditingTask(null);
      setNewTask('');
      setNewDeadline('');
      setNewLocation('');
    }
  };

  if (!session) {
    return (
      <div className='flex flex-col items-center justify-center'>
        <h1 className='text-lg md:text-xl mb-4'>
          Please sign in to access your Todo List
        </h1>
        <Button  onClick={() => signIn()}>Sign in</Button>
      </div>
    );
  }

  return (
    <div className='flex flex-col items-center justify-center w-full max-w-7xl'>
      <h1 className='text-2xl mb-4'>Welcome, {session?.user?.name}!</h1>
      <Button onClick={() => signOut()}>Sign out</Button>
      <div className='max-w-3xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl w-full'>
        <div className='space-y-4'>
          <Input
            type='text'
            placeholder='New task'
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
          />
          <Input
            type='datetime-local'
            value={newDeadline}
            onChange={(e) => setNewDeadline(e.target.value)}
          />
          <Input
            type='text'
            placeholder='Location'
            value={newLocation}
            onChange={(e) => setNewLocation(e.target.value)}
          />
          <div className='flex justify-between'>
            <Button
              onClick={editingTask ? saveEdit : addTask}
              className='w-full'
              id='edit'
            >
              {editingTask ? 'Save Edit' : 'Add Task'}
              {editingTask ? (
                <SaveIcon className='h-4 w-4 ml-2' />
              ) : (
                <PlusIcon className='h-4 w-4 ml-2' />
              )}
            </Button>

            {editingTask && (
              <Button
                onClick={() => {
                  setEditingTask(null);
                  setNewTask('');
                  setNewDeadline('');
                  setNewLocation('');
                }}
                className='w-full ml-4'
                id='cancel-edit'
              >
                Cancel Edit
                <XIcon className='h-4 w-4 ml-2' />
              </Button>
            )}
          </div>
        </div>
        <ul className='mt-6 space-y-4'>
          {tasks &&
            tasks.map((task) => (
              <li
                key={task.id}
                className='flex items-center justify-between p-4 bg-gray-100 rounded-lg'
              >
                <div className='flex flex-col'>
                  <div className='flex items-center space-x-3 pr-4'>
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={(checked: boolean) =>
                        updateTask(task.id, {
                          completed: checked as boolean,
                        })
                      }
                    />
                    <span className={task.completed ? 'line-through' : ''}>
                      {task.title.startsWith('http') ||
                      task.title.startsWith('https') ||
                      task.title.startsWith('www.') ? (
                        <a
                          href={task.title}
                          target='_blank'
                          rel='noopener noreferrer'
                          className='underline text-blue-600'
                        >
                          {task.title}
                        </a>
                      ) : task.title.includes('@') ? (
                        <a
                          href={`mailto:${task.title}`}
                          className='underline text-blue-600'
                        >
                          {task.title}
                        </a>
                      ) : (
                        task.title
                      )}
                    </span>
                  </div>
                  <div>
                    {task.deadline ? (
                      <span
                        className={`ms-7 text-xs ${
                          new Date(task.deadline) < new Date()
                            ? 'text-red-500'
                            : 'text-gray-500'
                        }`}
                      >
                        <DeadlineComponent deadline={task.deadline} />
                      </span>
                    ) : null}
                  </div>
                  <div>
                    {task.location ? (
                      <span className='ms-7 text-xs text-gray-500'>
                        {task.location}
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className='flex items-center space-x-2'>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => startEditing(task)}
                  >
                    <a href='#todo'>
                      <PencilIcon className='h-4 w-4' />
                    </a>
                  </Button>
                  <Button
                    variant='outline'
                    size='icon'
                    onClick={() => deleteTask(task.id)}
                  >
                    <TrashIcon className='h-4 w-4' />
                  </Button>
                </div>
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
}
