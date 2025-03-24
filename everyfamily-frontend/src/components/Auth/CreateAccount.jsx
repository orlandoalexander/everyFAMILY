import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Divider } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useCreateAccount from "../../hooks/useAddUser";
import "./index.css";
import "./CreateAccount.css";

function CreateAccount() {
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
        referralCode,
      },
      {
        onSuccess: () => {
          navigate("/");
        },
      }
    );
  };

  return (
    <div className="auth-form-container">
      <h1 className="auth-form-title">Create account</h1>

      {error && (
        <div className="error-message">
          {error.message || "Something went wrong. Please try again."}
        </div>
      )}

      <Form
        name="create-account"
        className="auth-form"
        onFinish={onFinish}
        layout="vertical"
        requiredMark={false}
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
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            placeholder=""
            size="large"
            iconRender={(visible) =>
              visible ? <EyeOutlined /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item name="referralCode" label="Referral code">
          <Input placeholder="Enter your referral code" size="large" />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isPending}
            block
            className="submit-button"
          >
            Create account
          </Button>
        </Form.Item>

        <Divider style={{ marginBottom: 0 }} />

        <section>
          <p className="switch-text">Already have an account?</p>
          <Link to="/login" style={{ width: "100%" }}>
            <Button block size="large" className="switch-button">
              Log in
            </Button>
          </Link>
        </section>
      </Form>
    </div>
  );
}

export default CreateAccount;
