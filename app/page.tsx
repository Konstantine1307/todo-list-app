import TodoApp from '@/components/TodoApp';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between py-8">
      <div className="z-10 w-full max-w-lg items-center justify-between font-mono px-4">
        <div className="flex items-center justify-center">
          <h1 className="text-4xl font-bold mb-8 mx-auto" id="todo">
            Todo App
          </h1>
        </div>
        <TodoApp />
      </div>
    </main>
    
  );
}
