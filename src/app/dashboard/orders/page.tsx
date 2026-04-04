"use client";

import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, Button, Table, Tag, Badge, message, Space, Divider, Descriptions, InputNumber } from "antd";
import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllOrdersQuery,
  useGetOrderDetailsQuery,
  useCreateOrderMutation,
  useUpdateOrderStatusMutation,
  useCancelOrderMutation,
} from "@/redux/features/order/orderApi";
import { useGetAllProductsQuery } from "@/redux/features/product/productApi";
import { RoleVisibility } from "@/components/role-visibility";
import Swal from "sweetalert2";

export default function OrdersPage() {
  const user = useAppSelector((state) => state.auth.user);
  const userRole = user?.role;
  const [messageApi, contextHolder] = message.useMessage();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"CREATE" | "DETAILS">("CREATE");
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
  
  // Cart state for orders
  const [customerName, setCustomerName] = useState("");
  const [cart, setCart] = useState<any[]>([]);

  const { data: response, isLoading: ordersLoading } = useGetAllOrdersQuery({});
  const orders = response?.data || response?.items || response || [];

  const { data: detailsData, isFetching: detailsLoading } = useGetOrderDetailsQuery(selectedOrderId ?? "", {
    skip: !selectedOrderId || modalType !== "DETAILS",
  });

  const { data: productsRes, isLoading: productsLoading } = useGetAllProductsQuery({});
  const allProducts = Array.isArray(productsRes?.data) ? productsRes.data : [];
  const activeProducts = allProducts.filter((p: any) => p.isActive && p.stockQuantity > 0);

  const [createOrder, { isLoading: isCreating }] = useCreateOrderMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateOrderStatusMutation();
  const [cancelOrder, { isLoading: isCancelling }] = useCancelOrderMutation();

  const statusColors: any = {
    PENDING: "gold",
    CONFIRMED: "blue",
    SHIPPED: "purple",
    DELIVERED: "green",
    CANCELLED: "red",
  };

  const handleOpenCreateMode = () => {
    setModalType("CREATE");
    setSelectedOrderId(null);
    setCustomerName("");
    setCart([]);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (id: string) => {
    setModalType("DETAILS");
    setSelectedOrderId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOrderId(null);
    setCart([]);
  };

  const addToCart = (product: any) => {
    const existing = cart.find(item => item.productId === product.id);
    if (existing) {
      if (existing.quantity >= product.stockQuantity) {
        messageApi.warning("Exceeds availability");
        return;
      }
      setCart(cart.map(item => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item));
    } else {
      setCart([...cart, { productId: product.id, name: product.name, quantity: 1, unitPrice: product.price, maxStock: product.stockQuantity }]);
    }
    messageApi.success(`${product.name} added to load`);
  };

  const updateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      setCart(cart.filter(item => item.productId !== productId));
      return;
    }
    setCart(cart.map(item => item.productId === productId ? { ...item, quantity: qty } : item));
  };

  const handleCreateOrder = async () => {
    if (!customerName.trim() || cart.length === 0) {
      messageApi.error("Target Designation & Items required");
      return;
    }
    try {
      await createOrder({
        customerName: customerName.trim(),
        items: cart.map(i => ({ productId: i.productId, quantity: i.quantity }))
      }).unwrap();
      messageApi.success("Order dispatched successfully");
      handleCloseModal();
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Procurement failed");
    }
  };

  const handleStatusChange = async (status: string) => {
    if (!selectedOrderId) return;
    try {
      await updateStatus({ orderId: selectedOrderId, statusData: { status } }).unwrap();
      messageApi.success(`Status migrated to ${status}`);
    } catch (err: any) {
      messageApi.error(err?.data?.message || "Migration failed");
    }
  };

  const handleCancel = () => {
    if (!selectedOrderId) return;
    Modal.confirm({
      title: "Abort Order?",
      content: "This will terminate the transaction and return units to inventory.",
      okText: "Abort Transaction",
      okType: "danger",
      onOk: async () => {
        try {
          await cancelOrder(selectedOrderId).unwrap();
          messageApi.success("Transaction aborted");
          handleCloseModal();
        } catch (err: any) {
          messageApi.error(err?.data?.message || "Abort failed");
        }
      }
    });
  };

  const cartTotal = cart.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);

  return (
    <div className="space-y-8">
      {contextHolder}

      {/* Header */}
      <div className="card-glass p-8 sm:p-10 border border-amber-100 shadow-[0_32px_64px_-16px_rgba(245,158,11,0.15)] bg-gradient-to-br from-white/95 to-amber-50/30">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Tag color="orange" className="m-0 label-caps bg-amber-100 text-amber-700 px-3 py-0.5 rounded-full border-none">
              Procurement Control
            </Tag>
            <h1 className="mt-2 leading-tight">
              Order Logistics
            </h1>
            <p className="card-subtitle mt-2">
              Oversee fulfillment cycles, customer requisitions, and transaction status.
            </p>
          </div>
          {(userRole === "MANAGER" || userRole === "ADMIN") && (
            <Button
              type="primary"
              className="bg-amber-600 hover:!bg-amber-700 h-14 px-10 rounded-2xl font-black text-sm! shadow-xl shadow-amber-600/20 border-none uppercase tracking-widest"
              onClick={handleOpenCreateMode}
            >
              Dispatch Order
            </Button>
          )}
        </div>
      </div>

      {/* Order List */}
      <div className="space-y-4">
        {ordersLoading ? (
           <div className="grid gap-4">
             {[1, 2, 3].map(i => <div key={i} className="h-28 bg-white/50 animate-pulse rounded-[32px] border border-slate-100" />)}
           </div>
        ) : orders.length > 0 ? (
          <div className="grid gap-4">
            {orders.map((order: any) => (
              <div 
                key={order.id || order._id}
                onClick={() => handleOpenDetails(order.id || order._id)}
                className="group relative flex items-center justify-between gap-6 p-6 border border-slate-100/80 rounded-[32px] bg-white shadow-sm transition-all duration-500 hover:shadow-2xl hover:shadow-amber-200/40 hover:border-amber-200 cursor-pointer"
              >
                <div className="flex items-center gap-6 flex-1 min-w-0">
                  <div className={`flex-shrink-0 w-16 h-16 rounded-3xl flex items-center justify-center transition-all duration-500 shadow-lg border ${order.status === 'CANCELLED' ? 'bg-slate-50 text-slate-300 border-slate-100' : 'bg-gradient-to-br from-amber-50 to-white text-amber-600 border-amber-100 group-hover:scale-110 shadow-amber-900/5'}`}>
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-4 mb-2 flex-wrap">
                      <h3 className="mb-0 group-hover:text-amber-700 transition-colors">
                        ORD-{ (order.id || order._id).slice(-6).toUpperCase() }
                      </h3>
                      <Tag color={statusColors[order.status]} className="rounded-full label-caps px-3 border-none shadow-sm">
                        {order.status}
                      </Tag>
                    </div>
                    <div className="flex items-center gap-5 label-caps">
                      <span className="text-slate-900">{order.customerName}</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span>{order.items?.length || 0} Line Items</span>
                      <span className="hidden sm:inline w-1.5 h-1.5 rounded-full bg-slate-200" />
                      <span className="hidden sm:inline">{new Date(order.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-8 pr-2">
                  <div className="text-right">
                    <p className="label-caps mb-1">Total Value</p>
                    <p className="text-2xl font-black text-slate-900 leading-none">${Number(order.totalPrice).toLocaleString()}</p>
                  </div>
                  <div className="w-12 h-12 rounded-2xl bg-slate-50 text-slate-300 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-all duration-300">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-slate-200 p-24 text-center rounded-[48px]">
             <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner border border-slate-100">
                <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
             </div>
             <h3 className="font-black text-slate-800">No Orders in Queue</h3>
             <p className="text-slate-500 mt-2 max-w-sm mx-auto font-medium">Capture your first client requisition by initiating the dispatch protocol.</p>
             <Button type="primary" className="bg-amber-600 hover:!bg-amber-700 h-14 px-10 rounded-2xl font-black mt-10" onClick={handleOpenCreateMode}>
                Initialize Dispatch
             </Button>
          </div>
        )}
      </div>

      {/* Integrated Order Modal */}
      <Modal
        open={isModalOpen}
        onCancel={handleCloseModal}
        footer={null}
        centered
        width={modalType === 'CREATE' ? 1080 : 820}
        styles={{ body: { padding: 0 } }}
        className="inventory-ant-modal overflow-hidden rounded-[40px]"
        title={null}
      >
        {modalType === 'CREATE' ? (
          <div className="flex flex-col lg:flex-row h-[85vh] lg:h-[700px]">
             {/* Product Selection Side */}
             <div className="flex-1 p-8 lg:p-10 overflow-y-auto bg-slate-50/50 border-r border-slate-100">
                <div className="mb-8">
                   <h2 className="mb-0">Select Assets</h2>
                   <p className="label-caps mt-1">Available Inventory</p>
                </div>
                {productsLoading ? (
                   <div className="space-y-4 animate-pulse">
                      {[1, 2, 3, 4].map(i => <div key={i} className="h-20 bg-white rounded-2xl border border-slate-100" />)}
                   </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                     {activeProducts.map((p: any) => (
                       <div 
                         key={p.id}
                         onClick={() => addToCart(p)}
                         className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-amber-400 hover:shadow-lg hover:shadow-amber-100 transition-all cursor-pointer group"
                       >
                          <div className="min-w-0">
                             <p className="font-extrabold text-slate-800 group-hover:text-amber-700 truncate mb-0">{p.name}</p>
                             <p className="label-caps mt-1">${p.price} &middot; {p.stockQuantity} in stock</p>
                          </div>
                          <div className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 flex items-center justify-center group-hover:bg-amber-100 group-hover:text-amber-600 transition-all">
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v16m8-8H4" /></svg>
                          </div>
                       </div>
                     ))}
                  </div>
                )}
             </div>

             {/* Dispatch Summary Side */}
             <div className="flex-1 p-8 lg:p-10 flex flex-col bg-white">
                <div className="mb-8">
                   <h2 className="mb-0">Manifest</h2>
                   <p className="label-caps mt-1">Order Summary</p>
                </div>
                
                <div className="space-y-6 flex-1 flex flex-col min-h-0">
                   <div>
                      <label className="label-caps mb-2 block">Customer Designation</label>
                      <Input 
                        placeholder="e.g. Global Tech Solutions" 
                        size="large" 
                        className="rounded-2xl h-14 border-2 border-slate-100 font-bold" 
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                      />
                   </div>

                   <div className="flex-1 bg-slate-50/80 rounded-[32px] border border-slate-100 p-6 overflow-y-auto">
                      <div className="space-y-4">
                         {cart.length === 0 ? (
                            <div className="py-20 text-center opacity-30 select-none">
                               <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                               <p className="label-caps">No lines added to manifest</p>
                            </div>
                         ) : (
                           cart.map(item => (
                             <div key={item.productId} className="flex items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                                <div className="min-w-0 flex-1 mr-4">
                                   <p className="font-bold text-slate-800 truncate mb-0">{item.name}</p>
                                   <p className="label-caps mt-1">${item.unitPrice} per unit</p>
                                </div>
                                <div className="flex items-center gap-4">
                                   <InputNumber 
                                     min={0} 
                                     max={item.maxStock} 
                                     value={item.quantity} 
                                     onChange={val => updateQuantity(item.productId, Number(val))}
                                     className="w-20 rounded-lg h-9 flex items-center font-bold"
                                   />
                                   <p className="font-black text-slate-900 w-20 text-right">${(item.quantity * item.unitPrice).toFixed(2)}</p>
                                </div>
                             </div>
                           ))
                         )}
                      </div>
                   </div>

                   <div className="pt-6">
                      <div className="flex justify-between items-center mb-6 px-4">
                         <p className="label-caps">Total Dispatch Value</p>
                         <p className="text-3xl font-black text-slate-900 leading-none">${cartTotal.toFixed(2).toLocaleString()}</p>
                      </div>
                      <div className="flex gap-4">
                         <Button onClick={handleCloseModal} className="h-14 flex-1 rounded-2xl font-black text-slate-400 border-none bg-slate-50 uppercase tracking-widest">Discard</Button>
                         <Button 
                           type="primary" 
                           onClick={handleCreateOrder} 
                           loading={isCreating}
                           disabled={cart.length === 0 || !customerName.trim()}
                           className="h-14 flex-[2] rounded-2xl btn-primary font-black uppercase tracking-[0.2em] shadow-xl shadow-primary-600/20"
                         >
                           Initialize Dispatch
                         </Button>
                      </div>
                   </div>
                </div>
             </div>
          </div>
        ) : (
          <div className="flex flex-col max-h-[90vh]">
             {/* Details Header */}
             <div className="bg-slate-50/50 p-8 sm:p-10 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-6">
                   <div className="w-16 h-16 rounded-[24px] bg-gradient-to-br from-amber-600 to-amber-400 flex items-center justify-center shadow-xl rotate-3">
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                   </div>
                   <div>
                      <p className="label-caps text-primary-700 mb-1">Global Procurement Log</p>
                      <h2 className="mb-0">Order #{ selectedOrderId?.slice(-6).toUpperCase() }</h2>
                   </div>
                </div>
                {detailsData?.data?.order?.status === 'CANCELLED' && (
                  <Tag color="red" className="m-0 uppercase font-black px-4 py-1 rounded-full text-xs">Transaction Aborted</Tag>
                )}
             </div>

             <div className="p-10 overflow-y-auto space-y-10">
                {detailsLoading ? (
                   <div className="space-y-8 animate-pulse">
                      <div className="h-40 bg-slate-100 rounded-3xl" />
                      <div className="h-60 bg-slate-50 rounded-3xl" />
                   </div>
                ) : detailsData?.data && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="bg-slate-50 rounded-[32px] p-8 border border-slate-100">
                          <h4 className="label-caps !text-slate-400 mb-6 flex items-center gap-2">
                             <span className="w-2 h-2 rounded-full bg-amber-500" />
                             Contact & Identity
                          </h4>
                          <Descriptions column={1} size="small" className="inventory-descriptions">
                             <Descriptions.Item label="Target Recipient"><span className="font-extrabold text-slate-800 text-lg">{detailsData.data.order.customerName}</span></Descriptions.Item>
                             <Descriptions.Item label="System ID"><span className="font-mono text-[10px] text-slate-400 tracking-tighter">{detailsData.data.order.id}</span></Descriptions.Item>
                             <Descriptions.Item label="Timestamp">{new Date(detailsData.data.order.createdAt).toLocaleString()}</Descriptions.Item>
                             <Descriptions.Item label="Process Lead"><span className="font-bold text-slate-600">{detailsData.data.manager?.name || 'System Auto'}</span></Descriptions.Item>
                          </Descriptions>
                       </div>
                       <div className="bg-white rounded-[32px] p-8 border border-slate-200 shadow-sm flex flex-col justify-center text-center">
                          <p className="label-caps mb-2">Total Fiscal Valuation</p>
                          <p className="text-5xl font-black text-slate-900 leading-none">${detailsData.data.order.totalPrice.toLocaleString()}</p>
                          <Divider className="my-6" />
                          <div className="flex justify-center gap-6">
                             <div>
                                <p className="label-caps !text-[9px]">Line Count</p>
                                <p className="text-xl font-bold text-slate-800">{detailsData.data.items?.length || 0}</p>
                             </div>
                             <div className="w-px h-10 bg-slate-100" />
                             <div>
                                <p className="label-caps !text-[9px]">Unit Sum</p>
                                <p className="text-xl font-bold text-slate-800">{detailsData.data.items?.reduce((acc: number, cur: any) => acc + cur.quantity, 0) || 0}</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div>
                       <h4 className="label-caps !text-slate-400 mb-4 ml-2">Shipment Inventory</h4>
                       <div className="rounded-[32px] border border-slate-200 overflow-hidden shadow-sm bg-white">
                          <Table 
                            dataSource={detailsData.data.items} 
                            pagination={false} 
                            className="inventory-table"
                            rowKey="id"
                            columns={[
                              { title: 'ASSET DESIGNATION', dataIndex: ['product', 'name'], key: 'name', render: (t, r: any) => <span className="font-bold text-slate-800">{t || r.productId}</span> },
                              { title: 'UNIT VALUE', dataIndex: 'unitPrice', key: 'price', align: 'right', render: (v) => <span className="font-medium text-slate-500">${v}</span> },
                              { title: 'QUANTITY', dataIndex: 'quantity', key: 'qty', align: 'center', render: (v) => <Tag className="rounded-lg font-black bg-slate-100 border-none m-0 px-3">{v}</Tag> },
                              { title: 'LINE TOTAL', dataIndex: 'lineTotal', key: 'total', align: 'right', render: (v, r: any) => <span className="font-black text-slate-900">${v || (r.quantity * r.unitPrice)}</span> }
                            ]}
                          />
                       </div>
                    </div>

                    {(userRole === "MANAGER" || userRole === "ADMIN") && detailsData.data.order.status !== 'CANCELLED' && detailsData.data.order.status !== 'DELIVERED' && (
                      <div className="bg-amber-50 rounded-[40px] p-8 sm:p-10 border border-amber-100 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-amber-200/20 rounded-full blur-3xl -mt-10 -mr-10" />
                        <h4 className="label-caps !text-amber-800 mb-8 flex items-center gap-3">
                           <span className="w-2.5 h-2.5 rounded-full bg-amber-600 animate-pulse" />
                           Lifecycle Administration
                        </h4>
                        <div className="flex flex-col sm:flex-row gap-6 items-end">
                           <div className="flex-1 w-full">
                              <label className="label-caps text-amber-700 mb-2 block">Transition Protocol</label>
                              <Select 
                                className="w-full h-14 inventory-select" 
                                placeholder="Select protocol transition..."
                                defaultValue={detailsData.data.order.status}
                                onChange={handleStatusChange}
                                loading={isUpdatingStatus}
                                options={[
                                  { label: 'PENDING IDENTIFICATION', value: 'PENDING' },
                                  { label: 'CONFIRM DISPATCH', value: 'CONFIRMED' },
                                  { label: 'INITIATE SHIPMENT', value: 'SHIPPED' },
                                  { label: 'FINALIZE DELIVERY', value: 'DELIVERED' },
                                ]}
                              />
                           </div>
                           <Button 
                             danger 
                             onClick={handleCancel}
                             loading={isCancelling}
                             className="h-14 px-8 rounded-2xl font-black uppercase tracking-widest border-2 border-rose-200 bg-white text-rose-600 hover:!bg-rose-50 shadow-lg shadow-rose-900/5"
                           >
                              Abort Transaction
                           </Button>
                        </div>
                      </div>
                    )}
                    
                    {/* Admin History Timeline */}
                    <RoleVisibility roles={["ADMIN"]}>
                       {detailsData.data.timeHistory?.timeline?.length > 0 && (
                          <div className="mt-4 pt-10 border-t border-slate-100">
                             <h4 className="label-caps !text-slate-400 mb-8 ml-2">Verification Audit Trail</h4>
                             <div className="space-y-8 pl-4 border-l-2 border-slate-100 ml-4 relative">
                                {detailsData.data.timeHistory.timeline.map((event: any, idx: number) => (
                                   <div key={idx} className="relative pl-6">
                                      <div className="absolute -left-[33px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-slate-200" />
                                      <p className="font-extrabold text-slate-700 text-sm leading-tight">{event.message}</p>
                                      <p className="text-[10px] font-medium text-slate-400 mt-1 uppercase tracking-wider">
                                        {new Date(event.timestamp).toLocaleString()} &middot; Initiated By {event.actor?.name || 'System'}
                                      </p>
                                   </div>
                                ))}
                             </div>
                          </div>
                       )}
                    </RoleVisibility>
                  </>
                )}
             </div>

             {/* Footer Actions */}
             <div className="p-8 border-t border-slate-100 bg-white sticky bottom-0 z-10">
                <Button onClick={handleCloseModal} block className="h-12 rounded-2xl font-black text-slate-400 border-none bg-slate-50 uppercase tracking-widest">Dismiss Log</Button>
             </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
