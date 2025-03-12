import { Modal, Input, Button, Select, Upload, Form, message } from "antd";
import "./AddResourceModal.css";
import { Edit } from "react-feather";

const AddResourceModal = ({ open, onCancel, onSubmit }) => {
  const [form] = Form.useForm();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        onSubmit(values);
        message.success("Resource added successfully");
        form.resetFields();
      })
      .catch((error) => {
        message.error("Please fill all the fields");
      });
  };

  return (
    <Modal
      title="Add new resource"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
    >
      <Form className="form" form={form} layout="horizontal">
        <section className="form-item">
          <div className="form-item-title">
            {/* <Edit size={15} color="gray" /> */}
            <p>Name</p>
          </div>
          <Form.Item
            name="name"
            rules={[
              { required: true, message: "Please input the resource name!" },
            ]}
          >
            <Input placeholder="Enter resource name" />
          </Form.Item>
        </section>

        <section className="form-item">
          <div className="form-item-title">
            <p>Link</p>
          </div>
          <Form.Item
            name="link"
            rules={[
              { required: true, message: "Please input the resource link!" },
            ]}
          >
            <Input placeholder="Enter resource link" />
          </Form.Item>
        </section>
        <section className="form-item">
          <div className="form-item-title">
            <p>Type</p>
          </div>
          <Form.Item
            name="type"
            rules={[
              { required: true, message: "Please select the resource type!" },
            ]}
          >
            <Select placeholder="Select resource type">
              <Select.Option value="article">Article</Select.Option>
              <Select.Option value="video">Video</Select.Option>
              <Select.Option value="book">Book</Select.Option>
              <Select.Option value="website">Website</Select.Option>
            </Select>
          </Form.Item>
        </section>

        <section className="form-item">
          <div className="form-item-title">
            <p>Category</p>
          </div>
          <Form.Item
            name="category"
            rules={[{ required: true, message: "Please select the category!" }]}
          >
            <Select placeholder="Select category">
              <Select.Option value="education">Education</Select.Option>
              <Select.Option value="technology">Technology</Select.Option>
              <Select.Option value="science">Science</Select.Option>
              <Select.Option value="art">Art</Select.Option>
            </Select>
          </Form.Item>
        </section>

        <Form.Item
          name="thumbnail"
          label="Thumbnail"
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[{ required: true, message: "Please upload a thumbnail!" }]}
        >
          <Upload
            name="thumbnail"
            listType="picture"
            maxCount={1}
            beforeUpload={() => false} // Prevent auto upload
          >
            <Button>Upload Thumbnail</Button>
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddResourceModal;
