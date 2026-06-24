import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { BsArrowLeftShort, BsArrowRightShort, BsStopwatch, BsCartPlus } from 'react-icons/bs';
import { IoMdHeart, IoMdHeartEmpty } from 'react-icons/io';
import { BsHandThumbsUp, BsHandThumbsUpFill } from 'react-icons/bs';
import defaultFoodImg from '../assets/foodRecipe1.avif';

export default function RecipeCarousel({ recipes = [], loading = false }) {
    const navigate = useNavigate();
    const scrollContainerRef = useRef(null);

    const scroll = (direction) => {
        if (scrollContainerRef.current) {
            const { scrollLeft, clientWidth } = scrollContainerRef.current;
            const scrollAmount = clientWidth * 0.75;
            scrollContainerRef.current.scrollTo({
                left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
                behavior: 'smooth'
            });
        }
    };

    if (loading) {
        return (
            <div className="carousel-loading">
                {Array.from({ length: 3 }).map((_, idx) => (
                    <div key={idx} className="card skeleton-card carousel-skeleton-item">
                        <div className="skeleton-image skeleton-pulse"></div>
                        <div className="card-body">
                            <div className="skeleton-text skeleton-title skeleton-pulse"></div>
                            <div className="skeleton-text skeleton-author skeleton-pulse"></div>
                        </div>
                    </div>
                ))}
            </div>
        );
    }

    if (!recipes || recipes.length === 0) {
        return (
            <div className="empty-carousel">
                <p>No trending recipes right now. Like or favourite some recipes to trend them!</p>
            </div>
        );
    }

    return (
        <div className="carousel-outer-wrapper">
            <button className="carousel-nav-btn prev" onClick={() => scroll('left')} aria-label="Scroll left">
                <BsArrowLeftShort />
            </button>
            
            <div className="carousel-scroll-container" ref={scrollContainerRef}>
                {recipes.map((item) => {
                    const score = (item.likesCount || 0) + (item.favouritesCount || 0);
                    return (
                        <div 
                            key={item._id} 
                            className="carousel-card-item card"
                            onClick={() => navigate(`/recipe/${item._id}`)}
                        >
                            <div className="carousel-card-img-wrapper">
                                <img 
                                    src={item.coverImage || defaultFoodImg} 
                                    alt={item.title}
                                    onError={(e) => { e.target.src = defaultFoodImg; }}
                                    loading="lazy"
                                />
                                {score > 0 && (
                                    <span className="trending-score-badge">
                                        🔥 {score} Points
                                    </span>
                                )}
                            </div>
                            <div className="card-body">
                                <div className="title">{item.title}</div>
                                {item.userEmail && (
                                    <div className="author">by {item.userEmail.split('@')[0]}</div>
                                )}
                                <div className="icons">
                                    <div className="timer">
                                        <BsStopwatch /> {item.time || "N/A"}
                                    </div>
                                    <div className="carousel-stats-preview">
                                        <span className="stat-preview-item">
                                            👍 {item.likesCount || 0}
                                        </span>
                                        <span className="stat-preview-item">
                                            ❤️ {item.favouritesCount || 0}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            <button className="carousel-nav-btn next" onClick={() => scroll('right')} aria-label="Scroll right">
                <BsArrowRightShort />
            </button>
        </div>
    );
}
