"use client";

import { useState, type ReactNode } from "react";
import { ChevronLeft, ChevronRight, ExternalLink } from "lucide-react";
import Badge from "@/components/ui/Badge";
import Modal from "@/components/ui/Modal";
import { useMention } from "@/context/mention-context";
import { useComments } from "@/hooks/use-comments";
import type { Mention } from "@/lib/types";

const COMMENTS_PER_PAGE = 10;

export default function MentionDetailModal() {
  const { selectedMention, clearMention } = useMention();

  return (
    <Modal open={!!selectedMention} title="Mention Detail" onClose={clearMention}>
      {selectedMention && (
        // Keyed by id so switching to a different mention remounts this
        // subtree — the simplest way to reset the comments page back to 1
        // instead of carrying over the previous mention's page number.
        <MentionDetailContent key={selectedMention.id} mention={selectedMention} />
      )}
    </Modal>
  );
}

function MentionDetailContent({ mention }: { mention: Mention }) {
  const [page, setPage] = useState(1);
  const { data: comments, isLoading } = useComments(mention.id, {
    page,
    perPage: COMMENTS_PER_PAGE,
  });

  return (
    <div className="grid gap-4">
      <Badge tone={mention.sentiment}>{mention.sentiment}</Badge>
      <div>
        <h2 className="m-0 text-2xl font-black text-[#10231c]">{mention.user}</h2>
        <p className="mt-3 leading-8 text-[#10231c]">{mention.text}</p>
      </div>
      <div className="grid gap-3 rounded-2xl bg-[#f6faf5] p-4 sm:grid-cols-2">
        <Info label="Platform" value={mention.platform} />
        <Info label="Location" value={mention.location || "-"} />
        <Info label="Engagement" value={mention.engagement} />
        <Info label="Time" value={mention.time} />
        <Info label="Category" value={mention.category || "-"} />
        <Info label="Risk Level" value={mention.risk || "-"} />
      </div>
      {mention.url && (
        <a
          href={mention.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex h-11 items-center justify-center gap-2 rounded-2xl bg-[#052d22] text-sm font-black text-white hover:bg-[#07513b]"
        >
          <ExternalLink size={16} />
          Lihat postingan asli
        </a>
      )}

      <div className="border-t border-[#dce8df] pt-4">
        <b className="text-sm text-[#10231c]">
          Comments{comments ? ` (${comments.pagination.total})` : ""}
        </b>

        <div className="mt-3 grid gap-3">
          {isLoading && !comments && (
            <p className="m-0 text-sm text-[#6d7e75]">Memuat komentar...</p>
          )}

          {comments?.items.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-[#f6faf5] p-3">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <b className="text-sm text-[#10231c]">{comment.user}</b>
                <Badge tone={comment.sentiment}>{comment.sentiment}</Badge>
              </div>
              <p className="m-0 text-sm leading-6 text-[#10231c]">{comment.text}</p>
              <small className="mt-1 block text-xs font-bold text-[#6d7e75]">
                {comment.engagement} • {comment.time}
              </small>
            </div>
          ))}

          {comments && comments.items.length === 0 && (
            <p className="m-0 text-sm text-[#6d7e75]">Belum ada komentar untuk postingan ini.</p>
          )}
        </div>

        {comments && comments.pagination.totalPages > 1 && (
          <div className="mt-3 flex items-center justify-between gap-3">
            <p className="m-0 text-xs font-bold text-[#6d7e75]">
              Page {comments.pagination.page} of {comments.pagination.totalPages}
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setPage((current) => current - 1)}
                disabled={comments.pagination.page <= 1}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#dce8df] bg-white text-[#07513b] hover:bg-[#f8fbf5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Previous comments page"
              >
                <ChevronLeft size={15} />
              </button>
              <button
                type="button"
                onClick={() => setPage((current) => current + 1)}
                disabled={comments.pagination.page >= comments.pagination.totalPages}
                className="grid h-8 w-8 place-items-center rounded-lg border border-[#dce8df] bg-white text-[#07513b] hover:bg-[#f8fbf5] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-white"
                aria-label="Next comments page"
              >
                <ChevronRight size={15} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
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
