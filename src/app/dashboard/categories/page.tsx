"use client";

import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useBanCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoryDetailsQuery,
} from "@/redux/features/category/categoryApi";
import Swal from "sweetalert2";
import { useState, useEffect } from "react";
import { Modal, Form, Input, Button, message, Tag, Space, Descriptions, Table } from "antd";

export default function CategoriesPage() {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const { data, isLoading, error } = useGetAllCategoriesQuery(
    userRole === "ADMIN" ? { includeBanned: true } : {}
  );

  const { data: detailsData, isFetching: isFetchingDetails } = useGetCategoryDetailsQuery(editingCategoryId ?? "", {
    skip: !editingCategoryId,
  });

  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdating }] = useUpdateCategoryMutation();
  const [banCategory] = useBanCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  const categories = Array.isArray(data?.data) ? data.data : [];

  useEffect(() => {
    if (editingCategoryId && detailsData?.data) {
      form.setFieldsValue({ name: detailsData.data.name });
    } else if (!editingCategoryId) {
      form.resetFields();
    }
  }, [editingCategoryId, detailsData, form]);

  const handleOpenModal = (id: string | null = null) => {
    setEditingCategoryId(id);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (id: string) => {
    setEditingCategoryId(id);
    setIsDetailsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    form.resetFields();
  };

  const handleCloseDetails = () => {
    setIsDetailsModalOpen(false);
    setEditingCategoryId(null);
  };

  const onFinish = async (values: { name: string }) => {
    try {
      if (editingCategoryId) {
        await updateCategory({
          categoryId: editingCategoryId,
          data: { name: values.name.trim() },
        }).unwrap();
        messageApi.success("Category updated successfully.");
      } else {
        await createCategory({ name: values.name.trim() }).unwrap();
        messageApi.success("Category created successfully.");
      }
      handleCloseModal();
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Operation failed.");
    }
  };

  const handleBan = async (categoryId: string, name: string) => {
    const result = await Swal.fire({
      title: `Ban category "${name}"?`,
      text: "This will mark the category and its products as inactive system-wide.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Ban",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await banCategory(categoryId).unwrap();
      messageApi.success(`"${name}" has been banned.`);
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Failed to ban category.");
    }
  };

  const handleDelete = async (categoryId: string, name: string) => {
    const result = await Swal.fire({
      title: `Delete category "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
    });
    if (!result.isConfirmed) return;
    try {
      await deleteCategory(categoryId).unwrap();
      messageApi.success(`"${name}" has been deleted.`);
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Failed to delete category.");
    }
  };

  return (
    <div className="space-y-8">
      {contextHolder}
      
      {/* Header Section */}
      <div className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur p-8 sm:p-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <p className="label-caps text-primary-700">
              Inventory Architecture
            </p>
            <h1 className="mt-2 leading-tight">
              Product Categories
            </h1>
            <p className="card-subtitle mt-2 max-w-2xl">
              Organize and classify your catalog for better discovery and reporting.
            </p>
          </div>
          {(userRole === "MANAGER" || userRole === "ADMIN") && (
            <Button
              type="primary"
              className="btn-primary h-12 px-8 font-bold text-[15px] shadow-lg shadow-primary-600/20"
              onClick={() => handleOpenModal()}
            >
              <Space size={8}>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                New Category
              </Space>
            </Button>
          )}
        </div>
      </div>

      {/* Content Section */}
      <div className="space-y-4">
        {error ? (
          <div className="p-12 text-center text-red-600 bg-red-50 rounded-3xl border border-red-200 font-bold">
            Failed to load categories. Please try again.
          </div>
        ) : isLoading ? (
          <div className="grid gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-white/50 animate-pulse rounded-2xl border border-slate-100" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid gap-4">
            {categories.map((cat: any) => (
              <div
                key={cat.id}
                className={`group relative flex items-center justify-between gap-5 p-5 border border-slate-100/80 rounded-[22px] bg-white shadow-sm transition-all duration-300 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary-100/50 ${!cat.isActive ? "opacity-75 blur-[0.4px]" : ""}`}
              >
                <div 
                  className="flex items-center gap-5 flex-1 min-w-0 cursor-pointer" 
                  onClick={() => handleOpenDetails(cat.id)}
                >
                  {/* Category Icon */}
                  <div
                    className={`flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-lg ${
                      cat.isActive
                        ? "bg-gradient-to-br from-primary-100 to-white text-primary-600 group-hover:scale-110 shadow-primary-900/5"
                        : "bg-slate-100 text-slate-400 group-hover:scale-110"
                    }`}
                  >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1.5 flex-wrap">
                      <h3 className="mb-0 group-hover:text-primary-700 transition-colors">
                        {cat.name}
                      </h3>
                      {!cat.isActive && (
                        <Tag color="red" className="rounded-full label-caps px-2 py-0 shadow-xs border-red-200">
                          Banned
                        </Tag>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-5 label-caps">
                      <span className="flex items-center gap-1.5 text-slate-400 bg-slate-50 px-3 py-1 rounded-full border border-slate-100/50">
                        <span className="text-primary-500">{cat._count?.products ?? 0}</span> Products
                      </span>
                      <span className="text-slate-300 hidden sm:inline">
                        {cat.createdAt ? new Date(cat.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex-shrink-0 flex items-center gap-3 pr-2">
                  <Button
                    icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>}
                    className="border-none bg-slate-50 text-slate-500 hover:!bg-primary-50 hover:!text-primary-600 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
                    onClick={() => handleOpenModal(cat.id)}
                  />
                  {(userRole === "MANAGER" || userRole === "ADMIN") && (
                    <Button
                      danger
                      icon={<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
                      className="border-none bg-rose-50 text-rose-500 hover:!bg-rose-100 rounded-xl w-10 h-10 flex items-center justify-center transition-all"
                      onClick={() => handleDelete(cat.id, cat.name)}
                    />
                  )}
                  {userRole === "ADMIN" && cat.isActive && (
                    <Button
                      className="border-none bg-amber-50 text-amber-600 hover:!bg-amber-100 rounded-xl h-10 font-bold px-4 transition-all"
                      onClick={() => handleBan(cat.id, cat.name)}
                    >
                      Ban
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50/50 p-20 text-center">
             <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
                <svg className="w-10 h-10 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
             </div>
             <h3 className="mb-0">No categories found</h3>
             <p className="card-subtitle mt-2 max-w-xs mx-auto">Start building your menu by adding your first product category.</p>
             {(userRole === "MANAGER" || userRole === "ADMIN") && (
                <Button type="primary" className="btn-primary mt-8 h-11 px-8 font-bold" onClick={() => handleOpenModal()}>
                  Create Category
                </Button>
             )}
          </div>
        )}
      </div>

      {/* Integrated Form Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={580}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden"
        title={null}
      >
        <div className="bg-slate-50/50 p-6 sm:p-10 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl transition-all duration-500 ${editingCategoryId ? 'bg-gradient-to-br from-indigo-600 to-indigo-400 rotate-6 shadow-indigo-200/50' : 'bg-gradient-to-br from-primary-700 to-primary-500 -rotate-6 shadow-primary-200/50'}`}>
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <div>
              <p className="label-caps text-primary-700 mb-1">{editingCategoryId ? 'Catalog Management' : 'Index Definition'}</p>
              <h2 className="mb-0 leading-tight">{editingCategoryId ? 'Update Category' : 'Create Category'}</h2>
            </div>
          </div>
          {editingCategoryId && detailsData?.data && (
            <Tag color={detailsData.data.isActive ? 'green' : 'red'} className="m-0 rounded-full font-bold px-3 py-0.5 border-none shadow-sm">
              {detailsData.data.isActive ? 'Active' : 'Banned'}
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
            {isFetchingDetails ? (
              <div className="py-20 text-center animate-pulse space-y-4">
                <div className="h-4 bg-slate-100 rounded-full w-48 mx-auto" />
                <div className="h-4 bg-slate-50 rounded-full w-64 mx-auto" />
              </div>
            ) : (
              <div className="space-y-8">
                <div className="bg-slate-50/50 p-6 rounded-[28px] border border-slate-100/60">
                   <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                     <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                     Category Identity
                   </h4>
                   <Form.Item
                    name="name"
                    label="Index Designation"
                    rules={[{ required: true, message: "Required" }]}
                    className="m-0"
                  >
                    <Input 
                      placeholder="e.g. Smart Electronics" 
                      size="large" 
                      className="h-14 rounded-2xl border-2 border-white shadow-sm font-bold text-lg"
                    />
                  </Form.Item>
                </div>

                {editingCategoryId && detailsData?.data && (
                    <div className="bg-white rounded-[32px] p-6 border border-slate-200/60 shadow-sm flex items-center justify-between">
                       <div className="flex items-center gap-4">
                          <div className="w-12 h-12 rounded-[18px] bg-slate-50 flex items-center justify-center text-slate-400 border border-slate-100">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          </div>
                          <div>
                            <p className="label-caps !text-slate-400 mb-0.5">Audit Trail</p>
                            <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                               <span>Created: {new Date(detailsData.data.createdAt || '').toLocaleDateString()}</span>
                               <span className="text-slate-200">|</span>
                               <span>Updated: {new Date(detailsData.data.updatedAt || '').toLocaleDateString()}</span>
                            </div>
                          </div>
                       </div>
                       <div className="text-right">
                          <p className="label-caps !text-slate-400 mb-0.5">Origin</p>
                          <p className="text-xs font-black text-primary-700 uppercase tracking-widest">{detailsData.data.createdBy?.name || 'System'}</p>
                       </div>
                    </div>
                )}

                {!editingCategoryId && (
                   <div className="p-6 bg-primary-50/30 rounded-[28px] border border-primary-100/50 border-dashed">
                      <p className="text-sm font-medium text-primary-700 line-clamp-3 mb-0 leading-relaxed italic">
                        "Newly registered categories are initialized with global visibility. Ensure category names are distinct and descriptive to maintain optimal catalog hierarchy."
                      </p>
                   </div>
                )}

                <div className="flex flex-col sm:flex-row justify-end items-center gap-3 pt-4 border-t border-slate-100">
                  <Button 
                    onClick={handleCloseModal}
                    className="h-14 px-8 rounded-2xl font-bold border-none bg-slate-100 text-slate-500 hover:!bg-slate-200 transition-all w-full sm:w-auto uppercase tracking-widest text-xs"
                  >
                    Dismiss
                  </Button>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={isCreating || isUpdating}
                    className="btn-primary h-14 px-12 rounded-2xl font-black text-sm shadow-xl shadow-primary-500/30 w-full sm:w-auto uppercase tracking-widest"
                  >
                    {editingCategoryId ? 'Apply Update' : 'Initialize Category'}
                  </Button>
                </div>
              </div>
            )}
          </Form>
        </div>
      </Modal>
      {/* Category Details Modal */}
      <Modal
        open={isDetailsModalOpen}
        onCancel={handleCloseDetails}
        footer={null}
        centered
        width={800}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden"
        title={null}
      >
        <div className="flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="bg-slate-50/50 p-6 sm:p-8 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-lg text-white">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <p className="label-caps text-primary-700 mb-0.5">Category Insights</p>
                <h2 className="mb-0">{detailsData?.data?.name || "Loading..."}</h2>
              </div>
            </div>
            {detailsData?.data && (
              <Tag color={detailsData.data.isActive ? "green" : "red"} className="m-0 rounded-full font-bold px-4 py-1">
                {detailsData.data.isActive ? "ACTIVE" : "BANNED"}
              </Tag>
            )}
          </div>

          <div className="p-6 sm:p-8 overflow-y-auto custom-scrollbar space-y-8">
            {isFetchingDetails ? (
              <div className="space-y-4 animate-pulse">
                <div className="h-24 bg-slate-100 rounded-2xl" />
                <div className="h-48 bg-slate-50 rounded-2xl" />
              </div>
            ) : detailsData?.data && (
              <>
                {/* Summary Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-slate-400 mb-2">Total Products</p>
                    <p className="text-3xl font-black text-slate-900 leading-none">{detailsData.data.summary?.totalProducts || 0}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-emerald-500 mb-2">Active</p>
                    <p className="text-3xl font-black text-emerald-600 leading-none">{detailsData.data.summary?.activeProducts || 0}</p>
                  </div>
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm text-center">
                    <p className="label-caps text-rose-500 mb-2">Out of Stock</p>
                    <p className="text-3xl font-black text-rose-600 leading-none">{detailsData.data.summary?.outOfStockProducts || 0}</p>
                  </div>
                </div>

                {/* Metadata Card */}
                <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-primary-400" />
                      Administrative Data
                    </h4>
                    <Descriptions column={1} size="small" className="inventory-descriptions">
                      <Descriptions.Item label="System ID"><span className="font-mono text-[10px] text-slate-400">{detailsData.data.id}</span></Descriptions.Item>
                      <Descriptions.Item label="Created At">{new Date(detailsData.data.createdAt).toLocaleString()}</Descriptions.Item>
                      <Descriptions.Item label="Last Updated">{new Date(detailsData.data.updatedAt).toLocaleString()}</Descriptions.Item>
                    </Descriptions>
                  </div>
                  <div>
                    <h4 className="label-caps !text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      Creator Identity
                    </h4>
                    {detailsData.data.createdBy ? (
                      <div className="space-y-1">
                        <p className="font-bold text-slate-800 text-sm mb-0">{detailsData.data.createdBy.name}</p>
                        <p className="text-xs text-slate-500 mb-1">{detailsData.data.createdBy.email}</p>
                        <Tag color="blue" className="rounded-full text-[9px] font-black border-none px-2 m-0 bg-blue-50 text-blue-600 uppercase tracking-widest">{detailsData.data.createdBy.role}</Tag>
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic">System Auto-generated</p>
                    )}
                  </div>
                </div>

                {/* Product List Table */}
                <div>
                  <h4 className="label-caps !text-slate-400 mb-4 ml-2">Associated Catalog</h4>
                  <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white">
                    <Table
                      dataSource={detailsData.data.products || []}
                      pagination={false}
                      size="small"
                      rowKey="id"
                      className="inventory-table"
                      columns={[
                        { title: 'PRODUCT NAME', dataIndex: 'name', key: 'name', render: (t: string) => <span className="font-bold text-slate-800">{t}</span> },
                        { title: 'PRICE', dataIndex: 'price', key: 'price', align: 'right', render: (v: number) => <span className="font-medium text-slate-500">${v}</span> },
                        { title: 'STOCK', dataIndex: 'stockQuantity', key: 'stock', align: 'center', render: (v: number, r: any) => <Tag color={v <= r.minStockThreshold ? 'red' : 'green'} className="m-0 font-bold border-none bg-slate-50 rounded-lg px-2">{v}</Tag> },
                        { title: 'STATUS', dataIndex: 'status', key: 'status', align: 'center', render: (s: string) => <Tag color={s === 'ACTIVE' ? 'blue' : 'default'} className="m-0 label-caps px-2 py-0 border-none rounded-full">{s}</Tag> }
                      ]}
                    />
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-slate-100 bg-white flex justify-end gap-3 sticky bottom-0">
            <Button onClick={handleCloseDetails} className="h-10 px-6 font-bold text-slate-500 border-slate-200 rounded-xl">Dismiss</Button>
            <Button 
              type="primary" 
              className="btn-primary h-10 px-6 font-bold rounded-xl"
              onClick={() => {
                handleCloseDetails();
                handleOpenModal(editingCategoryId);
              }}
            >
              Edit Category
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
