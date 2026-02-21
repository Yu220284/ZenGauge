"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const PAGE_ORDER = [
  '/sessions',
  '/trainers',
  '/',
  '/community',
  '/menu'
];

function getPageIndex(pathname: string): number {
  // カテゴリページは/sessionsと同じ扱い
  if (pathname.startsWith('/category/')) return 0;
  // 個別トレーナーページは/trainersと同じ扱い
  if (pathname.startsWith('/trainer/')) return 1;
  return PAGE_ORDER.indexOf(pathname);
}

export function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname();
  const [direction, setDirection] = useState(0);
  const [prevPathname, setPrevPathname] = useState(pathname);

  useEffect(() => {
    if (prevPathname !== pathname) {
      const prevIndex = getPageIndex(prevPathname);
      const currentIndex = getPageIndex(pathname);
      
      if (prevIndex !== -1 && currentIndex !== -1) {
        setDirection(currentIndex > prevIndex ? 1 : -1);
      } else {
        setDirection(0);
      }
      
      setPrevPathname(pathname);
    }
  }, [pathname, prevPathname]);

  return (
    <motion.div
      key={pathname}
      initial={{ opacity: 0, x: direction * 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: direction * -100 }}
      transition={{
        duration: 0.3,
        ease: "easeIn"
      }}
    >
      {children}
    </motion.div>
  );
}