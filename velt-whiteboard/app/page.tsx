import { Header } from "@/components/layout/header";
import { Whiteboard } from "@/components/whiteboard/whiteboard";

export default function Home() {
  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <Header />
      <main className="flex-1 overflow-hidden">
        <Whiteboard />
      </main>
    </div>
  );
}
