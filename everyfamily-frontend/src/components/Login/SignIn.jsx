import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox, Card, Typography, Row, Col, Alert, Space } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import useLogin from "./useLogin";

const LoginPage = () => {
    const { mutate: login, isLoading, error } = useLogin();

    const onFinish = (values) => {
        const { email, password, remember } = values;
        login({ email, password, remember: remember || false });
    };

    const { Title, Text, Paragraph } = Typography;

    return (
        <Row className="min-h-screen bg-gray-50">
            <Col xs={24} lg={12} className="flex justify-center items-center p-4">
                <Card bordered={false} className="w-full max-w-md shadow-lg" style={{ borderRadius: 8 }}>
                    <div className="text-center mb-6">
                        <Title level={2} style={{ marginBottom: 8 }}>Welcome back</Title>
                        <Paragraph type="secondary">Please enter your details to sign in</Paragraph>
                    </div>

                    {error && (
                        <Alert
                            message="Login Failed"
                            description="Invalid email or password. Please try again."
                            type="error"
                            showIcon
                            className="mb-4"
                        />
                    )}

                    <Form
                        name="login"
                        initialValues={{ remember: false }}
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
                            rules={[{ required: true, message: "Please enter your password" }]}
                        >
                            <Input.Password
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                placeholder="Enter your password"
                            />
                        </Form.Item>

                        <Form.Item>
                            <Row justify="space-between" align="middle">
                                <Form.Item name="remember" valuePropName="checked" noStyle>
                                    <Checkbox>Remember me</Checkbox>
                                </Form.Item>
                                <Link to="/forgot-password" className="text-primary">
                                    Forgot password?
                                </Link>
                            </Row>
                        </Form.Item>

                        <Form.Item>
                            <Button
                                type="primary"
                                htmlType="submit"
                                loading={isLoading}
                                block
                            >
                                Sign in
                            </Button>
                        </Form.Item>

                        <div className="text-center">
                            <Space>
                                <Text type="secondary">Don't have an account?</Text>
                                <Link to="/register" className="text-primary font-medium">
                                    Sign up
                                </Link>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </Col>

            <Col xs={0} lg={12} className="bg-blue-600 flex items-center justify-center">
                <div className="text-center text-white max-w-md p-8">
                    <Title level={2} style={{ color: "white", marginBottom: 16 }}>
                        Welcome to Our EveryFamily
                    </Title>
                </div>
            </Col>
        </Row>
    );
};

export default LoginPage;