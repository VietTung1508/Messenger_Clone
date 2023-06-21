import { useParams } from "next/navigation";
import { useMemo } from "react";

const useConverstation = () => {
  const params = useParams();

  const converstationId = useMemo(() => {
    if (!params?.conversationId) {
      return "";
    }

    return params.conversationId as string;
  }, [params?.conversationId]);

  const isOpen = useMemo(() => !!converstationId, [converstationId]);

  return useMemo(
    () => ({
      isOpen,
      converstationId,
    }),
    [isOpen, converstationId]
  );
};

export default useConverstation;
