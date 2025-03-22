import React from "react";
import { Link } from "react-router-dom";
import { Form, Input, Button, Checkbox } from "antd";
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import everyFamilyLogo from "../../assets/everyFAMILY-logo.png"; // Import logo

const LoginPage = () => {
  const onFinish = (values) => {
    console.log("Received values:", values);
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
        <h1 className="text-2xl font-semibold text-center mb-8">Log in</h1>

        <Form
          name="login"
          initialValues={{ remember: false }}
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
            <Input placeholder="" size="large" className="rounded-md" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder=""
              size="large"
              className="rounded-md"
              iconRender={(visible) =>
                visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
              }
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Link to="/forgot-password" className="text-gray-500 text-sm">
              Forgot your password
            </Link>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              style={{
                height: "48px",
                borderRadius: "500px",
                backgroundColor: "#92278F",
                fontSize: "16px",
              }}
            >
              Log in
            </Button>
          </Form.Item>

          <div className="border-t border-gray-200 pt-6 mt-4">
            <p className="text-center text-gray-700 mb-4">
              Don't have an account?
            </p>
            <Link to="/register">
              <Button
                block
                size="large"
                style={{
                  height: "48px",
                  borderRadius: "500px",
                  border: "1px solid #d9d9d9",
                  fontSize: "16px",
                }}
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

export default LoginPage;
