import React from "react";
import ToolHeader from "../common/ToolHeader";
import AdBanner from "../ads/AdBanner";
import AdSidebar from "../ads/AdSidebar";
import { adConfig } from "../../config/adConfig";

export default function ToolLayout({
  title,
  description,
  badgeText,
  badgeColor,
  onBack,
  children,
  showSidebarAd = true,
}) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
      {/* Top Breadcrumb & Title */}
      <ToolHeader
        title={title}
        description={description}
        badgeText={badgeText}
        badgeColor={badgeColor}
        onBack={onBack}
      />

      {/* Top Banner Ad Slot */}
      <AdBanner slotId={adConfig.slots.topBanner} />

      {/* Main Content Area + Optional Sidebar Ad */}
      <div className="flex flex-col lg:flex-row gap-8 items-start mt-6">
        <div className="flex-1 w-full min-w-0">{children}</div>
        {showSidebarAd && <AdSidebar slotId={adConfig.slots.sidebarSticky} />}
      </div>

      {/* Bottom Banner Ad Slot */}
      <AdBanner slotId={adConfig.slots.bottomBanner} className="mt-12" />
    </div>
  );
}
