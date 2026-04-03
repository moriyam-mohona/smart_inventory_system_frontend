"use client";

import { Button, Form, Input, InputNumber, Select, Space, message } from "antd";
import { useEffect } from "react";

import {
  createProductByManager,
  type ManagerCategory,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

type ProductFormValues = {
  name: string;
  categoryId: string;
  price: number;
  stockQuantity: number;
  minStockThreshold: number;
};

interface ProductSetupFormProps {
  categories: ManagerCategory[];
  loadingCategories: boolean;
  onCategoriesRefresh: () => Promise<void>;
}

export function ProductSetupForm({
  categories,
  loadingCategories,
  onCategoriesRefresh,
}: ProductSetupFormProps) {
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const [form] = Form.useForm<ProductFormValues>();
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    if (!form.getFieldValue("categoryId") && categories[0]?.id) {
      form.setFieldValue("categoryId", categories[0].id);
    }
  }, [categories, form]);

  const onFinish = async (values: ProductFormValues) => {
    if (!accessToken) {
      messageApi.error("Missing manager token. Please login again.");
      return;
    }

    try {
      await createProductByManager(accessToken, {
        name: values.name.trim(),
        categoryId: values.categoryId,
        price: Number(values.price),
        stockQuantity: Number(values.stockQuantity),
        minStockThreshold: Number(values.minStockThreshold),
      });
      messageApi.success("Product created.");
      form.resetFields();
      form.setFieldValue("categoryId", categories[0]?.id);
      form.setFieldValue("minStockThreshold", 5);
      await onCategoriesRefresh();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to create product.";
      messageApi.error(text);
    }
  };

  return (
    <div>
      {contextHolder}
      <p className="card-subtitle mb-5">
        Select a category and create product under that category.
      </p>

      <Form<ProductFormValues>
        form={form}
        layout="vertical"
        initialValues={{
          minStockThreshold: 5,
          stockQuantity: 0,
          categoryId: categories[0]?.id,
        }}
        onFinish={(values) => {
          void onFinish(values);
        }}
      >
        <div className="grid gap-4 md:grid-cols-2">
          <Form.Item
            name="name"
            label="Product Name"
            rules={[
              { required: true, message: "Enter product name" },
              { min: 2, message: "At least 2 characters" },
            ]}
          >
            <Input placeholder="Wireless Mouse" />
          </Form.Item>

          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: "Select category" }]}
          >
            <Select
              loading={loadingCategories}
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              placeholder="Select category"
              showSearch
              optionFilterProp="label"
              notFoundContent="No categories found. Create one in Manager Workspace."
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
            label="Stock Quantity"
            rules={[{ required: true, message: "Enter stock quantity" }]}
          >
            <InputNumber className="w-full" min={0} step={1} />
          </Form.Item>

          <Form.Item
            name="minStockThreshold"
            label="Minimum Stock Threshold"
            rules={[
              { required: true, message: "Enter minimum stock threshold" },
            ]}
          >
            <InputNumber className="w-full" min={0} step={1} />
          </Form.Item>
        </div>

        <Space>
          <Button type="primary" htmlType="submit" className="btn-primary">
            Add Product
          </Button>
          <Button
            onClick={() => {
              form.resetFields();
              form.setFieldValue("categoryId", categories[0]?.id);
              form.setFieldValue("minStockThreshold", 5);
            }}
          >
            Reset
          </Button>
        </Space>
      </Form>
    </div>
  );
}
