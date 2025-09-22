import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { UtilData } from './context/utilContext.jsx';
import { AuthData } from './context/authContest.jsx';

createRoot(document.getElementById('root')).render(
  <AuthData>
    <UtilData>
      <App />
    </UtilData>
  </AuthData>,
)
