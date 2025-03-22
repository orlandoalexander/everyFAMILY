import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useCreateAccount from "../../hooks/useCreateAccount";
import everyFamilyLogo from "../../assets/everyFAMILY-logo.png";
import "./SignUp.css";

const SignUp = () => {
    const navigate = useNavigate();
    const { mutate: createAccount, isPending, error } = useCreateAccount();

    const onFinish = (values) => {
        const { email, password, referralCode } = values;

        createAccount(
            {
                email,
                password,
                role: "user",
                remember: true,
                referralCode
            },
            {
                onSuccess: () => {
                    navigate("/");
                }
            }
        );
    };

    return (
        <div className="signup-container">
            <div className="logo-container">
                <img
                    src={everyFamilyLogo}
                    alt="everyFAMILY logo"
                    className="logo"
                />
            </div>

            <div className="form-container">
                <h1 className="form-title">Create account</h1>

                {error && (
                    <div className="error-message">
                        {error.message || "Something went wrong. Please try again."}
                    </div>
                )}

                <Form
                    name="signup"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                >
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

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 6, message: "Password must be at least 6 characters" }
                        ]}
                    >
                        <Input.Password
                            placeholder=""
                            size="large"
                            className="input-field"
                            iconRender={(visible) => (
                                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="referralCode"
                        label="Referral code"
                    >
                        <Input
                            placeholder="Enter your referral code"
                            size="large"
                            className="input-field"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            block
                            className="create-account-button"
                        >
                            Create account
                        </Button>
                    </Form.Item>

                    <div className="divider"></div>

                    <div className="login-section">
                        <p className="login-text">Already have an account?</p>
                        <Link to="/login" style={{ width: "100%" }}>
                            <Button
                                block
                                size="large"
                                className="login-button"
                            >
                                Log in
                            </Button>
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SignUp;