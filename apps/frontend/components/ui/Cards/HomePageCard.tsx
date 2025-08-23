import React from 'react';

type HomePageCardProps = {

};

const HomePageCard: React.FC<HomePageCardProps> = () => {

    return (
        <div className="flex items-center justify-center">
            <div
                className="relative w-full max-w-md rounded-2xl 
                 border border-white/10 
                 bg-neutral-900/40 backdrop-blur-xl 
                 shadow-[0_0_25px_rgba(255,255,255,0.05),inset_0_0_20px_rgba(255,255,255,0.04)]
                 transition"
            >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <h3 className="text-sm font-medium text-neutral-200">Upcoming</h3>
                    <button className="w-6 h-6 flex items-center justify-center rounded-md bg-white/10 text-neutral-300 hover:bg-white/20">
                        +
                    </button>
                </div>

                {/* Task rows */}
                <ul className="divide-y divide-white/5">
                    <li className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition">
                        <span className="text-neutral-300 text-sm">Promote Bento Cards v2</span>
                        <span className="text-xs text-neutral-500">Today</span>
                    </li>
                    <li className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition">
                        <span className="text-neutral-300 text-sm">Release Bento Cards for Framer</span>
                        <span className="px-2 py-0.5 rounded-md text-xs bg-blue-500/20 text-blue-400">Kohaku</span>
                    </li>
                    <li className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition">
                        <span className="text-neutral-300 text-sm">Remove Illustrations</span>
                        <span className="text-xs text-neutral-500">Tomorrow</span>
                    </li>
                    <li className="flex items-center justify-between px-4 py-3 hover:bg-white/5 transition">
                        <span className="text-neutral-300 text-sm">Bento Cards v4</span>
                        <span className="text-xs text-neutral-500">Next Week</span>
                    </li>
                </ul>

                {/* Subtle glowing inside border layer */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-2xl 
                   shadow-[inset_0_0_30px_rgba(255,255,255,0.06)]"
                ></div>
            </div>
        </div>
    )
}
export default HomePageCard;