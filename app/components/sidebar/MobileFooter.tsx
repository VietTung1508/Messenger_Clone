"use client";

import useConverstation from "@/app/hooks/useConverstation";
import useRoutes from "@/app/hooks/useRoutes";
import MobileItem from "./MobileItem";

const MobileFooter = () => {
  const routes = useRoutes();
  const { isOpen } = useConverstation();

  if (isOpen) {
    return null;
  }

  return (
    <div className="fixed justify-around w-full bottom-0 z-40 flex items-center bg-white border-t-[1px] lg:hidden">
      {routes.map((route) => (
        <MobileItem
          key={route.label}
          href={route.href}
          active={route.active}
          onClick={route.onClick}
          icon={route.icon}
        />
      ))}
    </div>
  );
};

export default MobileFooter;
