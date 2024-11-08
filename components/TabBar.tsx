// components/TabBar.tsx
import IconHome from "tabler_icons_tsx/home.tsx";
import IconAnalytics from "tabler_icons_tsx/device-analytics.tsx";
import IconPlus from "tabler_icons_tsx/plus.tsx";
import IconUser from "tabler_icons_tsx/user.tsx";

export default function TabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 w-full bg-white dark:bg-gray-100 border-t border-gray-200 dark:border-gray-800">
      <div className="flex justify-around items-center h-16">
        <a
          href="/dashboard/stats"
          className="flex flex-col items-center text-gray-500 hover:text-primary"
        >
          <IconHome className="w-6 h-6" />
          <span className="text-xs mt-1">Dashboard</span>
        </a>
        <a
          href="/assets"
          className="flex flex-col items-center text-gray-500 hover:text-primary"
        >
          <IconAnalytics className="w-6 h-6" />
          <span className="text-xs mt-1">Analyze</span>
        </a>
        <a
          href="/submit"
          className="flex flex-col items-center text-gray-500 hover:text-primary"
        >
          <IconPlus className="w-6 h-6" />
          <span className="text-xs mt-1">Add</span>
        </a>
        <a
          href="/account"
          className="flex flex-col items-center text-gray-500 hover:text-primary"
        >
          <IconUser className="w-6 h-6" />
          <span className="text-xs mt-1">Account</span>
        </a>
      </div>
    </nav>
  );
}
