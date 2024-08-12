import { useCallback } from "react";
import { useCurrentAccount, useSignAndExecuteTransaction, useSuiClient } from "@mysten/dapp-kit";
import { useToast } from "@/components/ui/use-toast";
import { editProject, cancelAndBurnProject, claim } from "@/api/suifund";
import { EditEnum, editProjectParam, ProjectRecord } from "@/type";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { getAllProjectAdminCap } from "@/api/suifund";

const useProjectActions = (selectedProject: ProjectRecord | null) => {
  const { toast } = useToast();
  const router = useRouter();
  const { mutate: signAndExecuteTransaction } = useSignAndExecuteTransaction();
  const client = useSuiClient();
  const currentAccount = useCurrentAccount();
  const { mutate } = useSWRConfig();

  const { data: adminCapMap } = useSWR(
    selectedProject ? [selectedProject.creator] : null,
    ([address]) => getAllProjectAdminCap(client, address)
  );

  const refreshProjectData = useCallback(async () => {
    if (selectedProject?.id) {
      await mutate([selectedProject.id, client]);
    }
  }, [mutate, selectedProject?.id, client]);

  const handleEditSubmit = useCallback(
    async (editedProject: Partial<ProjectRecord>) => {
      if (!selectedProject || !adminCapMap) return;

      const admincap = adminCapMap[selectedProject.id];
      const editFields = {
        image_url: EditEnum.edit_image_url,
        x: EditEnum.edit_x_url,
        telegram: EditEnum.edit_telegram_url,
        discord: EditEnum.edit_discord_url,
        website: EditEnum.edit_website_url,
        github: EditEnum.edit_github_url,
        description: EditEnum.edit_description,
      };
      const params: editProjectParam[] = Object.entries(editFields)
        .map(([field, editEnum]) => {
          if (
            editedProject[field as keyof Partial<ProjectRecord>] !==
            selectedProject[field as keyof ProjectRecord]
          ) {
            return {
              type: editEnum,
              project_record: selectedProject.id,
              project_admin_cap: admincap,
              content: editedProject[field as keyof ProjectRecord] as string,
            };
          }
          return null;
        })
        .filter((param): param is editProjectParam => param !== null);

      const txb = await editProject(params, currentAccount!.address);
      signAndExecuteTransaction(
        {
          transaction: txb,
          chain: "sui::testnet",
        },
        {
          onSuccess: async () => {
            toast({
              title: "Success",
              description: "Project updated successfully",
            });
            await refreshProjectData();
          },
          onError: (error) => {
            toast({
              variant: "destructive",
              title: "Error",
              description: error.message.toString(),
            });
          },
        }
      );
    },
    [adminCapMap, currentAccount, refreshProjectData, selectedProject, signAndExecuteTransaction, toast]
  );

  const handleClaimSubmit = useCallback(async () => {
    if (!selectedProject || !adminCapMap) return;

    const admincap = adminCapMap[selectedProject.id];
    const txb = claim(selectedProject.id, admincap);

    signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: async () => {
          toast({
            title: "Success",
            description: "Project claimed successfully",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        },
      }
    )
  },[adminCapMap, selectedProject, signAndExecuteTransaction, toast]);

  const handleBurnProject = useCallback(() => {
    if (!selectedProject || !adminCapMap) return;

    const admincap = adminCapMap[selectedProject.id];
    const txb = cancelAndBurnProject(selectedProject.id, admincap);

    signAndExecuteTransaction(
      {
        transaction: txb,
      },
      {
        onSuccess: async () => {
          router.push("/");
          toast({
            title: "Success",
            description: "Project burned successfully",
          });
        },
        onError: (error) => {
          toast({
            variant: "destructive",
            title: "Error",
            description: error.message.toString(),
          });
        },
      }
    );
  }, [adminCapMap, router, selectedProject, signAndExecuteTransaction, toast]);

  return { handleEditSubmit, handleBurnProject,handleClaimSubmit };
};

export default useProjectActions;
