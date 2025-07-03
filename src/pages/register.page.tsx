import React from "react";
import {Button, DatePicker, Form, Input, Typography} from "antd";
import {useNavigate} from "react-router-dom";
import dayjs from "dayjs";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../redux/store.ts";
import {registerAccount} from "../redux/slices/user.slice.ts";

const {Title} = Typography;
export const RegisterPage: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.user);

    async function handleRegister(values: { email: string, password: string, name: string, dateOfBirth: Date, phoneNumber: string}) {
        const result = await dispatch(registerAccount({
            email: values.email,
            password: values.password,
            name: values.name,
            dateOfBirth: values.dateOfBirth,
            phoneNumber: values.phoneNumber
        }));

        if(registerAccount.fulfilled.match(result)) {
            navigate('/confirmation', {state: {email: values.email}});
        }
    }
    return(
        <div style={{ maxWidth: 400, margin: "100px auto" }}>
            <Title level={2} style={{ textAlign: "center" }}>Register</Title>

            <Form layout="vertical" onFinish={handleRegister}>
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email!" },
                        { type: "email", message: "Enter a valid email!" },
                    ]}
                >
                    <Input placeholder="you@example.com" />
                </Form.Item>

                <Form.Item
                    label="Name"
                    name="name"
                    rules={[
                        {
                            required: true, message: "Please input your name!",
                        }
                    ]}
                >
                    <Input placeholder={"Your name"}></Input>
                </Form.Item>

                <Form.Item
                    label={"Date of Birth"}
                    name="dateOfBirth"
                    rules={[
                        {
                            required: true,
                            message: "Please input your date of birth!",
                        }
                    ]}

                >
                    <DatePicker style={{
                        width: "100%"
                    }} format={"DD-MM-YYYY"}
                        disabledDate={(current) => current && current > dayjs().endOf("day")}
                    />
                </Form.Item>

                <Form.Item
                    label={"Phone Number"}
                    name="phoneNumber"
                    rules={[
                        {
                            required: true,
                            message: "Please input your phone number!",
                        }
                    ]}
                >
                    <Input placeholder={"0123456789"}/>
                </Form.Item>
                <Form.Item
                    label="Password"
                    name="password"
                    rules={[
                        { required: true, message: "Please input your password!" },
                        { min: 6, message: "Password must be at least 6 characters!" },
                    ]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item
                    label="Confirm Password"
                    name={"confirmPassword"}
                    dependencies={["password"]}
                    rules={[
                        { required: true, message: "Please confirm your password!" },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("password") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="••••••••" />
                </Form.Item>

                <Form.Item>
                    <Button
                        type="primary"
                        htmlType="submit"
                        block
                        loading={status.status === "loading"}
                    >
                        Register
                    </Button>
                </Form.Item>

                <Form.Item>
                    <div style={{ textAlign: "center" }}>
                        Already have an account?{" "}
                        <a onClick={() => navigate("/login")}>Login</a>
                    </div>
                </Form.Item>
            </Form>
        </div>
    )
}