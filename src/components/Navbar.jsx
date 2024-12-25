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
    const [isMobile, setIsMobile] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const [showMenu, setShowMenu] = useState(true);
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 900);
            if (window.innerWidth > 900) {
                onMenuToggle(false);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [onMenuToggle]);

    useEffect(() => {
        setIsScrolled(currentSlide > 0);
    }, [currentSlide]);

    const toggleMenu = () => {
        onMenuToggle(prev => !prev);
    };

    const handleMenuItemClick = (verticalIndex, horizontalIndex) => {
        setCurrentVerticalIndex(verticalIndex);
        setCurrentHorizontalIndex(horizontalIndex);
    };

    const iconColor = isPressed ? 'rgb(183, 187, 202)' : isHovered ? 'rgb(167, 144, 144)' : 'rgb(222, 222, 222)';

    return (
        <>
            <div className={`navContainer ${isScrolled ? 'scrolled' : ''}`}>
                <div className="nav-content">
                    <div className="logo">
                        <img src={logo} alt="UNLOCK" height="40" />
                    </div>
                    
                    <div className="menuItemsContainer">
                        <div className="menuItem1"onClick={() => handleMenuItemClick(0, 0)}>about</div>
                        <div className="menuItem2"onClick={() => handleMenuItemClick(1, 0)}>objectives</div>
                        <div className="menuItem3"onClick={() => handleMenuItemClick(2, 0)}>stakeholders</div>
                        <div className="menuItem4"onClick={() => handleMenuItemClick(3, 0)}>field reports</div>
                        <div className="menuItem5"onClick={() => handleMenuItemClick(4, 0)}>Contacts</div>
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
                            <div className="hamburger-inner"></div>
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