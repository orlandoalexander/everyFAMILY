import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, Divider, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useLogin from "../../hooks/useLogin";
import useForgotPassword from "../../hooks/useForgotPassword";
import "./index.css";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { mutate: login, isPending, error } = useLogin();
  const { mutate: forgotPassword, isPending: isForgotPasswordPending } =
    useForgotPassword();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = (values) => {
    const { email, password, remember = false } = values;

    login(
      { email, password, remember },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };

  const handleForgotPassword = () => {
    const email = form.getFieldValue("email");

    if (!email) {
      messageApi.error("Please enter your email address first");
      return;
    }

    // Validate email format
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      messageApi.error("Please enter a valid email address");
      return;
    }

    forgotPassword(
      { email },
      {
        onSuccess: () => {
          messageApi.success("Password reset link has been sent to your email");
        },
        onError: (error) => {
          messageApi.error(
            error.message || "Failed to send reset link. Please try again."
          );
        },
      }
    );
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {contextHolder}
        <h1 className="auth-form-title">Log in</h1>

        {error && (
          <div className="error-message">
            {error.message || "Something went wrong. Please try again."}
          </div>
        )}

        <Form
          name="login"
          className="auth-form"
          form={form}
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
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder=""
              size="large"
              iconRender={(visible) =>
                visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="login-options ">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Button
              className="forgot-password"
              type="link"
              onClick={handleForgotPassword}
              loading={isForgotPasswordPending}
            >
              Forgot your password
            </Button>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              block
              className="submit-button"
            >
              Log in
            </Button>
          </Form.Item>

          <Divider style={{ marginBottom: 0 }} />

          <section>
            <p className="switch-text">Don't have an account?</p>
            <Link to="/create_account">
              <Button block size="large" className="switch-button">
                Create account
              </Button>
            </Link>
          </section>
        </Form>
      </div>
    </div>
  );
}

export default Login;
