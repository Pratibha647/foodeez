import React from 'react';

export default function RecipeSkeleton({ count = 4 }) {
    return (
        <div className="card-container">
            {Array.from({ length: count }).map((_, index) => (
                <div key={index} className="card skeleton-card">
                    <div className="skeleton-image skeleton-pulse"></div>
                    <div className="card-body">
                        <div className="skeleton-text skeleton-title skeleton-pulse"></div>
                        <div className="skeleton-text skeleton-author skeleton-pulse"></div>
                        <div className="skeleton-footer">
                            <div className="skeleton-text skeleton-timer skeleton-pulse"></div>
                            <div className="skeleton-actions skeleton-pulse"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
