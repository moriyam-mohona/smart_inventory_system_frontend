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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
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

  const handleOpenDetails = (id: string) => {
    setEditingProductId(id);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProductId(null);
    form.resetFields();
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setEditingProductId(null);
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
                onClick={() => handleOpenDetails(product.id || product._id)}
                className={`group relative flex items-center justify-between gap-6 p-6 border border-slate-100/80 rounded-[28px] bg-white shadow-sm transition-all duration-300 hover:shadow-2xl hover:shadow-slate-200/60 hover:border-purple-200 cursor-pointer ${!product.isActive ? 'opacity-70 blur-[0.2px]' : ''}`}
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
        className="inventory-ant-modal overflow-hidden"
        title={null}
      >
        <div className="bg-slate-50/50 p-6 sm:p-10 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${editingProductId ? 'bg-gradient-to-br from-indigo-600 to-indigo-400 rotate-6 shadow-indigo-200/50' : 'bg-gradient-to-br from-purple-600 to-purple-400 -rotate-6 shadow-purple-200/50'}`}>
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <div>
              <p className="label-caps text-primary-700 mb-1">{editingProductId ? 'System Update' : 'Asset Registration'}</p>
              <h2 className="mb-0">{editingProductId ? 'Update Product' : 'Register New Asset'}</h2>
            </div>
          </div>
          {editingProductId && productDetails?.data && (
            <Tag color={productDetails.data.isActive ? 'green' : 'red'} className="m-0 rounded-full font-bold px-3 py-0.5 border-none shadow-sm">
              {productDetails.data.status}
            </Tag>
          )}
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2 pb-2">
                    <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                      Core Information
                    </h4>
                    <Form.Item
                      name="name"
                      label="Product Designation"
                      rules={[{ required: true, message: "Required" }]}
                      className="m-0"
                    >
                      <Input placeholder="e.g. Ergonomic Office Chair" size="large" className="rounded-2xl h-14 border-2 border-slate-100 font-semibold" />
                    </Form.Item>
                  </div>

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

                  <div className="sm:col-span-2 mt-4">
                    <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Financials & Stock Load
                    </h4>
                  </div>

                  <Form.Item
                    name="price"
                    label="Unit Cost (USD)"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber prefix="$" min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100 bg-slate-50/30" placeholder="0.00" />
                  </Form.Item>

                  <Form.Item
                    name="stockQuantity"
                    label="Primary Inventory Load"
                    rules={[{ required: true, message: "Required" }]}
                  >
                    <InputNumber min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100 bg-slate-50/30" />
                  </Form.Item>

                  <Form.Item
                    name="minStockThreshold"
                    label="Restock Safety Buffer"
                    rules={[{ required: true, message: "Required" }]}
                    className="sm:col-span-2"
                  >
                    <InputNumber min={0} className="w-full h-14 rounded-2xl flex items-center font-bold text-lg border-2 border-slate-100 bg-slate-50/30" />
                  </Form.Item>
                </div>

                {editingProductId && productDetails?.data && (
                  <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                      </div>
                      <div>
                        <p className="label-caps !text-slate-400 mb-0.5">Audit Trail</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <span>Created: {new Date(productDetails.data.createdAt).toLocaleDateString()}</span>
                          <span className="text-slate-200">|</span>
                          <span>Updated: {new Date(productDetails.data.updatedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="label-caps !text-slate-400 mb-0.5">Origin</p>
                      <p className="text-xs font-black text-primary-700 uppercase tracking-widest">{productDetails.data.createdBy?.name || 'System'}</p>
                    </div>
                  </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-8 border-t border-slate-100">
                  {editingProductId && userRole === "ADMIN" && productDetails?.data?.isActive && (
                    <Button 
                      danger 
                      className="h-14 px-8 rounded-2xl font-bold border-none bg-rose-50 text-rose-600 hover:!bg-rose-100 transition-all mr-auto w-full sm:w-auto"
                      onClick={handleDeactivate}
                      loading={isDeactivating}
                    >
                      Deactivate Asset
                    </Button>
                  )}
                  <Button 
                    onClick={handleCloseModal}
                    className="h-14 px-8 rounded-2xl font-bold border-none bg-slate-100 text-slate-500 hover:!bg-slate-200 transition-all w-full sm:w-auto uppercase tracking-widest text-xs"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isCreating || isUpdating}
                    className="btn-primary h-14 px-12 rounded-2xl font-black text-sm shadow-xl shadow-primary-500/30 w-full sm:w-auto uppercase tracking-widest"
                  >
                    {editingProductId ? 'Apply Changes' : 'Initialize Asset'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </Modal>
      {/* Product Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onCancel={handleCloseDetails}
        footer={null}
        centered
        width={780}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden"
        title={null}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-slate-50/50 p-6 sm:p-10 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-700 to-purple-400 flex items-center justify-center shadow-lg text-white">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <div>
                <p className="label-caps text-purple-700 mb-1">Asset Intelligence</p>
                <h2 className="mb-0 leading-tight">{productDetails?.data?.name || "Loading..."}</h2>
              </div>
            </div>
            {productDetails?.data && (
              <Tag color={productDetails.data.isActive ? "green" : "red"} className="m-0 rounded-full font-bold px-4 py-1 border-none shadow-sm">
                {productDetails.data.status}
              </Tag>
            )}
          </div>

          <div className="p-6 sm:p-10 overflow-y-auto custom-scrollbar space-y-10">
            {detailsLoading ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-32 bg-slate-100 rounded-[32px]" />
                <div className="h-64 bg-slate-50 rounded-[32px]" />
              </div>
            ) : productDetails?.data && (
              <>
                {/* Statistics Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-slate-400 mb-2">Market Price</p>
                    <p className="text-4xl font-black text-slate-900 leading-none">${productDetails.data.price?.toLocaleString()}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-purple-500 mb-2">Stock Level</p>
                    <p className="text-4xl font-black text-purple-700 leading-none">{productDetails.data.stockQuantity}</p>
                  </div>
                  <div className="bg-white p-6 rounded-[28px] border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-amber-500 mb-2">Min Threshold</p>
                    <p className="text-4xl font-black text-amber-600 leading-none">{productDetails.data.minStockThreshold}</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Category Card */}
                  <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100/80 flex flex-col items-center justify-center text-center">
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 mb-4 shadow-sm">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                    </div>
                    <p className="label-caps text-slate-400 mb-1">Catalog Classification</p>
                    <h3 className="mb-0">{productDetails.data.category?.name || "Uncategorized"}</h3>
                    <Tag className="mt-3 rounded-full font-bold border-none bg-white text-slate-500 px-3 py-0.5 shadow-sm">
                      {productDetails.data.category?.isActive ? 'Active Category' : 'Restricted Category'}
                    </Tag>
                  </div>

                  {/* Creator Card */}
                  <div className="bg-white rounded-[32px] p-8 border border-slate-200/60 shadow-sm">
                    <h4 className="label-caps !text-slate-400 mb-5 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-purple-400" />
                      Registry Entry
                    </h4>
                    {productDetails.data.createdBy ? (
                      <div className="space-y-4">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[18px] bg-purple-50 flex items-center justify-center font-black text-purple-700 border border-purple-100 text-lg">
                            {productDetails.data.createdBy.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-extrabold text-slate-800 text-sm mb-0">{productDetails.data.createdBy.name}</p>
                            <p className="text-xs font-semibold text-slate-400">{productDetails.data.createdBy.email}</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 pt-2">
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                             <p className="label-caps !text-[9px] mb-0.5">Author Role</p>
                             <p className="font-black text-purple-700 text-[10px] uppercase">{productDetails.data.createdBy.role}</p>
                          </div>
                          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center">
                             <p className="label-caps !text-[9px] mb-0.5">Registry On</p>
                             <p className="font-black text-slate-700 text-[10px]">{new Date(productDetails.data.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm font-medium text-slate-400 italic">No registry history available.</p>
                    )}
                  </div>
                </div>

                {/* Additional Info */}
                <div className="bg-slate-50/50 rounded-[32px] border border-slate-100 p-8 border-dashed">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                       <div>
                          <p className="label-caps !text-slate-400 mb-1">Last Inventory Reconciliation</p>
                          <p className="font-bold text-slate-700 leading-none">{new Date(productDetails.data.updatedAt).toLocaleString()}</p>
                       </div>
                       <div className="flex items-center gap-4">
                          <div className="text-right">
                             <p className="label-caps !text-slate-400 mb-1">Operational Status</p>
                             <p className="font-black text-emerald-600 uppercase tracking-wider">{productDetails.data.isActive ? 'Verified Active' : 'Deactivated Asset'}</p>
                          </div>
                          <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${productDetails.data.isActive ? 'bg-emerald-500 text-white' : 'bg-slate-300 text-white'}`}>
                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                          </div>
                       </div>
                    </div>
                </div>
              </>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-8 border-t border-slate-100 bg-white sticky bottom-0 z-10 flex justify-end gap-3">
             <Button 
               onClick={handleCloseDetails} 
               className="h-12 px-8 rounded-2xl font-bold text-slate-400 border-none bg-slate-50 uppercase tracking-widest text-xs"
             >
               Dismiss
             </Button>
             {(userRole === "MANAGER" || userRole === "ADMIN") && (
               <Button 
                 type="primary" 
                 onClick={() => {
                   handleCloseDetails();
                   handleOpenModal(editingProductId);
                 }}
                 className="h-12 px-8 rounded-2xl font-black bg-purple-600 hover:!bg-purple-700 border-none uppercase tracking-widest text-xs shadow-lg shadow-purple-500/20"
               >
                 Modify Asset
               </Button>
             )}
          </div>
        </div>
      </Modal>
    </div>
  );
}
