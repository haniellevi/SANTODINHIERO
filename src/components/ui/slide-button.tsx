"use client";

import React, { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { Check, ChevronRight, Loader2 } from "lucide-react";

interface SlideButtonProps {
    onConfirm: () => Promise<void>;
    isConfirmed: boolean;
    label?: string;
    confirmedLabel?: string;
    className?: string;
    disabled?: boolean;
}

export function SlideButton({
    onConfirm,
    isConfirmed,
    label = "Arrastar",
    confirmedLabel = "Confirmado",
    className,
    disabled = false,
}: SlideButtonProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [position, setPosition] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const thumbRef = useRef<HTMLDivElement>(null);

    const reset = () => {
        setIsDragging(false);
        setPosition(0);
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        if (disabled || isLoading) return;

        // If already confirmed, allow click to toggle (handled via onClick on container)
        // But prevent dragging if confirmed
        if (isConfirmed) return;

        setIsDragging(true);
    };

    const handleMove = (clientX: number) => {
        if (!isDragging || !containerRef.current || !thumbRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const thumbWidth = thumbRef.current.offsetWidth;
        const maxPos = containerRect.width - thumbWidth;

        const newPos = Math.min(Math.max(0, clientX - containerRect.left - thumbWidth / 2), maxPos);
        setPosition(newPos);
    };

    const handleEnd = async () => {
        if (!isDragging || !containerRef.current || !thumbRef.current) return;

        const containerRect = containerRef.current.getBoundingClientRect();
        const thumbWidth = thumbRef.current.offsetWidth;
        const maxPos = containerRect.width - thumbWidth;
        const threshold = maxPos * 0.9;

        if (position >= threshold) {
            setPosition(maxPos);
            setIsLoading(true);
            try {
                await onConfirm();
            } finally {
                setIsLoading(false);
                // Don't reset if confirmed, let the prop update handle state
            }
        } else {
            reset();
        }
        setIsDragging(false);
    };

    const handleClick = async () => {
        if (disabled || isLoading) return;

        // If confirmed, allow clicking to unconfirm (toggle)
        if (isConfirmed) {
            setIsLoading(true);
            try {
                await onConfirm();
            } finally {
                setIsLoading(false);
            }
        }
    };

    useEffect(() => {
        const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
        const onTouchMove = (e: TouchEvent) => handleMove(e.touches[0].clientX);
        const onMouseUp = () => handleEnd();
        const onTouchEnd = () => handleEnd();

        if (isDragging) {
            window.addEventListener("mousemove", onMouseMove);
            window.addEventListener("touchmove", onTouchMove);
            window.addEventListener("mouseup", onMouseUp);
            window.addEventListener("touchend", onTouchEnd);
        }

        return () => {
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("touchmove", onTouchMove);
            window.removeEventListener("mouseup", onMouseUp);
            window.removeEventListener("touchend", onTouchEnd);
        };
    }, [isDragging, position]);

    // Reset position if isConfirmed becomes false (unchecking)
    useEffect(() => {
        if (!isConfirmed) {
            setPosition(0);
        }
    }, [isConfirmed]);

    return (
        <div
            ref={containerRef}
            onClick={handleClick}
            className={cn(
                "relative h-10 w-full min-w-[120px] max-w-[200px] rounded-full bg-muted/50 overflow-hidden select-none transition-colors",
                isConfirmed ? "bg-emerald-500/20 cursor-pointer" : "bg-muted/50",
                disabled && "opacity-50 cursor-not-allowed",
                className
            )}
        >
            {/* Background Text */}
            <div className="absolute inset-0 flex items-center justify-center text-xs font-medium text-muted-foreground z-0 pointer-events-none">
                {isConfirmed ? (
                    <span className="flex items-center gap-1 text-emerald-600">
                        <Check className="h-3 w-3" /> {confirmedLabel}
                    </span>
                ) : (
                    <span className="opacity-50">{label}</span>
                )}
            </div>

            {/* Progress Track */}
            <div
                className="absolute inset-y-0 left-0 bg-emerald-500/10 z-0 transition-all duration-75"
                style={{ width: isConfirmed ? "100%" : position + 20 }} // +20 to cover thumb
            />

            {/* Thumb */}
            <div
                ref={thumbRef}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
                className={cn(
                    "absolute top-1 bottom-1 w-8 rounded-full flex items-center justify-center z-10 shadow-sm cursor-grab active:cursor-grabbing transition-transform duration-75",
                    isConfirmed ? "bg-emerald-500 right-1 cursor-pointer" : "bg-background border border-border/50"
                )}
                style={{
                    transform: isConfirmed ? "none" : `translateX(${position}px)`,
                    left: isConfirmed ? "auto" : "4px",
                }}
            >
                {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin text-emerald-600" />
                ) : isConfirmed ? (
                    <Check className="h-4 w-4 text-white" />
                ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                )}
            </div>
        </div>
    );
}
