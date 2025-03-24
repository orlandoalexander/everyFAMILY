import React from "react";
import { Button, Modal, Table } from "antd";
import useDeleteAccount from "../../hooks/useDeleteAccount.js";
import "./ManageUsersModal.css";

const { Column, ColumnGroup } = Table;

function ManageUsersModal({ open, onCancel, usersInfo, onRemoveUser }) {
  const { mutate: deleteUser, isLoading } = useDeleteAccount();

  const handleRemoveUser = (user_id) => {
    deleteUser(user_id, {
      onSuccess: () => {
        console.log(`User ${user_id} deleted successfully!`);
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
      },
    });
  };

  return (
    <Modal
      title="Manage users"
      width={700}
      open={open}
      onCancel={onCancel}
      footer={null}
    >
      <div>
        <Table
          dataSource={usersInfo}
          pagination={false}
          scroll={{ x: "max-content" }}
        >
          <Column title="Name" dataIndex="name" width={100} />
          <Column title="Email" dataIndex="email" width={200} />
          <Column title="Organisation role" dataIndex="organisationRole" />
          <Column title="Local authority" dataIndex="localAuthority" />
          <Column title="Last logged in time" dataIndex="lastLoggedInTime" />
          <Column
            title="Action"
            key="action"
            fixed="right"
            render={(text, record) => (
              <Button
                type="text"
                danger
                onClick={() => handleRemoveUser(record.user_id)}
              >
                Remove User
              </Button>
            )}
          />
        </Table>
      </div>
    </Modal>
  );
}

export default ManageUsersModal;
