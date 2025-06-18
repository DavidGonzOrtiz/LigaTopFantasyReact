import type { FC } from 'react'; 

// Asegúrate de que las rutas sean correctas según tu estructura de carpetas
import Hero from './LandingComps/Hero';
import HowItWorks from './LandingComps/HowItWorks';
import Features from './LandingComps/Features';
import Gallery from './LandingComps/Gallery';
import CallToAction from './LandingComps/CallToAction';

const Landing: FC = () => {
    return (
        <main style={{ marginTop: '60px' }}>
            <Hero />
            <HowItWorks />
            <Features />
            <Gallery />
            <CallToAction />
        </main>
    );
};

export default Landing;
