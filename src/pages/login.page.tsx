import {Button, Divider, Form, Input, message, Typography} from "antd";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../redux/store.ts";
import {loginUser} from "../redux/slices/auth.slice.ts";
import {Link, useNavigate} from "react-router-dom";
import {userActions} from "../redux/slices/user.slice.ts";
import {ForgotPasswordComponent} from "../components/user/forgot.password.component.tsx";
import {HomeOutlined} from "@ant-design/icons";

const {Title} = Typography;

export const LoginPage = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.auth.status);
    const isForgotPasswordModalOpen = useSelector((state: RootState) => state.user.isForgotPasswordModalOpen);
    async function handleLogin(values: {email: string, password: string}) {
        const result = await dispatch(loginUser(values));

        if(loginUser.fulfilled.match(result)) {
            message.success("Login successful");
            navigate("/profile");
        } else {
            console.log(result.payload);
            message.error((result.payload as string) ?? 'Login failed');
        }
    }

    return (
        <div style={{ maxWidth: 400, margin: '100px auto' }}>
            <Title level={2} style={{ textAlign: 'center' }}>
                Login
            </Title>

            <Form
                layout="vertical"
                onFinish={handleLogin}
                initialValues={{ email: '', password: '' }}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: 'Please input your email!' },
                        { type: 'email', message: 'Enter a valid email!' },
                    ]}
                >
                    <Input placeholder="you@example.com" />
                </Form.Item>

                <Form.Item
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                    <div style={{
                        textAlign: 'right',
                    }}>
                        <a onClick={() => {
                            dispatch(userActions.openForgotPasswordModal())
                        }}>Forgot password</a>
                    </div>
                </Form.Item>
                <ForgotPasswordComponent
                    open={isForgotPasswordModalOpen}
                    onClose={() => dispatch(userActions.closeForgotPasswordModal())}
                />
                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={status === 'loading'}
                    >
                        Login
                    </Button>
                    <Divider
                        plain
                    >
                        Not have an account?
                    </Divider>
                    <Button type={"primary"}
                            htmlType="submit"
                            block
                            ghost
                            href={"/register"}
                    >
                        Register
                    </Button>
                </Form.Item>
                <Form.Item>
                    <Button block type="primary" ghost>
                        <Link to={"/"}>
                            <HomeOutlined/> Back to home page
                        </Link>
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}