import React from "react";
import {useDispatch, useSelector} from "react-redux";
import {Form, Input, message, Modal} from "antd";
import type {AppDispatch, RootState} from "../../redux/store.ts";
import {forgotPassword} from "../../redux/slices/user.slice.ts";
import {STATE_STATUS} from "../../constants/auth.constant.ts";

interface ForgotPasswordProps {
    open: boolean;
    onClose: () => void;
}
export const ForgotPasswordComponent: React.FC<ForgotPasswordProps> = ({
    open,
    onClose
})=> {
    const dispatch = useDispatch<AppDispatch>();
    const status = useSelector((state: RootState) => state.user.status);
    const [form] = Form.useForm();
    async function handleSubmit(): Promise<void> {
        try {
            const values = await form.validateFields();
            const result = await dispatch(forgotPassword(values));

            if(forgotPassword.fulfilled.match(result)) {
                message.success("Email sent successfully.");
                form.resetFields();
                onClose();
            }
        } catch (err) {
            message.error(""+ err);
        }
    }
    return (
        <Modal

            title="Forgot Password"
            open={open}
            onCancel={onClose}
            onOk={handleSubmit}
            confirmLoading={status === STATE_STATUS.LOADING}
            okText="Send Reset Link"
            destroyOnClose
        >
            <Form layout="vertical"
            form={form}
            >
                <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                        { required: true, message: "Please input your email" },
                        { type: "email", message: "Invalid email format" },
                    ]}
                >
                    <Input placeholder="you@example.com" />
                </Form.Item>
            </Form>
        </Modal>
    );
}