import React, { useEffect, useState } from 'react';
import _ from 'lodash'; // Import lodash debounce function

export const RandomDots = () => {
    const [dots, setDots] = useState([]);
    const [lines, setLines] = useState([]);

    useEffect(() => {
        createDots();
        setInterval(() => {
            console.log("Moving dots...");
            moveDots();
        }, 50);
        const handleMouseMoveThrottled = _.throttle(handleMouseMove, 50); // Throttle mouse move event handling
        window.addEventListener('mousemove', handleMouseMoveThrottled);
        return () => window.removeEventListener('mousemove', handleMouseMoveThrottled);
    }, []);

    const createDots = () => {
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const dotSize = 10;
        const spacing = 40;
        const numDotsX = Math.ceil(screenWidth / spacing);
        const numDotsY = Math.ceil(screenHeight / spacing);
        const dotsArray = [];

        for (let i = 0; i < numDotsX; i++) {
            for (let j = 0; j < numDotsY; j++) {
                dotsArray.push({ top: `${j * spacing - dotSize / 2}px`, left: `${i * spacing - dotSize / 2}px`, backgroundColor: 'white' });
            }
        }
        setDots(dotsArray);
    };

    const moveDots = () => {
        setDots(prevDots => prevDots.map(dot => {
            const currentX = parseFloat(dot.left);
            const currentY = parseFloat(dot.top);
            const newX = currentX + (Math.random() * 4 - 2);
            const newY = currentY + (Math.random() * 4 - 2);

            return {
                ...dot,
                left: `${newX}px`,
                top: `${newY}px`
            };
        }));
    };

    const drawLine = (x1, y1, x2, y2) => {
        // Calculate the length and angle of the line
        const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        // Style for the line
        const lineStyle = {
            width: `${length}px`,
            height: "1px", // Set line thickness
            backgroundColor: "white",
            position: "absolute",
            left: `${x1}px`,
            top: `${y1}px`,
            transformOrigin: "top left",
            transform: `rotate(${angle}deg)`
        };

        // Return JSX for the line
        return <div className="line" style={lineStyle}></div>;
    };

    const handleMouseMove = (event) => {
        const mouseX = event.clientX;
        const mouseY = event.clientY;
        const radius = 100; // Adjust the radius as needed
        const screenX = (event.screenX/100)*30;
        const screenY = (event.screenY/100)*30;
        const screenWidth = window.innerWidth;
        const leftBoundary = screenWidth * 0.3; // Left 30% of the screen
        const rightBoundary = screenWidth * 0.7; // Right 30% of the screen

        const newLines = [];
        setDots(prevDots => prevDots.map(dot => {
            const dotX = parseFloat(dot.left) + 5; // Assuming dot size is 10px
            const dotY = parseFloat(dot.top) + 5; // Assuming dot size is 10px
            const distance = Math.sqrt(Math.pow(mouseX - dotX, 2) + Math.pow(mouseY - dotY, 2));

            // if (mouseX >= leftBoundary && mouseX <= rightBoundary) {
            //     setLines([]);
            //     return { ...dot, backgroundColor: 'white' };
            // }
            if (distance <= radius) {
                newLines.push(drawLine(mouseX, mouseY, dotX, dotY));
                return { ...dot, backgroundColor: 'red' };
            } else {
                return { ...dot, backgroundColor: 'white' };
            }
        }));
        setLines(newLines);
    };

    return (
        <div className="random-dots" onMouseMove={handleMouseMove}>
            {dots.map((dot, index) => (
                <div key={index} className="dot" style={{ top: dot.top, left: dot.left, backgroundColor: dot.backgroundColor }}></div>
            ))}
            {lines}
        </div>
    );
};

