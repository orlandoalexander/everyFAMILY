import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import everyFamilyLogo from "../../assets/everyFAMILY-logo.png";
import api from "../../hooks/api";
import "./SignIn.css"; // Reuse signin styles

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [error, setError] = useState(null);

    const onFinish = async (values) => {
        setIsLoading(true);
        setError(null);

        try {
            // Replace with actual API call when available
            // await api.post("/forgot-password", { email: values.email });

            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));

            setEmailSent(true);
            message.success("Reset link sent to your email");
        } catch (err) {
            setError({
                message: "Failed to send reset email. Please try again."
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signin-container">
            <div className="logo-container">
                <img
                    src={everyFamilyLogo}
                    alt="everyFAMILY logo"
                    className="logo"
                />
            </div>

            <div className="form-container">
                <h1 className="form-title">Reset Your Password</h1>

                {error && (
                    <div className="error-message">
                        {error.message}
                    </div>
                )}

                {!emailSent ? (
                    <Form
                        name="forgotPassword"
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                    >
                        <p style={{ marginBottom: "24px", color: "#666666" }}>
                            Enter your email address and we'll send you a link to reset your password.
                        </p>

                        <Form.Item
                            name="email"
                            label="Email address"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" }
                            ]}
                        >
                            <Input
                                placeholder=""
                                size="large"
                                className="input-field"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                                className="login-button"
                            >
                                Send reset link
                            </Button>
                        </Form.Item>
                    </Form>
                ) : (
                    <div style={{ textAlign: "center" }}>
                        <p style={{ marginBottom: "24px", color: "#666666" }}>
                            A password reset link has been sent to your email address.
                            Please check your inbox and follow the instructions.
                        </p>
                    </div>
                )}

                <div className="divider"></div>

                <div className="create-account-section">
                    <p className="create-account-text">Remember your password?</p>
                    <Link to="/login" style={{ width: "100%" }}>
                        <Button
                            block
                            size="large"
                            className="create-account-button"
                            style={{ background: "white", color: "#666666" }}
                        >
                            Back to login
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;