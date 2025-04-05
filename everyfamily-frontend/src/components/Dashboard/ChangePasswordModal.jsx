import { useContext } from "react";
import { Modal, Input, Button, Form, message } from "antd";
import useUpdatePassword from "../../hooks/useUpdatePassword";
import AuthContext from "../../AuthContext";

const ChangePasswordModal = ({ open, onCancel }) => {
  const { user } = useContext(AuthContext);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { mutate: updatePassword, isPending: updatePasswordIsPending } =
    useUpdatePassword();

  const handleSubmit = ({ current_password, new_password }) => {
    updatePassword(
      { user_id: user.id, current_password, new_password },
      {
        onSuccess: (success) => {
          messageApi.success(success.message);
          onCancel();
          form.resetFields();
        },
        onError: (error) => {
          messageApi.error(
            error?.response?.data?.message ||
              "Error updating password. Please try again later."
          );
        },
      }
    );
  };

  const handleClose = () => {
    onCancel();
    //form.resetFields();
  };

  return (
    <Modal
      title="Change password"
      open={open}
      onCancel={handleClose}
      footer={null}
    >
      {contextHolder}
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item
          label="Current password"
          name="current_password"
          rules={[
            { required: true, message: "Please enter your current password" },
          ]}
        >
          <Input.Password placeholder="Enter current password" />
        </Form.Item>

        <Form.Item
          label="New Password"
          name="new_password"
          rules={[
            { required: true, message: "Please enter your new password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password placeholder="Enter new password" />
        </Form.Item>

        <Form.Item
          label="Confirm new password"
          name="confirm_password"
          dependencies={["new_password"]}
          rules={[
            { required: true, message: "Please confirm your new password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("new_password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm new password" />
        </Form.Item>
        <br />
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={updatePasswordIsPending}
            block
          >
            Change Password
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ChangePasswordModal;
