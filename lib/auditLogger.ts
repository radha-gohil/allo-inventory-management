import { supabase } from "./supabase";

export const createAuditLog =
  async (
    action: string,
    entity: string,
    entityId: string,
    metadata?: any
  ) => {

    const {
      data: { user },
    } =
      await supabase.auth.getUser();

    const { error } =
      await supabase
        .from("audit_logs")
        .insert([
          {
            action,

            entity,

            entity_id:
              entityId,

            performed_by:
              user?.email ||
              "system",

            metadata,
          },
        ]);

    if (error) {

      console.error(
        "Audit log failed:",
        error
      );
    }
  };