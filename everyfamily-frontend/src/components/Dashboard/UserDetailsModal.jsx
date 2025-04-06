import { Modal } from "antd";
import useGetUsers from "../../hooks/useGetUsers.js";

const UserDetailsModal = ({ open, onCancel, user }) => {
  const { data: users, isFetching, isLoading } = useGetUsers();

  const userDetails = users?.find((userData) => userData.id === user.id) || {};

  return (
    <Modal
      title="User Details"
      open={open}
      onCancel={onCancel}
      loading={isFetching || isLoading}
      footer={null}
    >
      <p>
        <strong>Name:</strong> {userDetails.first_name} {userDetails.last_name}
      </p>
      <p>
        <strong>Email:</strong> {userDetails.email}
      </p>
      <p>
        <strong>Local authority:</strong> {userDetails.local_authority}
      </p>
      <p>
        <strong>Organisation:</strong> {userDetails.organisation}
      </p>
      <p>
        <strong>Organisation role:</strong> {userDetails.organisation_role}
      </p>
    </Modal>
  );
};

export default UserDetailsModal;
