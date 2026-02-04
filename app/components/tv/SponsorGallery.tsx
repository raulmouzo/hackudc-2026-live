import type { SponsorTierItem } from "./data";
import { SponsorTier } from "./SponsorTier";

export function SponsorGallery({
  platinum,
  gold,
  user,
  collaborators,
}: {
  platinum: SponsorTierItem[];
  gold: SponsorTierItem[];
  user: SponsorTierItem[];
  collaborators: SponsorTierItem[];
}) {
  return (
    <div className="flex flex-1 flex-col gap-4 overflow-hidden rounded-[24px] bg-[#050914E6] p-6">
      <SponsorTier label="ROOT" sponsors={platinum} tier="root" />
      <SponsorTier label="ADMIN" sponsors={gold} tier="admin" />
      <SponsorTier label="USER" sponsors={user} tier="user" />
      <SponsorTier label="COLLABORATOR" sponsors={collaborators} tier="collaborator" />
    </div>
  );
}
