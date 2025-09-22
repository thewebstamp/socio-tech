import {
  createBrowserRouter,
  Outlet,
  RouterProvider
} from 'react-router-dom';
import { GoogleOAuthProvider } from "@react-oauth/google";
import Start from './pages/start';
import Nav from './components/nav.jsx';
import Dash from './components/dash.jsx';
import NotifyDash from './components/notifyDash.jsx';
import Home from './pages/home.jsx';
import Profile from './pages/profile.jsx';
import ProtectedRoute from './components/protectedRoute.jsx';
import Users from './pages/users.jsx';
import Notifications from './pages/notifications.jsx';
import Messages from './pages/messages.jsx';

function App() {
  const Layout = () => {
    return (
      <div className='bg-[#e6e6e6] dark:bg-[#212121] w-full'>
        <header className='sticky z-30 top-[0px] bg-red-500'>
          <Nav />
        </header>
        <div className='grid grid-cols-[1.05fr_2.2fr_1.05fr]  [@media(max-width:1200px)]:grid-cols-[1.1fr_2.5fr] [@media(max-width:1000px)]:!grid-cols-[2fr_1fr] [@media(max-width:800px)]:!grid-cols-[1fr] px-[3vw] [@media(max-width:680px)]:!px-[6px]'>
          <aside className="sticky z-20 top-[60px] h-[calc(100vh-60px)] px-2 py-4 overflow-y-scroll scroll-hover bg-[#e9e9e9] dark:bg-[#181818] [@media(max-width:1000px)]:hidden">
            <Dash />
          </aside>
          <main className='min-w-0 px-[5vw] mt-[10px] [@media(max-width:1220px)]:pr-[1.15vw] [@media(max-width:800px)]:!px-0 [@media(max-width:1000px)]:!pr-[4vw] [@media(max-width:1000px)]:!pl-[1.1vw]'>
            <Outlet />
          </main>
          <aside className='sticky z-20 top-[60px] h-[calc(100vh-60px)] px-2 py-4 overflow-y-scroll scroll-hover bg-[#e9e9e9] dark:bg-[#181818] [@media(max-width:1220px)]:hidden [@media(max-width:1000px)]:!block [@media(max-width:800px)]:!hidden'>
            <NotifyDash />
          </aside>
        </div>
      </div>
    )
  };

  const router = createBrowserRouter([
    {
      path: '/welcome',
      element: <Start />
    },
    {
      path: '/',
      element: <ProtectedRoute><Layout /></ProtectedRoute>,
      children: [
        {
          path: '',
          element: <Home />
        },
        {
          path: 'profile/:id',
          element: <Profile />
        },
        {
          path: 'users/:id',
          element: <Users />
        },
        {
          path: 'notifications',
          element: <Notifications />
        },
        {
          path: 'messages',
          element: <Messages />
        }
      ]
    }
  ]);

  return (
    <GoogleOAuthProvider clientId='602971994262-auljsiafq3dmrrer40pg5q676hfr50cl.apps.googleusercontent.com'>
      <RouterProvider router={router} />
    </GoogleOAuthProvider>
  )
}

export default App
