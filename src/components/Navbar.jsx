import hamburgerIcon from '../assets/hamburger.svg';
import logo from '../assets/unlock_institucional_01.svg';
import { useState, useEffect } from 'react';
import MobileMenu from './MobileMenu';

const Navbar = ({ 
    currentSlide, 
    onMenuToggle, 
    isMenuOpen, 
    slideColor,
    setCurrentVerticalIndex,
    setCurrentHorizontalIndex 
}) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        setIsScrolled(currentSlide > 0);
    }, [currentSlide]);

    const toggleMenu = () => {
        onMenuToggle(prev => !prev);
    };

    const handleMenuItemClick = (verticalIndex, horizontalIndex) => {
        // Close mobile menu if open
        if (isMenuOpen) {
            onMenuToggle(false);
        }
        // Set indices for navigation
        setCurrentVerticalIndex(verticalIndex);
        setCurrentHorizontalIndex(horizontalIndex);
    };

    const menuItems = [
        { label: 'projecto', vertical: 0, horizontal: 0 },
        { label: 'grupos-alvo', vertical: 1, horizontal: 0 },
        { label: 'actividades', vertical: 2, horizontal: 0 },
        { label: 'parceiros', vertical: 3, horizontal: 0 },
        { label: 'resultados', vertical: 4, horizontal: 0 },
        { label: 'contactos', vertical: 5, horizontal: 0 }
    ];

    const iconColor = isPressed ? 'rgb(183, 187, 202)' : isHovered ? 'rgb(167, 144, 144)' : 'rgb(222, 222, 222)';

    return (
        <>
            <div className={`navContainer ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">
                        <img src={logo} alt="UNLOCK" height="40" />
                    </div>
                    
                    <div className="menuItemsContainer">
                        {menuItems.map((item, index) => (
                            <div
                                key={item.label}
                                className={`menuItem${index + 1}`}
                                onClick={() => handleMenuItemClick(item.vertical, item.horizontal)}
                                role="button"
                                tabIndex={0}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter' || e.key === ' ') {
                                        handleMenuItemClick(item.vertical, item.horizontal);
                                    }
                                }}
                            >
                                {item.label}
                            </div>
                        ))}
                    </div>

                    <div 
                        className={`hamburger-icon ${isMenuOpen ? 'is-active' : ''}`}
                        onClick={toggleMenu}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onMouseDown={() => setIsPressed(true)}
                        onMouseUp={() => setIsPressed(false)}
                        style={{
                            '--hamburger-color': slideColor
                        }}
                    >
                        <div className="hamburger-box">
                            <div className={`hamburger-inner ${isMenuOpen ? 'hamburger-inner-clicked' : ''}`}></div>
                        </div>
                    </div>
                </div>
            </div>
            
            <MobileMenu 
                isOpen={isMenuOpen} 
                onClose={() => onMenuToggle(false)}
                setCurrentVerticalIndex={setCurrentVerticalIndex}
                setCurrentHorizontalIndex={setCurrentHorizontalIndex}
                slideColor={slideColor}
            />
        </>
    );
};

export default Navbar;