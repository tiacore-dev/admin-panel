// src/components/rolePermissions/RestrictionItem.tsx
import React from "react";
// import { List, Checkbox } from "antd";
// import { IRestriction } from "../../api/permissionsApi";

// interface RestrictionItemProps {
//   restriction: IRestriction;
//   isLinked: boolean;
//   isEditing: boolean;
//   onRestrictionChange: (restrictionId: string, checked: boolean) => void;
// }

// export const RestrictionItem: React.FC<RestrictionItemProps> = ({
//   restriction,
//   isLinked,
//   isEditing,
//   onRestrictionChange,
// }) => (
//   <List.Item
//     style={
//       !isEditing && isLinked
//         ? { borderLeft: "4px solid rgba(24, 143, 255, 0.56)" }
//         : { borderLeft: "4px solid rgba(145, 148, 151, 0.17)" }
//     }
//   >
//     <Checkbox
//       checked={isLinked}
//       onChange={(e) =>
//         onRestrictionChange(restriction.restriction_id, e.target.checked)
//       }
//       disabled={!isEditing}
//       style={!isEditing ? { pointerEvents: "none", opacity: 1 } : {}}
//     >
//       <span style={{ color: "black" }}>
//         {restriction.restriction_name}
//         {restriction.comment && (
//           <span style={{ marginLeft: "8px" }}>({restriction.comment})</span>
//         )}
//       </span>
//     </Checkbox>
//   </List.Item>
// );
