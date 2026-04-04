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
import { Modal, Form, Input, Button, message, Tag, Space, Descriptions } from "antd";

export default function CategoriesPage() {
  const userRole = useAppSelector((state) => state.auth.user?.role);
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCategoryId(null);
    form.resetFields();
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
                  onClick={() => handleOpenModal(cat.id)}
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
        width={560}
        title={
          <div className="flex items-center gap-4 py-2">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${editingCategoryId ? 'from-blue-600 to-blue-400' : 'from-primary-700 to-primary-500'} text-white shadow-lg shadow-primary-900/10`}>
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
               </svg>
            </div>
            <div>
              <div className="label-caps text-primary-700">{editingCategoryId ? 'Modify Index' : 'Definition'}</div>
              <h3 className="mb-0 leading-tight">
                {editingCategoryId ? 'Edit Category' : 'Create Category'}
              </h3>
            </div>
          </div>
        }
        className="inventory-ant-modal"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="mt-6"
        >
          {isFetchingDetails ? (
            <div className="py-12 text-center animate-pulse">
               <div className="h-4 bg-slate-100 rounded w-48 mx-auto" />
            </div>
          ) : (
            <>
              <Form.Item
                name="name"
                label="Category Name"
                rules={[{ required: true, message: "Required" }, { min: 2, message: "Too short" }]}
              >
                <Input placeholder="e.g. Health & Beauty" size="large" className="rounded-xl h-12" />
              </Form.Item>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 mb-6">
                 <h4 className="label-caps !text-slate-400 mb-3">System Insights</h4>
                 {editingCategoryId && detailsData?.data ? (
                    <div className="space-y-3">
                       <div className="flex justify-between items-center">
                          <span className="label-caps !text-slate-500 !tracking-wide">Associated Products</span>
                          <span className="font-black text-slate-800">{detailsData.data._count?.products || 0}</span>
                       </div>
                       <div className="flex justify-between items-center">
                          <span className="label-caps !text-slate-500 !tracking-wide">Visibility Status</span>
                          <Tag color={detailsData.data.isActive ? 'green' : 'red'} className="m-0 label-caps px-2 py-0.5 rounded-full">
                            {detailsData.data.isActive ? 'Active' : 'Banned'}
                          </Tag>
                       </div>
                    </div>
                 ) : (
                    <p className="text-xs font-medium text-slate-500 italic">
                      New categories are active by default. Use clear, unique names to avoid structural duplication.
                    </p>
                 )}
              </div>

              <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
                <Button 
                  onClick={handleCloseModal} 
                  className="h-11 px-6 font-bold text-slate-500 bg-slate-50 border-none hover:!text-slate-700"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={isCreating || isUpdating}
                  className="btn-primary h-11 px-8 font-bold"
                >
                  {editingCategoryId ? 'Save Changes' : 'Create Category'}
                </Button>
              </div>
            </>
          )}
        </Form>
      </Modal>
    </div>
  );
}
