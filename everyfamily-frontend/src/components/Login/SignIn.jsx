import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useLogin from "../../hooks/useLogin";
import everyFamilyLogo from "../../assets/everyFAMILY-logo.png";
import "./SignIn.css";

const SignIn = () => {
    const navigate = useNavigate();
    const { mutate: login, isPending, error } = useLogin();

    const onFinish = (values) => {
        const { email, password, remember = false } = values;

        login(
            { email, password, remember },
            {
                onSuccess: () => {
                    navigate("/");
                }
            }
        );
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
                <h1 className="form-title">Log in</h1>

                {error && (
                    <div className="error-message">
                        {error.message || "Something went wrong. Please try again."}
                    </div>
                )}

                <Form
                    name="signin"
                    onFinish={onFinish}
                    layout="vertical"
                    requiredMark={false}
                    initialValues={{ remember: false }}
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
                            { required: true, message: "Please enter your password" }
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

                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "24px"
                    }}>
                        <Form.Item
                            name="remember"
                            valuePropName="checked"
                            noStyle
                        >
                            <Checkbox>Remember me</Checkbox>
                        </Form.Item>
                        <Link
                            to="/forgot-password"
                            style={{
                                color: "#666666",
                                fontSize: "14px"
                            }}
                        >
                            Forgot your password
                        </Link>
                    </div>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            loading={isPending}
                            block
                            className="login-button"
                        >
                            Log in
                        </Button>
                    </Form.Item>

                    <div className="divider"></div>

                    <div className="create-account-section">
                        <p className="create-account-text">Don't have an account?</p>
                        <Link to="/register" style={{ width: "100%" }}>
                            <Button
                                block
                                size="large"
                                className="create-account-button"
                            >
                                Create account
                            </Button>
                        </Link>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default SignIn;