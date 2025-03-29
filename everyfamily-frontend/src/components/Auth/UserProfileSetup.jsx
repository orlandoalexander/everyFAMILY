import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import { useMutation } from "@tanstack/react-query";
import api from "../../hooks/api";
import { useContext } from "react";
import AuthContext from "../../AuthContext";
import "../Auth/index.css";


function UserProfileSetup() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();

    const updateUserProfile = useMutation({
        mutationFn: async (userData) => {
            const response = await api.put(`/user/${user.id}`, userData);
            return response.data;
        },
        onSuccess: () => {
            messageApi.success("Profile updated successfully");
            navigate("/");
        },
        onError: (error) => {
            messageApi.error(
                error.message || "Failed to update profile. Please try again."
            );
        },
    });

    const onFinish = (values) => {
        updateUserProfile.mutate(values);
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                {contextHolder}
                <h1 className="auth-form-title">Complete your profile</h1>

                <Form
                    name="user-profile"
                    className="auth-form"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[
                            { required: true, message: "Please enter your first name" },
                        ]}
                    >
                        <Input placeholder="" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[
                            { required: true, message: "Please enter your last name" },
                        ]}
                    >
                        <Input placeholder="" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="localAuthority"
                        label="Local Authority"
                        rules={[
                            { required: true, message: "Please enter your local authority" },
                        ]}
                    >
                        <Input placeholder="" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="organisation"
                        label="Organisation"
                        rules={[
                            { required: true, message: "Please enter your organisation" },
                        ]}
                    >
                        <Input placeholder="" size="large" />
                    </Form.Item>

                    <Form.Item
                        name="organisationRole"
                        label="Organisation Role"
                        rules={[
                            { required: true, message: "Please enter your role in the organisation" },
                        ]}
                    >
                        <Input placeholder="" size="large" />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={updateUserProfile.isPending}
                            block
                            className="submit-button"
                        >
                            Save Profile
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </div>
    );
}

export default UserProfileSetup;