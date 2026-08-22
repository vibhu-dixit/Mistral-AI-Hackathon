import { Badge } from "@/components/ui/Badge";
import { SEVERITY_COLOR } from "@/lib/severity";
import { SEVERITY_LABEL, type Severity } from "@/lib/types";

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge color={SEVERITY_COLOR[severity]}>{SEVERITY_LABEL[severity]}</Badge>;
}
