"use client";
import React, { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useCopyToClipboard } from "/src/hooks/useCopyToClipboard";
import { deleteUserFormById } from "/src/app/actions";
import { useSession } from "@clerk/nextjs";
import { FormState } from "@prisma/client";
import { TrashIcon, ShareIcon } from "@heroicons/react/24/outline";

export type FormCardProps = {
  id?: string;
  title: string;
  state?: FormState;
};

export const FormCard: React.FC<FormCardProps> = ({ title, id, state }) => {
  const { push } = useRouter();
  const { copyText } = useCopyToClipboard();
  const { session } = useSession();
  const isPublished = state === FormState.PUBLISHED;

  const [showModal, setShowModal] = useState(false);

  const backgroundColors = [
    "bg-pink-200",
    "bg-blue-200",
    "bg-green-200",
    "bg-purple-200",
  ];

  const randomBackground = useMemo(
    () => backgroundColors[Math.floor(Math.random() * backgroundColors.length)],
    [],
  );

  const handleDelete = async () => {
    if (session?.user && id) {
      await deleteUserFormById(id, session.user.id);
      setShowModal(false); // Close the modal after deletion
    }
  };

  return (
    <>
      <div
        onClick={() => {
          push(`/f/${id}/edit`);
        }}
        className="card bg-base-100 card-compact shadow-xl cursor-pointer"
      >
        <div
          className={randomBackground.concat(" rounded-t-2xl")}
          style={{
            height: 191,
          }}
        />
        <div className="card-body flex flex-col justify-between">
          <h2 className="card-title">{title}</h2>
          <div className="card-actions justify-end">
            <button
              className="btn btn-square"
              onClick={(e) => {
                e.stopPropagation();
                setShowModal(true); // Show the confirmation modal
              }}
            >
              <TrashIcon width={20} />
            </button>
            <button
              className="btn btn-square"
              onClick={(e) => {
                e.stopPropagation();
                copyText(`${window.location.origin}/f/${id}`);
              }}
            >
              <ShareIcon width={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Confirm Deletion</h3>
            <p className="py-4">
              Are you sure you want to delete the form titled "{title}"? This
              action cannot be undone.
            </p>
            <div className="modal-action">
              <button
                className="btn btn-outline"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button className="btn btn-error" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
