import { Phone, UserRound } from "lucide-react";

import { formatDistance } from "@/lib/format";
import type { Hazard } from "@/lib/types";

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-rw-text-muted">{label}</dt>
      <dd className="min-h-5 text-rw-text">{value}</dd>
    </div>
  );
}

export function StreetPermitInfo({ hazard }: { hazard: Hazard }) {
  return (
    <section className="space-y-3 rounded-xl border border-rw-border px-4 py-3">
      <h3 className="text-sm font-medium text-rw-text">Street-use permit</h3>
      <dl className="grid grid-cols-2 gap-4 text-sm">
        <Field label="Street" value={hazard.permit_street_name} />
        <div>
          <dt className="flex items-center gap-1 text-rw-text-muted">
            <UserRound className="h-3.5 w-3.5" />
            Agent / contractor
          </dt>
          <dd className="min-h-5 text-rw-text">{hazard.agent}</dd>
        </div>
        <div>
          <dt className="flex items-center gap-1 text-rw-text-muted">
            <Phone className="h-3.5 w-3.5" />
            Phone
          </dt>
          <dd className="min-h-5 text-rw-text">
            {hazard.agent_phone ? (
              <a className="underline decoration-rw-border underline-offset-2" href={`tel:${hazard.agent_phone}`}>
                {hazard.agent_phone}
              </a>
            ) : (
              ""
            )}
          </dd>
        </div>
        <Field label="Permit number" value={hazard.permit_number} />
        <Field label="Permit type" value={hazard.permit_type} />
        <Field label="Permit status" value={hazard.permit_status} />
        <Field
          label="Distance to permit"
          value={hazard.permit_distance_m != null ? formatDistance(hazard.permit_distance_m) : ""}
        />
        <Field
          label="Coordinates"
          value={hazard.latitude && hazard.longitude ? `${hazard.latitude.toFixed(5)}, ${hazard.longitude.toFixed(5)}` : ""}
        />
      </dl>
    </section>
  );
}
