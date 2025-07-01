import type React from "react";
import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { IRole } from "../../../api/roleApi";
import { Button, Table, type TableColumnsType, Typography, Tag } from "antd";
import { useAppsMap } from "../../../hooks/base/useAppHelpers";
import { getTegColorForString } from "../../../utils/stringToColour";

interface RolesTableResponse {
  rolesData: {
    total: number;
    roles: IRole[];
  };
}

export const RolesTable: React.FC<RolesTableResponse> = ({
  rolesData = { total: 0, roles: [] },
}) => {
  const navigate = useNavigate();
  const appsMap = useAppsMap();

  const handleRoleClick = useCallback(
    (roleId: string) => {
      navigate(`/role_permissions_relations/${roleId}`);
    },
    [navigate]
  );

  const columns: TableColumnsType<IRole> = useMemo(
    () => [
      {
        title: "Название роли",
        dataIndex: "role_name",
        key: "role_name",
        render: (text: string, record: IRole) => (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              cursor: "pointer",
              fontWeight: 600,
              color: "#1890ff",
              marginBottom: 2,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
            onClick={() => handleRoleClick(record.role_id)}
          >
            {/* <Button type="link" onClick={() => handleRoleClick(record.role_id)}> */}
            {text}
            {/* </Button> */}
          </div>
        ),
        sorter: (a, b) => a.role_name.localeCompare(b.role_name),
      },
      {
        title: "Приложение",
        dataIndex: "application_id",
        key: "application_id",
        render: (applicationId: string) => {
          const appName = appsMap.get(applicationId);
          const color = appName ? getTegColorForString(appName) : "default";
          return appName ? (
            <Tag color={color} style={{ fontSize: 14 }}>
              {appName}
            </Tag>
          ) : (
            <Tag color="orange">Неизвестное приложение</Tag>
          );
        },
        // filters: Array.from(appsMap.entries()).map(([id, name]) => ({
        //   text: name,
        //   value: id,
        // })),
        // onFilter: (value, record) => record.application_id === value,
        sorter: (a, b) => {
          const appNameA = appsMap.get(a.application_id) || "";
          const appNameB = appsMap.get(b.application_id) || "";
          return appNameA.localeCompare(appNameB);
        },
      },
    ],
    [handleRoleClick, appsMap]
  );

  const paginationConfig = useMemo(
    () => ({
      total: rolesData.total,
      showSizeChanger: true,
      pageSizeOptions: ["10", "20", "50", "100"],
      showTotal: (total: number, range: [number, number]) => (
        <Typography.Text type="secondary">
          Показано {range[0]}-{range[1]} из {total} ролей
        </Typography.Text>
      ),
      showQuickJumper: true,
    }),
    [rolesData.total]
  );

  return (
    <Table
      columns={columns}
      dataSource={rolesData.roles}
      rowKey="role_id"
      pagination={paginationConfig}
      size="middle"
      scroll={{ x: 600 }}
    />
  );
};
