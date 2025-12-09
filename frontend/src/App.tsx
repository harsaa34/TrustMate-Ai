// src/App.tsx - CORRECTED (remove QueryClientProvider)
import { BrowserRouter as Router } from 'react-router-dom';
import AppRoutes from './components/router';

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;