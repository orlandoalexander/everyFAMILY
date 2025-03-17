import React from "react";
import {Button, Modal, Table} from "antd";
import "./ManageUsersModal.css"

const { Column, ColumnGroup } = Table;

function ManageUsersModal({ open, onCancel, usersInfo, onRemoveUser }) {
    return (
        <Modal
            title="Manage users"
            open={open}
            onCancel={onCancel}
            footer={null}
        >
           <div>
           <Table dataSource={usersInfo} pagination={false}>
               <Column title="Name" dataIndex="name" />
               <Column title="Email" dataIndex="email"></Column>
               <Column
                   title="Action"
                   key="action"
                   render={(text, record) => (
                       <Button type="text" danger onClick={() => onRemoveUser(record.email)}>
                           Remove User
                       </Button>
                   )}
               />
           </Table>
           </div>
        </Modal>
    )
}

export default ManageUsersModal;