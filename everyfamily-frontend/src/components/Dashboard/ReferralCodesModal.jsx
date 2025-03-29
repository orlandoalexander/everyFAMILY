import React from "react";
import { Button, Modal, Table } from "antd";

const { Column, ColumnGroup } = Table;

function ReferralCodesModal({ open, onCancel, referralCodes }) {

    return (
        <Modal
            title="Referral codes"
            width={700}
            open={open}
            onCancel={onCancel}
            footer={null}
        >
            <div>
                <Table
                    dataSource={referralCodes}
                    pagination={false}
                    scroll={{ x: "max-content" }}
                    rowKey="id"
                >
                    <Column title="Title" dataIndex="title" width={100} />
                    <Column title="Status" dataIndex="status" width={200} />
                </Table>
            </div>
        </Modal>
    );
}

export default ReferralCodesModal;
