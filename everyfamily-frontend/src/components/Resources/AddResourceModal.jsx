import { useState } from "react";
import {
  Modal,
  Input,
  Button,
  Select,
  Upload,
  Divider,
  Space,
  Form,
  message,
} from "antd";
import useGetCategories from "../../hooks/useGetCategories";
import useGetTypes from "../../hooks/useGetTypes";
import useAddType from "../../hooks/useAddType";
import useAddCategory from "../../hooks/useAddCategory";
import "./AddResourceModal.css";
import {
  Type,
  Link,
  Grid,
  Tag,
  Image,
  Plus,
  AlignJustify,
} from "react-feather";
import { getLinkPreview, getPreviewFromContent } from "link-preview-js";

function AddResourceModal({ open, onCancel, onSubmit, user, form }) {
  const [newType, setNewType] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [messageApi, contextHolder] = message.useMessage();

  const addType = useAddType();
  const addCategory = useAddCategory();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { link } = values;

        const urlPattern = /^(https?:\/\/[^\s$.?#].[^\s]*)$/i;
        if (!urlPattern.test(link)) {
          messageApi.error("Please enter a valid URL");
          return;
        }

        onSubmit({ ...values, upload_user_id: user.id });
      })
      .catch((error) => {
        messageApi.error("Please fill all the fields");
      });
  };

  const handleSetNewType = () => {
    if (!newType) {
      messageApi.warning("Please enter new resource type");
    } else if (
      typeData.some(
        (item) => item.title.toLowerCase() === newType.toLowerCase()
      )
    ) {
      messageApi.warning("Resource type already exists");
    }
    {
      addType.mutate({ title: newType });
      setNewType("");
    }
  };

  const handleSetNewCategory = () => {
    if (!newCategory) {
      messageApi.warning("Please enter new resource category");
    } else if (
      categoryData.some(
        (item) => item.title.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      messageApi.warning("Resource Category already exists");
    }
    {
      addCategory.mutate({ title: newCategory });
      setNewCategory("");
    }
  };

  const { data: categoryData } = useGetCategories();

  const { data: typeData } = useGetTypes();

  return (
    <Modal
      title="Add new resource"
      open={open}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText="Submit"
      cancelText="Cancel"
      maskClosable={false}
    >
      <Form className="form" form={form} layout="horizontal">
        {contextHolder}
        <Form.Item
          name="title"
          label={
            <div className="form-item-title">
              <Type size={15} color="gray" />
              <p>Name</p>
            </div>
          }
          rules={[{ required: true, message: "" }]}
          colon={false}
          required={false}
        >
          <Input placeholder="Enter resource name" />
        </Form.Item>
        <Form.Item
          name="description"
          label={
            <div className="form-item-title">
              <AlignJustify size={15} color="gray" />
              <p>Description</p>
            </div>
          }
          rules={[{ required: false }]}
          colon={false}
        >
          <Input placeholder="Enter resource description" />
        </Form.Item>

        <Form.Item
          name="type"
          label={
            <div className="form-item-title">
              <Grid size={15} color="gray" />
              <p>Type</p>
            </div>
          }
          rules={[{ required: true, message: "" }]}
          colon={false}
          required={false}
        >
          <Select
            placeholder="Select resource type"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                  }}
                >
                  <Input
                    placeholder="New resource type"
                    value={newType}
                    onChange={(e) => setNewType(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  {contextHolder}
                  <Button
                    type="text"
                    icon={<Plus />}
                    onClick={handleSetNewType}
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          >
            {typeData &&
              typeData.map((item, index) => (
                <Select.Option key={item.title} value={item.title}>
                  {item.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="category"
          label={
            <div className="form-item-title">
              <Tag size={15} color="gray" />
              <p>Category</p>
            </div>
          }
          rules={[{ required: true, message: "" }]}
          colon={false}
          required={false}
        >
          <Select
            placeholder="Select category"
            dropdownRender={(menu) => (
              <>
                {menu}
                <Divider
                  style={{
                    margin: "8px 0",
                  }}
                />
                <Space
                  style={{
                    padding: "0 8px 4px",
                  }}
                >
                  <Input
                    placeholder="New category"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    onKeyDown={(e) => e.stopPropagation()}
                  />
                  {contextHolder}
                  <Button
                    type="text"
                    icon={<Plus />}
                    onClick={handleSetNewCategory}
                  >
                    Add
                  </Button>
                </Space>
              </>
            )}
          >
            {categoryData &&
              categoryData.map((item, index) => (
                <Select.Option key={index} value={item.title}>
                  {item.title}
                </Select.Option>
              ))}
          </Select>
        </Form.Item>

        <Form.Item
          name="link"
          label={
            <div className="form-item-title">
              <Link size={15} color="gray" />
              <p>Link</p>
            </div>
          }
          rules={[{ required: true, message: "" }]}
          colon={false}
          required={false}
        >
          <Input placeholder="Enter resource link" />
        </Form.Item>

        <Form.Item
          name="thumbnail"
          label={
            <div className="form-item-title">
              <Image size={15} color="gray" />
              <p>Thumbnail</p>
            </div>
          }
          valuePropName="fileList"
          getValueFromEvent={(e) => e && e.fileList}
          rules={[
            {
              required: false,
            },
          ]}
          colon={false}
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
}

export default AddResourceModal;
