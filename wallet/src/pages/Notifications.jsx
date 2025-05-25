
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, BellRing, Info, ShieldCheck, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import Navigation from '@/components/layout/Navigation';
import { useNavigate } from 'react-router-dom';

const dummyNotifications = [
  {
    id: 1,
    icon: <ShieldCheck className="h-5 w-5 text-green-400" />,
    title: "Pembaruan Keamanan",
    message: "Akun Anda aman. Tidak ada aktivitas mencurigakan terdeteksi.",
    time: "Baru saja",
    read: false,
  },
  {
    id: 2,
    icon: <TrendingUp className="h-5 w-5 text-blue-400" />,
    title: "Harga BTC Naik!",
    message: "Harga Bitcoin telah mencapai $68,000. Pantau pasar sekarang.",
    time: "1 jam lalu",
    read: false,
  },
  {
    id: 3,
    icon: <Info className="h-5 w-5 text-yellow-400" />,
    title: "Fitur Baru: Staking",
    message: "Kini Anda dapat melakukan staking aset kripto Anda langsung dari CryVault.",
    time: "Kemarin",
    read: true,
  },
   {
    id: 4,
    icon: <BellRing className="h-5 w-5 text-primary" />,
    title: "Selamat Datang di CryVault!",
    message: "Jelajahi semua fitur dan mulai perjalanan kripto Anda bersama kami.",
    time: "2 hari lalu",
    read: true,
  },
];


const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = React.useState(dummyNotifications);

  const markAsRead = (id) => {
    setNotifications(
      notifications.map(notif => 
        notif.id === id ? { ...notif, read: true } : notif
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground pb-16">
      <header className="p-3 sticky top-0 bg-background z-10 flex items-center justify-between border-b border-neutral-700">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            className="mr-2 h-8 w-8"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold">Notifikasi</h1>
        </div>
         <Button variant="link" className="text-xs text-primary" onClick={() => setNotifications(notifications.map(n => ({...n, read: true})))}>
            Tandai semua terbaca
          </Button>
      </header>

      <main className="flex-grow px-3 py-3 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="text-center py-20">
            <BellRing className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Tidak ada notifikasi baru.</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="space-y-2"
          >
            {notifications.map((notif) => (
              <motion.div
                key={notif.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => markAsRead(notif.id)}
              >
                <Card className={`rounded-lg overflow-hidden border ${notif.read ? 'bg-neutral-800/50 border-neutral-700/60' : 'bg-neutral-700/70 border-primary/50'}`}>
                  <CardContent className="p-3">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0">{notif.icon}</div>
                      <div className="flex-grow">
                        <div className="flex justify-between items-center">
                           <h3 className={`text-sm font-semibold ${notif.read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.title}</h3>
                           {!notif.read && <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 ml-2"></div>}
                        </div>
                        <p className={`text-xs ${notif.read ? 'text-muted-foreground/70' : 'text-muted-foreground'}`}>{notif.message}</p>
                        <p className={`text-xs mt-1 ${notif.read ? 'text-muted-foreground/50' : 'text-muted-foreground/80'}`}>{notif.time}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </main>
      <Navigation />
    </div>
  );
};

export default Notifications;
