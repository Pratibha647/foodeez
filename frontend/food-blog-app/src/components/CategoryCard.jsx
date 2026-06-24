import React from 'react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
    { name: "Breakfast", icon: "🍳", color: "#F5A3B3" },
    { name: "Lunch", icon: "🥪", color: "#A8C7F0" },
    { name: "Dinner", icon: "🍜", color: "#B8E986" },
    { name: "Desserts", icon: "🍰", color: "#F7B500" },
    { name: "Vegan", icon: "🥗", color: "#7ED6C4" },
    { name: "Drinks", icon: "🍹", color: "#F3C7B0" }
];

export default function CategoryCard({ activeCategory }) {
    const navigate = useNavigate();

    return (
        <div className="category-grid">
            {CATEGORIES.map((cat) => {
                const isActive = activeCategory?.toLowerCase() === cat.name.toLowerCase();
                return (
                    <div
                        key={cat.name}
                        className={`category-card ${isActive ? 'active' : ''}`}
                        style={{ 
                            background: `linear-gradient(135deg, ${cat.color}20 0%, ${cat.color}45 100%)`,
                            border: isActive ? `2.5px solid ${cat.color}` : `1px solid ${cat.color}60`
                        }}
                        onClick={() => navigate(`/category/${cat.name.toLowerCase()}`)}
                    >
                        <div className="category-emoji">{cat.icon}</div>
                        <div className="category-name">{cat.name}</div>
                    </div>
                );
            })}
        </div>
    );
}
