"use client";

import { useState } from "react";

interface CloneStoreModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (mode: "full" | "design") => void;
    storeName: string;
}

export function CloneStoreModal({
    isOpen,
    onClose,
    onConfirm,
    storeName,
}: CloneStoreModalProps) {
    const [mode, setMode] = useState<"full" | "design">("full");

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl">
                <h3 className="text-xl font-bold text-slate-900 mb-2">Clone Store</h3>
                <p className="text-slate-600 mb-6">
                    You are about to clone <span className="font-semibold text-slate-900">{storeName}</span>. Choose what you want to copy:
                </p>

                <div className="space-y-3 mb-8">
                    <label
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === "full"
                                ? "border-[#1e3a5f] bg-blue-50/50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="cloneMode"
                            value="full"
                            checked={mode === "full"}
                            onChange={() => setMode("full")}
                            className="mt-1 w-4 h-4 text-[#1e3a5f]"
                        />
                        <div>
                            <span className="block font-semibold text-slate-900">
                                Full Clone
                            </span>
                            <span className="text-sm text-slate-500">
                                Copies EVERYTHING: Products, images, discounts, and design. Best for scaling to a new domain.
                            </span>
                        </div>
                    </label>

                    <label
                        className={`flex items-start gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${mode === "design"
                                ? "border-[#1e3a5f] bg-blue-50/50"
                                : "border-slate-200 hover:border-slate-300"
                            }`}
                    >
                        <input
                            type="radio"
                            name="cloneMode"
                            value="design"
                            checked={mode === "design"}
                            onChange={() => setMode("design")}
                            className="mt-1 w-4 h-4 text-[#1e3a5f]"
                        />
                        <div>
                            <span className="block font-semibold text-slate-900">
                                Design Only
                            </span>
                            <span className="text-sm text-slate-500">
                                Copies THEME & SETTINGS only. Creates an empty store ready for new products. Best for starting fresh.
                            </span>
                        </div>
                    </label>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 font-medium transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onConfirm(mode)}
                        className="flex-1 px-4 py-2 bg-[#1e3a5f] text-white rounded-lg hover:bg-[#2d4a6f] font-medium transition-colors"
                    >
                        Clone Store
                    </button>
                </div>
            </div>
        </div>
    );
}
