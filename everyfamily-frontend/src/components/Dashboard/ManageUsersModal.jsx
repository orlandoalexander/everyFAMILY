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
           <Table
               dataSource={usersInfo}
               pagination={false}
               scroll={{ x: "max-content" }}
           >
               <Column title="Name" dataIndex="name" width={100} />
               <Column title="Email" dataIndex="email" width={200}/>
               <Column title="Organisation role" dataIndex="organisationRole"/>
               <Column title="Local authority" dataIndex="localAuthority"/>
               <Column title="Last logged in time" dataIndex="lastLoggedInTime"/>
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