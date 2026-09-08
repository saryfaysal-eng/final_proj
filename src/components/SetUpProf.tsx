"use client";

import { useState } from "react";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";
import { updateProfile } from "@/app/actions/user";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  initialData: {
    name: string | null;
    bio: string | null;
    image: string | null;
    coverImage: string | null;
  };
};

export default function EditProfPage({ isOpen, onClose, initialData }: Props) {
  const [step, setStep] = useState<"avatar" | "banner" | "details">("avatar");
  const [name, setName] = useState(initialData.name || "");
  const [bio, setBio] = useState(initialData.bio || "");
  const [image, setImage] = useState(initialData.image || "");
  const [coverImage, setCoverImage] = useState(initialData.coverImage || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { startUpload: uploadProfileImage, isUploading: uploadingAvatar } =
    useUploadThing("profileImage");
  const { startUpload: uploadBannerImage, isUploading: uploadingBanner } =
    useUploadThing("bannerImage");

  if (!isOpen) return null;

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadProfileImage([file]);
    if (res?.[0]?.url) {
      setImage(res[0].url);
    }
  };

  const handleBannerChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const res = await uploadBannerImage([file]);
    if (res?.[0]?.url) {
      setCoverImage(res[0].url);
    }
  };

  const handleSave = async () => {
    setIsSubmitting(true);
    try {
      await updateProfile({ name, bio, image, coverImage });
      onClose();
    } catch (error) {
      console.error("Failed to update profile", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-800/40 backdrop-blur-xs">
      <div className="w-full max-w-lg rounded-2xl bg-black border border-gray-800 p-6 shadow-2xl relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-1 rounded-full hover:bg-zinc-900 transition"
        >
          <svg
            className="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="flex justify-center mb-4">
          <svg className="w-8 h-8 fill-current text-white" viewBox="0 0 24 24">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
        </div>
        {step === "avatar" && (
          <div className="flex flex-col items-center py-6 space-y-6">
            <h2 className="text-2xl font-bold">Pick a profile picture</h2>
            <p className="text-gray-500 text-sm">
              Have a favorite selfie? Upload it now.
            </p>

            <label className="relative cursor-pointer group">
              <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-gray-700 bg-zinc-900 flex items-center justify-center relative">
                {image ? (
                  <Image
                    src={image}
                    alt="Avatar"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-600 flex items-center justify-center text-4xl">
                    👤 {/* emoji */}
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
                  <svg
                    className="w-8 h-8 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
                disabled={uploadingAvatar}
              />
            </label>

            <button
              onClick={() => setStep("banner")}
              className="w-full py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition"
            >
              {uploadingAvatar
                ? "Uploading..."
                : image
                  ? "Next"
                  : "Skip for now"}
            </button>
          </div>
        )}

        {step === "banner" && (
          <div className="flex flex-col items-center py-6 space-y-6">
            <h2 className="text-2xl font-bold">Pick a header</h2>
            <p className="text-gray-500 text-sm">
              People who visit your profile will see this. Show your style.
            </p>

            <label className="w-full h-36 rounded-xl overflow-hidden border border-gray-700 bg-zinc-900 relative cursor-pointer group flex items-center justify-center">
              {coverImage ? (
                <Image
                  src={coverImage}
                  alt="Banner"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-600" />
              )}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-80 group-hover:opacity-100 transition">
                <svg
                  className="w-8 h-8 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleBannerChange}
                disabled={uploadingBanner}
              />
            </label>

            <div className="flex w-full gap-3">
              <button
                onClick={() => setStep("avatar")}
                className="w-1/2 py-3 rounded-full border border-gray-600 font-bold hover:bg-zinc-900 transition"
              >
                Back
              </button>
              <button
                onClick={() => setStep("details")}
                className="w-1/2 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition"
              >
                {uploadingBanner
                  ? "Uploading..."
                  : coverImage
                    ? "Next"
                    : "Skip for now"}
              </button>
            </div>
          </div>
        )}

        {step === "details" && (
          <div className="flex flex-col py-4 space-y-5">
            <h2 className="text-2xl font-bold text-center">
              Describe yourself
            </h2>

            <div className="space-y-4">
              <div className="border border-gray-700 rounded-lg p-2 focus-within:border-sky-500 transition">
                <label className="block text-xs text-gray-500">
                  Display Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-transparent text-white outline-none text-sm pt-1"
                />
              </div>

              <div className="border border-gray-700 rounded-lg p-2 focus-within:border-sky-500 transition">
                <label className="block text-xs text-gray-500">Bio</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-transparent text-white outline-none text-sm pt-1 resize-none"
                  placeholder="Your bio..."
                />
              </div>
            </div>

            <div className="flex w-full gap-3 pt-2">
              <button
                onClick={() => setStep("banner")}
                className="w-1/2 py-3 rounded-full border border-gray-600 font-bold hover:bg-zinc-900 transition"
              >
                Back
              </button>
              <button
                onClick={handleSave}
                disabled={isSubmitting}
                className="w-1/2 py-3 rounded-full bg-white text-black font-bold hover:bg-gray-200 transition disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Profile"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
