import { useState, useEffect } from "react";
import {
  Modal,
  Input,
  Button,
  Select,
  Image,
  Divider,
  Space,
  Form,
  Spin,
  message,
} from "antd";
import useGetCategories from "../../hooks/useGetCategories";
import useGetTypes from "../../hooks/useGetTypes";
import useAddType from "../../hooks/useAddType";
import useAddCategory from "../../hooks/useAddCategory";
import useAddResource from "../../hooks/useAddResource";
import useUpdateResource from "../../hooks/useUpdateResource";
import "./ResourceModal.css";
import {
  Type,
  Link,
  Grid,
  Tag,
  Plus,
  Image as ImageIcon,
  AlignJustify,
} from "react-feather";

const thumbnailURLAPIKey = import.meta.env.VITE_LINK_PREVIEW_API_KEY;

const isValidURL = (url) => {
  const regex = /^(https?:\/\/|www\.)[^\s/$.?#].[^\s]*$/i;
  return regex.test(url);
};

const fetchLinkThumbnail = async (url) => {
  const apiUrl = `https://api.linkpreview.net/?key=${thumbnailURLAPIKey}&q=${encodeURIComponent(
    url
  )}`;
  const response = await fetch(apiUrl);
  const data = await response.json();
  return data;
};

function ResourceModal({ open, onCancel, user, resourceData, id }) {
  const [newType, setNewType] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [linkURL, setLinkURL] = useState(null);
  const [thumbnailURL, setThumbnailURL] = useState(null);
  const [urlFetching, setURLFetching] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  const addType = useAddType();
  const addCategory = useAddCategory();
  const addResource = useAddResource();
  const updateResource = useUpdateResource();

  const { data: categoryData } = useGetCategories();
  const { data: typeData } = useGetTypes();

  const handleSubmit = () => {
    form
      .validateFields()
      .then((values) => {
        const { link } = values;

        if (!isValidURL(link)) {
          messageApi.error("Please enter a valid URL");
          return;
        }
        const data = {
          ...values,
          id,
          thumbnail_url: thumbnailURL,
          upload_user_id: user.id,
        };
        id
          ? updateResource.mutate(data, {
              onSuccess: (success) => {
                messageApi.success(success.message);
                handleClose();
                setThumbnailURL(null);
                setLinkURL(null);
              },
              onError: (error) => {
                messageApi.error(
                  error?.response?.data?.message ||
                    "Error adding resource. Please try again."
                );
              },
            })
          : addResource.mutate(data, {
              onSuccess: (success) => {
                messageApi.success(success.message);
                handleClose();
                setThumbnailURL(null);
                setLinkURL(null);
              },
              onError: (error) => {
                messageApi.error(
                  error?.response?.data?.message ||
                    "Error adding resource. Please try again."
                );
              },
            });
      })
      .catch((error) => {
        messageApi.error("Please complete all the fields");
      });
  };

  const handleClose = () => {
    onCancel();
    form.resetFields();
    setThumbnailURL(null);
    setLinkURL(null);
  };

  const handleSetNewType = () => {
    if (!newType) {
      messageApi.warning("Please enter new resource type");
    } else if (
      typeData?.some(
        (item) => item.title.toLowerCase() === newType.toLowerCase()
      )
    ) {
      messageApi.warning("Resource type already exists");
    }
    {
      addType.mutate(
        { title: newType },
        {
          onSuccess: () => {
            form.setFieldsValue({ type: newType });
            setNewType("");
            // Close the dropdown if the Select is focused
            const select = document.activeElement;
            if (select) select.blur();
          },
        }
      );
    }
  };

  const handleSetNewCategory = () => {
    if (!newCategory) {
      messageApi.warning("Please enter new resource category");
    } else if (
      categoryData &&
      categoryData.some(
        (item) => item.title.toLowerCase() === newCategory.toLowerCase()
      )
    ) {
      messageApi.warning("Resource category already exists");
    }
    {
      addType.mutate(
        { title: newCategory },
        {
          onSuccess: () => {
            form.setFieldsValue({ category: newCategory });
            setNewType("");
            // Close the dropdown if the Select is focused
            const select = document.activeElement;
            if (select) select.blur();
          },
        }
      );
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (linkURL) {
        const isValid = isValidURL(linkURL);
        if (isValid) {
          try {
            setURLFetching(true);
            const data = await fetchLinkThumbnail(linkURL);
            setThumbnailURL(data.image || null);
            setURLFetching(false);
          } catch (error) {
            setThumbnailURL(null);
            setURLFetching(false);
          }
        } else {
          setThumbnailURL(null);
          setURLFetching(false);
        }
      }
    };
    fetchData();
  }, [linkURL]);

  useEffect(() => {
    if (open && resourceData) {
      form.setFieldsValue({
        title: resourceData.title,
        description: resourceData.description,
        type: resourceData.type,
        category: resourceData.category,
        link: resourceData.link,
      });
      setLinkURL(resourceData.link);
      setThumbnailURL(resourceData.thumbnail_url || null);
    }
  }, [open, resourceData, form]);

  return (
    <Modal
      title={resourceData ? "Edit Resource" : "Add New Resource"}
      open={open}
      onCancel={handleClose}
      onOk={handleSubmit}
      okText={resourceData ? "Save changes" : "Add resource"}
      cancelText="Cancel"
      maskClosable={false}
      width={700}
      okButtonProps={{
        disabled: urlFetching,
      }}
      cancelButtonProps={{
        disabled: urlFetching,
      }}
    >
      <Spin
        spinning={
          updateResource.isPending === true || addResource.isPending === true
        }
        tip={resourceData ? "Saving changes" : "Adding resource..."}
        size="large"
      >
        <Form className="resource-form" form={form} layout="horizontal">
          {contextHolder}
          <Form.Item
            name="title"
            label={
              <div className="resource-form-item-title">
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
              <div className="resource-form-item-title">
                <AlignJustify size={15} color="gray" />
                <p>Description</p>
              </div>
            }
            rules={[{ required: false }]}
            colon={false}
          >
            <Input.TextArea
              placeholder="Enter resource description"
              rows={4}
              style={{ resize: "none" }}
            />
          </Form.Item>

          <Form.Item
            name="type"
            label={
              <div className="resource-form-item-title">
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
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                          handleSetNewType();
                        }
                      }}
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
              {typeData?.map((item, index) => (
                <Select.Option key={item.title} value={item.title}>
                  {item.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="category"
            label={
              <div className="resource-form-item-title">
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
                      onKeyDown={(e) => {
                        e.stopPropagation();
                        if (e.key === "Enter") {
                          handleSetNewCategory();
                        }
                      }}
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
              <div className="resource-form-item-title">
                <Link size={15} color="gray" />
                <p>Link</p>
              </div>
            }
            rules={[{ required: true, message: "" }]}
            colon={false}
            required={false}
          >
            <Input
              placeholder="Enter resource link"
              value={linkURL}
              onChange={(e) => setLinkURL(e.target.value)}
            />
          </Form.Item>

          {linkURL && (
            <Form.Item
              name="thumbnail"
              label={
                <div className="resource-form-item-title">
                  <ImageIcon size={15} color="gray" />
                  <p>Thumbnail</p>
                </div>
              }
              rules={[
                {
                  required: false,
                },
              ]}
              colon={false}
            >
              {urlFetching ? (
                <Spin />
              ) : (
                <Image
                  width={150}
                  src={thumbnailURL}
                  fallback="https://placehold.co/600x400/432666/FFF?text=Thumbnail+\n+Unavailable"
                  preview={false}
                />
              )}
            </Form.Item>
          )}
        </Form>
      </Spin>
    </Modal>
  );
}

export default ResourceModal;
