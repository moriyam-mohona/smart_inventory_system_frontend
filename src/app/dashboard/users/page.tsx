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

import { useAppSelector } from "@/redux/hooks";
import {
  useGetAllUsersQuery,
  useRestrictUserMutation,
  useDeleteUserMutation,
  useCreateManagerMutation,
  useGetManagerDetailsQuery,
} from "@/redux/features/auth/authApi";

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

function normalizeUser(user: any): UserRecord {
  const id = user.id || user._id || "";

  const isRestricted = user.isActive === false || user.status === "RESTRICTED";
  const isPending = user.isApproved === false || user.status === "PENDING";

  return {
    id,
    name: user.name || "Unknown User",
    email: user.email || "-",
    role: user.role || "USER",
    createdAt: user.createdAt || new Date().toISOString(),
    isApproved: user.isApproved !== false,
    status: isRestricted ? "RESTRICTED" : isPending ? "PENDING" : "ACTIVE",
  };
}

function getArrayCount(value: unknown) {
  return Array.isArray(value) ? value.length : 0;
}

export default function UsersPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [form] = Form.useForm<CreateManagerForm>();
  const [messageApi, contextHolder] = message.useMessage();

  // Queries & Mutations
  const { data: usersData, isLoading: loading, error: loadError } = useGetAllUsersQuery({});
  const { data: managerDetailsRes, isFetching: detailsLoading } = useGetManagerDetailsQuery(selectedUserId || "", {
    skip: !selectedUserId || !detailsOpen,
  });
  
  const [restrictUser] = useRestrictUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createManager, { isLoading: creating }] = useCreateManagerMutation();

  const usersRaw = Array.isArray(usersData?.data) ? usersData.data : [];
  const users = useMemo(() => usersRaw.map(normalizeUser).filter((u: UserRecord) => u.id), [usersRaw]);
  const managerDetails = managerDetailsRes?.data;

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
              {users.find((u: UserRecord) => u.id === selectedUserId)?.name ?? "Manager"}
            </div>
          </div>
        }
      >
        {selectedUserId ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-linear-to-br from-slate-50 to-white p-4">
              <Avatar
                className="bg-[linear-gradient(135deg,#4f46e5,#7c3aed)] font-semibold"
                size={56}
              >
                {(users.find((u: UserRecord) => u.id === selectedUserId)?.name || "M")
                  .split(" ")
                  .map((part: string) => part[0])
                  .slice(0, 2)
                  .join("")}
              </Avatar>
              <div>
                <div className="text-lg font-semibold text-slate-900">
                  {users.find((u: UserRecord) => u.id === selectedUserId)?.name}
                </div>
                <div className="text-sm text-slate-500">
                  {users.find((u: UserRecord) => u.id === selectedUserId)?.email}
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Tag color="blue">MANAGER</Tag>
                  <Tag color={statusColor(users.find((u: UserRecord) => u.id === selectedUserId)?.status || "ACTIVE")}>
                    {users.find((u: UserRecord) => u.id === selectedUserId)?.status}
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
                {users.find((u: UserRecord) => u.id === selectedUserId)?.createdAt ? new Date(users.find((u: UserRecord) => u.id === selectedUserId)!.createdAt).toLocaleString() : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Status">
                {users.find((u: UserRecord) => u.id === selectedUserId)?.status}
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
              <button
                type="button"
                className="btn-secondary h-10 px-4"
                onClick={() => {
                  const user = users.find((u: UserRecord) => u.id === selectedUserId);
                  if (user) void handleRestrict(user);
                  setDetailsOpen(false);
                }}
              >
                Toggle Access
              </button>
              <button
                type="button"
                className="btn-danger h-10 px-4"
                onClick={() => {
                  const user = users.find((u: UserRecord) => u.id === selectedUserId);
                  if (user) void handleDelete(user);
                  setDetailsOpen(false);
                }}
              >
                Delete Manager
              </button>
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
