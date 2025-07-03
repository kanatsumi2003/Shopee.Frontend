import './App.css'
import {Route, Routes} from "react-router-dom";
import {LoginPage} from "./pages/login.page.tsx";
import ProtectedRoute from "./routes/protected.route.tsx";
import {UserProfilePage} from "./pages/user/user.profile.page.tsx";
import 'antd/dist/reset.css';
import {RegisterPage} from "./pages/register.page.tsx";
import {ConfirmEmailOtpPage} from "./pages/user/confirm.email.otp.page.tsx";
import {PasswordRecoveryPage} from "./pages/user/password.recovery.page.tsx";
import {HomePage} from "./pages/home.page.tsx";

function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />}/>
            <Route path="/register" element={<RegisterPage />} />
            <Route path={"/confirmation"} element={<ConfirmEmailOtpPage />}/>
            <Route path={"/forgot-password"} element={<PasswordRecoveryPage />}/>
            <Route path={"/"} element={<HomePage/>}/>
            <Route element={<ProtectedRoute/> }>
                <Route path="/profile" element={<UserProfilePage />}/>
            </Route>
        </Routes>
    )
}
export default App;
