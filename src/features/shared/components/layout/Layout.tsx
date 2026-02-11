import React, { useState } from "react";
import { Link as HeroLink, Avatar, Button } from "@heroui/react";
import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Box, Menu, X } from "lucide-react";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    {
      name: "Designers",
      href: "/designers",
      icon: <LayoutDashboard size={22} />,
    },
    { name: "Editor", href: "/editor", icon: <Box size={22} /> },
  ];

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="h-screen flex bg-background text-text-primary antialiased font-sans overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background-paper border-b border-gray-100 flex items-center px-4 z-40 shrink-0">
        <div className="absolute left-4">
          <Button
            isIconOnly
            variant="light"
            onPress={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-text-primary h-10 w-10"
          >
            {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        <div className="flex-1 flex justify-center items-center gap-2">
          <div className="bg-primary p-1.5 rounded-lg shrink-0">
            <Box className="text-white" size={20} />
          </div>
          <p className="font-bold text-lg tracking-tight whitespace-nowrap">
            PORT<span className="text-primary">BIM</span>
          </p>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-[2px] z-45 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 h-full w-64 bg-background-paper border-r border-gray-100 flex flex-col z-50 transition-transform duration-300 ease-in-out shrink-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="p-6 border-b border-gray-100 hidden lg:flex items-center gap-3">
          <div className="bg-primary p-2 rounded-xl shadow-lg shadow-primary/20">
            <Box className="text-white" size={24} />
          </div>
          <p className="font-bold text-xl tracking-tight text-text-primary">
            PORT<span className="text-primary">BIM</span>
          </p>
        </div>

        {/* Mobile Header in Sidebar for Profile */}
        <div className="lg:hidden p-4 border-b border-gray-100">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <Avatar
              isBordered
              color="success"
              name="Admin"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              className="ring-2 ring-white"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-primary truncate">
                İlkin Emiraslanov
              </span>
              <span className="text-[10px] text-text-secondary truncate">
                ilkin.emiraslanovv@mail.ru
              </span>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const isActive =
              location.pathname.startsWith(item.href) ||
              (item.href === "/designers" && location.pathname === "/");
            return (
              <HeroLink
                key={item.href}
                as={Link}
                to={item.href}
                onPress={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 text-sm font-semibold
                  ${
                    isActive
                      ? "text-primary bg-primary/10 shadow-sm"
                      : "text-text-secondary hover:text-primary hover:bg-gray-50"
                  }`}
              >
                {item.icon}
                {item.name}
              </HeroLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 hidden lg:block">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 border border-gray-100">
            <Avatar
              isBordered
              color="success"
              name="Admin"
              size="sm"
              src="https://i.pravatar.cc/150?u=a04258a2462d826712d"
              className="ring-2 ring-white"
            />
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-bold text-text-primary truncate">
                İlkin Emiraslanov
              </span>
              <span className="text-[10px] text-text-secondary truncate">
                ilkin.emiraslanovv@mail.ru
              </span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full bg-gray-50/30 overflow-hidden relative">
        <main className="flex-1 p-4 lg:p-0 pt-16 lg:pt-0 overflow-y-auto overflow-x-hidden w-full h-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
