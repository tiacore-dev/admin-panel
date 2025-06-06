import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Breadcrumb } from "antd"; // Импорт компонента Ant Design

export const Breadcrumbs: React.FC = () => {
  const breadcrumbs = useSelector(
    (state: RootState) => state.breadcrumbs.paths
  );

  const breadcrumbItems = breadcrumbs.map((path, index) => ({
    title:
      index === breadcrumbs.length - 1 ? (
        path.label
      ) : (
        <Link to={path.to}>{path.label}</Link>
      ),
  }));

  return <Breadcrumb style={{ margin: "1%" }} items={breadcrumbItems} />;
};
