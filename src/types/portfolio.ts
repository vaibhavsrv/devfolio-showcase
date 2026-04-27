import type { Tables } from "@/integrations/supabase/types";

export type Profile = Tables<"profiles">;
export type Project = Tables<"projects">;

export interface PortfolioData {
  profile: Profile;
  projects: Project[];
}
