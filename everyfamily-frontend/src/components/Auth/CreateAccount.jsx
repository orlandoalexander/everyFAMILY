import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useAddUser from "../../hooks/useAddUser";
import "./CreateAccount.css";

function CreateAccount() {
  const { mutate: createAccount, isPending, error } = useAddUser();

  const onFinish = (values) => {
    const { email, password, referral_code } = values;

    createAccount({
      email,
      password,
      referral_code,
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <h1 className="auth-form-title">Create account</h1>

        {error && (
          <div className="error-message">
            {error?.response?.data?.message ||
              "Something went wrong. Please try again later."}
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
              { min: 8, message: "Password must be at least 8 characters" },
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

          <Form.Item
            name="referral_code"
            label="Referral code"
            rules={[
              { required: true, message: "Please enter a referral code" },
            ]}
          >
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
    </div>
  );
}

export default CreateAccount;
