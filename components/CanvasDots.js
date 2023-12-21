import React, { useEffect, useRef } from 'react';
import '../styles/index.css';
import Throttle from '../utilities/Throttle';





const CanvasDots = ({ isMobile, screenWidth, screenHeight }) => {
    const canvasRef = useRef(null);


    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        canvas.width = screenWidth;
        canvas.height = screenHeight;

        const colorDot = 'blue';
        canvas.style.display = 'block';
        ctx.fillStyle = colorDot;

        const mousePosition = {
            x: null,
            y: null
        };




        class Missile {
            constructor() {
                this.x = 0;
                this.y = 0;
                this.targetX = null;
                this.targetY = null;
                this.state = 'idle'; // 'idle', 'flying', 'exploding'
                this.velocity = 10;
                this.explosionRadius = 100;
                this.explosionDuration = 30;
                this.explosionCounter = 0;
                const svg = `<svg fill="#ffff" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 459.615 459.614" xml:space="preserve" transform="rotate(180)" stroke="#ffff"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M455.456,249.343l-13.932,3.993v53.451h-40.142l-30.042-37.909h-68.935v50.638c0,6.752-2.573,12.224-5.734,12.224 l-78.506-62.856H101.073c-1.374,0-2.733-0.027-4.09-0.05v-78.049c1.357-0.022,2.717-0.047,4.09-0.047h121.717l73.873-62.862 c3.169,0,5.729,5.475,5.729,12.238v50.624h64.635l34.354-43.598h40.142v59.82l13.927,4.169 C464.818,230.934,455.456,249.343,455.456,249.343z M0,229.808c0,19.485,34.821,35.634,80.359,38.594v-77.169 C34.827,194.19,0,210.327,0,229.808z"></path> </g> </g></svg>`;
                const encodedSvg = encodeURIComponent(svg).replace(/'/g, "%27").replace(/"/g, "%22");
                const svgDataUrl = `data:image/svg+xml,${encodedSvg}`;

                // Create an Image object and set the SVG as its source
                this.image = new Image();
                this.image.src = svgDataUrl;

                this.width = 30; // Set the width of the missile image
                this.height = 30; // Set the height of the missile image
            }



            launch(x, y) {
                this.targetX = x;
                this.targetY = y;
                this.x = canvas.width; // Starting from center for dramatic effect
                this.y = canvas.height / 2;
                this.state = 'flying';

                // Calculate the angle between the missile and its target
                const dx = this.targetX - this.x;
                const dy = this.targetY - this.y;
                this.angle = Math.atan2(dy, dx);
            }


            animate(ctx) {
                if (this.state === 'flying') {
                    let dx = this.targetX - this.x;
                    let dy = this.targetY - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 10) {
                        this.state = 'exploding';
                        this.explosionCounter = this.explosionDuration;
                    } else {
                        // Calculate the angle between the missile's current direction and the target
                        const targetAngle = Math.atan2(dy, dx);

                        // Interpolate the angle to smoothly rotate the missile
                        const rotationSpeed = 0.1;
                        const diff = targetAngle - this.angle;
                        if (Math.abs(diff) > rotationSpeed) {
                            this.angle += Math.sign(diff) * rotationSpeed;
                        } else {
                            this.angle = targetAngle;
                        }

                        this.x += Math.cos(this.angle) * this.velocity;
                        this.y += Math.sin(this.angle) * this.velocity;
                    }
                } else if (this.state === 'exploding' && this.explosionCounter > 0) {
                    this.explosionCounter--;


                    // Affect dots within explosion radius
                    dots.array.forEach(dot => {
                        let dx = dot.x - this.x;
                        let dy = dot.y - this.y;
                        let distance = Math.sqrt(dx * dx + dy * dy);
                        if (distance < this.explosionRadius && !dot.isAffectedByExplosion) {
                            dot.vx += dx / distance * 40; // Scatter effect
                            dot.vy += dy / distance * 20;
                            dot.isAffectedByExplosion = true;

                            // Set a timeout to reset the dot's state after 3 seconds
                            setTimeout(() => {
                                dot.isAffectedByExplosion = false;
                            }, 1400); // 3000 milliseconds = 3 seconds
                        }
                    });

                    if (this.explosionCounter <= 0) {
                        this.state = 'idle';
                    }
                }
            }
            draw(ctx) {
                if (this.state === 'flying') {
                    ctx.save(); // Save the current canvas state
                    ctx.translate(this.x, this.y); // Translate to the missile's position
                    ctx.rotate(this.angle); // Rotate the canvas
                    ctx.drawImage(this.image, -this.width / 2, -this.height / 2, this.width, this.height);
                    ctx.restore(); // Restore the canvas state
                } else if (this.state === 'exploding') {
                    ctx.beginPath();
                    ctx.arc(this.x, this.y, this.explosionRadius * (1 - this.explosionCounter / this.explosionDuration), 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 69, 0, ${this.explosionCounter / this.explosionDuration})`; // Fading effect
                    ctx.fill();
                }
            }
        }

        const missile = new Missile();

        const dots = {
            nb: isMobile ? 200 : 300,
            distance: isMobile ? 60 : 90,
            array: [],
            mouseDotIndex: 0
        };

        // New variables for customization
        const lineWidth = 1; // Set the desired line width
        const mouseEffectDistance = 300; // Set the maximum distance for mouse effect
        const minRadius = .9; // Minimum radius of dots
        const maxRadius = 3; // Maximum radius of dots when close to the mouse

        class Dot {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.vx = -.5 + Math.random();
                this.vy = -.5 + Math.random();
                this.radius = minRadius;
                this.isFixed = false;
                this.isAffectedByExplosion = false;


            }
            updatePosition(x, y) {
                this.x = x;
                this.y = y;
            }
            setFixed(isFixed) {
                this.isFixed = isFixed;
            }
            create() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
                ctx.fillStyle = colorDot;
                ctx.fill();
            }

            damping = 0.95;
            maxVelocity = 7;

            animate() {
                // Only apply damping and limit velocity if the dot is affected by an explosion
                if (this.isAffectedByExplosion) {
                    // Apply damping
                    this.vx *= this.damping;
                    this.vy *= this.damping;

                    // Limit the velocity
                    this.vx = Math.min(this.maxVelocity, Math.max(-this.maxVelocity, this.vx));
                    this.vy = Math.min(this.maxVelocity, Math.max(-this.maxVelocity, this.vy));
                }

                // Basic movement logic should always run
                if (!this.isFixed) {
                    if (this.y < 0 || this.y > canvas.height) {
                        this.vy = -this.vy;
                    } else if (this.x < 0 || this.x > canvas.width) {
                        this.vx = -this.vx;
                    }
                    this.x += this.vx;
                    this.y += this.vy;
                }
            }
            updateRadius() {
                if (mousePosition.x != null && mousePosition.y != null) {
                    const dx = this.x - mousePosition.x;
                    const dy = this.y - mousePosition.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);
                    this.radius = minRadius + (maxRadius - minRadius) * Math.max(0, Math.min(1, (mouseEffectDistance - distance) / mouseEffectDistance));
                } else {
                    this.radius = minRadius;
                }
            }
        }

        // Initialize dots
        for (let i = 0; i < dots.nb; i++) {
            dots.array.push(new Dot());
        }


        function animateDots() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw each dot and animate
            dots.array.forEach(dot => {
                dot.updateRadius();
                dot.create();
                dot.animate();
            });

            ctx.lineWidth = lineWidth; // Set line width

            for (let i = 0; i < dots.nb; i++) {
                for (let j = i + 1; j < dots.nb; j++) {
                    const dot1 = dots.array[i];
                    const dot2 = dots.array[j];

                    const distance = Math.sqrt((dot1.x - dot2.x) ** 2 + (dot1.y - dot2.y) ** 2);
                    const mouseDistance = mousePosition.x != null && mousePosition.y != null
                        ? Math.sqrt((dot1.x - mousePosition.x) ** 2 + (dot1.y - mousePosition.y) ** 2)
                        : mouseEffectDistance;

                    if (distance < dots.distance) {
                        const opacity = Math.max(0, Math.min(1, 1 - mouseDistance / mouseEffectDistance));
                        ctx.strokeStyle = `rgba(72, 141, 199, ${opacity})`;
                        ctx.beginPath();
                        ctx.moveTo(dot1.x, dot1.y);
                        ctx.lineTo(dot2.x, dot2.y);
                        ctx.stroke();
                    }
                }
            }
            missile.animate(ctx);
            missile.draw(ctx);

            requestAnimationFrame(animateDots);
        }

        function handleClick(e) {
            const rect = canvasRef.current.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            missile.launch(x, y);
        }
        if (isMobile) {

            mousePosition.x += 300
            mousePosition.y += 300

            mousePosition.x = Math.min(screenWidth, Math.max(0, mousePosition.x));
            mousePosition.y = Math.min(screenHeight, Math.max(0, mousePosition.y));
            // Optionally, you can log the position or update the UI here



        }
        const handleMouseMove = Throttle((e) => {
            mousePosition.x = e.pageX;
            mousePosition.y = e.pageY;


            // Update the position of the special dot
            const mouseDot = dots.array[dots.mouseDotIndex];
            mouseDot.updatePosition(e.pageX, e.pageY);
            mouseDot.setFixed(true); // Set the dot as fixed
        }, 10)
        canvas.addEventListener('click', handleClick);
        window.addEventListener('mousemove', handleMouseMove);

        animateDots();

        return () => {
            canvas.removeEventListener('click', handleClick);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [screenWidth, screenHeight, isMobile]);

    return <canvas ref={canvasRef} className="connecting-dots"></canvas>;
};

export default CanvasDots;