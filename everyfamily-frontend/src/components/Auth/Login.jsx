import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { EyeOutlined, EyeInvisibleOutlined } from "@ant-design/icons";
import useLogin from "../../hooks/useLogin";
import useResetPassword from "../../hooks/useResetPassword";
import "./index.css";
import "./Login.css";

function Login() {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const {
    mutate: login,
    isPending: loginIsPending,
    error: loginError,
  } = useLogin();
  const { mutate: resetPassword, isPending: resetPasswordIsPending } =
    useResetPassword();
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

  const handleResetPassword = () => {
    const email = form.getFieldValue("email");

    if (!email) {
      messageApi.error("Please enter your email address first");
      return;
    }

    resetPassword(
      { email },
      {
        onSuccess: () => {
          messageApi.success(
            `New password has been sent to '${email}'. Remember to check your junk/spam.`,
            10
          );
        },
        onError: (error) => {
          messageApi.error(
            error?.response?.data?.message ||
              "Failed to send reset link. Please try again.",
            10
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

        {loginError && (
          <div className="error-message">
            {loginError?.response?.data?.message ||
              "Error logging in. Please try again later."}
          </div>
        )}

        <Form
          name="login"
          className="auth-form"
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={onFinish}
          validateTrigger="onSubmit"
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

          <div className="login-options">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember me</Checkbox>
            </Form.Item>
            <Button
              className="forgot-password"
              type="link"
              onClick={handleResetPassword}
              loading={resetPasswordIsPending}
            >
              Forgot your password
            </Button>
          </div>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loginIsPending}
              block
              className="submit-button"
            >
              Log in
            </Button>
          </Form.Item>

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
