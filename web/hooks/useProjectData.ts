import useSWR from "swr";
import { getProjectRecord } from "@/api/suifund";
import { useSuiClient } from "@mysten/dapp-kit";

const useProjectData = (projectId: string) => {
  const client = useSuiClient();
  const { data, error } = useSWR([projectId, client], ([id, client]) =>
    getProjectRecord(id, client)
  );

  return {
    data,
    error,
    isLoading: !error && !data,
  };
};

export default useProjectData;
