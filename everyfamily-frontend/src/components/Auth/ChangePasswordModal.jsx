import React, { useState } from "react";
import { Modal, Input, Button, Form } from "antd";

const ChangePasswordModal = ({ open, onCancel }) => {
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();

    const handleSubmit = async (values) => {
        setLoading(true);

        try {
            // Simulate API call (Replace with actual API request)
            await new Promise((resolve) => setTimeout(resolve, 1500));

            // Log success message to the console
            console.log("Password changed successfully!");

            form.resetFields();
            onCancel();
        } catch (error) {
            // Log error message to the console
            console.error("Failed to change password. Try again.");
        }

        setLoading(false);
    };

    return (
        <Modal
            title="Change Password"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <Form form={form} layout="vertical" onFinish={handleSubmit}>
                <Form.Item
                    label="Current Password"
                    name="currentPassword"
                    rules={[{ required: true, message: "Please enter your current password" }]}
                >
                    <Input.Password placeholder="Enter current password" />
                </Form.Item>

                <Form.Item
                    label="New Password"
                    name="newPassword"
                    rules={[{ required: true, message: "Please enter a new password" }]}
                >
                    <Input.Password placeholder="Enter new password" />
                </Form.Item>

                <Form.Item
                    label="Confirm New Password"
                    name="confirmPassword"
                    dependencies={["newPassword"]}
                    rules={[
                        { required: true, message: "Please confirm your new password" },
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
                    <Input.Password placeholder="Confirm new password" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit" loading={loading} block>
                        Change Password
                    </Button>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;
