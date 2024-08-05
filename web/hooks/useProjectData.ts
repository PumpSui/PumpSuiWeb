import useSWR from "swr";
import { getProjectRecord } from "@/api/suifund";
import { useSuiClient } from "@mysten/dapp-kit";
import { useCallback} from "react";

const useProjectData = (projectId: string) => {
  const client = useSuiClient();
  const { data, error, mutate } = useSWR([projectId, client], ([id, client]) =>
    getProjectRecord(id, client),{revalidateOnFocus: false}
  );

  const refreshProjectData = useCallback(() => {
    mutate();
  }, [mutate]);

  return {
    data,
    error,
    refreshProjectData,
    isLoading: !error && !data,
  };
};

export default useProjectData;
