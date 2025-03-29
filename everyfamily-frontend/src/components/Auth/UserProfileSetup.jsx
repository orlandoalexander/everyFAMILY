import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import useUpdateProfile from "../../hooks/useUpdateProfile";
import { useContext } from "react";
import AuthContext from "../../AuthContext";
import "../Auth/index.css";


function UserProfileSetup() {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [messageApi, contextHolder] = message.useMessage();

    const updateProfile = useUpdateProfile();

    const onFinish = (values) => {
        updateProfile.mutate(values, {
            onSuccess: () => {
                messageApi.success("Profile updated successfully");
                setTimeout(() => navigate("/"), 1500);
            },
            onError: (error) => {
                messageApi.error(
                    error?.response?.data?.message || "Failed to update profile. Please try again."
                );
            }
        });
    };

    return (
        <div className="auth-container">
            <div className="auth-form-container">
                {contextHolder}
                <h1 className="auth-form-title">Complete your profile</h1>

                {updateProfile.isError && (
                    <div className="error-message">
                        {updateProfile.error?.response?.data?.message || "Something went wrong. Please try again."}
                    </div>
                )}

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
                            loading={updateProfile.isPending}
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