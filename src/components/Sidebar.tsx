'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  FaChevronDown, 
  FaChevronRight, 
  FaTachometerAlt, 
  FaUsers, 
  FaUserCircle, 
  FaLayerGroup, 
  FaTools, 
  FaRobot, 
  FaCog,
  FaBars,
  FaBrain
} from 'react-icons/fa';

export default function Sidebar({ isOpen, toggleSidebar }: { isOpen: boolean; toggleSidebar: () => void }) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});
  const pathname = usePathname();

  // Define menu structure
  const menuItems = [
    {
      name: 'Dashboard',
      href: '/sidelayout',
      icon: <FaTachometerAlt className="h-5 w-5" />
    },
    {
      name: 'Prompts',
      href: '/sidelayout/prompts',
      icon: <FaBrain className="h-5 w-5" />
    },
    {
      name: 'AI Assistant',
      href: '/sidelayout/ai-assistant',
      icon: <FaRobot className="h-5 w-5" />
    },
    {
      name: 'Admin Settings',
      href: '/sidelayout/settings',
      icon: <FaCog className="h-5 w-5" />,
      submenu: [
        { name: 'AI Models', href: '/sidelayout/settings/models' },
        { name: 'Profiles', href: '/sidelayout/profiles' },
        { name: 'Stacks', href: '/sidelayout/stacks' },
        { name: 'Technologies', href: '/sidelayout/technologies' },
        { name: 'Users', href: '/sidelayout/users' }
      ]
    }
  ];

  const toggleExpanded = (itemName: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemName]: !prev[itemName]
    }));
  };

  const isActiveLink = (href: string) => {
    if (!pathname) return false;
    
    if (href === '/sidelayout' && pathname === '/sidelayout') {
      return true;
    }
    
    return pathname.startsWith(href);
  };

  const isActiveSubLink = (href: string) => {
    if (!pathname) return false;
    return pathname === href;
  };

  return (
    <div className={`sidebar-container bg-gray-800 text-white h-full flex flex-col transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      <div className="p-4 border-b border-gray-700 flex justify-between items-center">
        {isOpen ? (
          <h1 className="text-xl font-bold">Menu</h1>
        ) : (
          <span></span>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-gray-700"
        >
          <FaBars className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        <ul className="space-y-1 px-2">
          {menuItems.map((item) => (
            <li key={item.name}>
              {item.submenu ? (
                <div>
                  <button
                    onClick={() => toggleExpanded(item.name)}
                    className={`flex items-center justify-between w-full px-4 py-2 rounded-md transition-colors ${
                      isActiveLink(item.href)
                        ? 'text-white bg-gray-700'
                        : 'text-gray-300 hover:text-white hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      {isOpen && <span>{item.name}</span>}
                    </div>
                    {isOpen && (
                      expandedItems[item.name] ? (
                        <FaChevronDown className="h-4 w-4" />
                      ) : (
                        <FaChevronRight className="h-4 w-4" />
                      )
                    )}
                  </button>
                  
                  {isOpen && expandedItems[item.name] && (
                    <ul className="ml-8 mt-1 space-y-1">
                      {item.submenu.map((subItem) => (
                        <li key={subItem.name}>
                          <Link
                            href={subItem.href}
                            className={`block px-4 py-2 rounded-md transition-colors ${
                              isActiveSubLink(subItem.href)
                                ? 'text-white bg-gray-700'
                                : 'text-gray-300 hover:text-white hover:bg-gray-700'
                            }`}
                          >
                            {subItem.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ) : (
                <Link
                  href={item.href}
                  className={`flex items-center ${isOpen ? 'space-x-3' : 'justify-center'} px-4 py-2 rounded-md transition-colors ${
                    isActiveLink(item.href)
                      ? 'text-white bg-gray-700'
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  {item.icon}
                  {isOpen && <span>{item.name}</span>}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
} 