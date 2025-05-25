import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Wallet, BarChartBig, Compass, Repeat, SlidersHorizontal } from 'lucide-react'; // Changed Settings2 to SlidersHorizontal, TrendingUp to BarChartBig

const Navigation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const navItems = [
    { path: '/', icon: Wallet, label: 'Dompet' },
    { path: '/market', icon: BarChartBig, label: 'Pasangan' }, // Changed icon
    { path: '/dapps', icon: Compass, label: 'Explore' },
    { path: '/swap', icon: Repeat, label: 'Tukar' },
    { path: '/earn', icon: SlidersHorizontal, label: 'Earn' } // Changed icon and path to /earn (as per image)
  ];
  
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 h-[56px]">
      <div className="bg-neutral-900/90 backdrop-blur-sm mx-0 h-full border-t border-neutral-700/50 flex items-center">
        <nav className="flex justify-around w-full">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="relative flex flex-col items-center justify-center p-1 w-1/5 h-full"
              >
                <motion.div
                  initial={{ scale: 0.9 }}
                  animate={{ scale: isActive ? 1 : 0.9 }}
                  className="relative"
                >
                  <item.icon
                    className={`h-5 w-5 mb-0.5 ${isActive ? 'text-primary' : 'text-muted-foreground'}`} 
                  />
                </motion.div>
                <span className={`text-[10px] ${isActive ? 'text-primary font-medium' : 'text-muted-foreground'}`}> 
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="navIndicator"
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-primary rounded-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
};

export default Navigation;