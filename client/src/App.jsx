import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';
import SkillTreePage from './components/SkillTreePage';
import NotFoundPage from './components/NotFoundPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/map" element={<MapPage />} />
                <Route path="/skills" element={<SkillTreePage />} />
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Router>
    );
}

export default App;
