"use client";

// src/pages/rolePermissions/components/CreateRoleModal.tsx
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
import { AppstoreOutlined, SafetyOutlined } from "@ant-design/icons";
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

  // Получаем текущие выбранные разрешения из формы
  const currentPermissions = Form.useWatch("permissions", form) || [];

  // Мемоизированные данные
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

  // Обработчики с useCallback
  const handleAppChange = useCallback(
    (value: string) => {
      setSelectedApp(value);
      // Сбрасываем выбранные разрешения при смене приложения
      form.setFieldsValue({ permissions: [] });
    },
    [form]
  );

  const handlePermissionsChange = useCallback(
    (checkedValues: string[]) => {
      console.log("Permissions changed:", checkedValues);
      form.setFieldsValue({ permissions: checkedValues });
    },
    [form]
  );

  const handleOk = useCallback(() => {
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

  // Функция для выбора всех разрешений
  const selectAllPermissions = useCallback(() => {
    console.log("Selecting all permissions:", allPermissionIds);
    form.setFieldsValue({ permissions: allPermissionIds });
  }, [form, allPermissionIds]);

  // Функция для снятия всех разрешений
  const clearAllPermissions = useCallback(() => {
    console.log("Clearing all permissions");
    form.setFieldsValue({ permissions: [] });
  }, [form]);

  // Проверки для кнопок
  const isSelectAllDisabled = useMemo(() => {
    return currentPermissions.length === allPermissionIds.length;
  }, [currentPermissions.length, allPermissionIds.length]);

  const isClearAllDisabled = useMemo(() => {
    return currentPermissions.length === 0;
  }, [currentPermissions.length]);

  return (
    <Modal
      title={
        <Space>
          <SafetyOutlined />
          <span>Создание новой роли</span>
        </Space>
      }
      open={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={createMutation.isPending}
      okText="Создать роль"
      cancelText="Отмена"
      width={700}
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical">
        <Card size="small" style={{ marginBottom: 16 }}>
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
            label={
              <Space>
                <AppstoreOutlined />
                <span>Приложение</span>
              </Space>
            }
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
        </Card>

        <Card
          size="small"
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
                    size="small"
                    onClick={selectAllPermissions}
                    disabled={isSelectAllDisabled}
                  >
                    Выбрать все ({uniquePermissions.length})
                  </Button>
                  <Button
                    size="small"
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
                    border: "1px solid #f0f0f0",
                    borderRadius: 6,
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
