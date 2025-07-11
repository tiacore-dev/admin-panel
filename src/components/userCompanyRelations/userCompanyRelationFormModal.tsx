"use client";

import type React from "react";
import {
  Modal,
  Form,
  Select,
  Button,
  Card,
  Space,
  Typography,
  Avatar,
  Alert,
} from "antd";
import { useUserCompanyRelationsMutations } from "../../hooks/userCompanyRelations/useUserCompanyRelationsMutations";
import type { IUserCompanyRelation } from "../../api/userCompanyRelationsApi";
import { useEffect, useState } from "react";
import type { IUser } from "../../api/usersApi";
import { fetchUserCompanyRelations } from "../../api/userCompanyRelationsApi";
import {
  UserOutlined,
  SafetyCertificateOutlined,
  AppstoreOutlined,
  LinkOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { useAppNameById } from "../../hooks/base/useAppHelpers";
import { useRolesQuery } from "../../hooks/role/useRoleQuery";

const { Title, Text } = Typography;

interface RelationFormModalProps {
  visible: boolean;
  onCancel: () => void;
  onSuccess?: () => void;
  mode?: "create" | "edit";
  initialData?: IUserCompanyRelation | null;
  roles: Array<{ role_id: string; role_name: string; application_id: string }>;
  userId?: string;
  companyId?: string;
  companies?: Array<{ company_id: string; company_name: string }>;
  users?: IUser[];
  applications?: Array<{ application_id: string; application_name: string }>;
}

export const RelationFormModal = ({
  visible,
  onCancel,
  onSuccess,
  mode = "create",
  initialData,
  roles,
  userId,
  companyId,
  companies = [],
  users = [],
  applications = [],
}: RelationFormModalProps) => {
  const [form] = Form.useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState<string | undefined>(
    initialData?.application_id
  );
  const { data: rolesData } = useRolesQuery(selectedAppId);

  const { createMutation, updateMutation } = useUserCompanyRelationsMutations(
    initialData?.user_company_id || "",
    initialData?.user_id || "",
    initialData?.company_id || "",
    initialData?.role_id || "",
    () => {}
  );

  // Функция для получения инициалов
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((word) => word.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Функция для получения цвета аватара
  const getAvatarColor = (name: string) => {
    const colors = [
      "#f56a00",
      "#7265e6",
      "#ffbf00",
      "#00a2ae",
      "#87d068",
      "#108ee9",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  // Компонент для отображения названия приложения
  const AppNameDisplay: React.FC<{ applicationId: string }> = ({
    applicationId,
  }) => {
    const appName = useAppNameById(applicationId);
    return <span>{appName || applicationId}</span>;
  };

  useEffect(() => {
    if (initialData && mode === "edit") {
      form.setFieldsValue({
        user_id: initialData.user_id,
        company_id: initialData.company_id,
        role_id: initialData.role_id,
        application_id: initialData.application_id,
      });
      setSelectedAppId(initialData.application_id);
    } else {
      form.resetFields();
      if (userId) {
        form.setFieldsValue({ user_id: userId });
      }
      if (companyId) {
        form.setFieldsValue({ company_id: companyId });
      }
    }
  }, [initialData, mode, form, userId, companyId]);

  const handleAppChange = (value: string) => {
    setSelectedAppId(value);
    form.setFieldsValue({ role_id: undefined }); // Сбрасываем выбор роли при изменении приложения
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const values = await form.validateFields();

      const user_id = userId || values.user_id;
      const company_id = companyId || values.company_id;

      if (mode === "create") {
        const existingRelations = await fetchUserCompanyRelations({
          user_id,
          company_id,
        });

        await createMutation.mutateAsync({
          user_id,
          role_id: values.role_id,
          company_id,
          application_id: values.application_id,
        });
      } else if (mode === "edit" && initialData?.user_company_id) {
        await updateMutation.mutateAsync({
          role_id: values.role_id,
          user_company_id: initialData.user_company_id,
          application_id: values.application_id,
        });
      }

      form.resetFields();
      onCancel();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getModalTitle = () => {
    return mode === "create"
      ? "Создание связи пользователь-компания"
      : "Редактирование связи";
  };

  const getSubmitButtonText = () => {
    return mode === "create" ? "Создать связь" : "Сохранить изменения";
  };

  const filteredRoles = selectedAppId
    ? roles.filter((role) => role.application_id === selectedAppId)
    : [];

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
          <LinkOutlined style={{ fontSize: "20px" }} />
          <span style={{ fontSize: "18px", fontWeight: "600" }}>
            {getModalTitle()}
          </span>
        </div>
      }
      open={visible}
      onOk={handleSubmit}
      onCancel={onCancel}
      centered
      width={800}
      okText={
        <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <SaveOutlined />
          {getSubmitButtonText()}
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
        disabled: isSubmitting,
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
      destroyOnClose
    >
      <div style={{ marginTop: 24 }}>
        <Form
          form={form}
          layout="vertical"
          size="large"
          initialValues={{
            role_id: initialData?.role_id,
            application_id: initialData?.application_id,
          }}
        >
          <Card size="small" style={{ marginBottom: 16, border: "none" }}>
            {mode === "create" && !userId && (
              <Form.Item
                name="user_id"
                label="Пользователь"
                rules={[
                  {
                    required: !companyId,
                    message: "Пожалуйста, выберите пользователя",
                  },
                ]}
              >
                <Select
                  placeholder="Выберите пользователя"
                  showSearch
                  filterOption={(input, option) =>
                    (
                      option?.label as any
                    )?.props?.children?.[1]?.props?.children?.[0]
                      ?.toLowerCase()
                      ?.includes(input.toLowerCase()) ?? false
                  }
                >
                  {users.map((user) => (
                    <Select.Option key={user.user_id} value={user.user_id}>
                      <Space>
                        <Avatar
                          size="small"
                          style={{
                            backgroundColor: getAvatarColor(
                              user.full_name || user.email || user.user_id
                            ),
                            fontSize: "12px",
                          }}
                        >
                          {getInitials(
                            user.full_name || user.email || user.user_id
                          )}
                        </Avatar>
                        <div>
                          <div style={{ fontWeight: 500 }}>
                            {user.full_name || "Без имени"}
                          </div>
                          {user.email && (
                            <Text type="secondary" style={{ fontSize: "12px" }}>
                              {user.email}
                            </Text>
                          )}
                        </div>
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            {mode === "create" && !companyId && (
              <Form.Item
                name="company_id"
                label="Компания"
                rules={[
                  {
                    required: !userId,
                    message: "Пожалуйста, выберите компанию",
                  },
                ]}
              >
                <Select
                  placeholder="Выберите компанию"
                  showSearch
                  filterOption={(input, option) =>
                    (option?.label as any)?.props?.children?.[1]
                      ?.toLowerCase()
                      ?.includes(input.toLowerCase()) ?? false
                  }
                >
                  {companies.map((company) => (
                    <Select.Option
                      key={company.company_id}
                      value={company.company_id}
                    >
                      <Space>
                        <Avatar
                          size="small"
                          style={{
                            backgroundColor: getAvatarColor(
                              company.company_name
                            ),
                            fontSize: "12px",
                          }}
                        >
                          {getInitials(company.company_name)}
                        </Avatar>
                        {company.company_name}
                      </Space>
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            )}

            <Form.Item
              name="application_id"
              label="Приложение"
              rules={[
                { required: true, message: "Пожалуйста, выберите приложение" },
              ]}
            >
              <Select
                placeholder="Выберите приложение"
                showSearch
                onChange={handleAppChange}
                filterOption={(input, option) =>
                  (option?.label as any)?.props?.children?.[1]
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase()) ?? false
                }
              >
                {applications.map((app) => (
                  <Select.Option
                    key={app.application_id}
                    value={app.application_id}
                  >
                    <Space>
                      <AppstoreOutlined style={{ color: "#722ed1" }} />
                      <AppNameDisplay applicationId={app.application_id} />
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="role_id"
              label="Роль"
              rules={[{ required: true, message: "Пожалуйста, выберите роль" }]}
            >
              <Select
                placeholder={
                  selectedAppId
                    ? "Выберите роль"
                    : "Сначала выберите приложение"
                }
                showSearch
                disabled={!selectedAppId}
                filterOption={(input, option) =>
                  (option?.label as any)?.props?.children?.[1]
                    ?.toLowerCase()
                    ?.includes(input.toLowerCase()) ?? false
                }
                notFoundContent={
                  selectedAppId ? (
                    "Роли не найдены"
                  ) : (
                    <Alert
                      message="Сначала выберите приложение"
                      type="info"
                      showIcon
                    />
                  )
                }
              >
                {filteredRoles.map((role) => (
                  <Select.Option key={role.role_id} value={role.role_id}>
                    <Space>
                      <SafetyCertificateOutlined style={{ color: "#1890ff" }} />
                      {role.role_name}
                    </Space>
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Card>
        </Form>
      </div>
    </Modal>
  );
};
