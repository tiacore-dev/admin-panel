"use client";

import type React from "react";
import { useState, useCallback, useMemo } from "react";
import {
  Modal,
  Form,
  Input,
  Checkbox,
  Select,
  Spin,
  Button,
  Space,
  Card,
  Typography,
  Divider,
} from "antd";
import {
  AppstoreOutlined,
  SafetyOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useCombinedPermissionsQuery } from "../../../hooks/permissions/usePermissionsQuery";
import { useRoleMutations } from "../../../hooks/role/useRoleMutations";
import { useAppsQuery } from "../../../hooks/base/useBaseQuery";

const { Text } = Typography;

interface CreateRoleModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess: () => void;
}

export const CreateRoleModal: React.FC<CreateRoleModalProps> = ({
  visible,
  onCancel,
  onSuccess,
}) => {
  const [form] = Form.useForm();
  const [selectedApp, setSelectedApp] = useState<string | undefined>(undefined);
  const { createMutation } = useRoleMutations("", "", onCancel);
  const { data: permission_data, isLoading: isLoadingPermissions } =
    useCombinedPermissionsQuery(selectedApp);
  const { data: appsData, isLoading: isLoadingApps } = useAppsQuery();

  const currentPermissions = Form.useWatch("permissions", form) || [];

  const uniquePermissions = useMemo(() => {
    if (!permission_data?.permissions) return [];

    return permission_data.permissions.filter(
      (permission, index, self) =>
        index ===
        self.findIndex((p) => p.permission_id === permission.permission_id)
    );
  }, [permission_data?.permissions]);

  const allPermissionIds = useMemo(() => {
    return uniquePermissions.map((permission) => permission.permission_id);
  }, [uniquePermissions]);

  const handleAppChange = useCallback(
    (value: string) => {
      setSelectedApp(value);
      form.setFieldsValue({ permissions: [] });
    },
    [form]
  );

  const handlePermissionsChange = useCallback(
    (checkedValues: string[]) => {
      form.setFieldsValue({ permissions: checkedValues });
    },
    [form]
  );

  const handleSubmit = useCallback(() => {
    form.validateFields().then((values) => {
      createMutation.mutate(
        {
          role_name: values.role_name,
          permissions: values.permissions || [],
          application_id: values.application_id,
        },
        {
          onSuccess: () => {
            onSuccess();
            form.resetFields();
            setSelectedApp(undefined);
          },
        }
      );
    });
  }, [form, createMutation, onSuccess]);

  const handleCancel = useCallback(() => {
    onCancel();
    form.resetFields();
    setSelectedApp(undefined);
  }, [onCancel, form]);

  const selectAllPermissions = useCallback(() => {
    form.setFieldsValue({ permissions: allPermissionIds });
  }, [form, allPermissionIds]);

  const clearAllPermissions = useCallback(() => {
    form.setFieldsValue({ permissions: [] });
  }, [form]);

  const isSelectAllDisabled = useMemo(() => {
    return currentPermissions.length === allPermissionIds.length;
  }, [currentPermissions.length, allPermissionIds.length]);

  const isClearAllDisabled = useMemo(() => {
    return currentPermissions.length === 0;
  }, [currentPermissions.length]);

  return (
    <Modal
      title={
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            margin: "-24px -24px 20px -24px",
            padding: "20px 24px",
            color: "white",
            borderRadius: "8px 8px 0 0",
          }}
        >
          <SafetyOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            Создание новой роли
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={handleCancel}
      centered
      width={700}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          Создать роль
        </span>
      }
      cancelText="Отмена"
      okButtonProps={{
        size: "large",
        style: {
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          border: "none",
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
        },
        disabled: createMutation.isPending,
      }}
      cancelButtonProps={{
        size: "large",
        style: {
          borderRadius: "8px",
          height: "40px",
          fontWeight: "500",
          borderColor: "#d1d5db",
          color: "#6b7280",
        },
      }}
      styles={{
        content: {
          borderRadius: "12px",
          overflow: "hidden",
        },
        footer: {
          borderTop: "1px solid #f3f4f6",
          marginTop: "20px",
        },
      }}
      confirmLoading={createMutation.isPending}
    >
      <Form form={form} layout="vertical">
        {/* <Card
          size="small"
          style={{
            marginBottom: 16,
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
          }}
        > */}
        <Form.Item
          name="role_name"
          label="Название роли"
          rules={[
            { required: true, message: "Пожалуйста, введите название роли" },
          ]}
          style={{ marginBottom: 16 }}
        >
          <Input placeholder="Введите название роли" size="large" />
        </Form.Item>

        <Form.Item
          name="application_id"
          label="Приложение"
          rules={[
            { required: true, message: "Пожалуйста, выберите приложение" },
          ]}
          style={{ marginBottom: 0 }}
        >
          <Select
            placeholder="Выберите приложение"
            onChange={handleAppChange}
            loading={isLoadingApps}
            size="large"
            showSearch
            optionFilterProp="children"
            suffixIcon={<AppstoreOutlined />}
          >
            {appsData?.applications.map((app) => (
              <Select.Option
                key={app.application_id}
                value={app.application_id}
              >
                {app.application_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        {/* </Card> */}

        <Card
          size="small"
          style={{
            border: "1px solid #f0f0f0",
            borderRadius: "8px",
            marginTop: "24px",
          }}
          title={
            <Space>
              <SafetyOutlined />
              <span>Разрешения</span>
              {currentPermissions.length > 0 && (
                <Text type="secondary">
                  ({currentPermissions.length} выбрано)
                </Text>
              )}
            </Space>
          }
        >
          <Form.Item name="permissions" style={{ marginBottom: 0 }}>
            {isLoadingPermissions ? (
              <div style={{ textAlign: "center", padding: 20 }}>
                <Spin size="small" />
                <Text type="secondary" style={{ marginLeft: 8 }}>
                  Загрузка разрешений...
                </Text>
              </div>
            ) : selectedApp ? (
              <>
                <Space style={{ marginBottom: 16 }}>
                  <Button
                    // size="small"
                    onClick={selectAllPermissions}
                    disabled={isSelectAllDisabled}
                  >
                    Выбрать все
                  </Button>
                  <Button
                    // size="small"
                    onClick={clearAllPermissions}
                    disabled={isClearAllDisabled}
                  >
                    Убрать все
                  </Button>
                  <Divider type="vertical" />
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Доступно разрешений: {uniquePermissions.length}
                  </Text>
                </Space>

                <div
                  style={{
                    maxHeight: 300,
                    overflowY: "auto",
                    // border: "1px solid #f0f0f0",
                    borderRadius: "6px",
                  }}
                >
                  <Checkbox.Group
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      padding: 8,
                    }}
                    value={currentPermissions}
                    onChange={handlePermissionsChange}
                  >
                    {uniquePermissions.map((permission) => (
                      <div
                        key={permission.permission_id}
                        style={{
                          padding: "8px 12px",
                          borderBottom: "1px solid #f5f5f5",
                          backgroundColor: currentPermissions.includes(
                            permission.permission_id
                          )
                            ? "#f6ffed"
                            : "#fff",
                        }}
                      >
                        <Checkbox value={permission.permission_id}>
                          <div>
                            <Text
                              strong={currentPermissions.includes(
                                permission.permission_id
                              )}
                            >
                              {permission.permission_name}
                            </Text>
                            {permission.comment && (
                              <div>
                                <Text type="secondary" style={{ fontSize: 12 }}>
                                  {permission.comment}
                                </Text>
                              </div>
                            )}
                          </div>
                        </Checkbox>
                      </div>
                    ))}
                  </Checkbox.Group>
                </div>
              </>
            ) : (
              <div style={{ textAlign: "center", padding: 40, color: "#999" }}>
                <AppstoreOutlined style={{ fontSize: 24, marginBottom: 8 }} />
                <div>
                  Выберите приложение, чтобы увидеть доступные разрешения
                </div>
              </div>
            )}
          </Form.Item>
        </Card>
      </Form>
    </Modal>
  );
};
