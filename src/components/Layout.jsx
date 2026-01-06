import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen overflow-hidden bg-mesh-white">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-y-auto relative">
        <Navbar />
        <main className="p-8 pb-20 flex-1 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;