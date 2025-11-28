import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import MapPage from './components/MapPage';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/map" element={<MapPage />} />
            </Routes>
        </Router>
    );
}

export default App;
