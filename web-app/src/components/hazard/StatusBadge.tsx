import { Badge } from "@/components/ui/Badge";
import { STATUS_COLOR } from "@/lib/severity";
import { STATUS_LABEL, type HazardStatus } from "@/lib/types";

export function StatusBadge({ status }: { status: HazardStatus }) {
  return <Badge color={STATUS_COLOR[status]}>{STATUS_LABEL[status]}</Badge>;
}
