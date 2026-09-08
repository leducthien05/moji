import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';

import { SignupPage } from './pages/signup';
import { SigninPage } from './pages/signin';
import { ChatApp } from './pages/chatapp';
import ProtectedRoute from './components/auth/protected.router';

function App() {

  return (
    <>
      <Toaster /> {/* Hiển thị thông báo */}
      <BrowserRouter>
        <Routes>
          {/* public routes */}
          <Route
            path="/signin"
            element={<SigninPage />}
          />

          <Route
            path="/signup"
            element={<SignupPage />}
          />

          {/* protected routes */}

          <Route element={<ProtectedRoute />}>
            <Route
              path="/"
              element={<ChatApp />}
            />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
