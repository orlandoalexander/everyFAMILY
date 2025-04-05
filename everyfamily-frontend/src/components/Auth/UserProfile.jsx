import React from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message } from "antd";
import useUpdateUser from "../../hooks/useUpdateUser";
import "../Auth/index.css";

function UserProfile() {
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const updateUser = useUpdateUser();

  const onFinish = (values) => {
    updateUser.mutate(values, {
      onSuccess: () => {
        navigate("/");
      },
      onError: (error) => {
        messageApi.error(
          error?.response?.data?.message ||
            "Failed to create account. Please try again."
        );
      },
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        {contextHolder}
        <h1 className="auth-form-title">Complete your profile</h1>

        {updateUser.isError && (
          <div className="error-message">
            {updateUser.error?.response?.data?.message ||
              "Something went wrong. Please try again."}
          </div>
        )}

        <Form
          name="user-profile"
          className="auth-form"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="first_name"
            label="First Name"
            rules={[
              { required: true, message: "Please enter your first name" },
            ]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item
            name="last_name"
            label="Last Name"
            rules={[{ required: true, message: "Please enter your last name" }]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item
            name="local_authority"
            label="Local Authority"
            rules={[
              { required: true, message: "Please enter your local authority" },
            ]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item
            name="organisation"
            label="Organisation"
            rules={[
              { required: true, message: "Please enter your organisation" },
            ]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item
            name="organisation_role"
            label="Organisation Role"
            rules={[
              {
                required: true,
                message: "Please enter your role in the organisation",
              },
            ]}
          >
            <Input placeholder="" size="large" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={updateUser.isPending}
              block
              className="submit-button"
            >
              Complete Profile
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}

export default UserProfile;
