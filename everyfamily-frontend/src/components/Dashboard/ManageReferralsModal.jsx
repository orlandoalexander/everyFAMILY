import { useState, useEffect, useRef } from "react";
import { debounce } from "lodash";
import { Button, Modal, Table, Input, Select, Popconfirm } from "antd";
import useAddReferral from "../../hooks/useAddReferral";
import useUpdateReferral from "../../hooks/useUpdateReferral";
import useDeleteReferral from "../../hooks/useDeleteReferral";
import useGetReferrals from "../../hooks/useGetReferrals";

const { Column } = Table;
const { Option } = Select;

function ReferralsModal({ open, onCancel }) {
  const [updatedReferrals, setUpdatedReferrals] = useState([]);

  const addReferral = useAddReferral();
  const updateReferral = useUpdateReferral();
  const deleteReferral = useDeleteReferral();
  const { data: referrals, isFetching, isLoading } = useGetReferrals();

  const debouncedUpdateData = useRef(
    debounce((id, data) => {
      updateReferral.mutate({ id: id, ...data });
    }, 500)
  ).current;

  const handleEdit = (id, key, value) => {
    setUpdatedReferrals((prev) =>
      prev.map((referral) =>
        referral.id === id ? { ...referral, [key]: value } : referral
      )
    );
    debouncedUpdateData(id, { [key]: value });
  };

  const handleAdd = () => {
    addReferral.mutate();
  };

  const handleDelete = (id) => {
    deleteReferral.mutate(id);
  };

  useEffect(() => {
    if (referrals?.length !== updatedReferrals?.length)
      setUpdatedReferrals(referrals);
  }, [referrals, updatedReferrals]);

  return (
    <Modal
      title="Manage Referral Codes"
      width={700}
      open={open}
      onCancel={onCancel}
      pagination={{ pageSize: 5 }}
      footer={null}
      loading={isFetching || isLoading}
    >
      <Table
        bordered
        dataSource={updatedReferrals?.map((referral) => ({
          ...referral,
          key: referral.id,
        }))}
        scroll={{ x: "max-content" }}
        pagination={true}
        rowKey="id"
      >
        <Column
          key="title"
          title="Title"
          dataIndex="title"
          width={200}
          render={(text, record) => (
            <Input
              key={record.id}
              value={text}
              onChange={(e) => handleEdit(record.id, "title", e.target.value)}
            />
          )}
        />
        <Column
          key="status"
          title="Status"
          dataIndex="status"
          width={150}
          render={(text, record) => (
            <Select
              key={record.id}
              value={text}
              onChange={(value) => handleEdit(record.id, "status", value)}
              style={{ width: "100%" }}
            >
              <Option value="Active">Active</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          )}
        />
        <Column
          key="action"
          width={50}
          title=""
          render={(text, record) => (
            <Popconfirm
              title="Are you sure you want to delete this referral code?"
              onConfirm={() => handleDelete(record.id)}
              okText="Yes"
              cancelText="No"
            >
              <Button danger>Delete referral code</Button>
            </Popconfirm>
          )}
        />
      </Table>
      <Button
        type="primary"
        onClick={handleAdd}
        style={{
          float: "left",
          marginLeft: "1rem",
          marginTop: "-50px",
        }}
      >
        Add New Code
      </Button>
    </Modal>
  );
}

export default ReferralsModal;
