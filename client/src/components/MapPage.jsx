import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MapContainer from './MapContainer';
import { PanelLeft } from 'lucide-react';

const MapPage = () => {
    // On desktop (large screens), sidebar is initially open or controlled by its internal logic (lg:translate-x-0 class in Sidebar)
    // But we need a state for mobile/toggle control if needed.
    // Sidebar.jsx has `lg:translate-x-0` so it forces open on desktop regardless of isOpen prop?
    // Let's check Sidebar code: `${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`
    // Yes, it stays open on LG.

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="relative w-full h-full flex overflow-hidden">
            <Sidebar isOpen={isSidebarOpen} />

            {/* Map Area */}
            <div className="flex-1 relative h-full w-full">
                <MapContainer />

                {/* Mobile Sidebar Toggle Button - Only visible on small screens since Sidebar forces open on desktop */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="lg:hidden absolute top-4 left-4 z-[50] p-2 bg-black/80 text-white rounded-lg border border-gray-700 backdrop-blur-sm"
                >
                    <PanelLeft size={20} />
                </button>
            </div>
        </div>
    );
};

export default MapPage;
