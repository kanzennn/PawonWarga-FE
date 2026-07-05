"use client";

import type { ReactNode } from "react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useMention } from "@/context/mention-context";

export default function MentionDetailModal() {
  const { selectedMention, clearMention } = useMention();

  return (
    <Modal open={!!selectedMention} title="Mention Detail" onClose={clearMention}>
      {selectedMention && (
        <div className="grid gap-4">
          <Badge tone={selectedMention.sentiment}>{selectedMention.sentiment}</Badge>
          <div>
            <h2 className="m-0 text-2xl font-black text-[#10231c]">
              {selectedMention.user}
            </h2>
            <p className="mt-3 leading-8 text-[#10231c]">{selectedMention.text}</p>
          </div>
          <div className="grid gap-3 rounded-2xl bg-[#f6faf5] p-4 sm:grid-cols-2">
            <Info label="Platform" value={selectedMention.platform} />
            <Info label="Location" value={selectedMention.location} />
            <Info label="Engagement" value={selectedMention.engagement} />
            <Info label="Time" value={selectedMention.time} />
            <Info label="Category" value={selectedMention.category || "-"} />
            <Info label="Risk Level" value={selectedMention.risk || "-"} />
          </div>
        </div>
      )}
    </Modal>
  );
}

function Info({ label, value }: { label: string; value: ReactNode }) {
  return (
    <span className="grid gap-1 text-sm text-[#6d7e75]">
      {label}
      <b className="text-base text-[#10231c]">{value}</b>
    </span>
  );
}
