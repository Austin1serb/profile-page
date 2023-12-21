// pages/index.js
import React, { useEffect, useState } from 'react';
import '../styles/index.css'
import CanvasDots from '../components/CanvasDots';
import Throttle from '../utilities/Throttle';
import TopBar from '../components/TopBar';
import Image from 'next/image';
import profilePicture from '../assets/profile.jpg';
import Icon from '../components/Icon';


const Home = () => {

    const [isMobile, setIsMobile] = useState(false);
    const [screenWidth, setScreenWidth] = useState(0); // Initialize with window.innerWidth
    const [screenHeight, setScreenHeight] = useState(0); // Initialize with window.innerHeight
    const phrases = ['a Software Developer.', 'a Tech Lover', 'an Artist.', 'an Avid Gamer.', 'a Health Enthusiast.', ' a Human.',];

    const [currentPhrase, setCurrentPhrase] = useState(0);

    useEffect(() => {
        const intervalId = setInterval(() => {
            setCurrentPhrase((prevPhrase) => (prevPhrase + 1) % phrases.length);
        }, 3000); // Change phrase every 3 seconds

        return () => clearInterval(intervalId);
    }, []);





    useEffect(() => {
        function handleResize() {
            setIsMobile(window.innerWidth < 768);
            setScreenWidth(window.innerWidth); // Update screenWidth state
            setScreenHeight(window.innerHeight); // Update screenHeight state
        }
        const throttledResize = Throttle(handleResize, 200);
        window.addEventListener('resize', throttledResize);

        handleResize();

        return () => {
            window.removeEventListener('resize', throttledResize);
        };
    }, []);

    const scrollToMyWork = () => {
        const section = document.getElementById('my-work');
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <div>
            <div className='canvas-container'>
                <CanvasDots isMobile={isMobile} screenHeight={screenHeight} screenWidth={screenWidth} />
            </div>
            <h1 className='header-index'>
                Hello, I'm <span className='name-index'>Austin.</span> <br />
                I'm <span key={phrases[currentPhrase]} className="phrase">{phrases[currentPhrase]}</span><br />
                <div className="container">

                    <div className="center">
                        <button onClick={scrollToMyWork} className="btn">
                            <svg className='btn-outline' width="200px" height="60px" viewBox="0 0 200 60" >
                                <polyline points="199,1 199,59 1,59 1,1 199,1" className="bg-line" />
                                <polyline points="199,1 199,59 1,59 1,1 199,1" className="hl-line" />
                            </svg>
                            <span>VIEW MY WORK   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-arrow-down-circle" viewBox="0 0 16 16">
                                <path fillRule="evenodd" d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8m15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0M8.5 4.5a.5.5 0 0 0-1 0v5.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                            </svg> </span>

                        </button>
                    </div>
                </div>
            </h1>

            <div id="my-work" className='my-work' >
                <TopBar />
                <div className='my-work-container'>
                    <h2 className='about-title'>About</h2>
                    <div className='about-title-underline'></div>
                </div>
                <div className='about-container'>
                    <div className='profile-picture-container'>
                        <div className="profile-picture">
                            <div className="profile-box">
                                <div className="profile-box-color">

                                    <div className="profile-picture-image">
                                        <Image src={profilePicture} alt="Profile" height={367} width={320} className='profile-color' />
                                    </div>
                                </div>
                                <div className="profile-picture-image">
                                    <Image src={profilePicture} alt="Profile" height={367} width={320} className='profile-gray' />
                                </div>
                            </div>
                        </div>
                        <div className='profile-description'>

                            <h1>About
                                Fully committed to the philosophy of life-long learning, I’m a full stack developer with a deep passion for JavaScript, React and all things web development. The unique combination of creativity, logic, technology and never running out of new things to discover, drives my excitement and passion for web development. When I’m not at my computer I like to spend my time drawong, keeping fit and being social.</h1>

                        </div>
                    </div>
                    <div className="skills-section">
                        <h3>Languages</h3>
                        <div className="skills-grid">
                            {/* HTML */}
                            <div className="skill-icon">
                                <h6>HTML</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='html' />
                                    </div>
                                    <Icon className='gray' name='html' />
                                </div>
                            </div>

                            {/* CSS */}
                            <div className="skill-icon">
                                <h6>CSS</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='css' />
                                    </div>
                                    <Icon className='gray' name='css' />
                                </div>
                            </div>

                            {/* JavaScript */}
                            <div className="skill-icon">
                                <h6>JAVASCRIPT</h6>
                                <div>
                                    <div className="box">
                                        <div className="box-color">
                                            <Icon height='40px' width='40px' className='color' name='javascript' />
                                        </div>
                                        <Icon height='40px' width='40px' className='gray' name='javascript' />
                                    </div>
                                </div>
                            </div>

                            {/* PYTHON */}
                            <div className="skill-icon">
                                <h6>PYTHON</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='python' />
                                    </div>
                                    <Icon className='gray' name='python' />
                                </div>
                            </div>

                            {/* JAVA */}
                            <div className="skill-icon">
                                <h6>JAVA</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='java' />
                                    </div>
                                    <Icon className='gray' name='java' />
                                </div>
                            </div>
                        </div>

                        {/* Databases */}
                        <h3>Databases</h3>
                        <div className="skills-grid">
                            {/* MONGODB */}
                            <div className="skill-icon">
                                <h6>MONGODB</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='mongodb' />
                                    </div>
                                    <Icon className='gray' name='mongodb' />
                                </div>
                            </div>

                            {/* MYSQL */}
                            <div className="skill-icon">
                                <h6>MYSQL</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='mysql' />
                                    </div>
                                    <Icon className='gray' name='mysql' />
                                </div>
                            </div>

                            {/* ...other databases... */}
                        </div>

                        {/* Libraries & Frameworks */}
                        <h3>Libraries & Frameworks</h3>
                        <div className="skills-grid">
                            {/* REACT */}
                            <div className="skill-icon">
                                <h6>REACT</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='react' />
                                    </div>
                                    <Icon className='gray' name='react' />
                                </div>
                            </div>

                            {/* Express.js */}
                            <div className="skill-icon">
                                <h6>Express.js</h6>
                                <div className="box">

                                    <Icon className='gray' name='express' />
                                </div>
                            </div>

                            {/* NEXT.js */}
                            <div className="skill-icon">
                                <h6>NEXT.js</h6>
                                <div className="box">

                                    <Icon className='gray' name='next' />
                                </div>
                            </div>

                            {/* NODE.js */}
                            <div className="skill-icon">
                                <h6>NODE.js</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='node' />
                                    </div>
                                    <Icon className='gray' name='node' />
                                </div>
                            </div>

                            {/* GIT */}
                            <div className="skill-icon">
                                <h6>GIT</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='git' />
                                    </div>
                                    <Icon className='gray' name='git' />
                                </div>
                            </div>

                            {/* MATERIAL UI */}
                            <div className="skill-icon">
                                <h6>MATERIAL UI</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='mui' />
                                    </div>
                                    <Icon className='gray' name='mui' />
                                </div>
                            </div>

                            {/* AWS EC2 */}
                            <div className="skill-icon">
                                <h6>AWS EC2</h6>
                                <div className="box">
                                    <div className="box-color">
                                        <Icon className='color' name='aws' />
                                    </div>
                                    <Icon className='gray' name='aws' />
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div className='my-work-container'>
                    <h2 className='about-title'>About</h2>
                    <div className='about-title-underline'></div>
                </div>
                <div className='projects-container'></div>
            </div>

        </div>
    );
};

export default Home;
