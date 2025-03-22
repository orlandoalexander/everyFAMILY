import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import useCreateAccount from "../../hooks/useCreateAccount";
import everyFamilyLogo from "../../assets/everyFAMILY-logo.png";
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

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-white">
            <div className="w-full max-w-md mb-8">
                <img
                    src={everyFamilyLogo}
                    alt="everyFAMILY logo"
                    className="mb-12 w-64 mx-auto"
                />
            </div>

            <div className="w-full max-w-md border border-gray-200 rounded-lg p-8 bg-white shadow-sm">
                <h1 className="text-2xl font-semibold text-center mb-8">Create account</h1>

                {error && (
                    <div className="mb-4 text-red-500 text-center">
                        {error.message || "Something went wrong. Please try again."}
                    </div>
                )}

                <Form
                    name="register"
                    initialValues={{ agree: false }}
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
                            className="rounded-md"
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        label="Password"
                        rules={[
                            { required: true, message: "Please enter your password" },
                            { min: 8, message: "Password must be at least 8 characters" }
                        ]}
                    >
                        <Input.Password
                            placeholder=""
                            size="large"
                            className="rounded-md"
                            iconRender={(visible) => (
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            )}
                        />
                    </Form.Item>

                    <Form.Item
                        name="confirmPassword"
                        label="Confirm Password"
                        dependencies={["password"]}
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
                            placeholder=""
                            size="large"
                            className="rounded-md"
                            iconRender={(visible) => (
                                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                            )}
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
                            style={{
                                height: "48px",
                                borderRadius: "500px",
                                backgroundColor: "#92278F",
                                fontSize: "16px"
                            }}
                        >
                            Create account
                        </Button>
                    </Form.Item>

                    <div className="border-t border-gray-200 pt-6 mt-4">
                        <p className="text-center text-gray-700 mb-4">Already have an account?</p>
                        <Link to="/login">
                            <Button
                                block
                                size="large"
                                style={{
                                    height: "48px",
                                    borderRadius: "500px",
                                    border: "1px solid #d9d9d9",
                                    fontSize: "16px"
                                }}
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

export default RegisterPage;