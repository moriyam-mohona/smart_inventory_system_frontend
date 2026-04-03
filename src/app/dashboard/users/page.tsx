"use client";

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
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  approveUserByAdmin,
  createManagerAccount,
  deleteUserByAdmin,
  getAllUsersAdmin,
  getManagerDetailsByAdmin,
  restrictUserByAdmin,
  type AdminManagedUser,
  type ManagerFullDetails,
} from "@/lib/auth-service";
import { useAppSelector } from "@/redux/hooks";

type UserRecord = {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  isApproved: boolean;
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

function normalizeUser(user: AdminManagedUser): UserRecord {
  const id =
    typeof user.id === "string"
      ? user.id
      : typeof user._id === "string"
        ? user._id
        : "";

  const isRestricted = user.isActive === false || user.status === "RESTRICTED";
  const isPending = user.isApproved === false || user.status === "PENDING";

  return {
    id,
    name: typeof user.name === "string" ? user.name : "Unknown User",
    email: typeof user.email === "string" ? user.email : "-",
    role: typeof user.role === "string" ? user.role : "USER",
    createdAt:
      typeof user.createdAt === "string"
        ? user.createdAt
        : new Date().toISOString(),
    isApproved: user.isApproved !== false,
    status: isRestricted ? "RESTRICTED" : isPending ? "PENDING" : "ACTIVE",
  };
}

function getArrayCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

export default function UsersPage() {
  const accessToken = useAppSelector((state) => state.auth.access_token);
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [managerDetails, setManagerDetails] =
    useState<ManagerFullDetails | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form] = Form.useForm<CreateManagerForm>();
  const [messageApi, contextHolder] = message.useMessage();

  const managers = useMemo(
    () => users.filter((user) => user.role.toUpperCase() === "MANAGER"),
    [users],
  );

  const stats = useMemo(() => {
    const active = managers.filter((user) => user.status === "ACTIVE").length;
    const restricted = managers.filter(
      (user) => user.status === "RESTRICTED",
    ).length;
    return { managers: managers.length, active, restricted };
  }, [managers]);

  const loadUsers = useCallback(async () => {
    if (!accessToken) {
      return;
    }

    try {
      setLoading(true);
      const data = await getAllUsersAdmin(accessToken);
      const normalized = data.map(normalizeUser).filter((user) => user.id);
      setUsers(normalized);
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to load users.";
      messageApi.error(text);
    } finally {
      setLoading(false);
    }
  }, [accessToken, messageApi]);

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const refreshUsers = useCallback(async () => {
    await loadUsers();
  }, [loadUsers]);

  const openDetails = async (user: UserRecord) => {
    setSelectedUser(user);
    setDetailsOpen(true);
    setManagerDetails(null);

    if (!accessToken) {
      messageApi.error("Missing admin token. Please login again.");
      return;
    }

    try {
      setDetailsLoading(true);
      const details = await getManagerDetailsByAdmin(accessToken, user.id);
      setManagerDetails(details);
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : "Failed to load manager details.";
      messageApi.error(text);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleRestrict = async (user: UserRecord) => {
    if (!accessToken) {
      messageApi.error("Missing admin token. Please login again.");
      return;
    }

    try {
      setUsers((prev) =>
        prev.map((record) =>
          record.id === user.id
            ? {
                ...record,
                status:
                  record.status === "RESTRICTED" ? "ACTIVE" : "RESTRICTED",
              }
            : record,
        ),
      );
      await restrictUserByAdmin(accessToken, user.id);
      messageApi.success("Manager access updated.");
      await refreshUsers();
    } catch (error) {
      const text =
        error instanceof Error
          ? error.message
          : "Failed to update manager access.";
      messageApi.error(text);
      await refreshUsers();
    }
  };

  const handleApprove = async (user: UserRecord) => {
    if (!accessToken) {
      messageApi.error("Missing admin token. Please login again.");
      return;
    }

    try {
      setUsers((prev) =>
        prev.map((record) =>
          record.id === user.id
            ? { ...record, isApproved: true, status: "ACTIVE" }
            : record,
        ),
      );
      await approveUserByAdmin(accessToken, user.id);
      messageApi.success("Manager approved.");
      await refreshUsers();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to approve manager.";
      messageApi.error(text);
      await refreshUsers();
    }
  };

  const handleDelete = async (user: UserRecord) => {
    if (!accessToken) {
      messageApi.error("Missing admin token. Please login again.");
      return;
    }

    try {
      setUsers((prev) => prev.filter((record) => record.id !== user.id));
      await deleteUserByAdmin(accessToken, user.id);
      messageApi.success("Manager removed.");
      if (selectedUser?.id === user.id) {
        setDetailsOpen(false);
        setSelectedUser(null);
      }
      await refreshUsers();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to delete manager.";
      messageApi.error(text);
      await refreshUsers();
    }
  };

  const handleCreateManager = async (values: CreateManagerForm) => {
    if (!accessToken) {
      messageApi.error("Missing admin token. Please login again.");
      return;
    }

    try {
      setCreating(true);
      await createManagerAccount(accessToken, {
        name: values.name.trim(),
        email: values.email.trim().toLowerCase(),
        password: values.password,
      });
      messageApi.success("Manager account created.");
      setCreateModalOpen(false);
      form.resetFields();
      await refreshUsers();
    } catch (error) {
      const text =
        error instanceof Error ? error.message : "Failed to create manager.";
      messageApi.error(text);
    } finally {
      setCreating(false);
    }
  };

  const detailsSummary = useMemo(() => {
    if (!managerDetails) {
      return [] as Array<{ label: string; value: number | string }>;
    }

    const summary =
      managerDetails.summary && typeof managerDetails.summary === "object"
        ? managerDetails.summary
        : {};

    const summaryObject = summary as Record<string, unknown>;

    return [
      {
        label: "Categories",
        value:
          (summaryObject.totalCategories as number | undefined) ??
          getArrayCount(managerDetails.categories),
      },
      {
        label: "Products",
        value:
          (summaryObject.totalProducts as number | undefined) ??
          getArrayCount(managerDetails.products),
      },
      {
        label: "Orders",
        value:
          (summaryObject.totalOrders as number | undefined) ??
          getArrayCount(managerDetails.orders),
      },
      {
        label: "Order Items",
        value: getArrayCount(managerDetails.orderItems),
      },
      {
        label: "Activity Logs",
        value: getArrayCount(managerDetails.activityLogs),
      },
      {
        label: "Sales",
        value: (summaryObject.totalSales as number | string | undefined) ?? "-",
      },
    ];
  }, [managerDetails]);

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
          {!user.isApproved ? (
            <Popconfirm
              title="Approve manager account?"
              description="This will grant approved access for this manager."
              okText="Approve"
              cancelText="Cancel"
              onConfirm={() => {
                void handleApprove(user);
              }}
            >
              <Button className="border border-emerald-200 text-emerald-700 hover:!border-emerald-400 hover:!text-emerald-700">
                Approve Manager
              </Button>
            </Popconfirm>
          ) : null}
          <Button
            className="border border-primary-200 text-primary-700 hover:!border-primary-500 hover:!text-primary-700"
            onClick={() => {
              void openDetails(user);
            }}
          >
            View Details
          </Button>
          <Popconfirm
            title="Change manager access?"
            description="This will toggle active/restricted state for this manager."
            okText="Confirm"
            cancelText="Cancel"
            onConfirm={() => {
              void handleRestrict(user);
            }}
          >
            <Button className="border border-amber-200 text-amber-700 hover:!border-amber-400 hover:!text-amber-700">
              Restrict / Ban
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

  return (
    <div className="space-y-6">
      {contextHolder}

      <Card className="rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-700">
              User management
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              Manager directory
            </h2>
            <p className="card-subtitle mt-2 max-w-2xl">
              Integrated with admin routes: create manager, list users,
              restrict/ban, delete, and view full manager details.
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

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[
            {
              label: "Managers",
              value: stats.managers,
              tone: "from-primary-600 to-primary-500",
            },
            {
              label: "Active",
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
              className="rounded-2xl border border-slate-200 bg-linear-to-br from-white to-slate-50 p-4 shadow-sm"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="text-sm font-medium text-slate-500">
                  {item.label}
                </span>
                <span
                  className={`h-2.5 w-2.5 rounded-full bg-linear-to-r ${item.tone}`}
                />
              </div>
              <div className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white/95 shadow-[0_20px_60px_-30px_rgba(15,23,42,0.35)] backdrop-blur">
        <div className="border-b border-slate-200 px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Managers table
              </h3>
              <p className="text-sm text-slate-500">
                Only manager users are displayed.
              </p>
            </div>
            <Tag
              color="blue"
              className="rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide"
            >
              Admin controls enabled
            </Tag>
          </div>
        </div>

        <div className="px-2 py-2 sm:px-4 sm:py-4">
          <Table
            loading={loading}
            columns={columns}
            dataSource={managers}
            rowKey="id"
            pagination={false}
            size="middle"
            className="users-modern-table"
            rowClassName={() => "align-top"}
            locale={{ emptyText: "No manager accounts found." }}
          />
        </div>
      </Card>

      <Modal
        open={createModalOpen}
        onCancel={() => setCreateModalOpen(false)}
        footer={null}
        centered
        title="Create Manager"
      >
        <Form<CreateManagerForm>
          form={form}
          layout="vertical"
          onFinish={(values) => void handleCreateManager(values)}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: "Enter manager name" }]}
          >
            <Input placeholder="New Manager" />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Enter manager email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="manager@company.com" />
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Enter password" },
              { min: 8, message: "Password must be at least 8 characters" },
            ]}
          >
            <Input.Password placeholder="Manager@789" />
          </Form.Item>
          <div className="flex justify-end gap-3">
            <Button onClick={() => setCreateModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={creating}
              className="btn-primary"
            >
              Create Manager
            </Button>
          </div>
        </Form>
      </Modal>

      <Modal
        open={detailsOpen}
        onCancel={() => setDetailsOpen(false)}
        footer={null}
        centered
        width={760}
        title={
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.28em] text-primary-700">
              Manager details
            </div>
            <div className="mt-1 text-xl font-bold text-slate-900">
              {selectedUser?.name ?? "Manager"}
            </div>
          </div>
        }
      >
        {selectedUser ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4">
              <Avatar
                className="bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] font-semibold"
                size={56}
              >
                {selectedUser.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")}
              </Avatar>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {selectedUser.name}
                </div>
                <div className="text-sm text-slate-500">
                  {selectedUser.email}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Tag color="blue">MANAGER</Tag>
                  <Tag color={statusColor(selectedUser.status)}>
                    {selectedUser.status}
                  </Tag>
                </div>
              </div>
            </div>

            <Descriptions
              bordered
              column={1}
              size="middle"
              className="overflow-hidden rounded-2xl"
            >
              <Descriptions.Item label="Created At">
                {new Date(selectedUser.createdAt).toLocaleString()}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {selectedUser.status}
              </Descriptions.Item>
              <Descriptions.Item label="Products Created">
                {
                  detailsSummary.find((item) => item.label === "Products")
                    ?.value
                }
              </Descriptions.Item>
              <Descriptions.Item label="Orders Created">
                {detailsSummary.find((item) => item.label === "Orders")?.value}
              </Descriptions.Item>
            </Descriptions>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {detailsSummary.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-200 bg-slate-50 p-3"
                >
                  <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                    {item.label}
                  </p>
                  <p className="mt-2 text-xl font-bold text-slate-900">
                    {detailsLoading ? "..." : item.value}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-end gap-3">
              {!selectedUser.isApproved ? (
                <Button
                  className="border border-emerald-200 text-emerald-700 hover:!border-emerald-400 hover:!text-emerald-700"
                  onClick={() => {
                    void handleApprove(selectedUser);
                    setDetailsOpen(false);
                  }}
                >
                  Approve Manager
                </Button>
              ) : null}
              <Button
                className="border border-amber-200 text-amber-700 hover:!border-amber-400 hover:!text-amber-700"
                onClick={() => {
                  void handleRestrict(selectedUser);
                  setDetailsOpen(false);
                }}
              >
                Restrict / Ban Manager
              </Button>
              <Button
                danger
                className="border border-rose-200 text-rose-600 hover:!border-rose-400 hover:!text-rose-600"
                onClick={() => {
                  void handleDelete(selectedUser);
                  setDetailsOpen(false);
                }}
              >
                Delete Manager
              </Button>
              <Button
                type="primary"
                className="btn-primary"
                onClick={() => setDetailsOpen(false)}
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
