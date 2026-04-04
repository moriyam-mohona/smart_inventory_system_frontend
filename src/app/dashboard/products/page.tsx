"use client";

import { useAppSelector } from "@/redux/hooks";
import { 
  useGetAllProductsQuery, 
  useCreateProductMutation, 
  useUpdateProductMutation, 
  useDeactivateProductMutation, 
  useGetProductDetailsQuery 
} from "@/redux/features/product/productApi";
import { useGetAllCategoriesQuery } from "@/redux/features/category/categoryApi";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, InputNumber, Button, message, Tag, Space, Descriptions, Divider, Badge } from "antd";
import Link from "next/link";

export default function ProductsPage() {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data: response, isLoading: productsLoading, error: queryError } = useGetAllProductsQuery({});
  const products = response?.data || response?.items || response || [];

  const { data: productDetails, isFetching: detailsLoading } = useGetProductDetailsQuery(editingProductId ?? "", {
    skip: !editingProductId,
  });

  const { data: categoryRes } = useGetAllCategoriesQuery(
    userRole === "ADMIN" ? { includeBanned: true } : {}
  );
  const categories = Array.isArray(categoryRes?.data) ? categoryRes.data : [];

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const [deactivateProduct, { isLoading: isDeactivating }] = useDeactivateProductMutation();

  useEffect(() => {
    if (editingProductId && productDetails?.data) {
      const p = productDetails.data;
      form.setFieldsValue({
        name: p.name,
        categoryId: p.categoryId,
        price: p.price,
        stockQuantity: p.stockQuantity,
        minStockThreshold: p.minStockThreshold,
      });
    } else if (!editingProductId) {
      form.resetFields();
      form.setFieldsValue({ minStockThreshold: 5 });
    }
  }, [editingProductId, productDetails, form]);

  const handleOpenModal = (id: string | null = null) => {
    setEditingProductId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    form.resetFields();
  };

  const onFinish = async (values: any) => {
    try {
      if (editingProductId) {
        await updateProduct({
          productId: editingProductId,
          data: values,
        }).unwrap();
        messageApi.success("Product updated successfully.");
      } else {
        await createProduct(values).unwrap();
        messageApi.success("Product created successfully.");
      }
      handleCloseModal();
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Operation failed.");
    }
  };

  const handleDeactivate = async () => {
    if (!editingProductId) return;
    Modal.confirm({
      title: "Deactivate Product?",
      content: "This product will no longer be available for ordering. This action is irreversible for Managers.",
      okText: "Yes, Deactivate",
      okType: "danger",
      onOk: async () => {
        try {
          await deactivateProduct(editingProductId).unwrap();
          messageApi.success("Product deactivated.");
          handleCloseModal();
        } catch (err: any) {
          messageApi.error(err?.data?.message || "Deactivation failed.");
        }
      }
    });
  };

  return (
    <div className="space-y-8">
      {contextHolder}

      {/* Header Section */}
      <div className="card-glass p-8 sm:p-10 border border-white/40 shadow-2xl relative overflow-hidden group">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl group-hover:bg-purple-500/20 transition-all duration-700" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div className="space-y-2">
            <Tag color="purple" className="m-0 label-caps bg-purple-100 text-purple-700 px-3 py-0.5 rounded-full border-none">
              Inventory Assets
            </Tag>
            <h1 className="drop-shadow-sm">
              Product Catalog
            </h1>
            <p className="card-subtitle max-w-2xl">
              Monitor stock levels, adjust pricing, and manage your global product directory.
            </p>
          </div>
          <div className="flex gap-4 items-center">
             <Button 
               className="h-12 px-6 rounded-2xl font-bold border-slate-200 text-slate-600 hover:!border-primary-500 hover:!text-primary-600 bg-white shadow-sm transition-all"
               onClick={() => (window.location.href = '/dashboard/categories')}
             >
                Structure View
             </Button>
            {(userRole === "MANAGER" || userRole === "ADMIN") && (
              <Button
                type="primary"
                className="btn-primary h-12 px-8 font-bold text-[15px] shadow-xl shadow-primary-600/20 rounded-2xl"
                onClick={() => handleOpenModal()}
              >
                <Space size={8}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" /></svg>
                  New Product
                </Space>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-4">
        {productsLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/50 animate-pulse rounded-3xl border border-slate-100" />)}
          </div>
        ) : products.length > 0 ? (
          <div className="grid gap-4">
            {products.map((product: any) => (
              <div
                key={product.id || product._id}
                onClick={() => handleOpenModal(product.id || product._id)}
                className={`group relative flex items-center justify-between gap-6 p-6 border border-slate-100/80 rounded-[28px] bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-slate-200/60 hover:border-purple-200 cursor-pointer ${!product.isActive ? 'opacity-70 blur-[0.2px]' : ''}`}
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-16 h-16 rounded-[22px] bg-gradient-to-br from-slate-50 to-white flex items-center justify-center shadow-lg border border-slate-100 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                    <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="mb-0 group-hover:text-purple-700 transition-colors">
                        {product.name}
                      </h3>
                      {!product.isActive && <Tag color="red" className="rounded-full label-caps px-2 py-0 border-red-100">Deactivated</Tag>}
                      {product.stockQuantity <= product.minStockThreshold && product.stockQuantity > 0 && <Tag color="orange" className="rounded-full label-caps px-2 py-0 border-orange-100">Low Stock</Tag>}
                      {product.stockQuantity === 0 && <Tag color="volcano" className="rounded-full label-caps px-2 py-0 border-red-100">Out of Stock</Tag>}
                    </div>
                    <div className="flex items-center gap-4 label-caps">
                      <span className="flex items-center gap-1.5"><Badge status={product.isActive ? 'processing' : 'default'} color={product.isActive ? 'purple' : '#ccc'} />{product.category?.name || 'Uncategorized'}</span>
                      <span className="w-1 h-1 rounded-full bg-slate-200" />
                      <span className={product.stockQuantity <= product.minStockThreshold ? 'text-amber-600' : ''}>{product.stockQuantity} Units available</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <p className="label-caps mb-1">MSRP</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">${Number(product.price).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-purple-100 group-hover:text-purple-600 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-glass border-dashed border-2 border-slate-200 py-32 text-center rounded-[40px]">
             <div className="w-24 h-24 bg-white/60 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-white">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
             </div>
             <h3 className="font-black text-slate-800">Warehouse Empty</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Add your first set of products to start managing stock and processing customer orders.</p>
             <Button type="primary" size="large" className="btn-primary mt-10 rounded-2xl px-10 h-14 font-extrabold" onClick={() => handleOpenModal()}>
                Initialize Inventory
             </Button>
          </div>
        )}
      </div>

      {/* Integrated Product Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={720}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden rounded-[32px]"
        title={null}
      >
        <div className="bg-slate-50/50 p-8 sm:p-10 border-b border-slate-100">
          <div className="flex items-center gap-6">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center shadow-2xl transition-all duration-500 ${editingProductId ? 'bg-gradient-to-br from-indigo-600 to-indigo-400 rotate-6 shadow-indigo-200/50' : 'bg-gradient-to-br from-purple-600 to-purple-400 -rotate-6 shadow-purple-200/50'}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
            </div>
             <div>
              <p className="label-caps text-primary-700 mb-1">{editingProductId ? 'Global ID: ' + editingProductId : 'Asset Entry'}</p>
              <h2 className="mb-0">{editingProductId ? 'Edit Product' : 'Register New Product'}</h2>
            </div>
          </div>
        </div>

        <div className="p-8 sm:p-10">
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            requiredMark={false}
          >
            {detailsLoading ? (
              <div className="py-20 text-center animate-pulse space-y-4">
                <div className="h-4 bg-slate-100 rounded-full w-48 mx-auto" />
                <div className="h-4 bg-slate-50 rounded-full w-64 mx-auto" />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <Form.Item
                    name="name"
                    label="Product Designation"
                    rules={[{ required: true, message: "Required" }]}
                    className="sm:col-span-2"
                  >
                    <Input placeholder="e.g. Ergonomic Office Chair" size="large" />
                  </Form.Item>

                  <Form.Item
                    name="categoryId"
                    label="Classification Cluster"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <Select 
                      size="large" 
                      placeholder="Select category" 
                      className="inventory-select h-14"
                      options={categories.map((c: any) => ({ label: c.name + (c.isActive ? '' : ' (Banned)'), value: c.id, disabled: !c.isActive }))}
                    />
                  </Form.Item>

                  <Form.Item
                    name="price"
                    label="Unit Cost (USD)"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber prefix="$" min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100" placeholder="0.00" />
                  </Form.Item>

                  <Form.Item
                    name="stockQuantity"
                    label="Primary Inventory Load"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100" />
                  </Form.Item>

                  <Form.Item
                    name="minStockThreshold"
                    label="Restock Safety Buffer"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100" />
                  </Form.Item>
                </div>

                {editingProductId && productDetails?.data && (
                  <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100/60 shadow-inner">
                     <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                        Asset Identity & Log
                     </h4>
                     <Descriptions column={2} size="small" className="inventory-descriptions">
                       <Descriptions.Item label="Current Status">
                         <Tag color={productDetails.data.isActive ? 'green' : 'red'} className="m-0 label-caps px-2 py-0 rounded-full border-none shadow-sm">
                           {productDetails.data.status}
                         </Tag>
                       </Descriptions.Item>
                       <Descriptions.Item label="Last Update">{new Date(productDetails.data.updatedAt).toLocaleDateString()}</Descriptions.Item>
                       <Descriptions.Item label="Created On">{new Date(productDetails.data.createdAt).toLocaleDateString()}</Descriptions.Item>
                       <Descriptions.Item label="Internal ID"><span className="font-mono text-[10px] text-slate-400">{productDetails.data.id}</span></Descriptions.Item>
                     </Descriptions>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
                  <div className="flex gap-3 w-full sm:w-auto">
                    {editingProductId && userRole === "ADMIN" && productDetails?.data?.isActive && (
                      <Button 
                        danger 
                        className="h-12 px-6 rounded-2xl font-bold border-none bg-rose-50 text-rose-600 hover:!bg-rose-100 transition-all"
                        onClick={handleDeactivate}
                        loading={isDeactivating}
                      >
                        Deactivate
                      </Button>
                    )}
                    <Button 
                      onClick={handleCloseModal}
                      className="h-12 px-6 rounded-2xl font-bold border-none bg-slate-100 text-slate-500 hover:!bg-slate-200 transition-all w-full sm:w-auto"
                    >
                      Dismiss
                    </Button>
                  </div>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isCreating || isUpdating}
                    className="btn-primary h-14 px-12 rounded-2xl font-black text-lg shadow-xl shadow-primary-500/30 w-full sm:w-auto uppercase tracking-widest"
                  >
                    {editingProductId ? 'Update Entry' : 'Verify & Create'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </Modal>
    </div>
  );
}
