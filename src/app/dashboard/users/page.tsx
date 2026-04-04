'use client'

import {
  Avatar,
  Badge,
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Modal,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tabs,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useMemo, useState } from "react";
import {
  useGetAllUsersQuery,
  useRestrictUserMutation,
  useDeleteUserMutation,
  useCreateManagerMutation,
  useGetManagerDetailsQuery,
  useApproveUserMutation,
} from "@/redux/features/auth/authApi";

// Helper for Activity Icons similar to Activity Log page
function getActivityMeta(action: string) {
  const a = (action || "").toUpperCase();
  if (a.startsWith("USER_")) {
    return {
      color: "bg-blue-500 shadow-blue-500/20",
      icon: "👤",
      label: "User Access",
    };
  }
  if (a.startsWith("PRODUCT_")) {
    return {
      color: "bg-emerald-500 shadow-emerald-500/20",
      icon: "📦",
      label: "Product",
    };
  }
  if (a.startsWith("CATEGORY_")) {
    return {
      color: "bg-purple-500 shadow-purple-500/20",
      icon: "📂",
      label: "Category",
    };
  }
  if (a.startsWith("ORDER_")) {
    return {
      color: "bg-amber-500 shadow-amber-500/20",
      icon: "📋",
      label: "Order",
    };
  }
  return {
    color: "bg-slate-500 shadow-slate-500/20",
    icon: "⚙️",
    label: "System",
  };
}

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isApproved: boolean;
  isActive: boolean;
  status: "ACTIVE" | "PENDING" | "RESTRICTED";
};

type CreateManagerForm = {
  name: string;
  email: string;
  password: string;
};

function statusColor(status: UserRecord["status"]) {
  if (status === "ACTIVE") return "success";
  if (status === "PENDING") return "warning";
  return "error";
}

function normalizeUser(user: any): UserRecord {
  const id = user.id || user._id || "";

  const isActive = user.isActive !== false;
  const isRestricted = !isActive || user.status === "RESTRICTED";
  const isPending = user.isApproved === false || user.status === "PENDING";

  return {
    id,
    name: user.name || "Unknown User",
    email: user.email || "-",
    role: user.role || "USER",
    createdAt: user.createdAt || new Date().toISOString(),
    isApproved: user.isApproved !== false,
    isActive,
    status: isRestricted ? "RESTRICTED" : isPending ? "PENDING" : "ACTIVE",
  };
}

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm<CreateManagerForm>();
  const [messageApi, contextHolder] = message.useMessage();

  // Queries & Mutations
  const { data: usersData, isLoading: loading } = useGetAllUsersQuery({});
  const { data: managerDetailsRes, isFetching: detailsLoading } = useGetManagerDetailsQuery(selectedUserId || "", {
    skip: !selectedUserId || !detailsOpen,
  });
  
  const [restrictUser] = useRestrictUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [approveUser] = useApproveUserMutation();
  const [createManager, { isLoading: creating }] = useCreateManagerMutation();

  const usersRaw = Array.isArray(usersData?.data) ? usersData.data : [];
  const users = useMemo(() => usersRaw.map(normalizeUser).filter((u: UserRecord) => u.id), [usersRaw]);
  const managerDetails = managerDetailsRes?.data;
  const currentUser = users.find((u: UserRecord) => u.id === selectedUserId);

  const managers = useMemo(
    () => users.filter((user: UserRecord) => user.role.toUpperCase() === "MANAGER"),
    [users],
  );

  const stats = useMemo(() => {
    const active = managers.filter((user: UserRecord) => user.status === "ACTIVE").length;
    const restricted = managers.filter(
      (user: UserRecord) => user.status === "RESTRICTED",
    ).length;
    return { managers: managers.length, active, restricted };
  }, [managers]);

  const openDetails = (user: UserRecord) => {
    setSelectedUserId(user.id);
    setDetailsOpen(true);
  };

  const handleRestrict = async (user: UserRecord) => {
    try {
      await restrictUser(user.id).unwrap();
      messageApi.success("Manager access updated.");
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to update manager access.");
    }
  };

  const handleApprove = async (user: UserRecord) => {
    try {
      await approveUser(user.id).unwrap();
      messageApi.success("Manager account approved.");
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to approve manager.");
    }
  };

  const handleDelete = async (user: UserRecord) => {
    try {
      await deleteUser(user.id).unwrap();
      messageApi.success("Manager removed.");
      if (selectedUserId === user.id) {
        setDetailsOpen(false);
      }
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to delete manager.");
    }
  };

  const handleCreateManager = async (values: CreateManagerForm) => {
    try {
      await createManager({
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      }).unwrap();

      messageApi.success("Manager account created.");
      setCreateModalOpen(false);
      form.resetFields();
    } catch (error: any) {
      messageApi.error(error?.data?.message || "Failed to create manager.");
    }
  };

  const columns: ColumnsType<UserRecord> = [
    {
      title: "Manager",
      dataIndex: "name",
      key: "name",
      render: (_, user) => (
        <Space size={12}>
          <Avatar
            className="bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] font-semibold"
            size={42}
          >
            {user.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </Avatar>
          <div>
            <div className="font-semibold text-slate-900">{user.name}</div>
            <div className="text-xs text-slate-500">{user.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: () => <Tag color="blue">MANAGER</Tag>,
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (value: UserRecord["status"]) => (
        <Badge status={statusColor(value)} text={value.toLowerCase()} />
      ),
    },
    {
      title: "Joined",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, user) => (
        <Space size={8} wrap>
          <Button
            className="border border-primary-200 text-primary-700 hover:!border-primary-500 hover:!text-primary-700"
            onClick={() => {
              void openDetails(user);
            }}
          >
            Details
          </Button>
          {(user.isApproved === false || user.status === "PENDING") && (
            <Popconfirm
              title="Approve this manager?"
              description="This will allow the manager to log in and use the system."
              okText="Approve"
              cancelText="Cancel"
              onConfirm={() => {
                void handleApprove(user);
              }}
            >
              <Button className="border border-emerald-200 text-emerald-600 hover:!border-emerald-500 hover:!text-emerald-600">
                Approve
              </Button>
            </Popconfirm>
          )}
          <Popconfirm
            title={user.status === "RESTRICTED" ? "Activate manager access?" : "Restrict manager access?"}
            description={user.status === "RESTRICTED" 
              ? "This will restore access for this manager." 
              : "This will restrict access for this manager."
            }
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => {
              void handleRestrict(user);
            }}
          >
            <Button className={user.status === "RESTRICTED"
              ? "border border-emerald-200 text-emerald-600 hover:!border-emerald-500 hover:!text-emerald-600"
              : "border border-amber-200 text-amber-700 hover:!border-amber-400 hover:!text-amber-700"
            }>
              {user.status === "RESTRICTED" ? "Activate" : "Restrict"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Delete manager?"
            description="This performs a soft delete and revokes active tokens."
            okText="Delete"
            cancelText="Cancel"
            onConfirm={() => {
              void handleDelete(user);
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

  const summary = managerDetails?.summary || {};
  const activities = Array.isArray(managerDetails?.activityLogs) ? managerDetails.activityLogs : [];

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="label-caps text-primary-700">
              User management
            </p>
            <h2 className="mt-2">
              Manager directory
            </h2>
            <p className="card-subtitle mt-2 max-w-2xl">
              Oversee account status, approval workflows, and operational performance of your management team.
            </p>
          </div>

          <Button
            type="primary"
            className="btn-primary h-11 px-5 font-semibold"
            onClick={() => setCreateModalOpen(true)}
          >
            Add Manager
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: "Total Managers",
              value: stats.managers,
              tone: "from-primary-600 to-primary-500",
            },
            {
              label: "Active Accounts",
              value: stats.active,
              tone: "from-emerald-500 to-emerald-400",
            },
            {
              label: "Restricted",
              value: stats.restricted,
              tone: "from-amber-500 to-amber-400",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="group rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50/50 p-5 transition-all hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="label-caps">
                  {item.label}
                </span>
                <span
                  className={`h-2 w-2 rounded-full bg-linear-to-r ${item.tone} shadow-sm group-hover:scale-125 transition-transform`}
                />
              </div>
              <div className="mt-3 text-3xl font-black tracking-tight text-slate-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="border-b border-slate-100 px-8 py-5 flex justify-between items-center">
            <h3>Management Team</h3>
            <Tag color="blue" className="rounded-full px-3 py-0.5 label-caps">
              Admin Access Enabled
            </Tag>
        </div>

        <div className="px-4 py-4 sm:px-6 sm:py-6">
          <Table
            loading={loading}
            columns={columns}
            dataSource={managers}
            rowKey="id"
            pagination={false}
            size="middle"
            className="users-modern-table"
            locale={{ emptyText: "No manager accounts found." }}
          />
        </div>
      </Card>

      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        centered
        title={
           <div className="pb-2">
             <div className="label-caps text-primary-600 mb-1">Onboarding</div>
             <h3 className="text-slate-900">Add New Manager</h3>
           </div>
        }
        className="inventory-ant-modal"
      >
        <Form<CreateManagerForm>
          form={form}
          layout="vertical"
          onFinish={(values) => void handleCreateManager(values)}
          className="mt-4"
        >
          <Form.Item
            name="name"
            label="Manager Name"
            rules={[{ required: true, message: "Enter manager name" }]}
          >
            <Input placeholder="John Doe" size="large" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Work Email"
            rules={[
              { required: true, message: "Enter manager email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="manager@company.com" size="large" />
          </Form.Item>
          <Form.Item
            name="password"
            label={<span className="font-bold text-slate-700 text-xs uppercase tracking-wide">Initial Password</span>}
            rules={[
              { required: true, message: "Enter password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="SecurePassword789" size="large" />
          </Form.Item>
          
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-slate-100">
            <Button onClick={() => setCreateModalOpen(false)} className="h-11 px-6 font-bold text-slate-500 hover:!text-slate-700 border-none bg-slate-50">Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating}
              className="btn-primary h-11 px-8 font-bold"
            >
              Create Account
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={detailsOpen}
        onCancel={() => setDetailsOpen(false)}
        footer={null}
        centered
        width={840}
        title={
          <div className="flex items-center gap-4 py-2">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-900 to-primary-700 text-white shadow-lg shadow-primary-900/20">
               <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.333 0 4 1 4 3" />
               </svg>
            </div>
            <div>
              <div className="label-caps text-primary-700">Manager Profile</div>
              <h3 className="text-slate-900 leading-tight">
                {currentUser?.name || "Member Details"}
              </h3>
            </div>
          </div>
        }
        className="inventory-ant-modal"
      >
        {detailsLoading ? (
           <div className="p-20 text-center animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-full mx-auto mb-4" />
              <div className="h-4 bg-slate-100 rounded w-48 mx-auto" />
           </div>
        ) : currentUser ? (
          <div className="space-y-6 mt-4">
            {/* Profile Brief */}
            <div className="p-6 rounded-3xl border border-slate-200 bg-linear-to-br from-slate-50/50 to-white flex flex-col sm:flex-row items-start sm:items-center gap-6 shadow-sm">
                <Avatar
                  className="bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] font-black text-lg border-4 border-white shadow-xl"
                  size={80}
                >
                  {currentUser.name.split(" ").map((n: string) => n[0]).join("")}
                </Avatar>
                <div className="flex-1">
                   <h2 className="mb-0">{currentUser.name}</h2>
                   <p className="card-subtitle mb-0">{currentUser.email}</p>
                   <div className="mt-4 flex flex-wrap gap-2">
                       <Tag color="blue" className="rounded-full label-caps border-blue-200 px-3 py-0.5">MANAGER</Tag>
                      <Tag color={statusColor(currentUser.status)} className="rounded-full label-caps px-3 py-0.5">
                        {currentUser.status}
                      </Tag>
                       {currentUser.isApproved && (
                         <Badge status="success" text={<span className="label-caps !text-emerald-600 ml-2">Verified Account</span>} />
                      )}
                   </div>
                </div>
            </div>

            <Tabs
              defaultActiveKey="1"
              className="custom-tabs"
              items={[
                {
                  key: "1",
                  label: <span className="px-2 label-caps">Overview</span>,
                  children: (
                    <div className="py-2 space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                          { label: "Products", value: summary.totalProducts ?? 0, icon: "📦", color: "text-blue-600" },
                          { label: "Categories", value: summary.totalCategories ?? 0, icon: "📂", color: "text-purple-600" },
                          { label: "Orders", value: summary.totalOrders ?? 0, icon: "📋", color: "text-amber-600" },
                          { label: "Sales Rank", value: summary.totalSales ? `$${summary.totalSales}` : "-", icon: "📈", color: "text-emerald-600" },
                        ].map((stat) => (
                          <div key={stat.label} className="p-4 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                            <span className="text-xl mb-1">{stat.icon}</span>
                            <span className="label-caps mb-2">{stat.label}</span>
                            <span className={`text-xl font-black ${stat.color}`}>{stat.value}</span>
                          </div>
                        ))}
                      </div>

                      <Descriptions bordered column={1} size="middle" className="overflow-hidden rounded-2xl shadow-sm border-slate-100">
                         <Descriptions.Item label={<span className="label-caps !text-slate-500">Joined System</span>}>
                            {new Date(currentUser.createdAt).toLocaleString()}
                         </Descriptions.Item>
                         <Descriptions.Item label={<span className="label-caps !text-slate-500">Management Scope</span>}>
                            {summary.totalCategories || 0} Categories, {summary.totalProducts || 0} Products Managed
                         </Descriptions.Item>
                         <Descriptions.Item label={<span className="label-caps !text-slate-500">Stock Insights</span>}>
                            {summary.activeProducts || 0} Active, <span className="text-amber-600 font-bold">{summary.lowStockProducts || 0} Low Stock</span>
                         </Descriptions.Item>
                      </Descriptions>
                    </div>
                  )
                },
                {
                  key: "2",
                  label: <span className="px-2 label-caps">Recent Activity</span>,
                  children: (
                    <div className="py-2">
                       {activities.length > 0 ? (
                         <div className="max-h-[360px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {activities.map((act: any) => {
                              const meta = getActivityMeta(act.action);
                              return (
                                <div key={act.id || act._id} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:border-primary-200 transition-colors">
                                   <div className={`w-10 h-10 rounded-xl ${meta.color} flex items-center justify-center text-white text-lg shadow-sm shrink-0`}>
                                      {meta.icon}
                                   </div>
                                   <div className="flex-1 min-w-0">
                                      <div className="flex items-center justify-between gap-2 mb-1">
                                         <span className="label-caps">{meta.label}</span>
                                         <span className="text-[10px] font-bold text-slate-500">{new Date(act.createdAt).toLocaleString([], { hour:'2-digit', minute:'2-digit', month: 'short', day:'numeric'})}</span>
                                      </div>
                                      <p className="text-sm font-bold text-slate-800 tracking-tight leading-snug mb-0">{act.message}</p>
                                   </div>
                                </div>
                              );
                            })}
                         </div>
                       ) : (
                         <div className="py-12 text-center card-subtitle italic">No recent logs for this manager.</div>
                       )}
                    </div>
                  )
                }
              ]}
            />

            <div className="flex flex-wrap justify-end gap-3 pt-6 border-t border-slate-100">
              {currentUser.status === "PENDING" && (
                <Button
                  type="primary"
                  className="btn-primary h-11 px-8 font-bold"
                  onClick={() => {
                    void handleApprove(currentUser);
                    setDetailsOpen(false);
                  }}
                >
                  Approve Manager Access
                </Button>
              )}
              
              <Popconfirm
                title="Restricted Account"
                description="Are you sure you want to change this account access?"
                onConfirm={() => {
                  void handleRestrict(currentUser);
                  setDetailsOpen(false);
                }}
              >
                <Button className="h-11 px-6 font-bold text-amber-700 bg-amber-50 border-none hover:!bg-amber-100">
                  {currentUser.status === "RESTRICTED" ? "Restore Access" : "Restrict Access"}
                </Button>
              </Popconfirm>

              <Popconfirm
                title="Remove Member"
                description="This action cannot be undone. All tokens will be revoked."
                onConfirm={() => {
                   void handleDelete(currentUser);
                   setDetailsOpen(false);
                }}
                okText="Yes, delete"
                okType="danger"
              >
                  <Button danger className="h-11 px-6 font-bold border-none bg-rose-50 hover:!bg-rose-100">
                    Delete
                  </Button>
              </Popconfirm>

              <Button
                onClick={() => setDetailsOpen(false)}
                className="h-11 px-6 font-bold text-slate-500 bg-slate-100 border-none hover:!bg-slate-200"
              >
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
}
