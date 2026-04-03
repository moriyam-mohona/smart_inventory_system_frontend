"use client";

import {
  Button,
  Card,
  Form,
  Input,
  InputNumber,
  Modal,
  Popconfirm,
  Select,
  Space,
  Table,
  Tabs,
  Tag,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  createCategoryByManager,
  createProductByManager,
  deleteCategoryByManager,
  getCategoriesByManager,
  updateCategoryByManager,
  type ManagerCategory,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

type CategoryRecord = {
  id: string;
  name: string;
  createdAt?: string;
};

type ProductFormValues = {
  name: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
};

export default function ManagerWorkspacePage() {
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [savingEdit, setSavingEdit] = useState(false);
  const [createName, setCreateName] = useState("");
  const [editingCategory, setEditingCategory] = useState<CategoryRecord | null>(
    null,
  );
  const [editName, setEditName] = useState("");
  const [productSubmitting, setProductSubmitting] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [productForm] = Form.useForm<ProductFormValues>();

  const categoryOptions = useMemo(
    () =>
      categories.map((category) => ({
        value: category.id,
        label: category.name,
      })),
    [categories],
  );

  const normalizeCategories = useCallback((rows: ManagerCategory[]) => {
    return rows
      .map((item) => ({
        id: item.id,
        name: item.name,
        createdAt: item.createdAt,
      }))
      .filter((item) => item.id);
  }, []);

  const loadCategories = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      const result = await getCategoriesByManager(accessToken);
      setCategories(normalizeCategories(result));
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to load categories.";
      messageApi.error(text);
    } finally {
      setLoading(false);
    }
  }, [accessToken, messageApi, normalizeCategories]);

  useEffect(() => {
    void loadCategories();
  }, [loadCategories]);

  const handleCreateCategory = async () => {
    if (!accessToken) {
      messageApi.error("Missing manager token. Please login again.");
      return;
    }

    const name = createName.trim();

    if (name.length < 2) {
      messageApi.error("Category name must be at least 2 characters.");
      return;
    }

    try {
      setCreateLoading(true);
      const created = await createCategoryByManager(accessToken, { name });
      setCategories((prev) => [
        { id: created.id, name: created.name, createdAt: created.createdAt },
        ...prev,
      ]);
      setCreateName("");
      messageApi.success("Category created.");
      await loadCategories();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to create category.";
      messageApi.error(text);
    } finally {
      setCreateLoading(false);
    }
  };

  const openEdit = (category: CategoryRecord) => {
    setEditingCategory(category);
    setEditName(category.name);
  };

  const handleUpdateCategory = async () => {
    if (!accessToken || !editingCategory) {
      messageApi.error("Missing manager token. Please login again.");
      return;
    }

    const name = editName.trim();

    if (name.length < 2) {
      messageApi.error("Category name must be at least 2 characters.");
      return;
    }

    try {
      setSavingEdit(true);
      const updated = await updateCategoryByManager(
        accessToken,
        editingCategory.id,
        {
          name,
        },
      );
      setCategories((prev) =>
        prev.map((row) =>
          row.id === editingCategory.id ? { ...row, name: updated.name } : row,
        ),
      );
      setEditingCategory(null);
      setEditName("");
      messageApi.success("Category updated.");
      await loadCategories();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to update category.";
      messageApi.error(text);
    } finally {
      setSavingEdit(false);
    }
  };

  const handleDeleteCategory = async (category: CategoryRecord) => {
    if (!accessToken) {
      messageApi.error("Missing manager token. Please login again.");
      return;
    }

    const previous = categories;
    setCategories((prev) => prev.filter((row) => row.id !== category.id));

    try {
      await deleteCategoryByManager(accessToken, category.id);
      messageApi.success("Category deleted.");
      await loadCategories();
    } catch (error) {
      setCategories(previous);
      const text =
        error instanceof Error ? error.message : "Failed to delete category.";
      messageApi.error(text);
    }
  };

  const handleCreateProduct = async (values: ProductFormValues) => {
    if (!accessToken) {
      messageApi.error("Missing manager token. Please login again.");
      return;
    }

    try {
      setProductSubmitting(true);
      await createProductByManager(accessToken, {
        name: values.name.trim(),
        categoryId: values.categoryId,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
        minStockThreshold: Number(values.minStockThreshold),
      });
      messageApi.success("Product created under selected category.");
      productForm.resetFields();
      productForm.setFieldValue("minStockThreshold", 5);
      if (categoryOptions[0]?.value) {
        productForm.setFieldValue("categoryId", categoryOptions[0].value);
      }
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to create product.";
      messageApi.error(text);
    } finally {
      setProductSubmitting(false);
    }
  };

  const categoryColumns: ColumnsType<CategoryRecord> = [
    {
      title: "Category Name",
      dataIndex: "name",
      key: "name",
      render: (value: string) => (
        <span className="font-semibold text-slate-900">{value}</span>
      ),
    },
    {
      title: "Created",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value?: string) =>
        value ? (
          new Date(value).toLocaleDateString()
        ) : (
          <span className="text-slate-400">-</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, category) => (
        <Space size={8}>
          <Button
            onClick={() => openEdit(category)}
            className="border border-primary-200 text-primary-700 hover:!border-primary-500 hover:!text-primary-700"
          >
            Update
          </Button>
          <Popconfirm
            title="Delete category?"
            description="This action cannot be undone."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              void handleDeleteCategory(category);
            }}
          >
            <Button
              danger
              className="border border-rose-200 text-rose-600 hover:!border-rose-400 hover:!text-rose-600"
            >
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-primary-700">
              Manager workspace
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">
              Categories and Products
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Create, update, and delete categories, then add products under any
              category.
            </p>
          </div>
          <Tag
            color="blue"
            className="w-fit rounded-full px-3 py-1 font-semibold uppercase"
          >
            Manager tools
          </Tag>
        </div>
      </Card>

      <Tabs
        defaultActiveKey="categories"
        items={[
          {
            key: "categories",
            label: "Categories",
            children: (
              <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row">
                  <Input
                    placeholder="New category name"
                    value={createName}
                    maxLength={100}
                    onChange={(event) => setCreateName(event.target.value)}
                    onPressEnter={() => {
                      void handleCreateCategory();
                    }}
                  />
                  <Button
                    type="primary"
                    className="btn-primary"
                    loading={createLoading}
                    onClick={() => {
                      void handleCreateCategory();
                    }}
                  >
                    Add Category
                  </Button>
                </div>

                <Table
                  loading={loading}
                  columns={categoryColumns}
                  dataSource={categories}
                  rowKey="id"
                  pagination={{ pageSize: 8 }}
                  locale={{ emptyText: "No categories found." }}
                />
              </Card>
            ),
          },
          {
            key: "products",
            label: "Add Product",
            children: (
              <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
                <Form<ProductFormValues>
                  form={productForm}
                  layout="vertical"
                  initialValues={{
                    categoryId: categoryOptions[0]?.value,
                    minStockThreshold: 5,
                    stockQuantity: 0,
                  }}
                  onFinish={(values) => {
                    void handleCreateProduct(values);
                  }}
                >
                  <div className="grid gap-4 md:grid-cols-2">
                    <Form.Item
                      name="name"
                      label="Product name"
                      rules={[
                        { required: true, message: "Enter a product name" },
                        { min: 2, message: "At least 2 characters" },
                      ]}
                    >
                      <Input placeholder="Bluetooth Speaker" />
                    </Form.Item>

                    <Form.Item
                      name="categoryId"
                      label="Category"
                      rules={[{ required: true, message: "Select a category" }]}
                    >
                      <Select
                        showSearch
                        placeholder="Select category"
                        options={categoryOptions}
                        optionFilterProp="label"
                        notFoundContent="No categories yet. Create one in Categories tab."
                      />
                    </Form.Item>

                    <Form.Item
                      name="price"
                      label="Price"
                      rules={[{ required: true, message: "Enter price" }]}
                    >
                      <InputNumber className="w-full" min={0.01} step={0.01} />
                    </Form.Item>

                    <Form.Item
                      name="stockQuantity"
                      label="Stock quantity"
                      rules={[
                        { required: true, message: "Enter stock quantity" },
                      ]}
                    >
                      <InputNumber className="w-full" min={0} step={1} />
                    </Form.Item>

                    <Form.Item
                      name="minStockThreshold"
                      label="Minimum stock threshold"
                      rules={[
                        {
                          required: true,
                          message: "Enter minimum stock threshold",
                        },
                      ]}
                    >
                      <InputNumber className="w-full" min={0} step={1} />
                    </Form.Item>
                  </div>

                  <div className="mt-2 flex justify-end">
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="btn-primary"
                      loading={productSubmitting}
                      disabled={categoryOptions.length === 0}
                    >
                      Create Product
                    </Button>
                  </div>
                </Form>
              </Card>
            ),
          },
        ]}
      />

      <Modal
        open={Boolean(editingCategory)}
        title="Update category"
        okText="Save"
        cancelText="Cancel"
        confirmLoading={savingEdit}
        onCancel={() => {
          setEditingCategory(null);
          setEditName("");
        }}
        onOk={() => {
          void handleUpdateCategory();
        }}
      >
        <Input
          value={editName}
          maxLength={100}
          placeholder="Category name"
          onChange={(event) => setEditName(event.target.value)}
        />
      </Modal>
    </div>
  );
}
