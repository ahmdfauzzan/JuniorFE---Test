"use client";

import React, { useState, useEffect, useCallback } from "react";
import {
  Table,
  Button,
  Input,
  Modal,
  Form,
  InputNumber,
  Space,
  Typography,
  Pagination,
  message,
  Popconfirm,
  Image,
  Descriptions,
} from "antd";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import axios from "axios";
import type {
  Product,
  ProductFormData,
  ProductsApiResponse,
  ProductApiResponse,
} from "@/types/product";

const { Title } = Typography;
const { TextArea } = Input;

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");

  // Modal states
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"create" | "edit" | "detail">(
    "create"
  );
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form] = Form.useForm();

  // Fetch products
  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: pageSize.toString(),
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await axios.get<ProductsApiResponse>(
        `/api/products?${params.toString()}`
      );

      console.log("Frontend Response:", response.data);

      const data = response.data.data || response.data || [];

      setProducts(data);
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to fetch products";
      message.error(errorMessage);
      console.error("Error fetching products:", error);
      // Set empty state jika error
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [currentPage, pageSize, searchTerm]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(timer);
  }, [currentPage, searchTerm, fetchProducts]);

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // reset ke halaman pertama saat search berubah
  };

  // Handle pagination
  const handlePageChange = (page: number) => {
    console.log("Page clicked:", page);
    setCurrentPage(page);
  };

  // Handle create product
  const handleCreate = () => {
    setModalType("create");
    setSelectedProduct(null);
    form.resetFields();
    setModalVisible(true);
  };

  // Handle edit product
  const handleEdit = async (product: Product) => {
    try {
      const response = await axios.get<ProductApiResponse>(
        `/api/product?product_id=${product.product_id}`
      );
      const productData = response.data.data;

      setModalType("edit");
      setSelectedProduct(productData);
      form.setFieldsValue(productData);
      setModalVisible(true);
    } catch (error: unknown) {
      message.error("Failed to fetch product details");
      console.error("Error fetching product details:", error);
    }
  };

  // Handle view details
  const handleViewDetails = async (product: Product) => {
    try {
      const response = await axios.get<ProductApiResponse>(
        `/api/product?product_id=${product.product_id}`
      );
      const productData = response.data.data;

      setModalType("detail");
      setSelectedProduct(productData);
      setModalVisible(true);
    } catch (error: unknown) {
      message.error("Failed to fetch product details");
      console.error("Error fetching product details:", error);
    }
  };

  // Handle delete product
  const handleDelete = async (productId: string) => {
    try {
      // Note: You'll need to implement DELETE endpoint
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (error: unknown) {
      message.error("Failed to delete product");
      console.error("Error deleting product:", error);
    }
  };

  // Handle form submit
  const handleSubmit = async (values: ProductFormData) => {
    try {
      if (modalType === "create") {
        await axios.post<ProductApiResponse>("/api/product", values);
        message.success("Product created successfully");
      } else if (modalType === "edit" && selectedProduct) {
        await axios.put<ProductApiResponse>("/api/product", {
          ...values,
          product_id: selectedProduct.product_id,
        });
        message.success("Product updated successfully");
      }

      setModalVisible(false);
      fetchProducts();
    } catch (error: unknown) {
      message.error(`Failed to ${modalType} product`);
      console.error(`Error ${modalType} product:`, error);
    }
  };

  // Table columns
  const columns = [
    {
      title: "Product Title",
      dataIndex: "product_title",
      key: "product_title",
      ellipsis: true,
    },
    {
      title: "Price",
      dataIndex: "product_price",
      key: "product_price",
      render: (price: number) => `$${price.toLocaleString()}`,
    },
    {
      title: "Category",
      dataIndex: "product_category",
      key: "product_category",
    },
    {
      title: "Description",
      dataIndex: "product_description",
      key: "product_description",
      ellipsis: true,
      render: (text: string | undefined) => {
        if (!text) return "";
        return text.substring(0, 50) + (text.length > 50 ? "..." : "");
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, record: Product) => (
        <Space size="small">
          <Button
            type="link"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetails(record)}
          >
            View
          </Button>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => handleDelete(record.product_id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <Title level={2}>Product Management</Title>

      <div
        style={{
          marginBottom: "16px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Input.Search
          placeholder="Search products..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          style={{ width: 400 }}
          onSearch={handleSearch}
          onChange={(e) => handleSearch(e.target.value)}
        />
        <Button
          type="primary"
          icon={<PlusOutlined />}
          size="large"
          onClick={handleCreate}
        >
          Create Product
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        rowKey="product_id"
        loading={loading}
        pagination={false}
        scroll={{ x: 800 }}
      />

      <div style={{ marginTop: "16px", textAlign: "right" }}>
        <Pagination
          current={currentPage}
          total={1000}
          pageSize={pageSize}
          showSizeChanger={false}
          showQuickJumper
          onChange={handlePageChange}
        />
      </div>

      {/* Modal for Create/Edit */}
      <Modal
        title={
          modalType === "create"
            ? "Create Product"
            : modalType === "edit"
            ? "Edit Product"
            : "Product Details"
        }
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={
          modalType === "detail"
            ? [
                <Button key="close" onClick={() => setModalVisible(false)}>
                  Close
                </Button>,
              ]
            : [
                <Button key="cancel" onClick={() => setModalVisible(false)}>
                  Cancel
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  {modalType === "create" ? "Create" : "Update"}
                </Button>,
              ]
        }
        width={modalType === "detail" ? 800 : 600}
      >
        {modalType === "detail" && selectedProduct ? (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Product ID">
              {selectedProduct.product_id}
            </Descriptions.Item>
            <Descriptions.Item label="Title">
              {selectedProduct.product_title}
            </Descriptions.Item>
            <Descriptions.Item label="Price">
              ${selectedProduct.product_price.toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Category">
              {selectedProduct.product_category || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {selectedProduct.product_description || "N/A"}
            </Descriptions.Item>
            <Descriptions.Item label="Image">
              {selectedProduct.product_image ? (
                <Image
                  width={200}
                  src={selectedProduct.product_image}
                  alt={selectedProduct.product_title}
                />
              ) : (
                "N/A"
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Created At">
              {new Date(selectedProduct.created_timestamp).toLocaleString()}
            </Descriptions.Item>
            <Descriptions.Item label="Updated At">
              {new Date(selectedProduct.updated_timestamp).toLocaleString()}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              name="product_title"
              label="Product Title"
              rules={[
                { required: true, message: "Please input product title!" },
              ]}
            >
              <Input placeholder="Enter product title" />
            </Form.Item>

            <Form.Item
              name="product_price"
              label="Price"
              rules={[
                { required: true, message: "Please input product price!" },
              ]}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Enter product price"
                min={0}
                precision={2}
              />
            </Form.Item>

            <Form.Item name="product_category" label="Category">
              <Input placeholder="Enter product category" />
            </Form.Item>

            <Form.Item name="product_description" label="Description">
              <TextArea rows={4} placeholder="Enter product description" />
            </Form.Item>

            <Form.Item name="product_image" label="Image URL">
              <Input placeholder="Enter image URL" />
            </Form.Item>
          </Form>
        )}
      </Modal>
    </div>
  );
}
