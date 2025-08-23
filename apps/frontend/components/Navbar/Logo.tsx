import React from 'react';

interface LogoProps {
    size?: number;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 80, className = "" }) => {

    return (
        <div className={`inline-flex items-center justify-center ${className}`}>
            <svg
                width={size}
                height={size}
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="drop-shadow-lg"
            >
                {/* Background circle with indigo gradient */}
                <defs>
                    <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#a5b4fc" /> {/* indigo-300 */}
                        <stop offset="100%" stopColor="#818cf8" /> {/* indigo-400 */}
                    </linearGradient>

                    <linearGradient id="rocketGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#ffffff" />
                        <stop offset="100%" stopColor="#f1f5f9" />
                    </linearGradient>

                    <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#fbbf24" />
                        <stop offset="50%" stopColor="#f59e0b" />
                        <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                </defs>

                {/* Main circle background */}
                <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="url(#logoGradient)"
                    className="drop-shadow-lg"
                />

                {/* Inner circle for depth */}
                <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeWidth="1"
                />

                {/* Rocket body (incorporates T shape) */}
                <g>
                    {/* Main rocket body */}
                    <ellipse
                        cx="50"
                        cy="45"
                        rx="8"
                        ry="20"
                        fill="url(#rocketGradient)"
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1"
                    />

                    {/* Rocket nose cone */}
                    <polygon
                        points="50,25 58,35 42,35"
                        fill="url(#rocketGradient)"
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1"
                    />

                    {/* Wings (forming the T shape) */}
                    <rect
                        x="35"
                        y="50"
                        width="30"
                        height="6"
                        rx="3"
                        fill="url(#rocketGradient)"
                        stroke="rgba(99, 102, 241, 0.3)"
                        strokeWidth="1"
                    />

                    {/* Window */}
                    <circle
                        cx="50"
                        cy="40"
                        r="4"
                        fill="rgba(99, 102, 241, 0.7)"
                        stroke="white"
                        strokeWidth="1"
                    />

                    {/* Rocket flames */}
                    <g>
                        <ellipse
                            cx="45"
                            cy="67"
                            rx="3"
                            ry="8"
                            fill="url(#flameGradient)"
                            opacity="0.9"
                        />
                        <ellipse
                            cx="50"
                            cy="70"
                            rx="4"
                            ry="10"
                            fill="url(#flameGradient)"
                            opacity="0.9"
                        />
                        <ellipse
                            cx="55"
                            cy="67"
                            rx="3"
                            ry="8"
                            fill="url(#flameGradient)"
                            opacity="0.9"
                        />
                    </g>

                    {/* Stars around the rocket */}
                    <g fill="white" opacity="0.8">
                        <polygon points="25,30 26,32 28,32 26.5,33.5 27,36 25,34.5 23,36 23.5,33.5 22,32 24,32" />
                        <polygon points="75,35 76,37 78,37 76.5,38.5 77,41 75,39.5 73,41 73.5,38.5 72,37 74,37" />
                        <polygon points="30,65 31,67 33,67 31.5,68.5 32,71 30,69.5 28,71 28.5,68.5 27,67 29,67" />
                        <polygon points="70,60 71,62 73,62 71.5,63.5 72,66 70,64.5 68,66 68.5,63.5 67,62 69,62" />
                    </g>

                    {/* Subtle highlight on rocket */}
                    <ellipse
                        cx="47"
                        cy="42"
                        rx="2"
                        ry="8"
                        fill="rgba(255,255,255,0.4)"
                    />
                </g>
            </svg>
        </div>
    )
}
export default Logo;