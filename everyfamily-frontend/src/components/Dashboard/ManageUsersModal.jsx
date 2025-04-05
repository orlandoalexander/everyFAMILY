import { Button, Modal, Table, message, Popconfirm, Select } from "antd";
import useDeleteUser from "../../hooks/useDeleteUser.js";
import useUpdateUser from "../../hooks/useUpdateUser.js";
import useGetUsers from "../../hooks/useGetUsers.js";

const { Column } = Table;

function ManageUsersModal({ open, onCancel, user }) {
  const [messageApi, contextHolder] = message.useMessage();

  const deleteUser = useDeleteUser();
  const updateUser = useUpdateUser();
  const { data: users, isFetching, isLoading } = useGetUsers();

  const filteredUsers =
    users?.filter((userData) => userData.id !== user.id) || [];

  const handleDelete = (id) => {
    deleteUser.mutate(id, {
      onSuccess: (success) => {
        messageApi.success(success.message);
      },
      onError: (error) => {
        messageApi.error(
          error?.response?.data?.message ||
            "Error deleting user. Please try again later."
        );
      },
    });
  };

  const handleUpdateRole = (id, role) => {
    updateUser.mutate({
      id: id,
      role: role,
    });
  };

  return (
    <Modal
      title="Manage Users"
      width={900}
      open={open}
      onCancel={onCancel}
      loading={isFetching || isLoading}
      footer={null}
    >
      {contextHolder}
      <div>
        <Table
          bordered
          dataSource={filteredUsers}
          pagination={true}
          scroll={{ x: "max-content" }}
          rowKey="id"
        >
          <Column title="Email" dataIndex="email" />
          <Column title="First name" dataIndex="first_name" />
          <Column title="Last name" dataIndex="last_name" />
          <Column title="Local authority" dataIndex="local_authority" />
          <Column title="Organisation" dataIndex="organisation" />
          <Column title="Organisation role" dataIndex="organisation_role" />
          <Column
            title="Logged in"
            dataIndex="logged_in"
            render={(text) => (text ? "Yes" : "No")}
          />
          <Column title="Last login" dataIndex="last_login" />
          <Column
            key="action"
            title=""
            fixed="right"
            width={250}
            render={(text, record) => (
              <div style={{ display: "flex", gap: "1rem" }}>
                <Select
                  defaultValue={record.role}
                  style={{ width: 120 }}
                  onChange={(newRole) => handleUpdateRole(record.id, newRole)}
                  options={[
                    { value: "admin", label: "Admin" },
                    { value: "champion", label: "Champion" },
                  ]}
                />
                <Popconfirm
                  title="Are you sure you want to delete this user?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger>Delete user</Button>
                </Popconfirm>
              </div>
            )}
          />
        </Table>
      </div>
    </Modal>
  );
}

export default ManageUsersModal;
