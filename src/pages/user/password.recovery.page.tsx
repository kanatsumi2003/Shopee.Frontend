import React, {useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import type {AppDispatch, RootState} from "../../redux/store.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Button, Form, Input, message, Typography} from "antd";
import {recoverPassword, userActions} from "../../redux/slices/user.slice.ts";

const {Title} = Typography
export const PasswordRecoveryPage: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const location = useLocation();
    const navigate = useNavigate();
    const forgotPasswordPayload = useSelector((state: RootState) => state.user.forgotPassword);


    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const email = searchParams.get("email");
        const token = searchParams.get("token");
        const timeStamp = searchParams.get("timestamp");

        if (Number(timeStamp) < (Math.floor(Date.now() / 1000))) {
            message.error("Link expired!");
            return;
        }

        if (!email || !timeStamp || !token) {
            message.error("Invalid or expired reset link");
            return;
        }

        dispatch(userActions.setRecoveryPasswordPayload({
            token: token,
            email: email,
            timestamp: timeStamp
        }))
        console.log('2' + email);

    }, [dispatch, location.search])


    async function handleRecoverPassword(payload: { newPassword: string }) {
        try {
            const result = await dispatch(recoverPassword({
                email: forgotPasswordPayload.email,
                timestamp: forgotPasswordPayload.timestamp,
                token: forgotPasswordPayload.token,
                newPassword: payload.newPassword
            }));

            if (recoverPassword.fulfilled.match(result)) {
                message.success("Reset password successfully");
                navigate("/login");
            }
        } catch (err) {
            message.error(err.message);
        }
    }

    return (
        <div style={{maxWidth: 400, margin: '100px auto'}}>
            <Title level={4} style={{
                textAlign: 'center'
            }}>Recover password</Title>
            <Form
                layout={"vertical"}
                onFinish={handleRecoverPassword}
            >
                <Form.Item
                    label={"New Password"}
                    name={"newPassword"}
                    rules={[
                        {
                            required: true,
                            message: "Please enter new password",
                        }
                    ]}
                >
                    <Input.Password placeholder={"********"}/>
                </Form.Item>
                <Form.Item
                    label={"Confirm new Password"}
                    name={"ConfirmNewPassword"}
                    dependencies={["newPassword"]}
                    rules={[
                        {
                            required: true,
                            message: "Please enter confirm new password",
                        },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue("newPassword") === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error("Passwords do not match!"));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder={"********"}/>
                </Form.Item>
                <Form.Item>
                    <Button type={"primary"} htmlType={"submit"} block>
                        Confirm
                    </Button>

                </Form.Item>
                <Form.Item>

                    <Button type={"primary"} ghost block onClick={() => {
                        navigate("/");
                    }}>
                        Cancel
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}