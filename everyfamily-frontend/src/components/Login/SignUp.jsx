import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, Row, Col, Alert, Space } from "antd";
import { UserOutlined, LockOutlined, SafetyOutlined } from "@ant-design/icons";
import useCreateAccount from "./useRegisterUser";

const RegisterPage = () => {
    const navigate = useNavigate();

    const { mutate: createAccount, isLoading, error } = useCreateAccount();

    const onFinish = (values) => {
        const { email, password } = values;

        createAccount(
            {
                email,
                password,
                role: "user",
                remember: true
            },
            {
                onSuccess: () => {
                    navigate("/dashboard");
                }
            }
        );
    };

    const { Title, Text, Paragraph } = Typography;

    return (
        <Row className="min-h-screen bg-gray-50">
            <Col xs={24} lg={12} className="flex justify-center items-center p-4">
                <Card bordered={false} className="w-full max-w-md shadow-lg" style={{ borderRadius: 8 }}>
                    <div className="text-center mb-6">
                        <Title level={2} style={{ marginBottom: 8 }}>Create an account</Title>
                        <Paragraph type="secondary">Fill in the details to get started</Paragraph>
                    </div>

                    {error && (
                        <Alert
                            message="Registration Failed"
                            description={error.message || "Something went wrong. Please try again."}
                            type="error"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    <Form
                        name="register"
                        initialValues={{ agree: false }}
                        onFinish={onFinish}
                        layout="vertical"
                        requiredMark={false}
                        size="large"
                    >
                        <Form.Item
                            name="email"
                            label="Email"
                            rules={[
                                { required: true, message: "Please enter your email" },
                                { type: "email", message: "Please enter a valid email" }
                            ]}
                        >
                            <Input
                                prefix={<UserOutlined className="site-form-item-icon" />}
                                placeholder="Enter your email"
                            />
                        </Form.Item>

                        <Form.Item
                            name="password"
                            label="Password"
                            rules={[
                                { required: true, message: "Please enter your password" },
                                { min: 8, message: "Password must be at least 8 characters" }
                            ]}
                            hasFeedback
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Create a password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="confirmPassword"
                            label="Confirm Password"
                            dependencies={["password"]}
                            hasFeedback
                            rules={[
                                { required: true, message: "Please confirm your password" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue("password") === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error("The two passwords do not match"));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                prefix={<SafetyOutlined className="site-form-item-icon" />}
                                placeholder="Confirm your password"
                            />
                        </Form.Item>

                        <Form.Item
                            name="agree"
                            valuePropName="checked"
                            rules={[
                                {
                                    validator: (_, value) =>
                                        value
                                            ? Promise.resolve()
                                            : Promise.reject(new Error("You must agree to the Terms of Service")),
                                },
                            ]}
                        >
                            <Checkbox>
                                I agree to the{" "}
                                <Link to="/terms" className="text-primary">
                                    Terms of Service
                                </Link>{" "}
                                and{" "}
                                <Link to="/privacy" className="text-primary">
                                    Privacy Policy
                                </Link>
                            </Checkbox>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                            >
                                Create account
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <Space>
                                <Text type="secondary">Already have an account?</Text>
                                <Link to="/login" className="text-primary font-medium">
                                    Sign in
                                </Link>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </Col>

            <Col xs={0} lg={12} className="bg-blue-600 flex items-center justify-center">
                <div className="text-center text-white max-w-md p-8">
                    <Title level={2} style={{ color: "white", marginBottom: 16 }}>
                        Join Our Community
                    </Title>
                    <Paragraph style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: 18 }}>
                        Connect with resources for every family
                    </Paragraph>
                </div>
            </Col>
        </Row>
    );
};

export default RegisterPage;