import { useNavigate } from "react-router-dom";
// import { IPermission } from "../../../api/permissionsApi";
import { IRole } from "../../../api/roleApi";
// import { IRolePermission } from "../../../api/rolePermissionsRelationsApi";
import { Button, Table, TableColumnsType, Typography } from "antd";

interface RolesTableResponse {
  rolesData: {
    total: number;
    roles: IRole[];
  };
  // permissionsData: {
  //   total: number;
  //   permissions: IPermission[];
  // };
  // relationsData: {
  //   total: number;
  //   relations: IRolePermission[];
  // };
}

export const RolesTable: React.FC<RolesTableResponse> = ({
  rolesData = { total: 0, roles: [] },
  // permissionsData = { total: 0, permissions: [] },
  // relationsData = { total: 0, relations: [] },
}) => {
  const navigate = useNavigate();

  const columns: TableColumnsType<IRole> = [
    {
      title: "Роль",
      dataIndex: "role_name",
      key: "role_name",
      render: (text: string, record: IRole) => (
        <Button
          type="link"
          onClick={() =>
            navigate(`/role_permissions_relations/${record.role_id}`)
          }
        >
          {text}
        </Button>
      ),
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={rolesData.roles}
      rowKey="role_id"
      pagination={{
        total: rolesData.total,
        showSizeChanger: true,
        pageSizeOptions: ["10", "20", "50", "100"],
        showTotal: (total) => <Typography.Text>Всего: {total}</Typography.Text>,
      }}
    />
  );
};
