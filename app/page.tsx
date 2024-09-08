import TodoApp from '@/components/TodoApp';

export default function Home() {
  return (
    <main className='flex min-h-screen flex-col items-center justify-between'>
      <div className='z-10 w-full max-w-7xl items-center justify-between font-mono'>
        <h1 className='text-4xl font-bold mb-8 text-center' id='todo'>Todo App</h1>
        <TodoApp />
      </div>
    </main>
    
  );
}
