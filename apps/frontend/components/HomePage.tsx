import React from 'react';

const HomePage: React.FC = () => {

    return (
        <div className="relative min-h-screen flex items-center justify-center  overflow-hidden">
            {/* Gradient Texture */}
            <div className=""></div>

            {/* Grid Overlay */}
            <div className="grid-overlay"></div>

            {/* Main Content */}
            <div className="z-10 text-center">
                <h1 className="text-sm font-medium neon-text ">
                    Explore the Neon Zone
                </h1>
                <p className="text-foreground mt-4 text-lg">
                    Welcome to a visually rich experience with glowing gradients and textures.
                </p>
                <button className="mt-6 px-6 py-2 text-darkBackground font-bold bg-neonPurple shadow-neon rounded-lg hover:scale-105 transition-transform">
                    Get Started
                </button>
            </div>
        </div>
    )
}
export default HomePage;