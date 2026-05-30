import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Welcome from './pages/Welcome';
import Signup from './pages/Signup';
import Signin from './pages/Signin';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import AutoMode from './pages/AutoMode';
import SwipeMode from './pages/SwipeMode';
import Settings from './pages/Settings';
import Account from './pages/Account';
import Applications from './pages/Applications';
import SavedJobs from './pages/SavedJobs';

function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<Welcome />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/signin" element={<Signin />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/applications" element={<Applications />} />
        <Route path="/saved" element={<SavedJobs />} />
        <Route path="/auto" element={<AutoMode />} />
        <Route path="/swipe" element={<SwipeMode />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/account" element={<Account />} />
      </Routes>
    </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
