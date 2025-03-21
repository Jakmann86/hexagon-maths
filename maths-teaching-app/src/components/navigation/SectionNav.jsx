import React from 'react';
import {
    PlayCircle,
    Brain,
    LineChart,
    BookOpen,
    Target
} from 'lucide-react';

export const SectionNav = ({ activeSection, onSectionChange }) => {
    const sectionColors = {
        starter: {
            active: 'bg-blue-500 hover:bg-blue-600',
            inactive: 'bg-blue-100 text-blue-700'
        },
        diagnostic: {
            active: 'bg-purple-500 hover:bg-purple-600',
            inactive: 'bg-purple-100 text-purple-700'
        },
        learn: {
            active: 'bg-green-500 hover:bg-green-600',
            inactive: 'bg-green-100 text-green-700'
        },
        examples: {
            active: 'bg-orange-500 hover:bg-orange-600',
            inactive: 'bg-orange-100 text-orange-700'
        },
        challenge: {
            active: 'bg-red-500 hover:bg-red-600',
            inactive: 'bg-red-100 text-red-700'
        }
    };

    const sections = [
        { name: 'starter', icon: PlayCircle },
        { name: 'diagnostic', icon: LineChart },
        { name: 'learn', icon: Brain },
        { name: 'examples', icon: BookOpen },
        { name: 'challenge', icon: Target }
    ];

    return (
        <nav className="flex justify-center space-x-4 mb-6">
            {sections.map(({ name, icon: Icon }) => (
                <button
                    key={name}
                    onClick={() => onSectionChange(name)}
                    className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 transition-all ${activeSection === name
                        ? `${sectionColors[name].active} text-white`
                        : `${sectionColors[name].inactive} hover:opacity-80`
                        }`}
                >
                    <Icon size={18} />
                    <span>{name.charAt(0).toUpperCase() + name.slice(1)}</span>
                </button>
            ))}
        </nav>
    );
};