import React from "react";
import {Button, Form, Input, message, Typography} from "antd";
import {useLocation, useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";
import type {AppDispatch} from "../../redux/store.ts";
import {confirmEmail} from "../../redux/slices/user.slice.ts";

const {Title, Text} = Typography
export const ConfirmEmailOtpPage: React.FC = () => {
    const location = useLocation();
    const email = location.state.email;
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const onFinish = async (values: { pin: string }) => {
        try {
            const result = await dispatch(confirmEmail({
                email: email,
                emailOtp: values.pin
            }));

            if(confirmEmail.fulfilled.match(result)) {
                message.success("Email confirmed successfully!");
                navigate('/login');
            }
        } catch (error) {
            message.error("Invalid PIN. Please try again." +   error);
        }
    };

    return (
        <div style={{ maxWidth: 400, margin: "100px auto", padding: 24 }}>
            <Title level={2} style={{ textAlign: "center" }}>
                Confirm Your Email
            </Title>

            <Text type="secondary" style={{ display: "block", textAlign: "center", marginBottom: 24 }}>
                Please enter the 6-digit PIN sent to your email.
            </Text>

            <Form layout="vertical"  onFinish={onFinish}>
                <Form.Item
                    label="Confirmation PIN"
                    name="pin"
                    rules={[
                        { required: true, message: "PIN is required" },
                        {
                            pattern: /^\d{6}$/,
                            message: "PIN must be 6 digits",
                        },
                    ]}
                >
                    <Input.OTP />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" block>
                        Confirm Email
                    </Button>
                </Form.Item>
            </Form>
        </div>
    );
}