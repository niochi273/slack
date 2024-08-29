import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Id } from "../../../convex/_generated/dataModel";

export const useGetWorkspace = ({ id }: { id: Id<"workspaces"> }) => {
  const data = useQuery(api.workspaces.getById, { id });
  const isPending = data === undefined;

  return { data, isPending };
};
